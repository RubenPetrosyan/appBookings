import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appointment_date: '',
    time_slot: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null); // Add error state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null); // Clear previous error
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
        setFormData({ name: '', email: '', appointment_date: '', time_slot: '' });
      } else {
        setError(result.message); // Set error message to state
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message); // Set the error message
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
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                {/* Add more time options here */}
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
          {success && (
            <div id="successModal" className="modal">
              <p>Thank you! Your appointment has been booked.</p>
              <button onClick={() => {
                setSuccess(false);
                setFormData({ name: '', email: '', appointment_date: '', time_slot: '' }); // Clear form when closing success modal
              }}>
                Close
              </button>
            </div>
          )}
          {error && (
            <div className="error-modal">
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        .error-modal {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          text-align: center;
          border-radius: 5px;
          animation: fadeIn 0.3s ease-out;
        }

        .modal {
          margin-top: 20px;
          padding: 15px;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          text-align: center;
          border-radius: 5px;
          animation: fadeIn 0.3s ease-out;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
