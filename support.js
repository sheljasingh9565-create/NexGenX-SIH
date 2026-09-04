/* =====================================================
   SORT & EARN — SUPPORT JAVASCRIPT
   ===================================================== */


/* =====================================================
   SMOOTH SCROLL
   ===================================================== */

function scrollToSection(id) {

    const section = document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}



/* =====================================================
   FAQ ACCORDION
   ===================================================== */

const faqQuestions =
    document.querySelectorAll(".faq-question");


faqQuestions.forEach(function(question) {

    question.addEventListener("click", function() {

        const item =
            this.closest(".faq-item");


        document
            .querySelectorAll(".faq-item.active")
            .forEach(function(openItem) {

                if (openItem !== item) {
                    openItem.classList.remove("active");
                }

            });


        item.classList.toggle("active");

    });

});



/* =====================================================
   SEARCH
   ===================================================== */

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const searchMessage =
    document.getElementById("searchMessage");


function performSearch() {

    const searchText =
        searchInput.value.trim().toLowerCase();


    const faqItems =
        document.querySelectorAll(".faq-item");


    if (searchText === "") {

        faqItems.forEach(function(item) {

            item.style.display = "block";

        });

        searchMessage.textContent = "";

        return;

    }


    let results = 0;

    let firstResult = null;


    faqItems.forEach(function(item) {

        const text =
            item.innerText.toLowerCase();


        if (text.includes(searchText)) {

            item.style.display = "block";

            results++;


            if (!firstResult) {
                firstResult = item;
            }

        } else {

            item.style.display = "none";

        }

    });


    if (results > 0) {

        searchMessage.textContent =
            results + " helpful result(s) found below.";

        firstResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        firstResult.classList.add("active");

    } else {

        searchMessage.textContent =
            "No results found. Try another search.";

    }

}


searchBtn.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            performSearch();

        }

    }
);



/* =====================================================
   GUIDE CONTENT
   ===================================================== */

const guideContent = {

    segregate: {

        title: "How to segregate waste",

        text:
        "Keep recyclable materials such as paper, cardboard, plastic, metal and glass separate from wet or biodegradable waste. Make sure recyclable items are reasonably clean and dry before giving them for collection."

    },


    pickup: {

        title: "How to schedule a pickup",

        text:
        "Society management can create a pickup request through the platform. Select the required collection details, confirm the request and track the scheduled pickup through the collection status section."

    },


    earnings: {

        title: "Understanding society earnings",

        text:
        "Collected recyclable material is sold through recycling channels. The value depends on material type, quantity and quality. The generated earnings are credited to the society fund and can be used according to society decisions."

    }

};



const guideButtons =
    document.querySelectorAll(".guide-btn");

const guideOutput =
    document.getElementById("guideOutput");


guideButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const type =
            this.dataset.guide;

        const data =
            guideContent[type];


        guideOutput.innerHTML = `

            <h3>${data.title}</h3>

            <p>${data.text}</p>

        `;


        guideOutput.classList.add("show");


        guideOutput.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});



/* =====================================================
   CONTACT
   ===================================================== */

function sendEmail() {

    const message =
        document.getElementById("contactMessage");

    message.textContent =
        "Email support selected. In the final version, this can open your official support email.";

}


function contactCollector() {

    const message =
        document.getElementById("contactMessage");

    message.textContent =
        "Collector support selected. Your society can contact the assigned collector through the platform.";

}


document
    .getElementById("reportBtn")
    .addEventListener("click", function() {

        document
            .getElementById("contactMessage")
            .textContent =
            "Report form opened. This demo can later be connected to your backend.";

    });



/* =====================================================
   CHATBOT
   ===================================================== */

const chatbotWindow =
    document.getElementById("chatbotWindow");

const closeChatbotButton =
    document.getElementById("closeChatbot");

const chatInput =
    document.getElementById("chatInput");

const sendMessageButton =
    document.getElementById("sendMessage");

const chatMessages =
    document.getElementById("chatMessages");

const typingIndicator =
    document.getElementById("typingIndicator");



function openChatbot() {

    chatbotWindow.classList.add("open");

    chatInput.focus();

}


function closeChatbot() {

    chatbotWindow.classList.remove("open");

}


closeChatbotButton.addEventListener(
    "click",
    closeChatbot
);



/* =====================================================
   ADD CHAT MESSAGE
   ===================================================== */

