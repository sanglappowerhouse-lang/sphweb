/* ============================================
   DRONACHARYA SECTION - JAVASCRIPT
   Form handling, interactions, and animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initDronacharya();
});

function initDronacharya() {
    // Initialize all Dronacharya section features
    setupBookingForm();
    setupPhotoInteractions();
    setupChampionCardAnimations();
    setupScrollAnimations();
    setupFormValidation();
    setupSuccessMessage();
}

/* ============================================
   BOOKING FORM HANDLING
   ============================================ */

const PRICING_MATRIX = {
    "Employee": {
        "Quarterly": 10000,
        "Half-Yearly": 15000,
        "Annually": 25000
    },
    "Student": {
        "Quarterly": 6000,
        "Half-Yearly": 10000,
        "Annually": 18000
    },
    "International Athlete": {
        "Quarterly": null,
        "Half-Yearly": 25000,
        "Annually": 35000
    }
};

function setupBookingForm() {
    const form = document.getElementById('dronacharya-booking-form');
    
    if (!form) return;

    // Interactive Price Calculator logic
    const membershipRadios = form.querySelectorAll('input[name="membership_type"]');
    const planRadios = form.querySelectorAll('input[name="plan_type"]');
    const quarterlyRadio = form.querySelector('input[name="plan_type"][value="Quarterly"]');
    const quarterlyCard = document.getElementById('plan-quarterly-card');
    const priceDisplay = document.getElementById('calculated-price');

    function calculatePrice() {
        let selectedMembership = "Employee";
        let selectedPlan = "Quarterly";

        // Find selected membership
        membershipRadios.forEach(radio => {
            if (radio.checked) {
                selectedMembership = radio.value;
            }
        });

        // Toggle Quarterly option based on membership type
        if (selectedMembership === "International Athlete") {
            if (quarterlyRadio) quarterlyRadio.disabled = true;
            if (quarterlyCard) quarterlyCard.classList.add('disabled');
            
            // If Quarterly was checked, switch to Half-Yearly
            if (quarterlyRadio && quarterlyRadio.checked) {
                const halfYearlyRadio = form.querySelector('input[name="plan_type"][value="Half-Yearly"]');
                if (halfYearlyRadio) {
                    halfYearlyRadio.checked = true;
                }
            }
        } else {
            if (quarterlyRadio) quarterlyRadio.disabled = false;
            if (quarterlyCard) quarterlyCard.classList.remove('disabled');
        }

        // Find selected plan
        planRadios.forEach(radio => {
            if (radio.checked) {
                selectedPlan = radio.value;
            }
        });

        const price = PRICING_MATRIX[selectedMembership][selectedPlan];
        
        if (priceDisplay) {
            if (price !== null && price !== undefined) {
                priceDisplay.textContent = `₹${price.toLocaleString('en-IN')}`;
            } else {
                priceDisplay.textContent = "N/A";
            }
        }
    }

    // Attach event listeners to all radios
    membershipRadios.forEach(radio => {
        radio.addEventListener('change', calculatePrice);
    });
    planRadios.forEach(radio => {
        radio.addEventListener('change', calculatePrice);
    });

    // Run once initially to set values
    calculatePrice();

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('dbf-name').value.trim();
        const phone = document.getElementById('dbf-phone').value.trim();
        const goals = document.getElementById('dbf-goals').value.trim();

        let selectedMembership = "";
        membershipRadios.forEach(radio => {
            if (radio.checked) selectedMembership = radio.value;
        });

        let selectedPlan = "";
        planRadios.forEach(radio => {
            if (radio.checked) selectedPlan = radio.value;
        });

        // Validate form
        if (!validateBookingForm(name, phone)) {
            return;
        }

        const price = PRICING_MATRIX[selectedMembership][selectedPlan];
        const formattedPrice = price ? `₹${price.toLocaleString('en-IN')}` : "N/A";

        // Construct the WhatsApp message
        let whatsappText = `Hello Dronacharya Fitness Camp, I would like to book a session. Here are my details:\n`;
        whatsappText += `- Name: ${name}\n`;
        whatsappText += `- Phone: ${phone}\n`;
        whatsappText += `- Membership Type: ${selectedMembership}\n`;
        whatsappText += `- Plan Type: ${selectedPlan}\n`;
        whatsappText += `- Calculated Price: ${formattedPrice}\n`;
        whatsappText += `- Fitness Goals: ${goals || "None specified"}`;

        const whatsappUrl = `https://wa.me/916290941903?text=${encodeURIComponent(whatsappText)}`;

        // Open WhatsApp directly
        window.open(whatsappUrl, '_blank');

        // Reset the form and recalculate
        form.reset();
        calculatePrice();
    });
}

