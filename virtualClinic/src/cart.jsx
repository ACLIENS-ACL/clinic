import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
function CartView() {
    const [prescription, setPrescription] = useState(null);
    const [name, setName] = useState(null);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };
    const [itemErrors, setItemErrors] = useState({});
    const isAddressFilled = Object.values(address).every(val => val !== '');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const { prescriptionID } = useParams();
    useEffect(() => {
        if (token === null) {
            navigate('/login');
        } else {
            // Fetch prescription details using the prescriptionId
            axios.get(`http://localhost:3001/getPrescriptionDetails/${prescriptionID}`, { headers })
                .then(response => {
                    setPrescription(response.data);
                    // Calculate total price based on prescription details
                    const calculatedTotal = response.data.reduce((acc, item) => acc + item.price * item.quantity, 0);
                    setTotal(calculatedTotal);
                })
                .catch(error => console.error('Error fetching prescription details:', error));

            axios.get(`http://localhost:3001/patientName`, { headers })
                .then(response => {
                    setName(response.data);
                })
                .catch(error => console.error('Error fetching prescription details:', error));

            axios.post('http://localhost:3001/patientDiscount', { prescriptionID }, { headers })
                .then(response => {
                    setDiscount(response.data);
                })
                .catch(error => console.error('Error fetching prescription details:', error));
        }
    }, [token, navigate, prescriptionID]);

    const updateQuantity = (itemId, available, oldQuantity, newQuantity) => {
        if (newQuantity > available) {
            setItemErrors((prevErrors) => ({
                ...prevErrors,
                [itemId]: "There are no more available in stock!",
            }));
        } else {
            setItemErrors((prevErrors) => ({
                ...prevErrors,
                [itemId]: undefined,
            }));
            if (newQuantity <= 0) {
                // If quantity is zero or less, remove the item
                //const updatedPrescription = prescription.filter(item => item.name !== itemId);
                setPrescription(updatedPrescription);
            } else {
                // Update the quantity and calculate the total price
                const updatedPrescription = prescription.map(item => {
                    if (item.name === itemId) {
                        if (oldQuantity < newQuantity) {
                            setTotal(total + item.price);
                        }
                        else {
                            setTotal(total - item.price);
                        }
                        const updatedItem = { ...item, quantity: newQuantity };
                        updatedItem.totalPrice = updatedItem.price * newQuantity;
                        return updatedItem;
                    }
                    return item;
                });

                setPrescription(updatedPrescription);
            }
        }
    };

    const handleConfirmOrder = () => {
        // Navigate to the Payment component with the required data
        navigate('/payOrder', {
            state: {
                totalAmount: total - total * discount,
                address: `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`,
                medicines: prescription.map(item => ({ name: item.name, quantity: item.quantity, _id: item._id, price: item.price })),
                name: name,
                pres: prescriptionID
            },
        });
    };

    const styles = {
        totalTag: {
            // Styles for the total tag
            marginRight: '10px', // Add any other styles as needed

            fontSize: '18px', // Add font size in pixels or other units
        },
        totalValue: {
            // Styles for the total value
            fontSize: '18px', // Add font size in pixels or other units
            // Add any other styles as needed
        },
        container: {
            margin: 'auto',
            textAlign: 'center',
        },
        header: {
            fontSize: '30px', // Increased font size
            marginBottom: '20px',
        },
        cartItem: {
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '20px', // Increased padding for better spacing
            paddingBottom: '10px',
            marginBottom: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            fontSize: '18px', // Increased font size for items
        },
        quantityButtons: {
            display: 'flex',
            marginTop: '10px',
            alignItems: 'center',
            justifyContent: 'center',
        },
        quantityButton: {
            cursor: 'pointer',
            padding: '5px 5px', // Increased padding
            fontSize: '15px', // Increased font size
            borderRadius: '3px',
            border: '1px solid #007BFF',
            backgroundColor: '#007BFF',
            color: '#fff',
            marginRight: '2px'
        },
        removeButton: {
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        total: {
            marginTop: '20px',
            fontWeight: 'bold',
            fontSize: '20px', // Increased font size
        },
        confirmOrderButton: {
            marginTop: '20px',
            marginBottom: '30px',
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            // Use a conditional statement to vary styling based on the disabled state
            ...(isAddressFilled
                ? {} // If address is filled, use the default styles
                : {
                    backgroundColor: '#6c757d', // Change background color when disabled
                    cursor: 'not-allowed', // Change cursor when disabled
                }),
        },
        logoutButton: {
            position: 'absolute',
            top: '20px',
            right: '20px',
        },
        addressForm: {
            margin: 'auto',
            textAlign: 'center',
            border: '2px solid #ddd',
            borderRadius: '5px',
            padding: '33px',
            height: '99%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',

        },
        deliveryAddressIndicator: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#28a745',
            marginBottom: '10px',
        },
        addressRow: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '15px',
        },
        addressInput: {
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            marginBottom: '15px',
            marginLeft: '15px'
        },
        label: {
            marginLeft: '10px', // Add margin-left to labels
        },
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <br></br>
            <h1 style={styles.header}>Shopping Cart</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="cart-items" style={{ width: '40%', marginLeft: '12%' }}>
                    {prescription && prescription.map((item) => (
                        <div key={item.name} style={styles.cartItem}>

                            <img
                                src={`http://localhost:3002/uploads/${encodeURIComponent(item.fileName)}`}
                                alt={item.name}
                                style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px 0' }}
                            />
                            <div>{item.name}</div>
                            <div>Price: ${item.price}</div>
                            <div>
                                Quantity: {item.quantity}
                                <div style={styles.quantityButtons}>

                                    <FontAwesomeIcon icon={faPlus} onClick={() => updateQuantity(item.name, item.available, item.quantity, item.quantity + 1)}
                                        style={{ ...styles.quantityButton, marginRight: '5px' }}
                                    />

                                    <FontAwesomeIcon icon={faMinus} style={{
                                        ...styles.quantityButton,
                                        marginLeft: '5px',
                                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                        backgroundColor: item.quantity <= 1 ? '#ccc' : 'rgb(0, 123, 255)',
                                    }}
                                        onClick={() => updateQuantity(item.name, item.available, item.quantity, item.quantity - 1)}
                                        disabled={item.quantity <= 1} />

                                </div>
                                {itemErrors[item.name] && (
                                    <div style={{ color: 'red', marginTop: '2px', fontSize: '12px' }}>
                                        {itemErrors[item.name]}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ width: '35%', marginRight: '12%', height: '100%' }}>
                    <div style={styles.addressForm} >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={styles.totalTag}><strong>Total:</strong></p>
                            <p style={styles.totalValue}>${total}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={styles.totalTag}><strong>Total After Discount </strong><small>(If applicable)</small><strong> :</strong></p>
                            <p style={styles.totalValue}>${total - total * discount}</p>
                        </div>
                        <br></br>
                        <p style={styles.deliveryAddressIndicator}>Please fill your Delivery Address:</p>
                        <br></br>
                        <div style={styles.addressRow}>
                            <label style={styles.label}>Street:
                                <input
                                    type="text"
                                    name="street"
                                    value={address.street}
                                    onChange={handleAddressChange}
                                    style={styles.addressInput}
                                />
                            </label>

                            <label style={styles.label}>City:
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                    style={styles.addressInput}
                                />
                            </label>
                        </div>

                        <div style={styles.addressRow}>
                            <label style={styles.label}>State:
                                <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={handleAddressChange}
                                    style={styles.addressInput}
                                />
                            </label>

                            <label style={styles.label}>Zip Code:
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={address.zipCode}
                                    onChange={handleAddressChange}
                                    style={styles.addressInput}
                                />
                            </label>
                        </div>


                        <button
                            style={styles.confirmOrderButton}
                            onClick={handleConfirmOrder}
                            disabled={!isAddressFilled}
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartView;
