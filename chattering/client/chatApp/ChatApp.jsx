var React = require('react');
var createReactClass = require('create-react-class');
var UsersList = require('./UsersList.jsx');
var MessageList = require('./MessageList.jsx');
var MessageForm = require('./MessageForm.jsx');
var ChangeNameForm = require('./ChangeNameForm.jsx');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000');

var ChatApp = createReactClass({
  getInitialState() {
    return { messages: this.props.messages || [], user: this.props.user, room: this.props.room };
  },

  componentDidMount() {
    socket.on('connect', () => {
      console.log('Socket connected');
    });
    socket.on('send:message', this._messageReceived.bind(this));

    console.log('ChatApp componentDidMount:', this.props);
  },

  componentDidUpdate(prevProps) {
    if (prevProps.room !== this.props.room || prevProps.messages !== this.props.messages) {
      this.setState({ room: this.props.room, messages: this.props.messages });
    }
  },

  componentWillUnmount() {
    socket.off('send:message', this._messageReceived.bind(this));

    if (this.state.room) {
      socket.emit('leave', { user: this.state.user, room: this.state.room });
    }
  },

  _messageReceived(message) {
    console.log('메시지 수신:', message);
    if (message.room === this.state.room) {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }), () => {
        console.log('Updated messages list:', this.state.messages);
      });
    }
  },

  handleMessageSubmit(text) {
    if (!this.state.user) {
      alert('로그인이 필요합니다.');
      return;
    }
    const timestamp = new Date().toLocaleTimeString();
    const message = {
      text,
      user: this.state.user,
      timestamp,
      room: this.state.room
    };

    console.log('handleMessageSubmit:', message);
    socket.emit('send:message', message);
  },

  handleChangeName(newName) {
    const oldName = this.state.user;
    socket.emit('change:name', { oldName, name: newName }, (result) => {
      if (!result) {
        return alert('이름 변경에 실패했습니다.');
      }
      this.setState({ user: newName });
    });
  },

  render() {
    console.log('ChatApp render:', this.state);
    if (!this.state.user) {
      return <div>Loading...</div>;
    }

    return (
      <div className="chat-app">
        <div className="chat-room-header">
          <div className="chat-room-name">{this.props.room}</div>
        </div>
        <div className="chat-room-controls">
          <UsersList users={this.props.users} /> {}
            <ChangeNameForm onChangeName={this.handleChangeName} />
        </div>
        <div className="chat-main">
          <div className="chat-main-content">
            <MessageList messages={this.state.messages} currentUser={this.state.user} />
            <MessageForm onMessageSubmit={this.handleMessageSubmit} user={this.state.user} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ChatApp;