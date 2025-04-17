import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appointmentDate: '',
    timeSlot: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${result.message}`);
        console.error('Failed to add appointment', result);
      } else {
        setMessage(result.message);
        setFormData({
          name: '',
          email: '',
          appointmentDate: '',
          timeSlot: '',
        });
      }
    } catch (error) {
      console.error('API request error:', error);
      setMessage('An error occurred while processing your request.');
    }
  };

  return (
    <div className="container">
      <h1>Book Appointment</h1>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Appointment Date</label>
          <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Time Slot</label>
          <input type="time" name="timeSlot" value={formData.timeSlot} onChange={handleChange} required />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}
