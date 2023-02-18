import axios from 'axios';
import React from 'react';
import { useState } from 'react';

const Chat = ({ user, clickedUser, getUserMessages, getClickedUserMessages }) => {
    const [textArea, settextArea] = useState('');
    const userId = user?.user_id;
    const clickedUserId = clickedUser?.user_id;

    const addMessage = async () => {
        if (textArea === '' || textArea === ' ') return

        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedUserId,
            message: textArea
        }

        try {
            await axios.post('http://localhost:8000/addmessage', { message });
            getUserMessages();
            getClickedUserMessages();
            settextArea("");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='chat-input'>
            <textarea value={textArea} onChange={(e) => settextArea(e.target.value)} />
            <button className='secondary-button' onClick={addMessage} >Submit</button>
        </div>
    )
}

export default Chat;