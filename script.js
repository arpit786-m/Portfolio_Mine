document.addEventListener('DOMContentLoaded', () => {

    
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

   
    const contactForm = document.getElementById("contact-form");
    
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); 

            
            const status = document.getElementById("status");
            status.textContent = "Thank you! Message sent.";
            status.style.color = "green";

            contactForm.reset();
        });
    }

});