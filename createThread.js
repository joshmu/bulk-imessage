const applescript = require('applescript')

const createThread = async (contact, message = '.') => {
  return new Promise((resolve, reject) => {
    // create a new thread before sending message
    const script = `activate application "Messages"
   tell application "System Events" to tell process "Messages"
   key code 45 using command down           -- press Command + N to start a new window
   keystroke "${contact}"  -- input the phone number
   key code 36                              -- press Enter to focus on the message area 
   keystroke "${message}"       -- type some message
   key code 36                              -- press Enter to send
end tell
`
    applescript.execString(script, (err, rtn) => {
      if (err) console.error(err)

      resolve(rtn)

      // if (Array.isArray(rtn)) {
      //   for (const songName of rtn) {
      //     console.log(songName)
      //   }
      // }
    })
  })
}

const sendSms = (contact, message) => {
  return new Promise((resolve, reject) => {
    const script = `
  tell application "Messages"
        send "${message}" to buddy "${contact}" of service "SMS"
    end tell
  `
    applescript.execString(script, (err, data) => {
      if (err) console.error(err)
      resolve(data)
    })
  })
}

// ;(async () => {
//   console.log('start')
//   const response = await createThread('0422669427', 'boo')
//   console.log({ response })
//   console.log('done')
// })()

module.exports = { createThread, sendSms }
