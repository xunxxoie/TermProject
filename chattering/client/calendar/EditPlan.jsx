var React = require('react');
var createReactClass = require('create-react-class');

var EditPlan = createReactClass({
  getInitialState() {
    return {
      title: this.props.selectedPlan ? this.props.selectedPlan.title : '',
      description: this.props.selectedPlan ? this.props.selectedPlan.description : '',
      important: this.props.selectedPlan ? this.props.selectedPlan.important : false,
      selectedPlanId: this.props.selectedPlan ? this.props.selectedPlan.id : null
    };
  },

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  },

  handleCheckboxChange(e) {
    this.setState({ important: e.target.checked });
  },

  handleDelete() {
    const { selectedPlanId } = this.state;
    this.props.onDeletePlan(selectedPlanId);
    this.props.onClose();
  },

  handleSubmit(e) {
    e.preventDefault();
    const { title, description, important, selectedPlanId } = this.state;
    if (title && description) {
      const plan = {
        id: selectedPlanId,
        title,
        description,
        important,
        date: this.props.date,
      };
      this.props.onEditPlan(plan);
      this.props.onClose();
    }
  },

  handleDelete() {
    console.log(this.state);
    const { selectedPlanId } = this.state;
    this.props.onDeletePlan(selectedPlanId);
    this.props.onClose();
  },

  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={this.props.onClose}>&times;</span>
          <h2>일정 수정</h2>
          <form onSubmit={this.handleSubmit}>
            <div>
              <input
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleChange}
                placeholder='일정 제목'
              />
            </div>
            <div>
              <input
                type="text"
                name="description"
                value={this.state.description}
                onChange={this.handleChange}
                placeholder='상세 내용'
              />
            </div>
            <div>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={this.state.important}
                  onChange={this.handleCheckboxChange}
                />
                중요 일정으로 등록하시겠습니까?
              </label>
            </div>
            <div className="button-group">
              <button type="submit" className="submit-button">수정하기</button>
              <button type="button" className="delete-button" onClick={this.handleDelete}>삭제하기</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = EditPlan;
