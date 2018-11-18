var helpers = require('../config/helperFunctions');
var UserModel = require('../models/UserModel');

module.exports = function(server) {
    server.get("/", function(req, res, next) {
        UserModel.find({}, function(err, users) {
            return helpers.success(res, next, users);
        });
    });

    server.get("/user/:id", function(req, res, next) {
        req.assert('id', 'ID is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            return helpers.failure(res, next, errors[0], 400);
        }
        UserModel.findOne({ _id: req.params.id }, function(err, user) {
            if (err) {
                return helpers.failure(res, next, 'Something went wrong', 500);
            }
            if (user === null) {
                return helpers.failure(res, next, 'Specified user couldnt be found', 404);
            }
            return helpers.success(res, next, user);
        });
    });

    server.post("/user", function(req, res, next) {
        req.assert('first_name', 'First name is required').notEmpty();
        req.assert('last_name', 'Last name is required').notEmpty();
        req.assert('email_address', 'Email is required and must be a valid email').notEmpty().isEmail();
        req.assert('career', 'Career is required and must be student, professor, or teacher').notEmpty().isIn(['student', 'teacher', 'professor']);
        var errors = req.validationErrors();
        if (errors) {
            return helpers.failure(res, next, errors, 400);
        }
        var user = new UserModel();
        user.first_name = req.params.first_name;
        user.last_name = req.params.last_name;
        user.email_address = req.params.email_address;
        user.career = req.params.career;
        user.save(function(err) {
            if (err) {
                return helpers.failure(res, next, 'Error saving user', 500);
            }
        });
        helpers.success(res, next, user);
    });

    server.put("/user/:id", function(req, res, next) {
        req.assert('id', 'ID is required and must be numeric').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            return helpers.failure(res, next, errors[0], 400);
        }
        UserModel.findOne({ _id: req.params.id }, function(err, user) {
            if (err) {
                return helpers.failure(res, next, 'Something went wrong', 500);
            }
            if (user === null) {
                return helpers.failure(res, next, 'Specified user couldnt be found', 404);
            }
            var updates = req.params;
            delete updates.id;
            for (var field in updates) {
                user[field] = updates[field];
            }
            user.save(function(err) {
                if (err) {
                    return helpers.failure(res, next, 'Error saving user', 500);
                }
            });
            return helpers.success(res, next, user);
        });
    });

    server.del("/user/:id", function(req, res, next) {
        req.assert('id', 'ID is required and must be numeric').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            return helpers.failure(res, next, errors[0], 400);
        }
        UserModel.findOne({ _id: req.params.id }, function(err, user) {
            if (err) {
                return helpers.failure(res, next, 'Something went wrong', 500);
            }
            if (user === null) {
                return helpers.failure(res, next, 'Specified user couldnt be found', 404);
            }
            user.remove(function(err) {
                if (err) {
                    return helpers.failure(res, next, 'Error deleting user', 500);
                }
            });
            return helpers.success(res, next, user);
        });
    });
};