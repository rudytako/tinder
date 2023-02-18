import React from 'react';
import ChatHeader from './ChatHeader';
import ChatDisplay from './ChatDisplay';
import MatchesDisplay from './MatchesDisplay';
import { useState } from 'react';

const ChatContainer = ({ user, styling }) => {
    const [clickedUser, setClickedUser] = useState(null);

    return (
        <div style={styling ? {display: "block"} : {display: "none"}} className='chat-container'>
            <ChatHeader user={user} />

            <div>
                <button className={clickedUser ? 'option disable-button' : 'option'} onClick={() => setClickedUser(null)} >Matches</button>
                <button className='option' disabled={!clickedUser} >Chat</button>
            </div>

            {!clickedUser && user.matches && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser} />}

            {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser}/>}
        </div>
    )
}

export default ChatContainer;