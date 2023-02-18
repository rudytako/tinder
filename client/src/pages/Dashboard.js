import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';
import tinderLogo from '../images/logo-tinder.png';
import chatlogo from '../images/chat-logo.png';

const Dashboard = () => {
    const [user, setUser] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [genderedUsers, setGenderedUsers] = useState([])
    const [filteredGenderedUsers, setFilteredGenderedUsers] = useState([]);
    const [chatActive, setChatActive] = useState(true);
    const userId = cookies.UserId;

    const getWindowDimensions = () => {
        const { innerWidth: width } = window;
        if (width < 900) setChatActive(true)
    }
    
    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data.users)
        } catch (error) {
            console.log(error)
        }
    }

    const filterUsers = () => {
        if (user?.matches) {
            const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

            const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))
            setFilteredGenderedUsers(filteredGenderedUsers)
        }
    }

    useEffect(() => {
        getWindowDimensions();
        window.addEventListener('resize', getWindowDimensions());
    }, [])

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()

        }
    }, [user])

    useEffect(() => {
        if (user.matches && genderedUsers[0]) {
            filterUsers();
        }
    }, [genderedUsers, user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }

    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    return (
        <>
        {user && 
        <div className='dashboard'>
            {chatActive && <ChatContainer user={user} styling={chatActive} />}

            <div className='swipe-container'>
                <div className='card-container'>
                    {filteredGenderedUsers.map((genderedUser) =>
                        <TinderCard 
                            className='swipe' 
                            key={genderedUser.user_id} 
                            onSwipe={(dir) => swiped(dir, genderedUser.user_id)} 
                            onCardLeftScreen={() => outOfFrame(genderedUser.first_name)} >
                            <div style={{ backgroundImage: 'url(' + genderedUser.url + ')'}} className='card'>
                                <h3>{genderedUser.first_name}</h3>
                            </div>
                        </TinderCard>
                    )}
                </div>
                <div className='menu'>
                    <div onClick={() => setChatActive(false)} class='menu-option'>
                        <img src={tinderLogo} />
                    </div>
                    <div onClick={() => setChatActive(true)} class='menu-option'>
                        <img src={chatlogo} />
                    </div>
                </div>
            </div>
        </div>}
        </>
    )
}

export default Dashboard;