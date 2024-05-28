const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const socketHandler = require('./routes/socket');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'client/images')));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

socketHandler(io); 

server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
