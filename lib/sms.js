/**
 * test
 */

const applescript = require('applescript')
const fs = require('fs')
const path = require('path')

/**
 * Send a SMS
 * @param {string } contact - phone number (inc country code)
 * @param {string} message - txt message to send
 */
const sendSms = (contact, message) => {
  console.log('send sms')
  return new Promise((resolve, reject) => {
    const script = `
      tell application "Messages"
          activate --steal focus

          set targetBuddy to "${contact}"
          set targetService to id of service "SMS"
          set textMessage to "${message}"

          set theBuddy to buddy targetBuddy of service id targetService
          send textMessage to theBuddy
      end tell
    `
    applescript.execString(script, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

/**
 * Create initial message thread with contact
 * @param {string } contact - phone number (inc country code)
 * @param {string} message - initial message to send (plain text)
 */
const createNewThread = (contact, message) => {
  console.log('create thread & initial message')
  return new Promise((resolve, reject) => {
    const script = `
      activate application "Messages"
      tell application "System Events" to tell process "Messages"
        key code 45 using command down           -- press Command + N to start a new window
        keystroke "${contact}"  -- input the phone number
        key code 36                              -- press Enter to focus on the message area 
        delay 1
        keystroke "${message}"       -- type some message
        delay 1
        key code 36                              -- press Enter to send
      end tell
    `
    applescript.execString(script, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

/**
 * Send an Attachment via SMS
 * @param {string} contact - phone number (inc country code)
 * @param {string} filePath - attachment relative file path
 */
const sendSmsAttachment = (contact, filePath = './attachment.gif') => {
  console.log('send attachment')
  return new Promise((resolve, reject) => {
    const script = `

    set theAttachment to POSIX file "${path.resolve(__dirname, '..', filePath)}"
    
    tell application "Messages"
      activate

      set targetBuddy to "${contact}"
      set targetService to id of service "SMS"
      set theBuddy to buddy targetBuddy of service id targetService

      send file theAttachment to theBuddy

    end tell
    `
    applescript.execString(script, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const bulkSMS = async ({ messages, contactsPath = './sms_contacts.txt' }) => {
  // retrieve contacts
  const contacts = getContacts(contactsPath)

  let invalidContacts = []

  // send message per contact
  for (let contact of contacts) {
    let messageCount = 0
    for (let msg of messages) {
      messageCount++
      try {
        if (messageCount === 1) {
          await createNewThread(contact, msg.message)
        } else if (msg.isFile) {
          await sendSmsAttachment(contact, (msg.message = './attachment.gif'))
          if (msg.wait) await sleep(+msg.wait * 1000)
        } else {
          await sendSms(contact, msg.message)
        }
      } catch (error) {
        console.error(error.message)
        console.log('invalid contact', contact)
        invalidContacts.push(contact)
      }
    }
  }

  // display any errors
  if (invalidContacts.length) {
    // only unique
    invalidContacts = uniqueArr(invalidContacts)

    fs.writeFileSync('./sms_invalidContacts.txt', invalidContacts.join('\n'))
    console.error('INVALID CONTACTS', invalidContacts)
  }
}

module.exports = {
  sendSms,
  createNewThread,
  sendSmsAttachment,
  bulkSMS,
}

// Helper
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * return list of unique items
 * @param {string[]} list
 */
const uniqueArr = list =>
  list.filter((item, index, self) => self.indexOf(item) === index)

/**
 * get contacts
 * @param {string} filePath file path
 */
const getContacts = filePath => {
  const txt = fs.readFileSync(filePath, 'utf8')
  const contacts = txt
    .split('\n')
    .filter(row => row.length)
    .map(contact => contact.replace(/\s+/g, '').trim())
  return contacts
}
