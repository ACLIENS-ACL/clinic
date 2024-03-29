import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const stripePromise = loadStripe('pk_test_51O88P5HzoCWXbTYqT8xDcGsLRVepjiG6k4KqILsc5mIxkTraEfRqAP9N6Vr3yRdQHDcuB8R4M5C754kjshcm1JtM0051zRZXTh');

const PaymentForm = ({ totalPaymentDue, type, packageId, self, selectedFamilyMembers }) => {
    const navigate = useNavigate();
    useEffect(() => {
        try {
            // Get the token from local storage
            const token = localStorage.getItem('token'); // Replace 'yourAuthTokenKey' with your actual key

            if (!token) {
                // If the token doesn't exist, navigate to the login page
                navigate('/login');
                return;
            }

            // Decode the token to get user information
            const decodedToken = jwtDecode(token);
            const userType = decodedToken.type.toLowerCase();

            if (userType !== 'patient') {
                // If the user is not a patient or is not logged in, navigate to the login page
                navigate('/login');
            }
        } catch (error) {

        }
    }, [navigate]);
    const handleWalletPayment = async () => {
        const token = localStorage.getItem('token');
        // You need to implement the server-side logic for handling wallet payments.
        // Make an Axios call to your server endpoint for wallet payments.
        try {
            const response = await axios.post('http://localhost:3001/wallet-payment', {
                totalPaymentDue
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            handleSubscribeClickToServer();
            alert("Successful");
            navigate('/patient')
            // Handle the server response, e.g., redirect to a success page
            console.log('Wallet payment successful:', response.data);
        } catch (error) {
            alert("insufficient Funds in Wallet")
            // Handle the error, e.g., show an error message
            console.error('Wallet payment error:', error);
        }
    };
    const handleSubscribeClickToServer = () => {
        const token = localStorage.getItem('token');
        const familyMembersArray = selectedFamilyMembers ? selectedFamilyMembers.split(',') : [];
        const data = {
            self: self,
            packageId: packageId,
            familyMembers: familyMembersArray,
        };

        // Make an HTTP POST request to the server
        axios.post('http://localhost:3001/subscribe', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                // Handle the server response, e.g., redirect to a success page
            })
            .catch((error) => {
                // Handle the error, e.g., show an error message
                console.error(error);
            });
    };
    const stripe = useStripe();
    const elements = useElements();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedPaymentMethod === 'creditCard') {
            if (!stripe || !elements) {
                return;
            }

            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                console.error('CardElement not found.');
                return;
            }

            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {

                console.error(error);
            } else {
                if (type == "packagePayment") {
                    handleSubscribeClickToServer();
                    alert("Successful");
                    navigate('/patient')
                }
                console.log('Payment successful');
            }
        } else if (selectedPaymentMethod === 'wallet') {
            // Handle wallet payment logic here
            console.log('Wallet payment selected');
            handleWalletPayment();

        }
    };

    // Add custom styles for CardElement layout
    const cardElementStyle = {
        base: {
            fontSize: '16px',
        },
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    };

    const boxStyle = {
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        cursor: 'pointer',
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle} className="payment-box">
                <h2>Payment Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="payment-method-selection">
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="wallet"
                                checked={selectedPaymentMethod === 'wallet'}
                                onChange={() => setSelectedPaymentMethod('wallet')}
                            />
                            Pay with Wallet
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="creditCard"
                                checked={selectedPaymentMethod === 'creditCard'}
                                onChange={() => setSelectedPaymentMethod('creditCard')}
                            />
                            Pay with Credit Card
                        </label>

                    </div>
                    {selectedPaymentMethod === 'creditCard' && (
                        <div className="card-element-container">
                            <div className="card-element">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                iconColor: '#c4f0ff',
                                                color: '#000', // Change text color
                                                fontWeight: 500,
                                                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                                                fontSize: '16px',
                                                fontSmoothing: 'antialiased',
                                                border: '1px solid black', // Add border

                                                ':-webkit-autofill': {
                                                    color: '#fce883',
                                                },
                                                '::placeholder': {
                                                    color: '#87BBFD',
                                                },
                                            },
                                            invalid: {
                                                iconColor: 'red',
                                                color: 'red',
                                            },
                                        },
                                    }}
                                />

                            </div>
                        </div>
                    )}
                    <button type="submit" style={buttonStyle}>
                        Pay {totalPaymentDue} EGP
                    </button>
                </form>
            </div>
        </div>
    );
};


const App = () => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    };
    const { totalPaymentDue, type, packageId, self, selectedFamilyMembers } = useParams();


    return (
        <div style={containerStyle} className="app-container">
            <Elements stripe={stripePromise}>
                <PaymentForm totalPaymentDue={totalPaymentDue} type={type} packageId={packageId} self={self} selectedFamilyMembers={selectedFamilyMembers} />
            </Elements>
        </div>
    );
};

export default App;
