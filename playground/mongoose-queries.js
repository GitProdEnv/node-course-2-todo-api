const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5aeb33c8c77fee6c85d83870';
//
// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id  // Mongoose does not require you to pass in ObjectID's, it can do that for you
// }).then((todos) => {
//     console.log('Todos', todos);
// });
//
// Todo.findOne({
//     _id: id  // Mongoose does not require you to pass in ObjectID's, it can do that for you
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo)
// }).catch((e) => console.log(e));

const id = '5aeb086fb7da1a50b56262e6';

User.findById(id).then((user) => {
    if (!user) {
        return console.log('No user found');
    }
    console.log('User by Id', user);
}).catch((e) => console.log(e));

