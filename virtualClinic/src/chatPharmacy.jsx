import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';

const ChatApp = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');
    const messagesContainerRef = useRef(null);
    // Function to generate a unique user ID
    const generateUserId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const storedToken = localStorage.getItem('token');
    const token = storedToken ? jwtDecode(storedToken) : null;

    // Get or generate a unique user ID from the token
    const userId = token ? token.username : generateUserId();

    const socket = io('http://localhost:3005', {
        query: {
            userId: userId,
            roomId: roomId, // Pass the roomId to the socket creation
        },
    });
    useEffect(() => {
        // Scroll to the bottom of the messages container
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        setUsername(userId);
        socket.current = io('http://localhost:3005', {
            query: {
                userId: userId,
                roomId: roomId, // Pass the roomId to the socket creation
            },
        });
        appendMessage('You joined', true);
        socket.current.emit('patient-request', { user: userId, userId, roomId });
        console.log("hi")
        console.log(roomId)
        socket.current.on('user-connected', (data) => {
            console.log("it should")
            if (roomId === data.roomId) {
                appendMessage(`${data.name} connected`);
            }
        });

        socket.current.on('chat-message', (data) => {
            if (userId !== data.userId && roomId === data.roomId) {
                appendMessage(`${data.name}: ${data.message}`);
            }
        });
        socket.current.on('user-disconnected', (data) => {
            if (roomId === data.roomId) {
                appendMessage(`${data.name} disconnected`);
            }
        });

        // Save the userId and roomId to local storage
        localStorage.setItem('userId', userId);
        localStorage.setItem('roomId', roomId);

        return () => {
            socket.current.disconnect();
        };
    }, []); // Include userId and roomId in the dependency array

    const sendMessage = (e) => {
        e.preventDefault();
        const message = messageInput;
        appendMessage(`You: ${message}`, true);
        socket.current.emit('send-chat-message', { message, userId, roomId });
        setMessageInput('');
    };

    const appendMessage = (message, isYourMessage) => {
        setMessages((prevMessages) => [...prevMessages, { content: message, isYourMessage }]);
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            padding: '20px',

            width: '60%',
            margin: 'auto'
        },
        messageContainer: {
            flex: 1,
            overflowY: 'auto',
            marginBottom: '20px',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
        },
        yourMessage: {
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#bfe4c7',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            wordWrap: 'break-word',
        },
        otherMessage: {
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: 'lightblue',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            wordWrap: 'break-word',
        },
        sendContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        messageInput: {
            flex: 1,
            padding: '10px',
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        sendButton: {
            padding: '10px 20px',
            borderRadius: '5px',
            backgroundColor: '#007BFF', // Change this to your desired button color
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
        },
    };

    // Your component using the styles
    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div ref={messagesContainerRef} style={styles.messageContainer}>
                    {messages.map((message, index) => (
                        <div key={index} style={message.isYourMessage ? styles.yourMessage : styles.otherMessage}>
                            {message.content}
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