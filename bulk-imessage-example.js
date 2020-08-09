/**
 * Example of how to use bulk-imessage
 */

const bulkImessage = require('./bulk-imessage')

const MESSAGES_TO_SEND = [
  {
    message: 'first message ⚡️',
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
