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

/**
 * @file Main File to send bulk imessages
 *
 * Currently configured to send 3 messages per contact in the contacts.txt file
 *
 * @requires fs
 * @requires osa-imessage
 */

const fs = require('fs')
const imessage = require('./osa-imessage')

const contactsPath = process.argv[2] || './contacts.txt'

/**
 * get contacts
 * @param {string} filePath file path
 */
const getContacts = filePath => {
  const txt = fs.readFileSync(filePath, 'utf8')
  const contacts = txt
    .split('\n')
    .filter(row => row.length)
    .map(contact => contact.trim())
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
}) => {
  try {
    await imessage.send({
      handle: contact,
      message,
      isFile,
    })
  } catch (error) {
    if (retryCount < retries) {
      console.log(`${contact} failed. retrying...`)
      retryCount++
      await sendMessage({ contact, message, isFile, retries, retryCount })
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

;(async () => {
  // retrieve contacts
  const contacts = getContacts(contactsPath)
  let invalidContacts = []

  // send message per contact
  for (let contact of contacts) {
    for (let msg of MESSAGES_TO_SEND) {
      try {
        await sendMessage({ contact, ...msg })
      } catch (error) {
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
})()
