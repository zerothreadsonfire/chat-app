function formatMessage(username, text) {
  return {
    username,
    text, 
    time: new Date().toLocaleTimeString(),
  }
}

export default formatMessage;
