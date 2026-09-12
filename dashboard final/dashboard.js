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
  earnedRupees: 9527,
  co2SavedKg: 210
};


/* ================= API-READY ANALYTICS ===============================
   Charts are rendered from JavaScript data on a <canvas>, not PNG files.
   The mock values below are only a development fallback. When the backend
   is ready, the same render functions consume the API response directly.
   No graph image needs to be replaced or regenerated.
   ===================================================================== */
const API_CONFIG = {
  summary: "http://127.0.0.1:8000/api/dashboard/summary",
  analytics: "http://127.0.0.1:8000/api/dashboard/analytics"
};


/* =====================================================================
   BACKEND CONTRACT
   =====================================================================
   GET /api/dashboard/analytics?metric=wasteSegregated
     { "labels":["Apr","May"], "values":[12,18], "unit":"kg" }

   GET /api/dashboard/analytics?metric=recyclableWaste
     { "labels":["Apr","May"], "values":[7,11], "unit":"kg" }

   GET /api/dashboard/analytics?metric=incomeComparison
     { "labels":["Apr","May"], "expected":[1100,1600],
       "actual":[980,1510], "unit":"₹" }

   The frontend keeps mock fallback data only when the API is unavailable.
   Replace the endpoint in API_CONFIG if your backend uses another route.
   ===================================================================== */


/* ===================== LOAD TEMPORARY DATA ========================== */

/* setText: writes textContent only if the element exists AND the value is
   present. This is the single choke point that stops a missing/renamed
   HTML id (or a field the API doesn't send back) from throwing and
   killing the rest of DOMContentLoaded, which is what was breaking the
   analytics dropdown before — one bad getElementById() call up here was
   silently stopping setupAnalyticsDrawer() from ever running below. */
