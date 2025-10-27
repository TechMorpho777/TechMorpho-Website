// ═══════════════════════════════════════════════════════════════
//  CONTACT FORM HANDLER - EMAILJS (JavaScript Only)
//  TechMorpho IT Solutions
// ═══════════════════════════════════════════════════════════════

// ⚙️ EMAILJS CONFIGURATION
// Get these from: https://dashboard.emailjs.com
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',      // ⬅️ Step 3: Add your Public Key
    serviceID: 'YOUR_SERVICE_ID',      // ⬅️ Step 4: Add your Service ID  
    templateID: 'YOUR_TEMPLATE_ID'     // ⬅️ Step 5: Add your Template ID
};

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                showMessage('error', 'Email service not loaded. Please refresh the page and try again.');
                return;
            }
            
            // Get the submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '⏳ Sending...';
            
            // Send email using EmailJS
            emailjs.sendForm(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                contactForm
            )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showMessage('success', '✅ Thank you! Your message has been sent successfully. We will contact you soon!');
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                showMessage('error', '❌ Sorry, there was an error sending your message. Please try again or contact us directly via WhatsApp.');
            })
            .finally(function() {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
});

// Function to show success/error messages
function showMessage(type, message) {
    // Remove any existing messages
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.innerHTML = `
        <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="message-text">${message}</span>
    `;
    
    // Insert message before form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 500);
    }, 8000);
}

