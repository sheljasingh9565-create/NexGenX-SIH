// ==========================================
// WASTE2WORTH DASHBOARD JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET ELEMENTS
    // ==========================================

    const helpBtn = document.getElementById("helpBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const navItems = document.querySelectorAll(".nav-item");


    // ==========================================
    // HELP BUTTON
    // ==========================================

    if (helpBtn) {

        helpBtn.addEventListener("click", function () {

            window.location.href = "support.html";

        });

    }


    // ==========================================
    // LOGOUT BUTTON
    // ==========================================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                window.location.href = "login.html";

            }

        });

    }


    // ==========================================
    // SIDEBAR ACTIVE STATE
    // ==========================================

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const href = item.getAttribute("href");

            /*
             * Only change active state for
             * navigation items.
             *
             * Real page links will continue
             * normally.
             */

            if (href === "#") {

                navItems.forEach(function (nav) {
                    nav.classList.remove("active");
                });

                item.classList.add("active");

            }

        });

    });


    // ==========================================
    // CURRENT PAGE ACTIVE STATE
    // ==========================================

    const currentPage =
        window.location.pathname.split("/").pop();


    navItems.forEach(function (item) {

        const linkPage = item.getAttribute("href");

        if (linkPage === currentPage) {

            navItems.forEach(function (nav) {
                nav.classList.remove("active");
            });

            item.classList.add("active");

        }

    });

});