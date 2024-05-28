var React = require('react');
var createReactClass = require('create-react-class');

var Message = createReactClass({
  render() {
    const { user, text, isCurrentUser, timestamp } = this.props;
    const messageClass = isCurrentUser ? 'message current-user' : 'message other-user';

    return (
      <div className={messageClass}>
        <div className="message-content">
          <strong>{user}:</strong>
          <span>{text}</span>
        </div>
        <div className="timestamp">
          <span>{timestamp}</span>
        </div>
      </div>
    );
  }
});

module.exports = Message;
