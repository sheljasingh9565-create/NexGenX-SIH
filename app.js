// ===============================
// WASTE RATES
// ===============================

const rates = {
    plastic: 15,
    paper: 10,
    metal: 25,
    organic: 5,
    "mixed-recyclable": 8
};


// ===============================
// GET ELEMENTS
// ===============================

const wasteContainer = document.getElementById("wasteContainer");
const addWasteBtn = document.getElementById("addWasteBtn");

const summaryWaste = document.getElementById("summaryWaste");
const summaryWeight = document.getElementById("summaryWeight");
const summaryRate = document.getElementById("summaryRate");
const estimatedValue = document.getElementById("estimatedValue");

const form = document.getElementById("pickupForm");
const successMessage = document.getElementById("successMessage");


// ===============================
// ADD ANOTHER WASTE
// ===============================

addWasteBtn.addEventListener("click", function () {

    const newRow = document.createElement("div");

    newRow.classList.add("row", "waste-row");

    newRow.innerHTML = `
        <div class="input-group">
            <label>Waste Category</label>

            <select class="wasteType" required>
                <option value="">Select category</option>
                <option value="plastic">Plastic</option>
                <option value="paper">Paper</option>
                <option value="metal">Metal</option>
                <option value="organic">Organic</option>
                <option value="mixed-recyclable">
                    Other Recyclable
                </option>
            </select>
        </div>

        <div class="input-group">
            <label>Estimated Weight (kg)</label>

            <input
                type="number"
                class="weight"
                placeholder="Minimum 5 kg"
                min="5"
                step="0.1"
                required
            >
        </div>
    `;

    wasteContainer.appendChild(newRow);

    updateSummary();
});


// ===============================
// UPDATE SUMMARY
// ===============================

function updateSummary() {

    // Get all waste rows
    const wasteRows = document.querySelectorAll(".waste-row");

    let totalWeight = 0;
    let totalValue = 0;

    let categories = [];
    let ratesUsed = [];


    // Check every waste row
    wasteRows.forEach(function(row) {

        const wasteSelect = row.querySelector(".wasteType");
        const weightInput = row.querySelector(".weight");

        const selectedWaste = wasteSelect.value;
        const enteredWeight = Number(weightInput.value);


        // If category and weight are entered
        if (selectedWaste && enteredWeight > 0) {

            // Add weight
            totalWeight += enteredWeight;


            // Get rate
            const rate = rates[selectedWaste] || 0;


            // Calculate value
            totalValue += enteredWeight * rate;


            // Get category name
            const categoryName =
                wasteSelect.options[wasteSelect.selectedIndex].text;


            // Store category
            categories.push(categoryName);


            // Store rate
            ratesUsed.push(rate);
        }
    });


    // ===============================
    // SHOW CATEGORIES
    // ===============================

    if (categories.length > 0) {

        summaryWaste.textContent =
            categories.join(", ");

    } else {

        summaryWaste.textContent = "—";
    }


    // ===============================
    // SHOW TOTAL WEIGHT
    // ===============================

    summaryWeight.textContent =
        totalWeight > 0 ? totalWeight.toFixed(1) : 0;


    // ===============================
    // SHOW RATES
    // ===============================

    if (ratesUsed.length > 0) {

        summaryRate.textContent =
            ratesUsed.join(", ");

    } else {

        summaryRate.textContent = 0;
    }


    // ===============================
    // SHOW TOTAL VALUE
    // ===============================

    if (totalValue > 0) {

        estimatedValue.textContent =
            totalValue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

    } else {

        estimatedValue.textContent = "0";
    }
}


// ===============================
// UPDATE SUMMARY WHEN USER CHANGES
// ANY WASTE CATEGORY OR WEIGHT
// ===============================

wasteContainer.addEventListener("input", function() {

    updateSummary();

});

wasteContainer.addEventListener("change", function() {

    updateSummary();

});


// ===============================
// DATE VALIDATION
// ===============================

const pickupDate =
    document.getElementById("pickupDate");

const today =
    new Date().toISOString().split("T")[0];

pickupDate.min = today;


// ===============================
// FORM SUBMISSION
// ===============================

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Get basic pickup details
    const societyName =
        document.getElementById("societyName").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const pickupDate =
        document.getElementById("pickupDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;


    // Get all waste rows
    const wasteRows =
        document.querySelectorAll(".waste-row");

    const wasteItems = [];

    let totalWeight = 0;
    let totalValue = 0;


    // Collect waste details
    wasteRows.forEach(function(row) {

        const wasteSelect =
            row.querySelector(".wasteType");

        const weightInput =
            row.querySelector(".weight");

        const category =
            wasteSelect.value;

        const weight =
            Number(weightInput.value) || 0;

        if (category && weight > 0) {

            const rate =
                rates[category] || 0;

            const value =
                weight * rate;

            totalWeight += weight;
            totalValue += value;

            wasteItems.push({
                category: category,
                weightKg: weight,
                ratePerKg: rate,
                estimatedValue: value
            });
        }
    });


    // Validate total weight
    if (totalWeight === 0) {

        alert(
            "Please enter the estimated waste weight."
        );

        return;
    }


    if (totalWeight < 5) {

        alert(
            "Minimum total pickup quantity is 5 kg."
        );

        return;
    }


    // Data sent to FastAPI
    const pickupData = {

        societyName: societyName,

        address: address,

        pickupDate: pickupDate,

        pickupTime: pickupTime,

        wasteItems: wasteItems,

        totalWeightKg: totalWeight,

        estimatedValue: totalValue
    };


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/pickup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(pickupData)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail || "Pickup request failed."
            );
        }


        // Backend successfully received pickup
        successMessage.style.display = "flex";

        console.log(
            "Pickup saved:",
            data
        );


    } catch (error) {

        console.error(
            "Pickup API Error:",
            error
        );

        alert(
            "Cannot connect to FastAPI server.\n\n" +
            "Make sure FastAPI is running."
        );
    }
});


// ===============================
// CLOSE SUCCESS MESSAGE
// ===============================

function closeSuccess() {

    successMessage.style.display = "none";

    form.reset();

    updateSummary();
}
function goToPayment() {
    window.location.href = "payment.html";
}


// ===============================
// INITIAL SUMMARY
// ===============================

updateSummary();