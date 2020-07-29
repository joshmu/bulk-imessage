const fs = require('fs')
const imessage = require('./osa-imessage')

const message = process.argv[2] || './attachment.gif'
const contactsPath = process.argv[3] || './contacts.txt'

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

;(async () => {
  // retrieve contacts
  const contacts = getContacts(contactsPath)
  let invalidContacts = []

  // send message per contact
  for (let contact of contacts) {
    // phone number, email, or group chat id
    try {
      await imessage.send({
        handle: contact,
        message: message,
        isFile: true,
      })
    } catch (error) {
      invalidContacts.push(contact)
    }
  }

  // display any errors
  if (invalidContacts.length) {
    fs.writeFileSync('./invalidContacts.txt', invalidContacts.join('\n'))
    console.error('INVALID CONTACTS', invalidContacts)
  }
})()
