var React = require('react');
var ReactDOM = require('react-dom/client');
var createReactClass = require('create-react-class');
var ChatApp = require('./chatApp/ChatApp.jsx');
var LoginForm = require('./LoginForm.jsx');
var SignUpForm = require('./SignUpForm.jsx');
var Sidebar = require('./Sidebar.jsx');
var ChatRoomList = require('./chatApp/ChatRoomList.jsx');
var CalendarComponent = require('./calendar/Calendar.jsx');
var AddPlan = require('./calendar/AddPlan.jsx');
var EditPlan = require('./calendar/EditPlan.jsx');
var PlanList = require('./calendar/PlanList.jsx');
var Info = require('./Info.jsx');  
var io = require('socket.io-client');
var socket = io.connect();

var App = createReactClass({
  getInitialState() {
    return { 
      user: null, 
      page: 'login', 
      currentRoom: null, 
      showChatRooms: false, 
      showCalendar: false, 
      showAddPlanModal: false, 
      showEditPlanModal: false, 
      showEditPlanList: false,
      showInfo: false, 
      plans: [], 
      selectedDate: new Date(), 
      selectedPlan: null,
      messages: [], 
      users: [] 
    };
  },

  handleLogin(username, password) {
    console.log('로그인 시도:', username);
    socket.emit('login', { username: username, password: password });
  },

  handleSignUp(userData) {
    console.log('회원가입 시도:', userData);
    socket.emit('signup', userData, (response) => {
      if (response.success) {
        alert('회원가입 성공! 이제 로그인해주세요.');
        this.setState({ page: 'login' });
      } else {
        alert('회원가입 실패: ' + response.message);
      }
    });
  },

  handlePageChange(page) {
    this.setState({ page: page });
  },

  handleRoomSelect(room) {
    if (this.state.user) {
      socket.emit('join:room', room, (data) => {
        this.setState({ currentRoom: room, messages: data.messages, users: data.users });
      });
    } else {
      console.error('사용자가 로그인하지 않았습니다. 채팅방을 변경할 수 없습니다.');
    }
  },

  handleChatRoomClick() {
    if (this.state.user) {
      this.setState({ showChatRooms: true, showCalendar: false, showInfo: false });
    } else {
      console.error('사용자가 로그인하지 않았습니다. 채팅방을 표시할 수 없습니다.');
    }
  },

  handleCalendarClick() {
    if (this.state.user) {
      this.setState({ showCalendar: true, showChatRooms: false, showInfo: false }); 
    } else {
      console.error('사용자가 로그인하지 않았습니다. 캘린더를 표시할 수 없습니다.');
    }
  },

  handleInfoClick() {
    if (this.state.user) {
      this.setState({ showInfo: true, showChatRooms: false, showCalendar: false });
    } else {
      console.error('사용자가 로그인하지 않았습니다. Info 페이지를 표시할 수 없습니다.');
    }
  },

  handleDateChange(date) {
    this.setState({ selectedDate: date });
  },

  handleAddPlan(plan) {
    plan.date = new Date(plan.date);
    socket.emit('add:plan', plan);
  },

  handleEditPlan(plan) {
    socket.emit('edit:plan', plan);
  },

  handleEditPlanClick(plan) {
    this.setState({ selectedPlan: plan, showEditPlanModal: true, showEditPlanList: false });
  },

  handleDeletePlan(planId) {
    socket.emit('delete:plan', planId);
    this.setState({
      plans: this.state.plans.filter(plan => plan.id !== planId)
    });
  },

  componentDidMount() {
    socket.on('loginSuccess', (data) => {
      console.log('로그인 성공:', data);
      const plans = data.plans.map(plan => ({
        ...plan,
        date: new Date(plan.date)
      }));
      this.setState({ user: data.name, page: 'main', plans: plans });
    });

    socket.on('loginError', (data) => {
      console.error('로그인 오류:', data.error);
      alert(data.error);
    });

    socket.on('joinRoomSuccess', (data) => {
      console.log('채팅방 입장 성공:', data);
      this.setState({ currentRoom: data.room, messages: data.messages, users: data.users });
    });

    socket.on('send:message', (message) => {
      console.log('메시지 수신:', message);
      if (message.room === this.state.currentRoom) {
        this.setState((prevState) => ({
          messages: [...prevState.messages, message],
        }));
      }
    });

    socket.on('user:join', (data) => {
      this.setState({ users: data.users });
    });

    socket.on('user:left', (data) => {
      this.setState({ users: data.users });
    });

    socket.on('plan:added', (plan) => {
      plan.date = new Date(plan.date); 
      this.setState((prevState) => ({
        plans: [...prevState.plans, plan]
      }));
    });

    socket.on('plan:edited', (updatedPlan) => {
      updatedPlan.date = new Date(updatedPlan.date); 
      this.setState((prevState) => ({
        plans: prevState.plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan),
        showEditPlanModal: false
      }));
    });

    socket.on('plan:deleted', (planId) => {
      this.setState((prevState) => ({
        plans: prevState.plans.filter(plan => plan.id !== planId)
      }));
    });

    socket.on('error', (error) => {
      console.error('소켓 오류:', error);
      alert(error.error);
    });

    window.addEventListener('beforeunload', this.handleLogout);
  },

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLogout);
  },

  handleLogout() {
    if (this.state.user) {
      socket.emit('logout');
    }
  },

  render() {
    let mainContent;
    if (this.state.page === 'login') {
      mainContent = (
        <div className="login-container">
          <div className="login-content">
            <img src="/Fire1.png" alt="Login Image 1" className="login-image"/>
            <LoginForm onLogin={this.handleLogin} onPageChange={this.handlePageChange} />
            <img src="/Fire2.png" alt="Login Image 2" className="login-image"/>
          </div>
        </div>
      );
    } else if (this.state.page === 'signup') {
      mainContent = (
        <div className="signup-container">
          <SignUpForm onSignUp={this.handleSignUp} />
        </div>
      );
    } else if (this.state.page === 'main') {
      mainContent = (
        <div className={`main-content-container ${this.state.showAddPlanModal || this.state.showEditPlanModal ? 'modal-active' : ''}`}>
          {this.state.showChatRooms && (
            <div className="chat-room-list-wrapper">
              <ChatRoomList
                user={this.state.user}
                room={this.state.currentRoom}
                onRoomSelect={this.handleRoomSelect}
              />
            </div>
          )}
          {this.state.showCalendar && (
            <div className="calendar-wrapper">
              <div className="calendar-section">
                <CalendarComponent onDateChange={this.handleDateChange} />
                <button className="add-plan-button" onClick={() => this.setState({ showAddPlanModal: true })}>일정 추가하기</button>
                <button className="edit-plan-button" onClick={() => this.setState({ showEditPlanList: true })}>일정 수정하기</button>
              </div>
              <div className="plan-list-section">
                {this.state.showAddPlanModal && (
                  <AddPlan
                    date={this.state.selectedDate}
                    onAddPlan={this.handleAddPlan}
                    onClose={() => this.setState({ showAddPlanModal: false })}
                  />
                )}
                {this.state.showEditPlanList && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={() => this.setState({ showEditPlanList: false })}>&times;</span>
                      <h2>수정할 일정을 선택하세요</h2>
                      <ul className="edit-plan-list">
                        {this.state.plans
                          .filter(plan => new Date(plan.date).toDateString() === this.state.selectedDate.toDateString() && plan.user === this.state.user)
                          .map(plan => (
                            <li key={plan.id} onClick={() => this.handleEditPlanClick(plan)} className="plan-item">
                              <h4>{plan.title}</h4>
                              <p>{plan.description}</p>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
                {this.state.showEditPlanModal && (
                  <EditPlan
                    date={this.state.selectedDate}
                    selectedPlan={this.state.selectedPlan}
                    onEditPlan={this.handleEditPlan}
                    onDeletePlan={this.handleDeletePlan}
                    onClose={() => this.setState({ showEditPlanModal: false })}
                  />
                )}
                <PlanList
                  selectedDate={this.state.selectedDate}
                  plans={this.state.plans.filter(plan => plan.date.toDateString() === this.state.selectedDate.toDateString())}
                  onEditPlanClick={this.handleEditPlanClick}
                />
              </div>
            </div>
          )}
          {this.state.showInfo && ( 
            <div className="info-wrapper">
              <Info />
            </div>
          )}
          {this.state.currentRoom && this.state.showChatRooms && ( 
            <div className="chat-room-wrapper">
              <ChatApp 
                user={this.state.user} 
                room={this.state.currentRoom} 
                messages={this.state.messages} 
                users={this.state.users}
              />
            </div>
          )}
        </div>
      );
    }
  
    return (
      <div className="app-container">
        <header className="header">
          <img src="/INU.png" alt="INU Logo" className="logo" />
        </header>
        {this.state.page !== 'login' && this.state.page !== 'signup' && (
          <Sidebar 
          onChatRoomClick={this.handleChatRoomClick}
          onCalendarClick={this.handleCalendarClick}
          onInfoClick={this.handleInfoClick} 
          />
        )}
        <div className={`main-content ${this.state.page === 'login' || this.state.page === 'signup' ? 'login-center' : ''}`}>
          {mainContent}
        </div>
      </div>
    );
  }
});

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

module.exports = App;
