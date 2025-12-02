// ===================
// Theme Switcher Logic
// ===================
const switchTheme = () => {
    document.body.classList.toggle('dark-mode');
    
    // Save User Preference
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
};

// Apply Saved Theme on Load
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
});

// ===================
// Mobile Menu Handling
// ===================
function toggleMenu() {
    const nav = document.querySelector('.nav-links');
    const icon = document.getElementById('menu-icon');
    
    nav.classList.toggle('active');
    
    // Swap Icon: Bars <-> Times
    if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.querySelector('.nav-links');
        const icon = document.getElementById('menu-icon');
        
        nav.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// ===================
// Contact Form Handler
// ===================
const form = document.getElementById("contact-form");
if (form) {
    // NOTE: Add your EmailJS Public Key Here
    emailjs.init("YOUR_PUBLIC_KEY_HERE"); 

    const statusMsg = document.getElementById("status");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        statusMsg.textContent = "Sending...";
        
        const serviceID = "YOUR_SERVICE_ID_HERE";
        const templateID = "YOUR_TEMPLATE_ID_HERE";

        const formData = {
            from_name: document.getElementById("name").value,
            reply_to: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        emailjs.send(serviceID, templateID, formData)
            .then(() => {
                statusMsg.textContent = "Sent successfully!";
                statusMsg.style.color = "green";
                form.reset();
            })
            .catch((error) => {
                statusMsg.textContent = "Error sending message.";
                statusMsg.style.color = "red";
            });
    });
}