function setText(id, value) {
  if (value === undefined || value === null) return;
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function loadMockDashboardData() {
  setText("userName", MOCK_DASHBOARD_DATA.userName);
  setText("headerUserName", MOCK_DASHBOARD_DATA.headerName);
  setText("popoverName", MOCK_DASHBOARD_DATA.userName);
  setText("disposedKpi", MOCK_DASHBOARD_DATA.disposedKg); // no-ops until/unless a #disposedKpi element exists
  setText("segregatedKpi", MOCK_DASHBOARD_DATA.segregatedKg);
  setText("earnedKpi", MOCK_DASHBOARD_DATA.earnedRupees);
  setText("co2Kpi", MOCK_DASHBOARD_DATA.co2SavedKg);
}


/* ===================== MONTHLY ANALYTICS =============================
   The UI uses one smooth Chart.js canvas and a small selector. Mock data
   is isolated here so the same rendering functions can consume API data
   later without changing the dashboard UI.
   ===================================================================== */

const MOCK_ANALYTICS_DATA = {
  months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  wasteSegregated: [12, 18, 15, 22, 27, 31],
  recyclableWaste: [7, 11, 9, 14, 18, 21],
  expectedIncome: [1100, 1600, 2200, 2900, 3600, 4300],
  actualIncome: [980, 1510, 2050, 2780, 3490, 4120]
};

let analyticsChartInstance = null;

const ANALYTICS_CONFIG = {
  wasteSegregated: {
    title: "Waste Segregated",
    unit: "kg",
    type: "bar",
    status: "Hover a bar to see the exact kilograms segregated.",
    datasets: (data) => [{
      label: "Waste Segregated (kg)",
      data: data.wasteSegregated,
      borderWidth: 1,
      borderRadius: 4,
      hoverBorderWidth: 2
    }]
  },
  incomeComparison: {
    title: "Expected vs Actual Income",
    unit: "₹",
    type: "line",
    status: "Hover a point to compare expected and actual income.",
    datasets: (data) => [
      { label: "Expected Income (₹)", data: data.expectedIncome, tension: 0.35, borderWidth: 3, pointRadius: 3, pointHoverRadius: 6 },
      { label: "Actual Income (₹)", data: data.actualIncome, tension: 0.35, borderWidth: 3, pointRadius: 3, pointHoverRadius: 6 }
    ]
  },
  recyclableWaste: {
    title: "Recyclable Waste Segregated",
    unit: "kg",
    type: "bar",
    status: "Hover a bar to see the exact recyclable kilograms segregated.",
    datasets: (data) => [{
      label: "Recyclable Waste (kg)",
      data: data.recyclableWaste,
      borderWidth: 1,
      borderRadius: 4,
      hoverBorderWidth: 2
    }]
  }
};

/* hexToRgba / lines below give the line chart a soft gradient fill instead
   of a flat outline, and let the bar/line colors share one dark-green
   palette instead of the old neon lime. */
function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderAnalyticsChart(metric = "wasteSegregated", data = MOCK_ANALYTICS_DATA) {
  const canvas = document.getElementById("analyticsCanvas");
  const status = document.getElementById("chartStatus");
  const unitLabel = document.getElementById("chartUnitLabel");
  if (!canvas || typeof Chart === "undefined") return;

  const config = ANALYTICS_CONFIG[metric] || ANALYTICS_CONFIG.wasteSegregated;

  if (analyticsChartInstance) {
    analyticsChartInstance.destroy();
    analyticsChartInstance = null;
  }

  const ctx = canvas.getContext("2d");
  const computed = getComputedStyle(document.documentElement);
  const ink = computed.getPropertyValue("--ink").trim() || "#14231B";
  const muted = computed.getPropertyValue("--muted").trim() || "#607267";
  const deep = "#071F19";

  // Calmer, dark-green palette (replaces the old neon lime). The two income
  // lines get different colors AND a dash pattern — previously both lines
  // used the same "deep" color, so Expected/Actual overlapped visually and
  // the chart read as a single flat line.
  const barGreen = "#2F6B46";
  const barGreenHover = "#4C9A69";
  const lineActualGreen = "#2F6B46";
  const lineExpectedGold = "#C9974A";
  const tooltipAccent = "#8FD7A8";
  const gradientHeight = canvas.clientHeight || canvas.height || 260;

  const datasets = config.datasets(data);
  datasets.forEach((dataset, index) => {
    if (config.type === "bar") {
      dataset.backgroundColor = barGreen;
      dataset.hoverBackgroundColor = barGreenHover;
      dataset.borderColor = deep;
      dataset.hoverBorderColor = deep;
    } else {
      // index 0 = "Expected Income" (dashed gold), index 1 = "Actual Income"
      // (solid green) — see the dataset order in ANALYTICS_CONFIG.incomeComparison.
      const isExpected = index === 0;
      const lineColor = isExpected ? lineExpectedGold : lineActualGreen;
      const gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);
      gradient.addColorStop(0, hexToRgba(lineColor, 0.30));
      gradient.addColorStop(1, hexToRgba(lineColor, 0.02));

      dataset.borderColor = lineColor;
      dataset.backgroundColor = gradient;
      dataset.fill = true;
      dataset.borderDash = isExpected ? [6, 4] : [];
      dataset.pointBackgroundColor = lineColor;
      dataset.pointBorderColor = "#fff";
      dataset.pointHoverBackgroundColor = "#fff";
      dataset.pointHoverBorderColor = lineColor;
    }
  });

  analyticsChartInstance = new Chart(ctx, {
    type: config.type,
    data: {
      labels: data.months,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: config.type === "line",
          labels: { color: ink, usePointStyle: true, boxWidth: 8, padding: 18, font: { family: "Plus Jakarta Sans", size: 11, weight: "700" } }
        },
        tooltip: {
          enabled: true,
          displayColors: config.type === "line",
          backgroundColor: deep,
          titleColor: tooltipAccent,
          bodyColor: "#fff",
          padding: 11,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const value = Number(context.parsed.y || 0).toLocaleString("en-IN");
              return config.unit === "₹"
                ? `${context.dataset.label}: ₹${value}`
                : `${context.dataset.label}: ${value} kg`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: muted, font: { family: "Plus Jakarta Sans", size: 10, weight: "600" } },
          border: { color: "rgba(20,35,27,.14)" }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(20,35,27,.08)" },
          ticks: {
            color: muted,
            font: { family: "Plus Jakarta Sans", size: 10 },
            callback: (value) => config.unit === "₹" ? `₹${Number(value).toLocaleString("en-IN")}` : `${value} kg`
          },
          border: { display: false }
        }
      }
    }
  });

  if (unitLabel) unitLabel.textContent = `MONTHLY · ${config.unit.toUpperCase()}`;
  if (status) status.textContent = config.status;
}

async function refreshAnalyticsFromAPI(metric) {
  const loading = document.getElementById("chartLoading");
  if (loading) loading.hidden = false;
  try {
    const response = await fetch(`${API_CONFIG.analytics}?metric=${encodeURIComponent(metric)}`, { headers: { "Accept": "application/json" } });
    if (!response.ok) throw new Error(`Analytics API returned ${response.status}`);
    const apiData = await response.json();
    const data = { ...MOCK_ANALYTICS_DATA };
    if (Array.isArray(apiData.labels) && apiData.labels.length) data.months = apiData.labels;
    if (metric !== "incomeComparison" && Array.isArray(apiData.values)) data[metric] = apiData.values;
    if (metric === "incomeComparison") {
      if (Array.isArray(apiData.expected)) data.expectedIncome = apiData.expected;
      if (Array.isArray(apiData.actual)) data.actualIncome = apiData.actual;
    }
    renderAnalyticsChart(metric, data);
    if (loading) loading.hidden = true;
    return apiData;
  } catch (error) {
    console.info("Using analytics mock fallback until the API is available.", error.message);
    renderAnalyticsChart(metric, MOCK_ANALYTICS_DATA);
    if (loading) loading.hidden = true;
    return null;
  }
}


/* ===================== PROFILE MENU ================================ */

