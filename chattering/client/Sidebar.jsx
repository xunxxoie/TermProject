var React = require('react');
var createReactClass = require('create-react-class');
var io = require('socket.io-client');
var socket = io.connect();

var Sidebar = createReactClass({

  handleChatRoomClick() {
    this.props.onChatRoomClick();

    socket.emit('get:rooms', (rooms) => {
      console.log('Rooms:', rooms);
    });
  },

  handleCalendarClick() {
    this.props.onCalendarClick();
  },

  handleInfoClick() {
    this.props.onInfoClick();
  },

  render() {
    return (
      <div className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <a onClick={this.handleChatRoomClick}>채팅방</a>
          </li>
          <li>
            <a onClick={this.handleCalendarClick}>일정</a>
          </li>
          <li>
            <a onClick={this.handleInfoClick}>info</a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <p>© 2024 xunssoie_</p>
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
