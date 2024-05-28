var React = require('react');
var createReactClass = require('create-react-class');

var UsersList = createReactClass({
  render() {
    const { users } = this.props;

    if (!users || users.length === 0) {
      console.log(users);
      return <div className="users">No users in this room.</div>;
    }

    return (
      <div className="users">
        <h3>참여자들</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    );
  }
});

module.exports = UsersList;
