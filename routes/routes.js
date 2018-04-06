const Authentication = require('../controllers/authentication_controller');
const UserController = require('../controllers/user_controller');
const EventController = require('../controllers/event_controller');
const TicketController = require('../controllers/ticket_controller');
const auth = require('../auth/authentication');
const express = require('express');
const authRoutes = express.Router();
const multer = require('multer');

const eventStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/eventImages');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/bmp' || file.mimetype === 'image/gif') {
        //Accept the file
        cb(null, true);
    } else {
        //Reject the file
        cb(new Error('Not a correct image file'), false);
    }
};

const uploadEventImage = multer({
    storage: eventStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//
// const uploadProfileImage = multer({
//     dest: 'uploads/ProfileImages/',
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     // fileFilter: fileFilter()
// });

module.exports = (app) => {
    authRoutes.use(function (req, res, next) {
        let token = req.headers.authorization;

        if(token) {
            if(auth.decodeToken(token.replace(/["]/g, ''))){
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
    app.get('/api/getCurrentUser', authRoutes, UserController.getCurrentUserByUsername);
    app.put('/api/editUser', authRoutes, UserController.editUser);
    app.delete('/api/deleteUser/:username', authRoutes, UserController.delete);

    //Events
    app.get('/api/getAllEvents', authRoutes, EventController.getAllEvents);
    app.get('/api/getEvent/:eventname', authRoutes, EventController.getEvent);
    app.get('/api/getUserEvents/', authRoutes, EventController.getUserEvents);
    app.get('/api/getAttendingUsers/:eventname', EventController.getAttendingUsers);
    app.post('/api/createEvent', authRoutes, uploadEventImage.single('eventImage'), EventController.addEvent);
    app.put('/api/editEvent/:eventname', authRoutes, EventController.editEvent);
    app.delete('/api/deleteEvent/:eventname', authRoutes, EventController.deleteEvent);

    //Tickets
    app.get('/api/getAllTickets', authRoutes, TicketController.getAllTickets);
    app.get('/api/getTicket/:ticketid', authRoutes, TicketController.getTicketById);
    app.post('/api/createTicket/:eventname', authRoutes, TicketController.createTicket);
    app.delete('/api/deleteTicket/:eventname/:ticketid', authRoutes, TicketController.deleteTicket);
};
