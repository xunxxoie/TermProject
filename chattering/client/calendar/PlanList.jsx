var React = require('react');
var createReactClass = require('create-react-class');

var PlanList = createReactClass({
  render() {

    return (
      <div className="plan-list">
        <h1>{this.props.selectedDate.toDateString()}</h1>
        {this.props.plans.length === 0 ? (
          <p>🚨등록된 일정이 없습니다.🚨</p>
        ) : (
          <ul className="plan-list-ul">
            {this.props.plans.map(plan => (
              <li key={plan.id} className={`plan-item ${plan.important ? 'important' : ''}`}>
                <h4>{plan.title}</h4>
                <p>{plan.description}</p>
                <div className="write">
                  <p>등록자: {plan.user}</p> {}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
});

module.exports = PlanList;
