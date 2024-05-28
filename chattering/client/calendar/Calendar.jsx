var React = require('react');
var createReactClass = require('create-react-class');
var Calendar = require('react-calendar').default;

var CalendarComponent = createReactClass({
  getInitialState() {
    return {
      date: new Date(),
      events: {}
    };
  },

  onChange(date) {
    this.setState({ date });
    if (this.props.onDateChange) {
      this.props.onDateChange(date);
    }
  },

  formatDay(locale, date) {
    return date.getDate().toString();
  },

  render() {
    return (
      <div className="calendar-container">
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          formatDay={this.formatDay}
        />
      </div>
    );
  }
});

module.exports = CalendarComponent;