function validateBookingForm(name, phone) {
    // Name validation
    if (!name || name.trim().length < 2) {
        showErrorMessage('Please enter a valid name');
        return false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
        showErrorMessage('Please enter a valid 10-digit phone number');
        return false;
    }

    return true;
}

function processBookingRequest(data) {
    // In production, this would send data to your backend
    console.log('Booking Request Submitted:', data);

    // Here you could:
    // 1. Send email notification
    // 2. Save to database
    // 3. Send WhatsApp notification to admin
    // 4. Create calendar invite

    // For now, we'll create a local success action
    return {
        success: true,
        bookingId: generateBookingId(),
        message: `Booking request received! We'll contact you shortly at ${data.phone}`
    };
}

function generateBookingId() {
    return 'DRONA-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/* ============================================
   SUCCESS MESSAGE HANDLING
   ============================================ */

function showBookingSuccess(form) {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h4>Booking Request Submitted!</h4>
            <p>Our team will contact you shortly to confirm your training sessions.</p>
            <small>We will contact you on the phone number provided.</small>
        </div>
    `;

    // Insert after form
    form.parentNode.insertBefore(successDiv, form.nextSibling);

    // Add animation
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            successDiv.remove();
        }, 500);
    }, 5000);
}

function setupSuccessMessage() {
    // Add CSS for success message if not exists
    if (!document.getElementById('dronacharya-success-styles')) {
        const style = document.createElement('style');
        style.id = 'dronacharya-success-styles';
        style.textContent = `
            .booking-success-message {
                margin-top: 1.5rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(37, 211, 102, 0.1), rgba(34, 177, 76, 0.1));
                border: 2px solid rgba(37, 211, 102, 0.4);
                border-radius: 12px;
                text-align: center;
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
                transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            }

            .booking-success-message.show {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .success-content i {
                font-size: 2.5rem;
                color: #25D366;
                display: block;
                margin-bottom: 0.5rem;
                animation: scaleInCheck 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .success-content h4 {
                color: #25D366;
                font-size: 1.3rem;
                margin-bottom: 0.5rem;
            }

            .success-content p {
                color: #e0e0e0;
                font-size: 0.95rem;
                margin-bottom: 0.5rem;
            }

            .success-content small {
                color: #b0b0b0;
                font-size: 0.85rem;
            }

            @keyframes scaleInCheck {
                0% {
                    opacity: 0;
                    transform: scale(0);
                }
                50% {
                    transform: scale(1.15);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   ERROR MESSAGE HANDLING
   ============================================ */

function showErrorMessage(message) {
    // Create error toast
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(errorDiv);

    // Add animation
    setTimeout(() => {
        errorDiv.classList.add('show');
    }, 10);

    // Auto-remove
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => {
            errorDiv.remove();
        }, 500);
    }, 3500);

    // Add error styles if needed
    if (!document.getElementById('dronacharya-error-styles')) {
        const style = document.createElement('style');
        style.id = 'dronacharya-error-styles';
        style.textContent = `
            .error-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, rgba(220, 20, 60, 0.95), rgba(255, 107, 53, 0.95));
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(220, 20, 60, 0.3);
                display: flex;
                align-items: center;
                gap: 0.7rem;
                font-weight: 500;
                z-index: 9999;
                opacity: 0;
                transform: translateX(400px);
                transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }

            .error-toast.show {
                opacity: 1;
                transform: translateX(0);
            }

            .error-toast i {
                font-size: 1.3rem;
                animation: shake 0.5s;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @media (max-width: 768px) {
                .error-toast {
                    left: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   FORM VALIDATION
   ============================================ */

function setupFormValidation() {
    const form = document.getElementById('dronacharya-booking-form');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input');

    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Remove error state on focus
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });

        // Real-time email validation
        if (input.type === 'email') {
            input.addEventListener('change', function() {
                validateEmail(this);
            });
        }

        // Real-time phone validation
        if (input.type === 'tel') {
            input.addEventListener('input', function() {
                formatPhoneNumber(this);
            });
        }
    });

    // Add validation styles
    if (!document.getElementById('dronacharya-validation-styles')) {
        const style = document.createElement('style');
        style.id = 'dronacharya-validation-styles';
        style.textContent = `
            .form-input.error {
                border-color: #DC143C;
                background: rgba(220, 20, 60, 0.05);
            }

            .form-input.error:focus {
                box-shadow: 0 0 20px rgba(220, 20, 60, 0.2);
            }

            .form-input.success {
                border-color: #25D366;
                background: rgba(37, 211, 102, 0.05);
            }
        `;
        document.head.appendChild(style);
    }
}

function validateField(field) {
    if (!field.value.trim()) {
        field.classList.add('error');
        return false;
    }
    field.classList.remove('error');
    field.classList.add('success');
    return true;
}

function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
        field.classList.add('error');
        return false;
    }
    field.classList.remove('error');
    field.classList.add('success');
    return true;
}

function formatPhoneNumber(field) {
    // Remove non-digit characters
    let value = field.value.replace(/[^0-9]/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) {
        value = value.substring(0, 10);
    }

    // Format as XXX-XXX-XXXX
    if (value.length > 0) {
        if (value.length <= 3) {
            field.value = value;
        } else if (value.length <= 6) {
            field.value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            field.value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
        }
    }
}

/* ============================================
   PHOTO INTERACTIONS
   ============================================ */

function setupPhotoInteractions() {
    const ownerPhoto = document.getElementById('ownerMainPhoto');
    if (!ownerPhoto) return;

    // Hover effect with parallax
    ownerPhoto.parentElement.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Store for pseudo-element glow effect
        this.style.setProperty('--mouse-x', xPercent + '%');
        this.style.setProperty('--mouse-y', yPercent + '%');
    });

    ownerPhoto.parentElement.addEventListener('mouseleave', function() {
        this.style.setProperty('--mouse-x', '50%');
        this.style.setProperty('--mouse-y', '50%');
    });
}

/* ============================================
   CHAMPION CARD ANIMATIONS
   ============================================ */

function setupChampionCardAnimations() {
    const cards = document.querySelectorAll('.champion-card');

    cards.forEach((card, index) => {
        // Stagger animation on page load
        card.style.animation = `slideInUp 0.6s ease forwards`;
        card.style.animationDelay = (index * 0.1) + 's';

        // Add hover ripple effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.style.setProperty('--ripple-x', x + 'px');
            this.style.setProperty('--ripple-y', y + 'px');
        });
    });

    // Add animation CSS if not exists
    if (!document.getElementById('dronacharya-card-animations')) {
        const style = document.createElement('style');
        style.id = 'dronacharya-card-animations';
        style.textContent = `
            @keyframes slideInUp {
                0% {
                    opacity: 0;
                    transform: translateY(40px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .champion-card {
                --ripple-x: 0;
                --ripple-y: 0;
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.owner-bio-card, .benefit-item, .trust-item'
    );

    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

function animateElement(element) {
    element.style.animation = 'fadeInUp 0.8s ease forwards';

    if (!document.getElementById('dronacharya-scroll-animations')) {
        const style = document.createElement('style');
        style.id = 'dronacharya-scroll-animations';
        style.textContent = `
            @keyframes fadeInUp {
                0% {
                    opacity: 0;
                    transform: translateY(30px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function scrollToDronacharya() {
    const element = document.getElementById('dronacharya');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Export for use in other scripts
window.scrollToDronacharya = scrollToDronacharya;

/* ============================================
   DEBUGGING & TESTING
   ============================================ */

// Log when Dronacharya section is loaded
console.log('✓ Dronacharya Section Initialized');
