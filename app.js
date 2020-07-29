const imessage = require('./osa-imessage')

;(async () => {
  // phone number, email, or group chat id
  await imessage.send('+61422669427', 'hello')

  const myHandle = await imessage.handleForName('josh mu')
  console.log({ myHandle })

  // imessage.listen().on('message', msg => {
  //   console.log(`${msg.text} from ${msg.handle}`)
  // })
})()
