function MessageBanner({ message }) {
  if (!message) return null;

  return <div className={`banner ${message.type}`}>{message.text}</div>;
}

export default MessageBanner;
