const mongodb = require('../config/mongo.db');
const Ticket = require('../models/ticket');
const Event = require('../models/event');

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

    getTicket(req, res, next) {
        let ticketId = req.params.ticketId;

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

    // getTicketByEvent(req, res, next) {
    //     let eventName = req.params.eventName;
    //     let ticketId = req.params.ticketId;
    //
    //     Event.find({eventName: eventName})
    //         .then((event) => {
    //             if(event !== null) {
    //
    //             }
    //         })
    // }

    createTicket(req, res, next) {
        let eventname = req.params.eventname;
        let body = req.body;

        let ticketToCreate = new Ticket();
        ticketToCreate.ticketId = body.ticketId;
        ticketToCreate.ticketType = body.ticketType;
        ticketToCreate.ticketPrice = body.ticketPrice;

        Ticket.findOne({ticketId: ticketToCreate.ticketId})
            .then((ticket) => {
                if(ticket === null) {
                    Ticket.create(ticketToCreate)
                        .then((ticket) => {
                            Event.findOne({eventName: eventname})
                                .then((event) => {
                                    event.ticket.push(ticket);
                                    event.save();
                                });
                            res.status(200);
                            res.contentType('application/json');
                            res.send(ticket);
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(401);
                            res.json({msg: 'Error occured, try again later'});
                        })
                } else {
                    res.status(401);
                    res.contentType('application/json');
                    res.json({msg: 'Ticket already sold, please try again'});
                }
            })
            .catch((error) => {
                res.status(500);
                res.json({msg: 'Server error'});
            });
    },

    deleteTicket(req, res, next) {
        let ticketId = req.params.ticketid;

        Ticket.findOneAndRemove({ticketId: ticketId})
            .then((ticket) => {
                res.status(200);
                res.json(ticket);
                res.json({msg: 'Ticket deleted'});
            })
            .catch((error) => {
                console.log(error);
                res.status(422);
                res.json({msg: 'Ticket does not exist'});
            })
    }
};