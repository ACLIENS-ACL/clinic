import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import Navbar from './navbar';
const socket = io('http://localhost:3004');

function App() {
    const videoRef = useRef();
    const remoteVideoRef = useRef();
    const [peerId, setPeerId] = useState(null);
    const peer = new Peer(); // Instantiate the Peer object

    useEffect(() => {
        // Listen for the 'open' event to get the PeerJS ID
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setPeerId(id);
            alert(id); // Set the PeerJS ID in the component state
        });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;

                // Listen for incoming connection requests
                peer.on('connection', (connection) => {
                    connection.on('open', () => {
                        // Send a greeting to the other user
                        connection.send('Hello from user A!');
                    });

                    // Display the remote user's greeting
                    connection.on('data', (data) => {
                        console.log('Received data:', data);
                    });
                });

                // Listen for incoming call requests
                peer.on('call', (call) => {
                    // Answer the call with the user's media stream
                    call.answer(stream);
                    call.on('stream', (remoteStream) => {
                        // Display the remote stream in the remote video element
                        remoteVideoRef.current.srcObject = remoteStream;
                    });
                });

                // Emit user's signal to the server
                peer.on('signal', (data) => {
                    socket.emit('signal', JSON.stringify(data));
                });

                socket.on('signal', (signal) => {
                    // Handle incoming signals from the other user
                    peer.signal(signal);
                });
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });

        return () => {
            // Clean up resources when the component unmounts
            peer.destroy();
        };
    }, []);

    // Function to initiate a call
    const initiateCall = () => {
        const remoteUserId = prompt('Enter the ID of the remote user:');
        const call = peer.call(remoteUserId, videoRef.current.srcObject);
        call.on('stream', (remoteStream) => {
            // Display the remote stream in the remote video element
            remoteVideoRef.current.srcObject = remoteStream;
        });
    };

    return (
        <div>
            <Navbar />
            <div className="app-container" style={styles.appContainer}>
                <h1 style={styles.heading}>Video Call App</h1>
                <p style={styles.peerId}>Your PeerJS ID: {peerId}</p>
                <div className="video-container" style={styles.videoContainer}>
                    <video ref={videoRef} autoPlay muted playsInline style={styles.localVideo}></video>
                    <video ref={remoteVideoRef} autoPlay playsInline style={styles.remoteVideo}></video>
                </div>
                <button onClick={initiateCall} style={styles.callButton}>
                    Initiate Call
                </button>
            </div>
        </div>
    );

}
const styles = {
    appContainer: {
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px',
    },
    heading: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
    },
    peerId: {
        fontSize: '16px',
        color: '#666',
    },
    videoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',

    },
    localVideo: {
        width: '500px', // Adjust width to make it bigger
        height: '400px', // Adjust height to make it bigger
        borderRadius: '8px',
        marginRight: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    remoteVideo: {
        width: '500px', // Adjust width to make it bigger
        height: '400px', // Adjust height to make it bigger
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },

    callButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default App;