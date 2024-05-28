var React = require('react');
var createReactClass = require('create-react-class');

var SignUpForm = createReactClass({
  getInitialState() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
      passwordsMatch: false,
      passwordChecked: false
    };
  },

  handleSignUp(e) {
    e.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ passwordsMatch: false, passwordChecked: true });
      return;
    }
    const userData = {
      username: this.state.username,
      password: this.state.password,
      age: this.state.age,
      gender: this.state.gender
    };
    this.props.onSignUp(userData);
  },

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
        if (this.state.password) {
          const passwordsMatch = this.state.password === this.state.confirmPassword;
          this.setState({ passwordsMatch, passwordChecked: true });
        } else {
          this.setState({ passwordChecked: false });
        }
      }
    });
  },

  render() {
    const ageOptions = Array.from({ length: 100 }, (_, i) => i + 1);
    return (
      <div className="signup_form">
        <h2>회원가입</h2>
        <form onSubmit={this.handleSignUp}>
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
          <div className="cPW">
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
            />
          </div>
          {this.state.username && this.state.passwordChecked && (
            <div className={this.state.passwordsMatch ? 'match' : 'error'}>
              {this.state.passwordsMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
            </div>
          )}
          <select name="age" value={this.state.age} onChange={this.handleChange}>
            <option value="">나이 선택</option>
            {ageOptions.map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          <div className="gender-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={this.state.gender === 'male'}
                onChange={this.handleChange}
              />
              남성
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={this.state.gender === 'female'}
                onChange={this.handleChange}
              />
              여성
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="not_either"
                checked={this.state.gender === 'not_either'}
                onChange={this.handleChange}
              />
              선택 안함
            </label>
          </div>
          <div className="sButton">
            <button type="submit">Sign Up!!</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = SignUpForm;
