/* =====================================================================
   WASTE2WORTH DASHBOARD JS
   =====================================================================

   CURRENT PROTOTYPE
   ---------------------------------------------------------------------
   The dashboard currently uses:
     1. MOCK_DASHBOARD_DATA       -> temporary dashboard numbers
     2. STATIC_GRAPH_SOURCE       -> temporary Matplotlib PNG graphs

   These sections are intentionally isolated so they can be removed when
   the backend/database/API is connected.

   ===================================================================== */

/* ================= TEMPORARY MOCK DATA ==============================
   Replace this with data returned by your backend/API later.
   ===================================================================== */
const MOCK_DASHBOARD_DATA = {
  userName: "EcoFriend",
  headerName: "User",
  disposedKg: 120,
  segregatedKg: 95,
  earnedRupees: 450,
  co2SavedKg: 210
};


/* ================= TEMPORARY STATIC PNG GRAPHS =======================
   Every graph is called "graph.png", but each is inside a different
   folder, so they are separate image files.

   REMOVE THIS OBJECT when live API charts are implemented.
   ===================================================================== */
const STATIC_GRAPH_SOURCE = {
  wasteDisposed: {
    title: "Waste Disposed",
    image: "./graphs/waste-disposed/graph.png",
    unit: "kg"
  },

  wasteSegregated: {
    title: "Waste Segregated",
    image: "./graphs/waste-segregated/graph.png",
    unit: "kg"
  },

  moneyEarned: {
    title: "Money Earned",
    image: "./graphs/money-earned/graph.png",
    unit: "₹"
  },

  incomeComparison: {
    title: "Expected vs Actual Income",
    image: "./graphs/income-comparison/graph.png",
    unit: "₹"
  }
};


/* =====================================================================
   FUTURE API / DATABASE INTEGRATION GUIDE
   =====================================================================

   When your database/backend is ready:

   STEP 1
   Create an API endpoint such as:

     GET /api/dashboard/analytics?metric=wasteDisposed

   STEP 2
   Return JSON such as:

     {
       "labels": ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6"],
       "values": [20,40,60,78,92,105],
       "unit": "kg"
     }

   For Expected vs Actual Income:

     {
       "labels": ["Week 1","Week 2","Week 3","Week 4"],
       "expected": [100,185,275,355],
       "actual": [85,155,245,325],
       "unit": "₹"
     }

   STEP 3
   Add a chart library to dashboard.html, for example Chart.js.

   STEP 4
   Replace the static <img id="analyticsChart"> with:

     <canvas id="analyticsCanvas"></canvas>

   STEP 5
   Replace updateStaticAnalyticsGraph() with an async function:

     async function updateAnalyticsFromAPI(metric) {
       const response = await fetch(
         `/api/dashboard/analytics?metric=${encodeURIComponent(metric)}`
       );

       if (!response.ok) {
         throw new Error("Analytics API request failed");
       }

       const data = await response.json();

       // Use data.labels and data.values to render the chart.
       // For incomeComparison use data.expected + data.actual.
     }

   STEP 6
   Change the dropdown listener to:

     chartSelect.addEventListener("change", () => {
       updateAnalyticsFromAPI(chartSelect.value);
     });

   STEP 7
   Remove STATIC_GRAPH_SOURCE and all temporary PNG references.

   IMPORTANT:
   In production, user-specific values should come from the backend.
   Do not keep real user data inside MOCK_DASHBOARD_DATA.

   ===================================================================== */


/* ===================== LOAD TEMPORARY DATA ========================== */

function loadMockDashboardData() {
  document.getElementById("userName").textContent =
    MOCK_DASHBOARD_DATA.userName;

  document.getElementById("headerUserName").textContent =
    MOCK_DASHBOARD_DATA.headerName;

  document.getElementById("popoverName").textContent =
    MOCK_DASHBOARD_DATA.userName;

  document.getElementById("disposedKpi").textContent =
    MOCK_DASHBOARD_DATA.disposedKg;

  document.getElementById("segregatedKpi").textContent =
    MOCK_DASHBOARD_DATA.segregatedKg;

  document.getElementById("earnedKpi").textContent =
    MOCK_DASHBOARD_DATA.earnedRupees;

  document.getElementById("co2Kpi").textContent =
    MOCK_DASHBOARD_DATA.co2SavedKg;
}


/* ===================== STATIC PNG GRAPH SWITCHING ===================
   TEMPORARY.
   Replace with API/chart rendering later.
   ===================================================================== */

function updateStaticAnalyticsGraph() {
  const select = document.getElementById("chartSelect");
  const image = document.getElementById("analyticsChart");
  const status = document.getElementById("chartStatus");
  const loading = document.getElementById("chartLoading");

  const source = STATIC_GRAPH_SOURCE[select.value];

  if (!source) return;

  loading.hidden = false;
  image.style.opacity = "0.18";

  const preload = new Image();

  preload.onload = () => {
    image.src = source.image;
    image.alt = `Weekly ${source.title} graph`;
    image.style.opacity = "1";

    loading.hidden = true;
    status.textContent = `Weekly · ${source.unit}`;
  };

  preload.onerror = () => {
    image.style.opacity = "1";
    loading.hidden = true;
    status.textContent = "Graph unavailable";

    console.error(
      "Could not load static graph:",
      source.image
    );
  };

  preload.src = source.image;
}


/* ===================== PROFILE MENU ================================ */

function setupProfileMenu() {
  const button = document.getElementById("profileButton");
  const popover = document.getElementById("profilePopover");
  const profileAction = document.getElementById("profileAction");

  button.addEventListener("click", () => {
    const currentlyOpen = !popover.hidden;

    popover.hidden = currentlyOpen;
    button.setAttribute(
      "aria-expanded",
      String(!currentlyOpen)
    );
  });

  profileAction.addEventListener("click", () => {
    alert("Profile page will be connected here.");
  });

  document.addEventListener("click", (event) => {
    if (
      !popover.hidden &&
      !popover.contains(event.target) &&
      !button.contains(event.target)
    ) {
      popover.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
}


/* ===================== TIP BUTTON ================================== */

function setupTipButton() {
  const button = document.getElementById("tipButton");
  const panel = document.querySelector(".tip-panel");

  button.addEventListener("click", () => {
    button.textContent = "Saved ✓";
    button.disabled = true;
    panel.classList.add("dismissed");
  });
}


/* ===================== PLACEHOLDER NAVIGATION ====================== */

function setupPlaceholderNavigation() {
  document.getElementById("historyButton").addEventListener(
    "click",
    () => {
      alert("History page will be connected here.");
    }
  );
}


/* ===================== SIDEBAR ACTIVE STATE ========================= */

function setupSidebarNavigation() {
  const links = document.querySelectorAll(
    ".sidebar-nav .side-link"
  );

  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");
    });
  });
}


/* ===================== INITIALIZE ================================== */

document.addEventListener("DOMContentLoaded", () => {
  loadMockDashboardData();

  const chartSelect = document.getElementById("chartSelect");

  chartSelect.addEventListener(
    "change",
    updateStaticAnalyticsGraph
  );

  setupProfileMenu();
  setupTipButton();
  setupPlaceholderNavigation();
  setupSidebarNavigation();

  /* Load the first temporary Matplotlib graph */
  updateStaticAnalyticsGraph();
});
