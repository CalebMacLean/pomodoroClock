// Enable strict mode to avoid common mistakes
"use strict";

// Imports
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError");
const db = require("../db");
const List = require("./list");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

// Set Up & Tear Down
// check models/_testCommon.js for clarification
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************************************** add */
describe("add class method", function () {
    test("works", async function () {
        // use List.add to create a new list for u1
        const result = await List.add('u1', {
            title: 'new list',
            listType: false
        });

        expect(result).toEqual({
            id: expect.any(Number),
            title: 'new list',
            username: 'u1',
            listType: false,
            createdAt: expect.any(Date),
            expiredAt: null
        });
    });

    test("Throws BadRequestError with no username", async function () {
        try {
            // use List.add without a username
            const result = await List.add();
            fail();
        }
        catch (err) {
            // Should be a BadRequestError
            expect(err instanceof BadRequestError).toBeTruthy();
            // Should have a specific message
            expect(err.message).toEqual('No username');
        }
    })
});
