var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const friendRequestController = require('../controllers/friendRequestController');
const { check } = require('express-validator');
const passport = require('passport');

// GET A USER'S INFO
router.get('/:id', passport.authenticate('jwt', { session: false }), userController.get_one_user);

// GETS 5 USERS THE LOGGED IN USER IS NOT FRIENDS WITH
router.get(
    '/:id/new-people',
    passport.authenticate('jwt', { session: false }),
    userController.get_new_users,
);

// SEND FRIEND REQUEST
router.post(
    '/friend-request/:fromUserID/send/:toUserID',
    passport.authenticate('jwt', { session: false }),
    friendRequestController.post_friend_request,
);

// ACCEPT FRIEND REQUEST
router.put(
    '/friend-request/:fromUserID/accept/:toUserID',
    passport.authenticate('jwt', { session: false }),
    friendRequestController.put_accept_friend_request,
);

// DECLINE FRIEND REQUEST
router.put(
    '/friend-request/:fromUserID/decline/:toUserID',
    passport.authenticate('jwt', { session: false }),
    friendRequestController.put_decline_friend_request,
);

router.post(
    '/log-in',
    [
        check('email', 'Email must be valid').isEmail().trim().escape(),
        check('password', 'Password must be at least 8 characters long')
            .isLength({ min: 8 })
            .trim()
            .escape(),
    ],
    userController.log_in,
);

router.post(
    '/sign-up',
    [
        check('first_name', 'First name is required').isLength({ min: 1, max: 50 }).trim().escape(),
        check('last_name', 'Last name is required').isLength({ min: 1, max: 50 }).trim().escape(),
        check('password', 'Password must be at least 8 characters long')
            .isLength({ min: 8 })
            .trim()
            .escape(),
        check('password_confirmation', 'Passwords must match')
            .custom((value, { req }) => value === req.body.password)
            .trim()
            .escape(),
        check('email', 'Email must be valid').isEmail().trim().escape(),
        check(['day', 'month', 'year'], 'Birthday is required').not().isEmpty().trim().escape(),
        check('gender', 'Choose a gender').not().isEmpty().trim().escape(),
    ],
    userController.sign_up,
);

module.exports = router;
