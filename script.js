document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dark Mode / Theme Toggle ---

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Save preference in localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode');
        } else {
            localStorage.setItem('theme', '');
        }
    });


    // --- 2. Animations on Scroll (Intersection Observer) ---

    // Define elements to be animated
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Callback function for the observer
    const animationCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class to trigger CSS animation
                entry.target.classList.add('animate-in');
                
                // Stop observing this element once it has animated
                observer.unobserve(entry.target);
            }
        });
    };

    // Observer options (root null, threshold 10% visible)
    const animationOptions = {
        root: null, // use the viewport
        threshold: 0.1 // element must be 10% visible before triggering
    };

    // Create the IntersectionObserver instance
    const animationObserver = new IntersectionObserver(animationCallback, animationOptions);

    // Start observing each animated element
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });


    // --- 3. Smooth Scrolling (From previous code) ---
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Calculate offset for the sticky navbar
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;

            // Scroll to the target position smoothly
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

});