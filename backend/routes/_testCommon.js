// Enable strict mode
"use strict";

// Imports
const db = require("../db");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
    // noinspection sqlWithoutWhere
    await db.query("DELETE FROM users");

    // Insert test users
    await User.register({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        password: "password1"
    });
    await User.register({
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        password: "password2"
    });
    await User.register({
        username: "u3",
        firstName: "U3F",
        lastName: "U3L",
        email: "u3@email.com",
        password: "password3"
    });
}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

// Exports
module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken
}