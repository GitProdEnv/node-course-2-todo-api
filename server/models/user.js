const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: { // see mongoosejs.com/docs/validation.html
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject(); // user.toObject() is responsible for taking your mongoose variable user and converting it into a regular object where only the properties available on the document exists.

    return _.pick(userObject, ['_id', 'email']);
};
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]); // There were some problems
    // user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {  // $pull let's you remove items from an array which matches certain criteria
            tokens: {token} // if the token in the argument does matches in the array it is going to remove it. Not just the token property, sondern the entire object, with means the id, the access property and the token property
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this; // Instance methods get called with the individual document, model methods get called with the model as the this binding
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();  // THis means that by this Promise, the success case in server.js will never fire // User.findByToken => catch call
        // })
        return Promise.reject(); // The same as above;
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}; // .statics everything you add on it turns to a model method as oppose an instance method

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        // all the bcrypt.js libraries only support callbacks, but we want still have Promises
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        })
    });
};

UserSchema.pre('save', function (next) {  // you have to call next somewhere inside your function. If not, the middleware is never be complete and program is going to crash
    var user = this;

    // Check if password gets updated
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};