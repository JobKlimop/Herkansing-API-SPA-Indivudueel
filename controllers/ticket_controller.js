const mongodb = require('../config/mongo.db');
const Ticket = require('../models/ticket');
const Event = require('../models/event');
const User = require('../models/user');
const auth = require('../auth/authentication');
const neo4j = require('../config/neo4j');

module.exports = {

    getAllTickets(req, res, next) {

        Ticket.find({})
            .then((tickets) => {
                res.status(200);
                res.send(tickets);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    getTicketById(req, res, next) {
        let ticketId = req.params.ticketid;

        Ticket.find({ticketId: ticketId})
            .then((ticket) => {
                res.status(200);
                res.send(ticket);
            })
            .catch((error) => {
                console.log(error);
                res.status(404);
                res.json({msg: 'Ticket not found'});
            })
    },

    // getTicketsByEvent(req, res, next) {
    //     let eventname = req.params.eventname;
    //
    //     Event.findOne({eventName: eventname})
    //         .then((event) => {
    //             console.log('1');
    //             console.log(event.ticket.length);
    //             let tickets = [];
    //             for(let i = 0; i < event.ticket.length + 1; i++) {
    //                 console.log('2');
    //                 Ticket.find({_id: event.ticket[i]})
    //                     .then((ticket) => {
    //                         console.log('3');
    //                         console.log(ticket);
    //                         tickets.push(ticket);
    //                     }).then(() => {
    //                     res.status(200);
    //                     res.contentType('application/json');
    //                     res.send(tickets);
    //                 });
    //                 console.log(event.ticket);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             return;
    //         })
    // },

    createTicket(req, res, next) {
        let eventname = req.params.eventname;
        let body = req.body;
        let token = req.headers.authorization;

        let ticketToCreate = new Ticket();
        ticketToCreate.ticketType = body.ticketType.ticketType;
        ticketToCreate.ticketPrice = body.ticketType.price;

        let currentUser = auth.getCurrentUser(token);

        console.log(body);

        Ticket.create(ticketToCreate)
            .then((ticket) => {
                Event.findOne({eventName: eventname})
                    .then((event) => {
                        event.ticket.push(ticket);
                        event.save();
                        });
                User.findOne({userName: currentUser})
                    .then((user) => {
                        user.tickets.push(ticket);
                        user.save();
                        });
                neo4j.session
                    .run("MATCH (a:User {userName:'" + currentUser + "'}), " +
                        "(b:Event {eventName:'" + eventname + "'}) " +
                        "MERGE(a)-[:ATTENDS]->(b)")
                    .then(() => {
                        neo4j.session.close()
                    });
                res.status(200);
                res.contentType('application/json');
                res.send(ticket);
                })
            .catch((error) => {
                console.log(error);
                res.status(401);
                res.json({msg: 'Error occured, try again later'});
            });
    },

    deleteTicket(req, res, next) {
        let ticketId = req.params.ticketid;
        let token = req.headers['x-access-token'];
        let eventname = req.params.eventname;

        let currentUser = auth.getCurrentUser(token);

        Ticket.findOne({ticketId: ticketId})
            .then((ticket) => {
                if(ticket !== null) {
                    Event.findOne({eventName: eventname})
                        .then((event) => {
                            event.ticket.remove(ticket._id);
                            event.save();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    User.findOne({userName: currentUser})
                        .then((user) => {
                            user.tickets.remove(ticket._id);
                            user.save();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    Ticket.findOneAndRemove({ticketId: ticketId})
                        .then(() => {
                            res.status(200);
                            res.json({msg: 'Ticket deleted'});
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(422);
                            res.json({msg: 'Ticket does not exist'});
                        });

                    neo4j.session
                        .run("MATCH (:User {userName:'" + currentUser + "'})-[r:ATTENDS]-(:Event {eventName:'" + eventname + "'})" +
                            "DELETE r");
                    res.status(200);
                    res.contentType('application/json');
                    res.json({msg: 'Ticket deleted'});
                } else {
                    res.status(401);
                    res.json({msg: 'Ticket does not exist'});
                }
            })
            .catch((error) => {
                console.log(error);
                next();
            });
    }
};