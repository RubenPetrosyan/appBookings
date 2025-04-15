// Wait for the DOM to load before applying animations and event handlers
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.slide-in');
  inputs.forEach((input, index) => {
    input.style.animationDelay = `${0.3 + index * 0.1}s`;
  });
});

// Set your backend endpoint to the provided Google Apps Script URL
const backendEndpoint = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhQ5rOil2KTzrMYHN6UGyL0RO61gbUdw9XHntcHLAy_Awd6fw_z2EDSXWQqIaW0s9AkOo07zEMzDp2J8aIMnos4QAf3qwkPhsDco-IVpcrgW28uKGYTUEZOkJwKtqWEZnW-M0Qr8RZORs8uiPCQtW4jOXYkrQNf801YLV0Rnp_VqNqjsLOvwmhNI6r_ZSJR9aStkpbIjJ7PC_2Dx51y586Vw8avjiKyQgImDhpGpVm2asYPCQOWC7-nuFvBc5tCcODRpCZekrW6EFeLkIsOnoxR5KDHMQ&lib=MkcaSUY_jdmyfyWY1SQgSYPDp8aFBtR4M";

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

  // Send appointment data to the backend using fetch with no-cors mode
  fetch(backendEndpoint, {
    method: 'POST',
    mode: 'no-cors', // Note: This makes the response opaque (you won't be able to read its content)
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => {
    // In no-cors mode, the response is opaque, so we assume submission worked
    console.log("Appointment submitted (opaque response).");
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

// Special Effect: Particle effect on mouse move
document.addEventListener('mousemove', function(e) {
  // Create a particle element
  const particle = document.createElement('div');
  particle.classList.add('particle');
  // Center the particle around the cursor
  particle.style.left = (e.pageX - 5) + 'px';
  particle.style.top = (e.pageY - 5) + 'px';
  
  // Append particle to the document body
  document.body.appendChild(particle);
  
  // Remove particle after the animation completes (800ms)
  setTimeout(() => {
    particle.remove();
  }, 800);
});
