// DOM Elements
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const darkModeToggle = document.getElementById('darkModeToggle');
const themeToggleBtn = document.getElementById('themeToggle');
const carouselInner = document.querySelector('.carousel-inner');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');
const faqQuestions = document.querySelectorAll('.faq-question');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

// Sidebar functionality
function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

openSidebarBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);

// Close sidebar when clicking on overlay
overlay.addEventListener('click', closeSidebar);

// Close sidebar when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// Dark mode functionality
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update toggle state
    darkModeToggle.checked = isDarkMode;
    
    // Update theme button icon
    updateThemeIcon(isDarkMode);
}

function updateThemeIcon(isDarkMode) {
    const themeIcon = themeToggleBtn.querySelector('i');
    if (isDarkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Check system preference for dark mode
function checkSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Initialize dark mode from localStorage or system preference
function initializeDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
        // Use saved preference
        const isDarkMode = savedDarkMode === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        darkModeToggle.checked = isDarkMode;
        updateThemeIcon(isDarkMode);
    } else {
        // Use system preference if no saved preference
        const systemPrefersDark = checkSystemPreference();
        if (systemPrefersDark) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
            updateThemeIcon(true);
            localStorage.setItem('darkMode', 'true');
        }
    }
}

// Listen for system preference changes
function watchSystemPreference() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only apply system preference if user hasn't manually set preference
            const savedDarkMode = localStorage.getItem('darkMode');
            if (savedDarkMode === null) {
                const isDarkMode = e.matches;
                if (isDarkMode) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
                darkModeToggle.checked = isDarkMode;
                updateThemeIcon(isDarkMode);
                localStorage.setItem('darkMode', isDarkMode.toString());
            }
        });
    }
}

// Event listeners for dark mode
darkModeToggle.addEventListener('change', toggleDarkMode);
themeToggleBtn.addEventListener('click', () => {
    darkModeToggle.checked = !darkModeToggle.checked;
    toggleDarkMode();
});

// Carousel functionality
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carousel-item').length;

function updateCarousel() {
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Next slide
nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
});

// Previous slide
prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
});

// Indicator click
indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        currentSlide = parseInt(indicator.getAttribute('data-index'));
        updateCarousel();
    });
});

// Auto slide every 5 seconds
let carouselInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}, 5000);

// Pause auto-slide on hover
carouselInner.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

carouselInner.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 5000);
});

// FAQ functionality
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = answer.classList.contains('active');
        
        // Close all answers
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.classList.remove('active');
        });
        
        // Remove active class from all questions
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
        });
        
        // If the clicked question wasn't active, open it
        if (!isActive) {
            answer.classList.add('active');
            question.classList.add('active');
        }
    });
});

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { name, email, subject, message });
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Process section animation on scroll
function animateProcessSection() {
    const processSteps = document.querySelectorAll('.process-step');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(step);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    watchSystemPreference();
    updateCarousel();
    
    // Initialize process section animations
    if (document.querySelector('.process-steps')) {
        animateProcessSection();
    }
    
    // Add smooth transition after initial load
    setTimeout(() => {
        document.body.style.transition = 'var(--transition)';
    }, 100);
});

// Close sidebar on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
    }
});

// Handle responsive behavior for process section
function handleProcessSectionResponsive() {
    const processSteps = document.querySelector('.process-steps');
    if (!processSteps) return;

    if (window.innerWidth < 768) {
        processSteps.style.paddingLeft = '20px';
    } else {
        processSteps.style.paddingLeft = '0';
    }
}

// Listen for window resize
window.addEventListener('resize', handleProcessSectionResponsive);

// Initial call for responsive behavior
handleProcessSectionResponsive();

// Add loading state for better UX
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add slight delay for process section animation
    setTimeout(() => {
        const processSection = document.getElementById('process');
        if (processSection) {
            processSection.style.opacity = '1';
        }
    }, 300);
});

// Debug function to check current dark mode state
function debugDarkMode() {
    console.log('Dark Mode Debug:');
    console.log('- System prefers dark:', checkSystemPreference());
    console.log('- Local storage value:', localStorage.getItem('darkMode'));
    console.log('- Current dark mode class:', document.body.classList.contains('dark-mode'));
    console.log('- Toggle checked:', darkModeToggle.checked);
}

// Uncomment the line below to enable debug logging
// debugDarkMode();
