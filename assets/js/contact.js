/**
 * Contact Form JavaScript
 * Handles contact form submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Simple validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real implementation, you would send the form data to a server
    // For this demo, we'll just show a success message
    alert('Thank you for your message! This is a demo site, so no message was actually sent.');
    
    // Clear the form
    contactForm.reset();
} 
