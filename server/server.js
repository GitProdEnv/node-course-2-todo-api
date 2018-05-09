require('./config/config');

const _ = require('lodash');
const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        return res.send({todo});
    }, (e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    } catch (e) {
        res.status(400).send();
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);  // Define what you want do update with lodash

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // new: true similar option mongoose developer set to returnOriginal: false
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.post('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

   try {
       const token = await user.generateAuthToken(); // a bit changed https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/questions/2434110
       res.header('x-auth', token).send(user);
   } catch (e) {
       res.status(400).send(e);
   }
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (req,res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};

