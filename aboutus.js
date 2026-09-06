// =====================================
// WASTE2WORTH - ABOUT US
// =====================================


// =====================================
// SCROLL REVEAL
// =====================================

// Select elements that should appear
// when the user scrolls to them

const revealElements = document.querySelectorAll(
    ".section-heading, " +
    ".journey-card, " +
    ".difference-card, " +
    ".purpose-card, " +
    ".comparison-card, " +
    ".cta-section"
);


// Add reveal class

revealElements.forEach(function(element) {

    element.classList.add("reveal");

});


// Create Intersection Observer

const observer = new IntersectionObserver(

    function(entries) {

        entries.forEach(function(entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


// Start observing elements

revealElements.forEach(function(element) {

    observer.observe(element);

});


// =====================================
// SMOOTH SCROLL
// =====================================

document.querySelectorAll('a[href^="#"]').forEach(function(link) {

    link.addEventListener("click", function(event) {

        const targetId = link.getAttribute("href");

        if (targetId !== "#") {

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }

    });

});