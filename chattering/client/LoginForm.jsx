var React = require('react');
var createReactClass = require('create-react-class');

var LoginForm = createReactClass({
  getInitialState() {
    return { username: '', password: '', error: '' };
  },

  handleLogin(e) {
    e.preventDefault();

    const { username, password } = this.state;
    if (username && password) {
      this.props.onLogin(username, password);
    } else {
      this.setState({ error: '아이디와 비밀번호를 입력하세요.' });
    }
  },

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  },

  render() {
    return (
      <div className="login_form">
        <h2>어서오세요!</h2>
        <form onSubmit={this.handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={this.state.password}
            onChange={this.handleChange}
          />
          {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
          <button type="submit">로그인</button>
        </form>
        <div className="signup_prompt">
          <span>회원이 아니신가요? </span>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            this.props.onPageChange('signup');
          }}>회원가입</a>
        </div>
      </div>
    );
  }
});

module.exports = LoginForm;