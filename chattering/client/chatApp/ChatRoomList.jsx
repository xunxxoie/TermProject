var React = require('react');
var createReactClass = require('create-react-class');
var Modal = require('./Modal.jsx');
var io = require('socket.io-client');
var socket = io.connect();

var ChatRoomList = createReactClass({
  getInitialState() {
    return {
      rooms: [],
      search: '',
      showModal: false,
      newRoomName: '',
      error: '',
      currentRoom: null,
    };
  },

  componentDidMount() {
    socket.on('room:created', (newRoom) => {
      this.setState((prevState) => ({
        rooms: [...prevState.rooms, newRoom],
      }));
    });

    socket.on('init', (data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ rooms: data.rooms, error: '' });
      }
    });

    socket.emit('get:rooms', (rooms) => {
      this.setState({ rooms });
    });
  },

  componentWillUnmount() {
    socket.off('room:created');
    socket.off('init');
  },

  handleSearchChange(e) {
    this.setState({ search: e.target.value });
  },

  handleRoomClick(room) {
    if (room !== this.state.currentRoom) {
      this.setState({ currentRoom: room });
      socket.emit('switch:room', room);
      this.props.onRoomSelect(room);
    }
  },

  handleCreateRoomClick() {
    this.setState({ showModal: true });
  },

  handleCloseModal() {
    this.setState({ showModal: false });
  },

  handleRoomNameChange(e) {
    this.setState({ newRoomName: e.target.value });
  },

  handleCreateRoom(e) {
    e.preventDefault();
    const newRoom = this.state.newRoomName.trim();
    if (newRoom && !this.state.rooms.includes(newRoom)) {
      socket.emit('create:room', newRoom, (success) => {
        if (success) {
          this.setState({
            showModal: false,
            newRoomName: '',
          });
        } else {
          this.setState({ error: '채팅방 생성 실패' });
        }
      });
    }
  },

  render() {
    const filteredRooms = this.state.rooms.filter((room) =>
      room.toLowerCase().includes(this.state.search.toLowerCase())
    );
  
    return (
      <div className={`chat-room-list-container ${this.state.showModal ? 'modal1-active' : ''}`}>
        <div className="chat-room-search">
          <input
            type="text"
            placeholder="채팅방 검색"
            value={this.state.search}
            onChange={this.handleSearchChange}
            className="room-name-input"
          />
        </div>
        <div className="chat-room-list">
          <ul>
            {filteredRooms.map((room, index) => (
              <li key={index} onClick={() => this.handleRoomClick(room)}>
                {room}
              </li>
            ))}
          </ul>
        </div>
        <div className="create-room">
          <button onClick={this.handleCreateRoomClick}>채팅방 개설하기</button>
        </div>
        {this.state.error && <div className="error">{this.state.error}</div>}
        {this.state.showModal && (
          <div className="modal1-backdrop">
            <Modal
              show={this.state.showModal}
              onClose={this.handleCloseModal}
              onCreateRoom={this.handleCreateRoom}
              roomName={this.state.newRoomName}
              onRoomNameChange={this.handleRoomNameChange}
            />
          </div>
        )}
      </div>
    );
  }
});

module.exports = ChatRoomList;
