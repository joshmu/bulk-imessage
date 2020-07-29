const osa = require('osa2')
const isValidPath = require('is-valid-path')

/**
 *  Gets the proper handle string for a contact with the given name
 *  @param {string} name
 */
const handleForName = name => {
  assert(typeof name == 'string', 'name must be a string')
  return osa(name => {
    // @ts-ignore
    const Messages = Application('Messages')
    return Messages.buddies.whose({ name: name })[0].handle()
  })(name)
}

/**
 * Sends a message to the given handle
 * @param {string} handle
 * @param {string} messageOrFilePath
 */
const send = (handle, messageOrFilePath) => {
  assert(typeof handle == 'string', 'handle must be a string')
  assert(typeof messageOrFilePath == 'string', 'message/file must be a string')

  return sendMessageOrFile(
    handle,
    messageOrFilePath,
    isValidPath(messageOrFilePath)
  )
}

/**
 * Sends the file at the filepath to the given handle
 * @param {string} handle
 * @param {string} filepath
 */
const sendFile = (handle, filepath) => {
  assert(typeof handle == 'string', 'handle must be a string')
  assert(typeof filepath == 'string', 'filepath must be a string')

  return sendMessageOrFile(handle, filepath, true)
}

/**
 * Handles sending a filepath or a message to a given handle
 * @param {string} handle
 * @param {string} messageOrFilepath
 * @param {boolean} [isFile = false]
 */
const sendMessageOrFile = (handle, messageOrFilepath, isFile = false) => {
  return osa((handle, messageOrFilepath, isFile) => {
    // @ts-ignore
    const Messages = Application('Messages')

    let target

    try {
      target = Messages.buddies.whose({ handle: handle })[0]
    } catch (e) {}

    try {
      target = Messages.textChats.byId('iMessage;+;' + handle)()
    } catch (e) {}

    let message = messageOrFilepath

    // If a string filepath was provided, we need to convert it to an
    // osascript file object.
    // This must be done in the osa context to have acess to Path
    if (isFile) {
      // @ts-ignore
      message = Path(messageOrFilepath)
    }

    try {
      return Messages.send(message, { to: target })
    } catch (e) {
      throw new Error(`no thread with handle '${handle}'`)
    }
  })(handle, messageOrFilepath, isFile)
}

/**
 * Simple assertion
 * @param {boolean} valid - whether we have a valid input
 * @param {string} msg - error message to display
 */
const assert = (valid, msg) => {
  if (!valid) throw new Error(msg)
}

module.exports = {
  send,
  sendFile,
  handleForName,
}
