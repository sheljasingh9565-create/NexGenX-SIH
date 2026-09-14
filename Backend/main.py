from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
print("Supabase connected:", supabase is not None)
try:
    result = supabase.table("waste_categories").select("id").limit(1).execute()
    print("Supabase database connected successfully!")
except Exception as e:
    print("Supabase database error:", e)

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

# -------------------------
# WASTE CATEGORIES
# -------------------------

@app.get("/api/waste-categories")
def get_waste_categories():
    result = supabase.table("waste_categories").select("*").execute()

    return {
        "success": True,
        "categories": result.data
    }

# -------------------------
# WASTE PRICES
# -------------------------

@app.get("/api/waste-prices")
def get_waste_prices():
    result = supabase.table("waste_prices").select("*").execute()

    return {
        "success": True,
        "prices": result.data
    }
# -------------------------
# ORGANIZATIONS
# -------------------------

@app.get("/api/organizations")
def get_organizations():
    result = supabase.table("organizations").select("*").execute()

    return {
        "success": True,
        "organizations": result.data
    }
# -------------------------
# LOCATIONS
# -------------------------

@app.get("/api/locations")
def get_locations():
    result = supabase.table("locations").select("*").execute()

    return {
        "success": True,
        "locations": result.data
    }
# -------------------------
# ORGANIZATION WASTE TYPES
# -------------------------

@app.get("/api/organization-waste-types")
def get_organization_waste_types():
    result = supabase.table("organization_waste_types").select("*").execute()

    return {
        "success": True,
        "organization_waste_types": result.data
    }

# -------------------------
# WASTE RECORDS
# -------------------------

@app.get("/api/waste-records")
def get_waste_records():
    result = supabase.table("waste_records").select("*").execute()

    return {
        "success": True,
        "waste_records": result.data
    }

# -------------------------
# COLLECTION REQUESTS
# -------------------------

@app.get("/api/collection-requests")
def get_collection_requests():
    result = supabase.table("collection_requests").select("*").execute()

    return {
        "success": True,
        "collection_requests": result.data
    }

# -------------------------
# RECYCLING TRANSACTIONS
# -------------------------

@app.get("/api/recycling-transactions")
def get_recycling_transactions():
    result = supabase.table("recycling_transactions").select("*").execute()

    return {
        "success": True,
        "recycling_transactions": result.data
    }

# -------------------------
# REWARDS
# -------------------------

@app.get("/api/rewards")
def get_rewards():
    result = supabase.table("rewards").select("*").execute()

    return {
        "success": True,
        "rewards": result.data
    }
# -------------------------
# SUPPORT REQUESTS
# -------------------------

@app.get("/api/support-requests")
def get_support_requests():
    result = supabase.table("support_requests").select("*").execute()

    return {
        "success": True,
        "support_requests": result.data
    }

