// Imports
import axios from "axios";

// Global Vars
const BASE_URL = import.meta.VITE_BASE_URL || "http://localhost:3001";

/** API Class
 * 
 * Static class tying together methods used to get/send to the API. There shouldn't be any frontend-specific functionality here, and there shouldn't be any API-aware stuff elsewhere in the frontend.
 * 
 */
class PomodoroAPI {
    // the token for interactions with the API will be stored here
    static token;

    /** request class method
     * 
     * Facilitates the making of HTTP requests to the application's REST API. It constructs, sends a request, handles authorization, and processes a response.
     * 
     * Parameters:
     * endpoint: (str) valid API endpoint
     * data: (obj) payload for a request. Defaults to an empty obj.
     * method: (str) the type of HTTP request. Defaults to "get".
     */
    static async request(endpoint, data={}, method="get") {
        // Log API call details for debugging
        console.debug("API Call: ", endpoint, data, method);

        // construct parameters for any axios request to the API
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${PomodoroAPI.token}`};
        const params = ( method === 'get' )
            ? data
            : {};
        
        // contain constructed parameters in an obj
        const reqObj = { url, method, data, params, headers }
        console.log("reqObj: ", reqObj);

        try {
            // attempt to make an API call using axios, return its data
            return (await axios({ url, method, data, params, headers })).data;
        }
        catch (err) {
            // log the error, and throw an array of the error messages
            console.log("API Error: ", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes
    /** Post a user to /token to retrieve a token */
    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        this.token = res.token;
        return res.token;
    }

    /** Get a user object with their username 
     * 
     * This method assumes that a validation token has already been set for the class.
    */
    static async getUser(username) {
        // check that a token has been set
        if( !this.token ) throw new Error("Need an authentication token");
        // make request to /users/:username, return response
        let res = await this.request(`/users/${username}`);
        return res.user;
    }
};

// Exports
export default PomodoroAPI;