function addMessage(text, sender) {

    const message =
        document.createElement("div");


    message.className =
        "message " + sender;


    message.textContent =
        text;


    chatMessages.appendChild(message);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}



/* =====================================================
   AI RESPONSE
   ===================================================== */

function getAIResponse(question) {

    const q =
        question.toLowerCase();


    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
    ) {

        return "Hi! 👋 How can I help you with Sort & Earn?";

    }


    if (
        q.includes("how") &&
        q.includes("work")
    ) {

        return "Residents segregate recyclable waste, the society schedules a pickup, a connected collector collects it and the recyclable material is sold. The earnings contribute to the society fund.";

    }


    if (
        q.includes("plastic") ||
        q.includes("recycle") ||
        q.includes("waste")
    ) {

        return "You can generally segregate paper, cardboard, plastic, metal and glass as recyclable materials. Keep wet waste separate.";

    }


    if (
        q.includes("paper") ||
        q.includes("cardboard")
    ) {

        return "Paper and cardboard should be kept dry and separate from wet waste before collection.";

    }


    if (
        q.includes("pickup") ||
        q.includes("collection") ||
        q.includes("collect")
    ) {

        return "Society management can schedule a recyclable waste pickup through the platform. The pickup status can then be tracked.";

    }


    if (
        q.includes("fund") ||
        q.includes("money") ||
        q.includes("earning") ||
        q.includes("earn")
    ) {

        return "The recyclable material collected from the society can be sold through recycling channels. The generated earnings are credited to the society fund.";

    }


    if (
        q.includes("resident") ||
        q.includes("direct")
    ) {

        return "In the Sort & Earn society model, residents do not receive money directly. The earnings go to the society fund.";

    }


    if (
        q.includes("collector")
    ) {

        return "Sort & Earn is designed to connect societies with local collectors who can collect segregated recyclable materials.";

    }


    if (
        q.includes("important") ||
        q.includes("why")
    ) {

        return "Waste segregation reduces contamination, makes recycling easier, reduces landfill waste and helps recover value from recyclable materials.";

    }


    return "I'm currently a demo AI assistant. Try asking about waste segregation, pickups, collectors, or the society fund.";

}



/* =====================================================
   SEND CHAT
   ===================================================== */

function sendChatMessage() {

    const question =
        chatInput.value.trim();


    if (question === "") {
        return;
    }


    addMessage(question, "user");


    chatInput.value = "";


    typingIndicator.style.display =
        "block";


    setTimeout(function() {

        typingIndicator.style.display =
            "none";


        const response =
            getAIResponse(question);


        addMessage(response, "bot");

    }, 600);

}


sendMessageButton.addEventListener(
    "click",
    sendChatMessage
);


chatInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            sendChatMessage();

        }

    }
);



/* =====================================================
   CHAT QUICK QUESTIONS
   ===================================================== */

document
    .querySelectorAll(".chat-quick button")
    .forEach(function(button) {

        button.addEventListener("click", function() {

            const question =
                this.textContent;

            chatInput.value =
                question;

            sendChatMessage();

        });

    });



/* =====================================================
   TERMS & CONDITIONS
   ===================================================== */

const termsModal =
    document.getElementById("termsModal");

const termsLink =
    document.getElementById("termsLink");

const closeTerms =
    document.getElementById("closeTerms");

const termsCheckbox =
    document.getElementById("termsCheckbox");

const acceptTerms =
    document.getElementById("acceptTerms");



termsLink.addEventListener(
    "click",
    function() {

        termsModal.classList.add("show");

    }
);



closeTerms.addEventListener(
    "click",
    function() {

        termsModal.classList.remove("show");

    }
);



termsCheckbox.addEventListener(
    "change",
    function() {

        acceptTerms.disabled =
            !this.checked;

    }
);



acceptTerms.addEventListener(
    "click",
    function() {

        if (!termsCheckbox.checked) {
            return;
        }


        localStorage.setItem(
            "sortEarnTermsAccepted",
            "true"
        );


        this.textContent =
            "Accepted ✓";


        setTimeout(function() {

            termsModal.classList.remove("show");

        }, 700);

    }
);



/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ===================================================== */

termsModal.addEventListener(
    "click",
    function(event) {

        if (event.target === termsModal) {

            termsModal.classList.remove("show");

        }

    }
);



/* =====================================================
   ESC KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeChatbot();

            termsModal.classList.remove("show");

        }

    }
);



