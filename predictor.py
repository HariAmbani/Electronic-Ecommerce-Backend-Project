# backend/predictor.py
import sys
import json
import joblib
import pandas as pd
import numpy as np
from predict_module import predict_laptop_price

# Load model and assets
model = joblib.load("model/best_xgb_model.pkl")
encoders = joblib.load("model/label_encoders.pkl")
feature_order = joblib.load("model/feature_order.pkl")

# Input from Node (via stdin)
input_json = sys.stdin.read()
input_data = json.loads(input_json)

# Prediction
try:
    result = predict_laptop_price(input_data, encoders, model, feature_order)
    print(json.dumps({"price": result}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
