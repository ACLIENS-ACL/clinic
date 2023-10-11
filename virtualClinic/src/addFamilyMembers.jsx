import React, { Component } from 'react';
import axios from 'axios';

const styles = {
  form: {
    maxWidth: '300px',
    margin: '0 auto',
  },
  input: {
    width: '100%',
    marginBottom: '10px',
  },
};

const relations = ["Mother", "Father", "Sibling", "Spouse", "Child", "Other"];

class AddFamilyMemberForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nationalID: '',
      age: '',
      gender: 'female',
      relation: '',
      message: '',
      error: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, nationalID, age, gender, relation } = this.state;
    
    if (name === '' || nationalID === '' || age === '' || relation === '') {
      this.setState({ error: 'Please fill in all required fields.', message: '' });
      return;
    }

    if (parseInt(age) < 0) {
      this.setState({ error: 'Age cannot be negative.', message: '' });
      return;
    }

    try {
      const response = await axios.put('http://localhost:3001/update-family-member', { name, nationalID, age, gender, relation });
      if (response.status === 200) {
        this.setState({
          message: response.data.message,
          error: '',
          name: '',
          nationalID: '',
          age: '',
          gender: 'female',
          relation: '',
        });
      }
    } catch (error) {
      this.setState({ error: 'An error occurred while updating family members.', message: '' });
    }
  }

  render() {
    return (
      <div>
        <h1>Add Family Member</h1>
        <form style={styles.form} onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="nationalID"
            placeholder="National ID"
            value={this.state.nationalID}
            onChange={this.handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={this.state.age}
            onChange={this.handleInputChange}
            style={styles.input}
            required
            min="0"
          />
          <select
            name="gender"
            value={this.state.gender}
            onChange={this.handleInputChange}
            style={styles.input}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
          <select
            name="relation"
            value={this.state.relation}
            onChange={this.handleInputChange}
            style={styles.input}
            required
          >
            <option value="" disabled>Select Relation</option>
            {relations.map((rel, index) => (
              <option key={index} value={rel}>{rel}</option>
            ))}
          </select>
          <button type="submit">Add Family Member</button>
        </form>
        {this.state.message && <p>{this.state.message}</p>}
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default AddFamilyMemberForm;
