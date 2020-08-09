/**
 *  Bulk send SMS
 */

const { bulkSMS } = require('./sms')

const MESSAGES_TO_SEND = [
  {
    // no emojis allowed if we are creating threads
    message: '- GIF OF DANCE -',
  },
  {
    message: './attachment.gif',
    isFile: true,
    // how many seconds to wait after we send attachment (otherwise following message might be received before attachment)
    wait: 20,
  },
  {
    message: 'third message 👾',
  },
]

bulkSMS({ messages: MESSAGES_TO_SEND })
