// Imports
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import PomodoroAPI from './PomodoroAPI';
import { AuthContext } from './AuthContext';

/** Profile Component
 * 
 * This component is responsible for rendering a user's profile page. It provides a form to update a user's profile information.
 * 
 * Props:
 * - username: (str) the root state var username.
 * 
 * State:
 * - formData: (obj) user profile data.
 */
const Profile = ({ }) => {
    // Navigation
    const navigate = useNavigate();
    const { username } = useContext(AuthContext);

    // redirect to login if not logged in
    // if (!username) navigate('/login', { replace: false });
    // redirect if token is missing
    // if (!localStorage.getItem('token')) navigate('/login', { replace: false });

    // State
    const INITIAL_STATE = {
        firstName: '',
        lastName: '',
        email: '',
        avatar: '',
    }
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [updatedFriends, setUpdatedFriends] = useState(false)

    // Event Handlers
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            let updatedUser = await PomodoroAPI.updateUser(usernameInput, formData);
            setUser(updatedUser);
        }
        catch (errors) {
            console.error("Profile Update Error: ", errors);
        }
    };

    const handleApprove = async (username, sender) => {
        setUpdatedFriends(false)
        try {
            let approveRequest = await PomodoroAPI.approveRequest(username, sender)
            setUpdatedFriends(true)
        } catch (errors) {
            console.error("Request Approval Error: ", errors);

        }
    }
    const handleDeny = async (username, sender) => {
        setUpdatedFriends(false)
        try {
            let denyRequest = await PomodoroAPI.denyRequest(username, sender)
            setUpdatedFriends(true)
        } catch (errors) {
            console.error("Request Approval Error: ", errors);

        }
    }

    // Effects
    useEffect(() => {
        async function getUser() {
            if (!username) return;
            const userRes = await PomodoroAPI.getUser(username);
            const friendsRes = await PomodoroAPI.getFriends(username)
            const requestsRes = await PomodoroAPI.getFriendRequests(username)
            setUser(userRes);
            setFriends(friendsRes)
            setFriendRequests(requestsRes)
        }
        getUser();
    }, [username, updatedFriends]);

    // Render
    return (
        <div className='Profile'>
            {user ? (
                <>
                    <div className="profile-card">
                        <h1 className='Profile-tile'>{user.username}'s Page</h1>
                        <h3>{user.numPomodoros} pomodoro cycles completed.</h3>
                        <img src={"src/" + user.avatar} alt={user.username} />
                    </div>


                    <form className='Profile-form' onSubmit={handleSubmit}>
                        <label htmlFor='username'>Username:</label>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            defaultValue={user.username}
                            onChange={handleChange}
                            disabled
                        />

                        <label htmlFor='firstName'>First Name:</label>
                        <input
                            type='text'
                            id='firstName'
                            name='firstName'
                            defaultValue={user.firstName}
                            onChange={handleChange}
                        />

                        <label htmlFor='lastName'>Last Name:</label>
                        <input
                            type='text'
                            id='lastName'
                            name='lastName'
                            defaultValue={user.lastName}
                            onChange={handleChange}
                        />

                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            defaultValue={user.email}
                            onChange={handleChange}
                        />

                        <label htmlFor='avatar'>Avatar:</label>
                        <input
                            type='text'
                            id='avatar'
                            name='avatar'
                            defaultValue={user.avatar}
                            onChange={handleChange}
                        />

                        <button>Save Changes</button>
                    </form>
                    <div>
                        {user.lists.length > 0 ? (
                            <>
                                <h3>Lists</h3>
                                <ul>
                                    {user.lists.map(list => (
                                        <li key={list.id}>{list.title}</li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p>No Lists</p>
                        )}
                    </div>
                    <div>
                        {friends.length > 0 ? (
                            <>
                                <h1>Friends</h1>
                                <ul>
                                    {friends.map(friend => (
                                        <li key={friend.username}>{friend.username}</li>
                                    ))}
                                </ul>
                            </>
                        ) :
                            <p>No Friends</p>
                        }
                    </div>
                    <div>
                        {friendRequests.length > 0 ? (
                            <>
                                <h1>Friend Requests</h1>
                                <div>
                                    {friendRequests.map(request => (
                                        <div key={request.username}>
                                            <p key={request.username}>{request.username}</p>
                                            <button onClick={() => handleApprove(username, request.username)}>Approve</button>
                                            <button  onClick={() => handleDeny(username, request.username)}>Reject</button>
                                        </div>
                                    ))}
                                </div>

                            </>
                        ) :
                            <p>No Friend Requests</p>
                        }
                    </div>
                </>
            ) : (
                <>
                    <h1>Loading...</h1>
                </>
            )}
        </div>
    )
};

// Exports
export default Profile;