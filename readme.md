# bulk imessage

Send imessages with attachments to multiple users.

## Installation

At the project root folder:
`npm install`

## Usage

At the root of the project foler add a phone number per line in the _contacts.txt_. Also replace the _attachement.gif_ with your own otherwise if using a different attachement then make sure to mention the path when initialising.

At the project root folder:
`node ./app.js` or `npm start`

Optionally you can specify message **attachment** location and **contacts** list location on start.
`node ./app.js ./attachment.gif ./contacts.txt`

If you have invalid contacts a **invalidContacts.txt** file will be generated at the root.
