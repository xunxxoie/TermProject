var React = require('react');
var createReactClass = require('create-react-class');
var Message = require('./Message.jsx');

var MessageList = createReactClass({
  render() {
    const { messages, currentUser } = this.props;

    if (!messages || messages.length === 0) {
      return <div className="messages">메시지가 없습니다.</div>;
    }

    if (!currentUser) {
      return <div>사용자가 설정되지 않았습니다.</div>;
    }

    return (
      <div className="messages">
        <h2>채팅방</h2>
        {messages.map((message, i) => (
          <Message
            key={i}
            user={message.user || 'Unknown'}
            text={message.text}
            timestamp={message.timestamp}
            isCurrentUser={message.user === currentUser}
          />
        ))}
      </div>
    );
  }
});

module.exports = MessageList;
