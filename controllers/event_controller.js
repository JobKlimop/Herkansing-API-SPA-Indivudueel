const mongodb = require('../config/mongo.db');
const Event = require('../models/event');
const neo4j = require('../config/neo4j');

module.exports = {

    getAllEvents(req, res, next) {
        Event.find({})
            .then((events) => {
                res.status(200)
                    .send(events);
            })
            .catch((error) => {
                res.status(404);
                res.json({msg: 'No events found'});
            });
    },

    getEvent(req, res, next) {
        let eventname = req.params.eventname;

        Event.findOne({eventName: eventname})
            .then((event) => {
                res.status(200).send(event);
            })
            .catch((error) => {
                res.status(404);
                res.json({msg: 'Event not found'});
            })
    },

    addEvent(req, res, next) {
        let body = req.body;

        let eventToCreate = new Event();
        eventToCreate.eventName = body.eventName;
        eventToCreate.eventImageUrl = body.eventImageUrl;
        eventToCreate.artist = body.artist;
        eventToCreate.eventDate = body.eventDate;
        eventToCreate.eventTime = body.eventTime;
        eventToCreate.location = body.location;
        eventToCreate.noOfTickets = body.noOfTickets;

        Event.findOne({eventName: eventToCreate.eventName})
            .then((event) => {
                if(event === null) {
                    Event.create(eventToCreate)
                        .then((event) => {
                            res.status(200);
                            res.contentType('application/json');
                            res.send(event);
                        })
                        .then(() => {
                            neo4j.session
                                .run("CREATE (a:Event {eventName:'" + body.eventName + "'})")
                                .then((result) => {
                                    res.status(200);
                                    neo4j.session.close();
                                })
                                .catch((error) => {
                                    console.log(error);
                                    next();
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            return;
                        })
                } else {
                    res.status(401);
                    res.contentType('application/json');
                    res.json({msg: 'Event already exists'});
                }
            })
            .catch((error) => {
                res.status(500);
                res.json({msg: 'Server error'});
            });
    },

    editEvent(req, res, next) {
        let newData = req.body;
        let eventname = req.params.eventname;
        let newEventName = newData.eventName;

        Event.findOneAndUpdate({eventName: eventname}, newData)
            .then((body) => {
                res.status(200);
                res.contentType('application/json');
                res.send(body);
            })
            .catch((error) => {
                res.status(422);
                console.log(error);
                res.json({msg: 'Event could not be updated'});
            });

        neo4j.session
            .run("MATCH (a:Event {eventName:'" + eventname + "'})" +
                "SET a.eventName = '" + newEventName + "'" +
                "RETURN a")
            .then(() => {
                res.status(200);
                neo4j.session.close;
            })
            .catch((error) => {
                res.status(422);
                console.log(error);
            });
    },

    deleteEvent(req, res, next) {
        let eventname = req.params.eventname;

        Event.findOne({eventName: eventname})
            .then((event) => {
                if(event !== null) {
                    Event.findOneAndRemove({eventName: eventname})
                        .then(() => {
                            neo4j.session
                                .run("MATCH (a:Event {eventName:'" + eventname + "'})" +
                                    "DETACH DELETE a")
                                .then(() => {
                                    neo4j.session.close();
                                });
                            res.status(200);
                            res.json({msg: 'Event deleted'});
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(422);
                            res.json({msg: 'Event could not be deleted'});
                        });
                } else {
                    res.status(422);
                    res.json({msg: 'Event does not exist'});
                }
            });
    }
};
