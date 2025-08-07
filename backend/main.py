from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Create the FastAPI app instance
app = FastAPI()

# --- CORS Middleware ---
# This is crucial! It allows your React frontend (running on a different port)
# to communicate with your Python backend.
origins = [
    "http://localhost:5173", # The default port for Vite/React dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Define the data shape for creating a profile ---
# This ensures the data sent from the frontend is valid.
class UserProfile(BaseModel):
    name: str
    email: str
    skills: list[str]
    interests: list[str]

# --- Your First API Endpoint ---
# This function will run when the frontend sends a POST request to http://localhost:8000/onboard
@app.post("/onboard")
async def create_user_profile(profile: UserProfile):
    # For now, we'll just print the data we receive.
    # Later, you will add code here to save this data to your Supabase database.
    print("Received new profile:")
    print(f"  Name: {profile.name}")
    print(f"  Email: {profile.email}")
    print(f"  Skills: {profile.skills}")
    
    # Return a success message and the data back to the frontend
    return {"status": "success", "message": "Profile created successfully!", "data": profile}

# This line allows you to run the server directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
