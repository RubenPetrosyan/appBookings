// pages/index.js
import Head from 'next/head'
import { useState } from 'react';

export default function Home() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appointment_date: '',
    time_slot: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      console.log(result);
      if (result.status === 'success') {
        setSuccess(true);
        // Reset the form data after successful submission
        setFormData({ name: '', email: '', appointment_date: '', time_slot: '' });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Book Your Appointment</title>
        <meta name="description" content="Book your appointment easily" />
        <link rel="icon" href="/AppBooking.ico" />
      </Head>
      <main>
        <div className="container" id="appointment-container">
          <h1>Book Your Appointment</h1>
          <form id="appointment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                className="slide-in"
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                className="slide-in"
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="appointment_date">Appointment Date</label>
              <input
                className="slide-in"
                type="date"
                id="appointment_date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time_slot">Time Slot</label>
              <select
                className="slide-in"
  id="time_slot"
  name="time_slot"
  value={formData.time_slot}
  onChange={handleChange}
  required
>
  <option value="">Select a time...</option>
  <option value="09:00">09:00 AM</option>
  <option value="10:00">10:00 AM</option>
  <option value="11:00">11:00 AM</option>
  <option value="12:00">12:00 PM</option>
  <option value="13:00">01:00 PM</option>
  <option value="14:00">02:00 PM</option>
  <option value="15:00">03:00 PM</option>
  <option value="16:00">04:00 PM</option>
  <option value="17:00">05:00 PM</option>
  <option value="18:00">06:00 PM</option>
  <option value="19:00">07:00 PM</option>
  <option value="20:00">08:00 PM</option>
</select>
            </div>
            <button type="submit">
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
          {success && (
            <div id="successModal" className="modal">
              <p>Thank you! Your appointment has been booked.</p>
              <button onClick={() => setSuccess(false)}>Close</button>
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        /* Container styling */
        .container {
          max-width: 420px;
          margin: 40px auto;
          padding: 30px;
          background: #fff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
        }
        h1 {
          text-align: center;
          margin-bottom: 25px;
          color: #2575fc;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          color: #555;
        }
        input,
        select {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #2575fc;
          border: none;
          color: #fff;
          font-size: 18px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }
        button:hover {
          background: #1a5bb8;
          transform: translateY(-2px);
        }
        .modal {
          margin-top: 20px;
          padding: 20px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          text-align: center;
        }
      `}</style>
    </>
  );
}
