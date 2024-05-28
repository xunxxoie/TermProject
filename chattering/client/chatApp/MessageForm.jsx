var React = require('react');
var createReactClass = require('create-react-class');

var MessageForm = createReactClass({
  getInitialState() {
    return { text: '' };
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.onMessageSubmit(this.state.text);
    this.setState({ text: '' });
  },

  handleChange(e) {
    this.setState({ text: e.target.value });
  },

  render() {
    return (
      <div className="message_form">
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="메시지 입력"
            className="textinput"
            onChange={this.handleChange}
            value={this.state.text}
          />
        </form>
      </div>
    );
  }
});

module.exports = MessageForm;
