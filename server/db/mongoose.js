var mongoose = require('mongoose');

mongoose.Promise = global.Promise;


// if (process.env.PORT) {
//     connectPath = `mongodb://${encodeURIComponent(dbUser)}:${dbPassword}@ds111410.mlab.com:11410/node-to-api`;
// } else {
//     connectPath = 'mongodb://localhost:27017/TodoApp';
// }


// mongoose.connect(connectPath);

mongoose.connect(process.env.MONGODB_URI);
module.exports = {mongoose};