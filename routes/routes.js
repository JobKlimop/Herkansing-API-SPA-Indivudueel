const Authentication = require('../controllers/authentication_controller');
const UserController = require('../controllers/user_controller');
const EventController = require('../controllers/event_controller');
const TicketController = require('../controllers/ticket_controller');
const auth = require('../auth/authentication');
const express = require('express');
const authRoutes = express.Router();

module.exports = (app) => {
    authRoutes.use(function (req, res, next) {
        let token = req.headers['x-access-token'];

        if(token) {
            if(auth.decodeToken(token)){
                next();
            } else {
                res.status(401);
                res.contentType('application/json');
                res.json({success: false, msg: 'Token expired'});

            }
        } else {
            res.status(401);
            res.contentType('application/json');
            res.json({msg: 'No token provided'});
        }
    });

    //Authentication
    app.post('/api/register', Authentication.register);
    app.post('/api/login', Authentication.login);

    //Users
    app.get('/api/getAllUsers', authRoutes, UserController.getAllUsers);
    app.get('/api/getUser/:username', authRoutes, UserController.getOneUser);
    app.delete('/api/deleteUser/:username', authRoutes, UserController.delete);

    //Events
    app.get('/api/getAllEvents', authRoutes, EventController.getAllEvents);
    app.get('/api/getEvent/:eventname', authRoutes, EventController.getEvent);
    app.post('/api/createEvent', authRoutes, EventController.addEvent);
    app.put('/api/editEvent/:eventname', authRoutes, EventController.editEvent);
    app.delete('/api/deleteEvent/:eventname', authRoutes, EventController.deleteEvent);

    //Tickets
    app.get('/api/getAllTickets', authRoutes, TicketController.getAllTickets);
    app.get('/api/getTicket/:ticketid', authRoutes, TicketController.getTicketById);
    // app.get('/api/getTicketByEvent/:eventname', authRoutes, TicketController.getTicketsByEvent);
    app.post('/api/createTicket/:eventname', authRoutes, TicketController.createTicket);
    app.delete('/api/deleteTicket/:eventname/:ticketid', authRoutes, TicketController.deleteTicket);
};