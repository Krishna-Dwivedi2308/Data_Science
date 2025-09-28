import pandas as pd
import pickle
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import os


# --- 1. Define Input Data Schema using Pydantic ---
# This class defines the structure of the JSON payload we expect to receive.
# In your case, the input is an array of float features.
class PredictionInput(BaseModel):
    """
    Defines the structured input fields for the model.
    """

    MedInc: float
    HouseAge: float
    AveRooms: float
    AveBedrms: float
    Population: float
    AveOccup: float
    Latitude: float
    Longitude: float


# --- 2. Initialize FastAPI App ---
app = FastAPI(
    title="ML Model Prediction Service",
    description="A service for predicting outcomes using a pre-trained scikit-learn model.",
)

# --- 3. Load Model and Scalar (Executes once on startup) ---
try:
    # Ensure these paths are correct relative to where the API is run
    model_path = "model.pkl"
    scalar_path = "scaling_new.pkl"

    # Check if files exist (good practice)
    if not os.path.exists(model_path) or not os.path.exists(scalar_path):
        raise FileNotFoundError(
            f"Missing one or both model files: {model_path} or {scalar_path}"
        )

    with open(model_path, "rb") as f:
        model = pickle.load(f)
        print("Model loaded successfully.")

    with open(scalar_path, "rb") as f:
        scalar = pickle.load(f)
        print("Scalar loaded successfully.")

except Exception as e:
    print(f"Error loading model or scalar: {e}")
    model = None  # Set to None to handle errors gracefully if needed
    scalar = None


# --- 4. Root Endpoint (GET) ---
# Use @app.get() instead of @app.route('/', methods=['GET'])
@app.get("/")
def home():
    """Returns a simple greeting message."""
    return {
        "message": "Welcome to the Prediction API. Use /predict_api for POST requests."
    }


# --- 5. Prediction Endpoint (POST) ---
# Use @app.post() and accept the Pydantic model as an argument.
# FastAPI handles reading the JSON body and validating it against the schema.
@app.post("/predict_api")
def predict_api(input_data: PredictionInput):
    """
    Accepts JSON input, scales it, and returns a prediction.

    Input JSON format:
    {"data": [100.0, 2.5, 50000.0, ...]}
    """
    if model is None or scalar is None:
        return {"error": "Model files failed to load on startup."}, 500

    try:
        # 1. Convert Pydantic object to a dictionary
        data_dict = input_data.model_dump()

        # 2. Extract values and feature names in the order defined by the Pydantic model
        data_values = list(data_dict.values())
        feature_names = list(data_dict.keys())

        # 3. Create a Pandas DataFrame with the correct feature names
        # This resolves the UserWarning about missing feature names.
        input_df = pd.DataFrame([data_values], columns=feature_names)  # Shape (1, N)

        # 4. Transform/scale the input features using the loaded scalar
        transformed_input_values = scalar.transform(input_df)

        # 5. Make prediction
        model_prediction = model.predict(transformed_input_values)

        # 6. Return the prediction as a standard float for clean JSON output
        return {"prediction": model_prediction[0].item()}

    except Exception as e:
        print(f"Prediction failed: {e}")
        return {"error": f"An error occurred during prediction: {e}"}, 500


if __name__ == "__main__":
    app.run(debug=True)
# To run this file, you would typically use the uvicorn command:
# uvicorn main:app --reload
