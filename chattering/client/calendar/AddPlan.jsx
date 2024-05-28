var React = require('react');
var createReactClass = require('create-react-class');

var AddPlan = createReactClass({
  getInitialState() {
    return {
      title: '',
      description: '',
      important: false
    };
  },

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  },

  handleCheckboxChange(e) {
    this.setState({ important: e.target.checked });
  },

  handleSubmit(e) {
    e.preventDefault();
    const { title, description, important } = this.state;
    if (title && description) {
      const plan = {
        title,
        description,
        important,
        date: this.props.date,
      };
      this.props.onAddPlan(plan);
      this.props.onClose();
    }
  },

  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={this.props.onClose}>&times;</span>
          <form onSubmit={this.handleSubmit}>
            <div>
              <input
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleChange}
                placeholder="일정 제목"
              />
            </div>
            <div className="descriptionBox">
              <input
                type="text"
                name="description"
                value={this.state.description}
                onChange={this.handleChange}
                placeholder="상세 내용"
              />
            </div>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.important}
                  onChange={this.handleCheckboxChange}
                />
                중요 일정으로 등록하시겠습니까?
              </label>
            </div>
              <button type="submit" className="confirmB">일정등록하기</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = AddPlan;
