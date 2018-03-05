const mongodb = require('../config/mongo.db');
const User = require('../models/user');
const neo4j = require('../config/neo4j');
const auth = require('../auth/authentication');

module.exports = {

    getAllUsers(req, res, next) {
        User.find({})
            .then((users) => {
                res.status(200)
                    .send(users);
            })
            .catch(next);
    },

    getOneUser(req, res, next) {
        let username = req.params.username;

        User.findOne({userName: username})
            .then((user) => {
                res.status(200).send(user);
            })
            .catch((error) => res.status(401).json(error));
    },

    getCurrentUserByUsername(req, res, next) {
        let token = req.headers.authorization;
        let username = auth.getCurrentUser(token);

        User.findOne({userName: username})
            .then((user) => {
                res.status(200).send(user);
            })
            .catch((error) => {
                res.status(401).json(error)
            });
    },

    edit(req, res, next) {
        let newData = req.body;
        let username = req.params.username;

        User.findOneAndUpdate({userName: username}, newData)
            .then(() => {
                res.status(200);
                res.contentType('application/json');
                res.send(body);
            })
            .catch(next);
    },

    delete(req, res, next) {
        let username = req.params.username;

        User.findOne({userName: username})
            .then(user => {
                if(user !== null) {
                    User.findOneAndRemove({userName: username})
                        .then(user => {
                            neo4j.session
                                .run("MATCH (a:User {userName:'" + username + "'})" +
                                    "DETACH DELETE a")
                                .then(() => {
                                    neo4j.session.close();
                                });

                            res.status(200);
                            res.json({msg: 'User deleted'});
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(422);
                            res.json({msg: 'Could not delete user'});
                        });
                } else {
                    res.status(422);
                    res.json({msg: 'User does not exist'});
                }
            })
            .catch(next);
    }
};