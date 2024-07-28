// Imports
import React from 'react';
import { NavLink } from 'react-router-dom';

/** NavBar Component
 * 
 * This component is responsible for rendering the navigation bar. It provides links to the home page, companies page, jobs page, and the user's profile page. It also provides a login and signup link if the user is not logged in, and a logout link if the user is logged in.
 * 
 * Props:
 * - user: object like { username, first_name, last_name, email, avatar, num_pomodoros, is_admin }
 * 
 * State: none
 */
const NavBar = ({ username }) => {
    // create var to check if a user is logged in
    const isLoggedIn = username? true : false;
    console.log("NavBar isLoggedIn:", isLoggedIn);

    // Render
    return (
        <nav className='NavBar'>
            <h2>Pomodoro Clock</h2>
            {isLoggedIn ? (
                <div>
                    <NavLink to="/logout">Logout</NavLink>
                </div>
            ) : (
                <div>
                    <NavLink to="/login">Login</NavLink>
                </div>
            )}
        </nav>
    )
}

// Exports
export default NavBar;