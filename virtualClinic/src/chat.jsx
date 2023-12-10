import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ChatApp = () => {
    const { roomId } = useParams();
    alert(roomId);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');

    // Function to generate a unique user ID
    const generateUserId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const storedToken = localStorage.getItem('token');
    const token = storedToken ? jwtDecode(storedToken) : null;

    // Get or generate a unique user ID from the token
    const userId = token ? token.username : generateUserId();

    const socket = io('http://localhost:3003', {
        query: {
            userId: userId,
            roomId: roomId, // Pass the roomId to the socket creation
        },
    });

    useEffect(() => {
        setUsername(userId);
        appendMessage('You joined');
        socket.emit('new-user', { user: userId, userId, roomId });

        socket.on('chat-message', (data) => {
            if (userId !== data.userId && roomId === data.roomId) {
                appendMessage(`${data.name}: ${data.message}`);
            }
        });

        socket.on('user-connected', (data) => {
            if (roomId === data.roomId) {
                appendMessage(`${data.name} connected`);
            }
        });

        socket.on('user-disconnected', (data) => {
            if (roomId === data.roomId) {
                appendMessage(`${data.name} disconnected`);
            }
        });

        // Save the userId and roomId to local storage
        localStorage.setItem('userId', userId);
        localStorage.setItem('roomId', roomId);

        return () => {
            socket.disconnect();
        };
    }, [userId, roomId]); // Include userId and roomId in the dependency array

    const sendMessage = (e) => {
        e.preventDefault();
        const message = messageInput;
        appendMessage(`You: ${message}`);
        socket.emit('send-chat-message', { message, userId, roomId });
        setMessageInput('');
    };

    const appendMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div style={styles.container}>
            <div style={styles.messageContainer}>
                {messages.map((message, index) => (
                    <div key={index} style={styles.message}>
                        {message}
                    </div>
                ))}
            </div>
            <form style={styles.sendContainer} onSubmit={sendMessage}>
                <input
                    type="text"
                    id="message-input"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={styles.messageInput}
                />
                <button type="submit" id="send-button" style={styles.sendButton}>
                    Send
                </button>
            </form>
        </div>
    );
};
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    messageContainer: {
        width: '80%',
        maxWidth: '1200px',
        backgroundColor: '#EEE',
        padding: '10px',
        marginBottom: '20px',
    },
    message: {
        backgroundColor: '#CCC',
        padding: '5px',
        marginBottom: '5px',
    },
    sendContainer: {
        position: 'fixed',
        bottom: '0',
        backgroundColor: 'white',
        maxWidth: '1200px',
        width: '80%',
        display: 'flex',
        padding: '10px',
    },
    messageInput: {
        flexGrow: '1',
        marginRight: '10px',
    },
    sendButton: {
        cursor: 'pointer',
    },
};

export default ChatApp;