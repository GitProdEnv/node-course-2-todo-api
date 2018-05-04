const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove both returns the doc
// Todo.findByIdAndRemove both returns the doc

// Todo.findOneAndRemove({_id: '5aeb432485fe7b77e54dc175'}).then((todo) => {
//     console.log(todo);
// });
// Todo.findByIdAndRemove('5aeb432485fe7b77e54dc175').then((todo) => {
//     console.log(todo);
// });
