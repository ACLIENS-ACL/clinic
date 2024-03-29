// Prescription.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import axios from 'axios';

const Prescription = () => {
    const { appointmentId } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [prescription, setPrescription] = useState([]);
    const [message, setMessage] = useState('');
    const [dosage, setDosage] = useState('');
    const [medicineName, setMedicineName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // If the token doesn't exist, navigate to the login page
            navigate('/login');
            return;
        }
        // Fetch medicines from the backend
        axios.get('http://localhost:3002/medicines', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => setMedicines(response.data))
            .catch(error => console.error('Error fetching medicines:', error));
        preDefined();

    }, []);
    const preDefined = async () => {

        await axios.get(`http://localhost:3001/getPrescription?appointmentId=${appointmentId}`)
            .then(response => {
                const prescriptionFromServer = response.data; // Assuming the response is an array of medicines
                if (prescriptionFromServer === "filled") {
                    alert("Prescription Submitted to Pharmacy can't be modified");
                    navigate("/myDAppointments");
                }
                // Map each item in the response to the format you need
                const mappedPrescription = prescriptionFromServer.map(item => ({
                    name: item.name,
                    dosage: {
                        timesDaily: item.dose.daily,
                        numberOfDays: item.dose.days,
                    },
                }));

                // Now you can add the mapped prescription to your existing prescription list
                setPrescription([...prescription, ...mappedPrescription]);
            })
            .catch(error => {
                // Handle errors
                console.error('Error getting prescription:', error);
            });
    }
    const addMedicine = (medicineName) => {
        // Check if the medicine is already in the prescription
        if (prescription.some(item => item.name === medicineName)) {
            alert('This medicine is already in the prescription.');
            return;
        }

        const selectedMedicine = medicines.find(medicine => medicine.name === medicineName);
        setPrescription([...prescription, { ...selectedMedicine, dosage: { timesDaily: 1, numberOfDays: 1 }, pharmacy: true }]);
    };

    const addNoPharmMedicine = (medicineName) => {
        if (prescription.some(item => item.name === medicineName)) {
            alert('This medicine is already in the prescription.');
            return;
        }
        setPrescription([...prescription, { name: medicineName, dosage: { timesDaily: 1, numberOfDays: 1 }, pharmacy: false }]);
    };

    const updateDosage = (index, field, value) => {
        const updatedPrescription = [...prescription];
        updatedPrescription[index].dosage[field] = Math.max(1, Number(value));
        setPrescription(updatedPrescription);
    };


    const removeMedicine = (index) => {
        const updatedPrescription = [...prescription];
        updatedPrescription.splice(index, 1);
        setPrescription(updatedPrescription);
    };

    const addPrescription = async () => {
        // Check if at least one medicine is added
        if (prescription.length === 0) {
            alert('Please add at least one medicine before adding the prescription.');
            return;
        }

        // Check if dosage fields are filled for each medicine
        if (prescription.some(item => item.dosage.timesDaily <= 0 || item.dosage.numberOfDays <= 0)) {
            alert('Please fill in valid dosage values for each medicine.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/add-prescription', { prescription, appointmentId });
            console.log('Prescription added/updated successfully.');
            setMessage('Prescription added/updated successfully!');

        } catch (error) {
            console.error('Error adding/updating prescription:', error);
            setMessage('Error adding/updating prescription. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <br></br>
                <h2 style={styles.heading}>Prescription</h2>
                <div>
                    <h3 style={styles.subHeading}>Medicines</h3>
                    <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                    <ul style={styles.list}>
                        {medicines.map(medicine => (
                            <li key={medicine._id} style={styles.listItem}>
                                <strong>{medicine.name}</strong><br />
                                Active Ingredients: {medicine.activeIngredients.join(', ')}<br />
                                Medicinal Use: {medicine.medicinalUse}<br />
                                Description: {medicine.description}<br />
                                <img src={`http://localhost:3002/uploads/${encodeURIComponent(medicine.imageUrl.fileName)}`} alt={medicine.name} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px 0' }} />
                                <button style={styles.addButton} onClick={() => addMedicine(medicine.name)}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = 'green')}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}>Add</button>
                                <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 style={{ fontSize: '18px' }}>Add a Medicine Not Available in Pharmacy</h5>
                    <form style={{ marginTop: '10px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <label htmlFor="medicineName" style={{ marginRight: '10px', paddingTop: '5px' }}>Medicine Name:</label>
                            <input
                                type="text"
                                id="medicineName"
                                name="medicineName"
                                value={medicineName}
                                onChange={(e) => setMedicineName(e.target.value)}
                                style={{ marginRight: '10px', padding: '5px', width: '250px' }}
                            />

                            <button
                                type="button"
                                onClick={() => addNoPharmMedicine(medicineName)}
                                style={styles.addButton}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = 'green')}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}
                            >
                                Add Medicine
                            </button>
                        </div>
                    </form>
                </div>
                <div style={{ display: prescription.length === 0 ? 'none' : 'block' }}>
                    <h3 style={styles.subHeading}>Prescription</h3>
                    <ul style={styles.list}>
                        {prescription.map((item, index) => (
                            <li key={index} style={styles.listItem}>
                                <strong>{item.name}</strong> - Dosage:
                                <input
                                    type="number"
                                    value={item.dosage.timesDaily || ''}
                                    onChange={(e) => updateDosage(index, 'timesDaily', e.target.value)}
                                    style={styles.dosageInput}
                                />
                                times daily for
                                <input
                                    type="number"
                                    value={item.dosage.numberOfDays || ''}
                                    onChange={(e) => updateDosage(index, 'numberOfDays', e.target.value)}
                                    style={styles.dosageInput}
                                />
                                days
                                <button style={styles.removeButton} onClick={() => removeMedicine(index)}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = 'crimson')}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}
                                >Remove</button>
                            </li>
                        ))}
                    </ul>
                    <div style={{ fontWeight: 'bold', color: 'black', fontStyle: 'italic' }}>
                        {message && <p>{message}</p>}
                    </div>
                    <button style={styles.generateButton} onClick={addPrescription}>Add Prescription</button>
                </div>

            </div >
        </div>
    );


};

const styles = {
    container: {
        maxWidth: '600px',
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '24px',
        textAlign: 'center',
        marginBottom: '20px',
    },
    subHeading: {
        fontSize: '18px',
        marginBottom: '10px',
    },
    list: {
        listStyle: 'none',
        padding: '0',
    },
    listItem: {
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        padding: '8px',
        transition: 'background-color 0.3s',
    },
    addButton: {
        backgroundColor: 'gray',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        borderRadius: '4px'
    },
    dosageInput: {
        marginLeft: '8px',
        padding: '4px',
        width: '50px',
        textAlign: 'center',
    },
    removeButton: {
        backgroundColor: 'gray',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        borderRadius: '4px'
    },
    generateButton: {
        backgroundColor: 'navy',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        padding: '10px',
        width: '40%',
        cursor: 'pointer',
        marginLeft: '30%',
        transition: 'background-color 0.3s',
    },
};


export default Prescription;