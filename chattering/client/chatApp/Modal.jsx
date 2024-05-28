var React = require('react');
var createReactClass = require('create-react-class');

var Modal = createReactClass({
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal1-backdrop">
        <div className="modal1">
          <h2>채팅방 개설하기</h2>
          <form onSubmit={this.props.onCreateRoom}>
            <input
              type="text"
              placeholder="채팅방 이름"
              value={this.props.roomName}
              onChange={this.props.onRoomNameChange}
              className="room-name-input"
            />
            <button type="submit">개설하기</button>
            <button type="button" onClick={this.props.onClose}>취소</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = Modal;
