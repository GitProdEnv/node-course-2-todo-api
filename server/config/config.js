const env = process.env.NODE_ENV || 'development';  // npm start script ala node server/server.js will default to development;

if (env === 'development' || env === 'test') {  // production we will never get from config.json; Config.json is not passed to github (see gitignore file) we have to set heroku config:set JWT_SECRET=XXXX and heroku config:set MONGODB_URI='wwwww' manually; If needed password with encodeURIComponent();
    var config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// } else if (env === 'production') {
//     // Heroku sets process.env.PORT automatically
//     // but since we don't use Heroku's MongoDB, we don't get passed a special process.env.MONGODB_URI; thats why we set it here
//     const dbUser = 'mLabDBQLU$ER';
//     const dbPassword = 'not3db4ddk!';
//     process.env.MONGODB_URI = `mongodb://${encodeURIComponent(dbUser)}:${dbPassword}@ds111410.mlab.com:11410/node-to-api`;
// }

