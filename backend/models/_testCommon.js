// Imports
const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

// Helper Functions
/** commonBeforeAll helper
 * 
 * Will clear tables and insert test data for all model tests.
 */
async function commonBeforeAll() {
    // clear rows in tables
    // noinspection SQLWithoutWhere
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM lists");

    // Reset Primary keys for tables that need it
    await db.query(`ALTER SEQUENCE lists_id_seq RESTART WITH 1`)

    // insert values into users, use hashed passwords
    await db.query(`
        INSERT INTO users(
            username,
            password,
            first_name,
            last_name,
            email)
        VALUES 
            ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
            ('u2', $2, 'U2F', 'U2L', 'u2@email.com'),
            ('u3', $3, 'U3F', 'U3L', 'u3@email.com')
        RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
            await bcrypt.hash('password3', BCRYPT_WORK_FACTOR)
        ]
    );

    // insert values into lists
    await db.query(`
        INSERT INTO lists
            (username)
        VALUES
            ('u1')
        RETURNING id, title`
    );
    await db.query(`
        INSERT INTO lists
            (username, title, list_type, expired_at)
        VALUES
            ('u2', 'expired list', true, '06/12/2023')
        RETURNING id, title`);
    
    // Insert values into friends
    await db.query(`
        INSERT INTO friends
            (sender, receiver, request_status)
        VALUES
            ('u1', 'u2', false)
        RETURNING sender, receiver, request_status`);
};

/** commonBeforeEach helper
 * 
 * Starts a new transaction in the database
 */
async function commonBeforeEach() {
    await db.query("BEGIN");
};

/** commonAfterEach helper
 * 
 * Rollsback transaction in the database
 */
async function commonAfterEach() {
    await db.query("ROLLBACK");
};

/** commonAfterAll helper
 * 
 * Ends connection to the database.
 */
async function commonAfterAll() {
    await db.end();
};

// Exports
module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
}