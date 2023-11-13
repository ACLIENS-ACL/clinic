import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51O88P5HzoCWXbTYqT8xDcGsLRVepjiG6k4KqILsc5mIxkTraEfRqAP9N6Vr3yRdQHDcuB8R4M5C754kjshcm1JtM0051zRZXTh');

const PaymentForm = ({ totalPaymentDue, type, doctorId, dateTime, familyMemberId }) => {
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch admin data from the server
        axios.get(`http://localhost:3001/get-user-type`).then((response) => {
            const responseData = response.data;
            if (responseData.type !== 'patient' || responseData.in !== true) {
                navigate('/login');
                return null;
            }
        });
    }, []);
    const handleWalletPayment = async () => {
        // You need to implement the server-side logic for handling wallet payments.
        // Make an Axios call to your server endpoint for wallet payments.
        try {
            const response = await axios.post('http://localhost:3001/wallet-payment', {
                totalPaymentDue
            });
            reserveSlot();
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
    const reserveSlot = async () => {
        // Prevent the default behavior of the click event

        try {
            if (type === "self") {
                // Make a POST request to your server
                const response = await axios.post('http://localhost:3001/reserve', {
                    doctorId,
                    dateTime,
                    totalPaymentDue
                });
            }
            else if (type === "familyMember") {
                // Make a reservation for the selected family member
                const response = await axios.post('http://localhost:3001/reserve-family-member', {
                    doctorId,
                    dateTime,
                    familyMemberId,
                    totalPaymentDue
                });
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while reserving the appointment');
        }
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
                reserveSlot();
                alert("Successful");
                navigate('/patient')


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
    const { totalPaymentDue, type, doctorId, dateTime, familyMemberId } = useParams();


    return (
        <div style={containerStyle} className="app-container">
            <Elements stripe={stripePromise}>
                <PaymentForm totalPaymentDue={totalPaymentDue} type={type} doctorId={doctorId} dateTime={dateTime} familyMemberId={familyMemberId} />
            </Elements>
        </div>
    );
};

export default App;
