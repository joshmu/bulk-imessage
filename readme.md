# bulk imessage

Send imessages with attachments to multiple users.

## Example

```js
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

bulkImessage({ messages: MESSAGES_TO_SEND, contactsPath: './contacts.txt' })
```

## Installation

At the project root:
`npm install`

## Usage

Import `bulkImessage` and pass a list of messages you would like to send to each phone number provided (_Refer to example.js_). Optionally specifiy the `contactsPath`. Otherwise simply initialise the `example.js` provided at the project root.

Modify _contacts.txt_ with a phone number per line (inlcude country code prefix, eg. **+61**). Also replace the _attachement.gif_ with your own otherwise if using a different attachement then make sure to mention the path when initialising.

At the project root folder:
`node ./example.js` or `npm start`

If you have invalid contacts a **invalidContacts.txt** file will be generated at the root.
