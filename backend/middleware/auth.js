"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        // console.log("authenticateJWT authHeader: ", authHeader);

        if (authHeader) {
            // console.log("authenticateJWT conditional reached");

            const token = authHeader.replace(/^[Bb]earer /, "").trim();

            // console.log("auth token: ", token);

            res.locals.user = jwt.verify(token, SECRET_KEY);

            // console.log("res.locals: ", res.locals);
        }
        // console.log("authenticateJWT res.locals.user", res.locals.user);
        return next();
    } catch (err) {
        console.log(err);
        return next();
    }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
    try {
        console.log("ensureLoggedIn req.params: ", req.params);
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user;
        // console.log("ensureCorrectUserOrAdmin res.locals: ", res.locals);
        // console.log("ensureCorrectUserOrAdmin res.locals.user: ", user);
        // console.log("ensureCorrectUserOrAdmin res.locals.user.username: ", user.username);
        // console.log("ensureCorrectUserOrAdmin req.params: ", req.params);
        // console.log("ensureCorrectUserOrAdmin req.body: ", req.body);

        if (!(user && (user.isAdmin || user.username === req.params.username || user.username === req.body.username))) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}


module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin
};