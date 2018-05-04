var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectPath;

const dbUser = 'mLabDBQLU$ER';
const dbPassword = 'not3db4ddk!';

if (process.env.PORT) {
    connectPath = `mongodb://${encodeURIComponent(dbUser)}:${dbPassword}@ds111410.mlab.com:11410/node-to-api`;
} else {
    connectPath = 'mongodb://localhost:27017/TodoApp';
}


mongoose.connect(connectPath);

module.exports = {mongoose};