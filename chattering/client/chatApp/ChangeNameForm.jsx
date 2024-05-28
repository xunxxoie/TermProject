var React = require('react');
var createReactClass = require('create-react-class');

var ChangeNameForm = createReactClass({
  getInitialState() {
    return { newName: '' };
  },

  handleChange(e) {
    this.setState({ newName: e.target.value });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.onChangeName(this.state.newName);
    this.setState({ newName: '' });
  },

  render() {
    return (
      <div className="change_name_form">
        <h3>아이디 변경</h3>
        <div className="ChangeNameinput">
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="변경할 아이디 입력"
            onChange={this.handleChange}
            value={this.state.newName}
          />
        </form>
        </div>
      </div>
    );
  }
});

module.exports = ChangeNameForm;
