import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';

const MatchesDisplay = ({ matches, setClickedUser }) => {
    const [matchedProfiles, setMatchedProfiles] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies();

    const matchedUsersIds = matches.map(({ user_id }) => user_id);
    const userId = cookies.UserId;

    const getMatches = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users', {
                params: {userIds: JSON.stringify(matchedUsersIds)}
            })
            setMatchedProfiles(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMatches();
    }, [])

    const filteredMatchesProfiles = matchedProfiles?.filter((matchedProfile) =>
        matchedProfile.matches.filter((profile) => profile.user_id == userId).length > 0
    )

    return (
        <div className="matches-display">
            {matchedProfiles?.map((match) => (
                <div key={match.user_id} className='match-card' onClick={() => setClickedUser(match)}>
                    <div className='img-container'>
                        <img src={match?.url} alt={match?.first_name + ' profile'} />
                    </div>
                    <h3>{match?.first_name}</h3>
                </div>
            ))}
        </div>
    )
}

export default MatchesDisplay;