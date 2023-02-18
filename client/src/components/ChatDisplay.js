import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Chat from './Chat';
import ChatInput from './ChatInput';

const ChatDisplay = ({ user, clickedUser }) => {
    const [userMessages, setUserMessages] = useState([]);
    const [clickedUserMessages, setClickedUserMessages] = useState([]);
    const userId = user?.user_id;
    const clickedUserId = clickedUser?.user_id;

    const getUserMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: {userId: userId, correspondingUserId: clickedUserId}
            })
            setUserMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getClickedUserMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: {userId: clickedUserId, correspondingUserId: userId}
            })
            setClickedUserMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserMessages();
        getClickedUserMessages();
    }, [])

    const messages = []

    userMessages?.forEach(message => {
        const formattedMessage = {};
        formattedMessage['name'] = user?.first_name;
        formattedMessage['class'] = 'user-message';
        formattedMessage['img'] = user?.url;
        formattedMessage['message'] = message.message;
        formattedMessage['timestamp'] = message.timestamp;
        messages.push(formattedMessage);
    })

    clickedUserMessages?.forEach(message => {
        const formattedMessage = {};
        formattedMessage['name'] = clickedUser?.first_name;
        formattedMessage['class'] = 'clicked-user-message';
        formattedMessage['img'] = clickedUser?.url;
        formattedMessage['message'] = message.message;
        formattedMessage['timestamp'] = message.timestamp;
        messages.push(formattedMessage);
    })

    const descendingOrderedMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <>
        <Chat descendingOrderedMessages={descendingOrderedMessages} />
        <ChatInput user={user} clickedUser={clickedUser} getUserMessages={getUserMessages} getClickedUserMessages={getClickedUserMessages} />
        </>
    )
}

export default ChatDisplay;