function setupProfileMenu() {
  const button = document.getElementById("profileButton");
  const popover = document.getElementById("profilePopover");
  const profileAction = document.getElementById("profileAction");
  if (!button || !popover || !profileAction) return;

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
  if (!button) return;
  // The dismiss animation is defined on .tip-panel in the CSS; the card in
  // dashboard.html is also classed .smart-home, so match on either.
  const panel = document.querySelector(".tip-panel") || document.querySelector(".smart-home");

  button.addEventListener("click", () => {
    button.textContent = "Saved ✓";
    button.disabled = true;
    if (panel) panel.classList.add("dismissed");
  });
}


/* ===================== PLACEHOLDER NAVIGATION ====================== */

function setupPlaceholderNavigation() {
  const historyButton = document.getElementById("historyButton");
  if (!historyButton) return;
  historyButton.addEventListener("click", () => {
    alert("History page will be connected here.");
  });
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


/* ===================== API-READY DATA HOOKS ==========================
   Keep these functions as the single integration point for the backend.
   The UI falls back to mock data if the API is unavailable.
   ===================================================================== */
async function refreshDashboardFromAPI(endpoint = API_CONFIG.summary) {
  try {
    const response = await fetch(endpoint, {headers:{"Accept":"application/json"}});
    if(!response.ok) throw new Error(`Dashboard API returned ${response.status}`);
    const data = await response.json();
    setText("userName", data.userName);
    setText("headerUserName", data.headerName);
    setText("popoverName", data.userName);
    if (Number.isFinite(data.segregatedKg)) setText("segregatedKpi", data.segregatedKg);
    if (Number.isFinite(data.earnedRupees)) setText("earnedKpi", data.earnedRupees);
    if (Number.isFinite(data.co2SavedKg)) setText("co2Kpi", data.co2SavedKg);
    return data;
  } catch(error) {
    console.info("Using dashboard mock data until the API is available.", error.message);
    return null;
  }
}

/* ===================== INITIALIZE ================================== */

function setupAnalyticsDrawer(){
  const toggle = document.getElementById("analyticsToggle");
  const details = document.getElementById("analyticsDetails");
  const chartSelect = document.getElementById("chartSelect");
  if(!toggle || !details) return;

  const openAnalytics = () => {
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    details.classList.add("is-open");
    details.setAttribute("aria-hidden", "false");

    // Scroll after the browser has applied the open state.
    setTimeout(() => {
      details.scrollIntoView({behavior:"smooth", block:"start"});
      const metric = chartSelect ? chartSelect.value : "wasteSegregated";
      refreshAnalyticsFromAPI(metric);
    }, 80);
  };

  const closeAnalytics = () => {
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    details.classList.remove("is-open");
    details.setAttribute("aria-hidden", "true");
  };

  window.toggleAnalyticsDrawer = (event) => {
    if(event) event.preventDefault();
    if(details.classList.contains("is-open")) closeAnalytics();
    else openAnalytics();
  };

  // This addEventListener is now the ONLY binding for the toggle click.
  // (The HTML used to also carry an inline onclick="window.toggleAnalyticsDrawer(event)"
  // on the same button — with both wired up, one click fired the toggle
  // twice, so it opened and immediately closed again and looked dead.
  // The inline handler has been removed from dashboard.html.)
  toggle.addEventListener("click", window.toggleAnalyticsDrawer);

  if(chartSelect){
    chartSelect.addEventListener("change", () => {
      if(!details.classList.contains("is-open")) openAnalytics();
      refreshAnalyticsFromAPI(chartSelect.value);
    });
  }

  document.querySelectorAll('.sidebar-nav a[href="#analytics"]').forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openAnalytics();
    });
  });
}

function setupPickupButton() {
  const button = document.getElementById("requestPickupButton");

  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();

    window.location.href = "../index.html";
  });
}
/* safeRun: runs one setup function in isolation. If it throws (missing
   element, a future edit, an API shape change, etc.) the error is logged
   instead of propagating — so every OTHER widget on the page still
   initializes normally. This is what the disposedKpi crash was missing:
   previously any single throw here stopped every setup call below it,
   including the analytics drawer. */
function safeRun(fn, label) {
  try {
    fn();
  } catch (error) {
    console.error(`Waste2Worth dashboard: "${label}" failed to initialize.`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  safeRun(loadMockDashboardData, "loadMockDashboardData");
  safeRun(setupProfileMenu, "setupProfileMenu");
  safeRun(setupTipButton, "setupTipButton");
  safeRun(setupPlaceholderNavigation, "setupPlaceholderNavigation");
  safeRun(setupSidebarNavigation, "setupSidebarNavigation");
  safeRun(setupAnalyticsDrawer, "setupAnalyticsDrawer");
  safeRun(setupPickupButton, "setupPickupButton");

  const closePickup = document.getElementById("closePickupNotice");
  if (closePickup) {
    closePickup.addEventListener("click", () => {
      const notice = document.getElementById("pickupNotice");
      if (notice) notice.hidden = true;
    });
  }

  /* Live backend can update the small home cards without changing the UI. */
  safeRun(() => refreshDashboardFromAPI(), "refreshDashboardFromAPI");
});
