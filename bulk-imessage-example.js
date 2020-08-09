/**
 * Example of how to use bulk-imessage
 */

const bulkImessage = require('./lib/bulk-imessage')

const MESSAGES_TO_SEND = [
  {
    // you cannot use an emoji for the first message
    message: 'first message️',
  },
  {
    message: './attachment.gif',
    isFile: true,
  },
  {
    message: 'third message 👾',
  },
]

bulkImessage({ messages: MESSAGES_TO_SEND })
