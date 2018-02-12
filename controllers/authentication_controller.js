const mongodb = require('../config/mongo.db');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const auth = require('../auth/authentication');

module.exports = {
    register(req, res, next) {
        let body = req.body;

        let userToCreate = new User();
        userToCreate.userName = body.userName;
        userToCreate.firstName = body.firstName;
        userToCreate.middleName = body.middleName;
        userToCreate.lastName = body.lastName;
        userToCreate.age = body.age;
        userToCreate.email = body.email;
        userToCreate.password = bcrypt.hashSync(body.password, 2);

        User.findOne({userName: userToCreate.userName})
            .then(user => {
                if(user === null) {
                    User.create(userToCreate)
                        .then(user => {
                            res.status(200);
                            res.contentType('application/json');
                            res.send(user);
                        })
                        .catch(error => {
                            console.log(error);
                            return;
                        });
                } else {
                    res.status(401);
                    res.contentType('application/json');
                    res.json({msg: 'User already exists'});
                }
            })
            .catch(err => {
                res.status(500);
                res.json({msg: 'Server error'})
            })
    },

    login(req, res, next) {
        let username = req.body.username;
        let password = req.body.password;

        User.findOne({userName: username})
            .then((user) => {
                if(user === null) {
                    console.log(user);
                    res.status(401);
                    res.json({msg: 'Username/password incorrect'});
                } else {
                    console.log(user);
                    pass = user.password;
                    if(bcrypt.compareSync(password, pass)) {
                        let token = auth.encodeToken(username);
                        res.status(200);
                        res.contentType('application/json');
                        res.send({'token': token});
                    } else {
                        res.status(401);
                        res.contentType('application/json');
                        res.json({msg: 'Username/password incorrect'});
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(401);
                res.contentType('application/json');
                res.json({msg: 'Username/password incorrect'});
            });
    }
};
