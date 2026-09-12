from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Waste2Worth API")

# Allow frontend to connect with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# LOGIN
# -------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
def login(data: LoginRequest):

    if (
        data.email == "test@gmail.com"
        and data.password == "123456"
    ):
        return {
            "success": True,
            "message": "Login successful"
        }

    return {
        "success": False,
        "message": "Invalid email or password"
    }


# -------------------------
# HOME / HEALTH CHECK
# -------------------------

@app.get("/")
def home():
    return {
        "message": "Waste2Worth Backend is Running!"
    }


# -------------------------
# DASHBOARD SUMMARY
# -------------------------

@app.get("/api/dashboard/summary")
def dashboard_summary():

    return {
        "userName": "EcoFriend",
        "headerName": "User",
        "segregatedKg": 95,
        "earnedRupees": 9527,
        "co2SavedKg": 210
    }


# -------------------------
# DASHBOARD ANALYTICS
# -------------------------

@app.get("/api/dashboard/analytics")
def dashboard_analytics(metric: str):

    # Waste Segregated
    if metric == "wasteSegregated":

        return {
            "labels": [
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep"
            ],
            "values": [
                12,
                18,
                15,
                22,
                27,
                31
            ],
            "unit": "kg"
        }

    # Recyclable Waste
    if metric == "recyclableWaste":

        return {
            "labels": [
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep"
            ],
            "values": [
                7,
                11,
                9,
                14,
                18,
                21
            ],
            "unit": "kg"
        }

    # Expected vs Actual Income
    if metric == "incomeComparison":

        return {
            "labels": [
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep"
            ],
            "expected": [
                1100,
                1600,
                2200,
                2900,
                3600,
                4300
            ],
            "actual": [
                980,
                1510,
                2050,
                2780,
                3490,
                4120
            ],
            "unit": "₹"
        }

    raise HTTPException(
        status_code=400,
        detail="Unknown analytics metric"
    )
# -------------------------
# PICKUP REQUEST
# -------------------------

class WasteItem(BaseModel):
    category: str
    weightKg: float
    ratePerKg: float
    estimatedValue: float


class PickupRequest(BaseModel):
    societyName: str
    address: str
    pickupDate: str
    pickupTime: str
    wasteItems: list[WasteItem]
    totalWeightKg: float
    estimatedValue: float


@app.post("/api/pickup")
def create_pickup(data: PickupRequest):

    return {
        "success": True,
        "message": "Pickup request submitted successfully!",
        "pickup": data
    }