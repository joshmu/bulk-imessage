/**
 * test
 */

const applescript = require('applescript')
const path = require('path')

/**
 * Send a SMS
 * @param {string } contact - phone number (inc country code)
 * @param {string} message - txt message to send
 */
const sendSms = (contact, message) => {
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
  console.log('create thread')
  return new Promise((resolve, reject) => {
    const script = `
      activate application "Messages"
      tell application "System Events" to tell process "Messages"
        key code 45 using command down           -- press Command + N to start a new window
        keystroke "${contact}"  -- input the phone number
        key code 36                              -- press Enter to focus on the message area 
        keystroke "${message}"       -- type some message
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
const sendSmsAttachment = (contact, filePath) => {
  console.log('send attachment')
  return new Promise((resolve, reject) => {
    const script = `

    set theAttachment to POSIX file "${path.join(__dirname, filePath)}"
    
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

;(async () => {
  try {
    // 1
    const res = await createNewThread('+61481304509', '- GIF OF DANCE -')
    console.log({ res })

    // 2
    const res2 = await sendSmsAttachment('+61481304509', 'attachment.gif')
    console.log({ res2 })

    await sleep(5000)

    // 3
    const res3 = await sendSms('+61481304509', 'END ⚡️')
    console.log({ res3 })
  } catch (error) {
    console.error(error)
  }
})()

module.exports = {
  sendSms,
  createNewThread,
  sendSmsAttachment,
}

// Helper
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
