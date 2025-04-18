import { useState } from 'react';
import styles from './styles.module.css';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name,
      email,
      appointmentDate,
      timeSlot,
    };

    try {
      console.log('Form Data:', formData);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatusMessage('Appointment successfully booked!');
        setName('');
        setEmail('');
        setAppointmentDate('');
        setTimeSlot('');
      } else {
        setStatusMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error during API request:', error);
      setStatusMessage('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Book Your Appointment</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="appointmentDate">Appointment Date</label>
          <input 
            type="date" 
            id="appointmentDate" 
            name="appointmentDate" 
            value={appointmentDate} 
            onChange={(e) => setAppointmentDate(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="timeSlot">Time Slot</label>
          <select 
            id="timeSlot" 
            name="timeSlot" 
            value={timeSlot} 
            onChange={(e) => setTimeSlot(e.target.value)} 
            required 
            className={styles.input}
          >
            <option value="">Select Time Slot</option>
            <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
            <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>Book Appointment</button>
      </form>

      {statusMessage && (
        <div className={styles.statusMessage}>
          <p>{statusMessage}</p>
        </div>
      )}
    </div>
  );
}
