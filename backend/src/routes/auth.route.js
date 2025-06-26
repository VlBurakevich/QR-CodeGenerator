const express = require('express');
const UserService = require('../service/UserService.js');
const UserRepository = require('../repository/UserRepository.js');
const db = require('../../db/connection.js');

const router = express.Router();

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);

router.post('/session', async (req, res, next) => {
    try {
        const session = await userService.createAnonymousSession();
        res.status(201).json(session);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
