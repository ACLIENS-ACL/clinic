// Prescription.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

const Prescription = () => {
    const { appointmentId } = useParams();
    const [medicines, setMedicines] = useState([]);
    const [prescription, setPrescription] = useState([]);
    const [dosage, setDosage] = useState('');
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
        setPrescription([...prescription, { ...selectedMedicine, dosage: { timesDaily: 1, numberOfDays: 1 } }]);
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

    const addPrescription = () => {
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
        // Send prescription data to the backend to add prescription
        axios.post('http://localhost:3001/add-prescription', { prescription, appointmentId: appointmentId });
    };

    return (
        <div style={styles.container}>
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
                            <button style={styles.addButton} onClick={() => addMedicine(medicine.name)}>Add</button>
                            <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                        </li>
                    ))}
                </ul>
            </div>
            <div>
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
                            <button style={styles.removeButton} onClick={() => removeMedicine(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <button style={styles.generateButton} onClick={addPrescription}>Add Prescription</button>
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
    },
    addButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        cursor: 'pointer',
    },
    dosageInput: {
        marginLeft: '8px',
        padding: '4px',
        width: '50px',
        textAlign: 'center',
    },
    removeButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        cursor: 'pointer',
    },
    generateButton: {
        backgroundColor: '#2196f3',
        color: '#fff',
        border: 'none',
        padding: '10px',
        width: '100%',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default Prescription;
