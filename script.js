// Wait for the DOM to load before applying animations and event handlers
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.slide-in');
  inputs.forEach((input, index) => {
    input.style.animationDelay = `${0.3 + index * 0.1}s`;
  });
});

// Set the backend endpoint to your deployed web app URL (no extra parameters)
const backendEndpoint = "https://script.google.com/macros/s/AKfycbx28_qruAfMTfnJMig7bJCLRiyP1FcdUcVTcH25fj1gWUMLg83XdN7yHYKiIdFoA-pD/exec";

// Get DOM elements
const form = document.getElementById('appointment-form');
const loader = document.getElementById('loader');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

// Form submission event handler
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Show loader while processing
  loader.classList.add('active');

  // Gather form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    appointment_date: document.getElementById('appointment-date').value,
    time_slot: document.getElementById('time-slot').value
  };

  // Send appointment data to the backend using fetch in default 'cors' mode
  fetch(backendEndpoint, {
    method: 'POST',
    // mode is omitted so default CORS mode is used
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => {
    // Attempt to parse response JSON
    return response.json();
  })
  .then(data => {
    console.log("Response:", data);
    loader.classList.remove('active');
    successModal.classList.add('active');
    form.reset();
  })
  .catch(error => {
    loader.classList.remove('active');
    console.error("Error:", error);
    alert("An error occurred, please try again.");
  });
});

// Close modal event handler
closeModalBtn.addEventListener('click', function() {
  successModal.classList.remove('active');
});

// Special Effect: Particle effect following the mouse pointer
document.addEventListener('mousemove', function(e) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  // Center the particle around the mouse pointer
  particle.style.left = (e.pageX - 5) + 'px';
  particle.style.top = (e.pageY - 5) + 'px';
  
  // Append particle element and remove it after 800ms when its CSS animation is done
  document.body.appendChild(particle);
  setTimeout(() => {
    particle.remove();
  }, 800);
});
