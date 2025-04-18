import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appointment_date: '',
    time_slot: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Special dates to disable (format: MM-DD)
  const specialDates = ['12-25', '01-01'];  // Christmas and New Year
  const today = new Date();
  const holidays = specialDates.map((date) => {
    // Create a Date object for the holiday in the current year
    return new Date(`${today.getFullYear()}-${date}`);
  });

  // Generate time slots for working hours (9 AM to 7 PM) in 15-minute intervals
  const timeSlots = [];
  for (let hour = 9; hour <= 19; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      let hourString = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;
      timeSlots.push(hourString);
    }
  }

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null); 
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
        setError(result.message); 
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message); 
    }
    setLoading(false);
  };

  // Convert string to Date object to check weekends and holidays
  const isWeekendOrHoliday = (dateString) => {
    const date = new Date(dateString); // Convert string to Date
    const day = date.getDay();
    const formattedDate = `${date.getMonth() + 1}-${date.getDate()}`; // MM-DD format
    return (
      day === 0 || // Sunday
      day === 6 || // Saturday
      holidays.some((holiday) => holiday.toDateString() === date.toDateString()) || // Special holidays
      formattedDate === today.toLocaleDateString().slice(0, 5) // Disable today's date
    );
  };

  // Mouse move effect (subtle movement)
  const handleMouseMove = (e) => {
    const { clientX: mouseX, clientY: mouseY } = e;
    const elements = document.querySelectorAll('.move-effect');
    elements.forEach((element) => {
      const offsetX = (mouseX - window.innerWidth / 2) * 0.05;
      const offsetY = (mouseY - window.innerHeight / 2) * 0.05;
      element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Book Your Appointment</title>
        <meta name="description" content="Book your appointment easily" />
        <link rel="icon" href="/AppBooking.ico" />
      </Head>
      <main>
        <div className="container move-effect" id="appointment-container">
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
                min={today.toISOString().split("T")[0]}  // Disable past dates
                required
                disabled={isWeekendOrHoliday(formData.appointment_date)}
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
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
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
                setFormData({ name: '', email: '', appointment_date: '', time_slot: '' });
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
        body {
          background: linear-gradient(135deg, #2b2d42, #8d99ae);
          color: white;
          font-family: Arial, sans-serif;
        }

        .container {
          text-align: center;
          max-width: 600px;
          margin: 50px auto;
          padding: 30px;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 10px;
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
        }

        .form-group {
          margin-bottom: 15px;
        }

        input, select, button {
          padding: 10px;
          width: 100%;
          margin: 8px 0;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        button {
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal, .error-modal {
          margin-top: 20px;
          padding: 15px;
          text-align: center;
          border-radius: 5px;
        }

        .modal {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .error-modal {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .form-group label {
          font-weight: bold;
        }

        .form-group input,
        .form-group select {
          font-size: 16px;
        }

        /* Improved placeholder text color */
        input::placeholder, select::placeholder {
          color: #ffffff;  /* Light color for contrast */
          opacity: 0.7;     /* Slight transparency for the placeholder */
        }

        /* Mouse movement effect */
        .move-effect {
          transition: transform 0.2s ease-out;
        }

        /* Responsive styling */
        @media (max-width: 600px) {
          .container {
            width: 90%;
            padding: 15px;
          }
        }
      `}</style>
    </>
  );
}
