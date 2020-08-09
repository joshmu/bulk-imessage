/**
 * @file Main File to send bulk imessages
 *
 * Currently configured to send 3 messages per contact in the contacts.txt file
 *
 * @requires fs
 * @requires osa-imessage
 * @requires createThread.js
 */

const fs = require('fs')
const imessage = require('./osa-imessage')
const { createThread, sendSms } = require('./createThread')

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

/**
 * retry message send
 */
const sendMessage = async ({
  contact,
  message,
  isFile = false,
  retries = 1,
  retryCount = 0,
  newThread = false,
  sms = false,
}) => {
  try {
    if (newThread) {
      console.log('creating thread...')
      await createThread(contact, message)
    } else {
      if (sms && !isFile) {
        console.log('sending sms')
        await sendSms(contact, message)
      } else {
        console.log('sending imessage')
        await imessage.send({
          handle: contact,
          message,
          isFile,
        })
      }
    }
  } catch (error) {
    if (retryCount < retries) {
      retryCount++
      await sendMessage({
        contact,
        message,
        isFile,
        retries,
        retryCount,
        newThread,
        sms,
      })
    } else if (retryCount === retries && !isFile) {
      // try again creating a thread
      retryCount++
      await sendMessage({
        contact,
        message,
        retries,
        retryCount,
        newThread: true,
      })
    } else if (retryCount === retries + 1 && !isFile) {
      // try again creating a thread
      retryCount++
      await sendMessage({
        contact,
        message,
        retries,
        retryCount,
        newThread: true,
        sms: true,
      })
    } else {
      throw error
    }
  }
}

/**
 * return list of unique items
 * @param {string[]} list
 */
const uniqueArr = list =>
  list.filter((item, index, self) => self.indexOf(item) === index)

const bulkImessage = async ({ messages, contactsPath = './contacts.txt' }) => {
  // retrieve contacts
  const contacts = getContacts(contactsPath)

  let invalidContacts = []

  // send message per contact
  for (let contact of contacts) {
    let msgCount = 0
    for (let msg of messages) {
      msgCount++
      try {
        await sendMessage({ contact, ...msg, newThread: msgCount === 1 })
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

    fs.writeFileSync('./invalidContacts.txt', invalidContacts.join('\n'))
    console.error('INVALID CONTACTS', invalidContacts)
  }
}

module.exports = bulkImessage

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
