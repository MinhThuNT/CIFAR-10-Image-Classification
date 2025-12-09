from flask import Flask, render_template, request, jsonify
import os
import numpy as np
from PIL import Image
import tensorflow as tf
import pickle
import io

# Create necessary folders
os.makedirs("templates", exist_ok=True)
os.makedirs("static", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

# Initialize Flask app
app = Flask(__name__, template_folder="templates", static_folder="static")
app.config['UPLOAD_FOLDER'] = "W5_7/uploads"

# Load model
if os.path.exists("checkpoints/best_model.keras"):
    model_path = "checkpoints/best_model.keras"
    print("Using the BEST model from checkpoint!")
elif os.path.exists("cifar10_final_model/cifar10_cnn_90plus.keras"):
    model_path = "cifar10_final_model/cifar10_cnn_90plus.keras"
else:
    raise FileNotFoundError("No model found! Please retrain.")

model = tf.keras.models.load_model(model_path)

# Load normalization stats and class names
with open("cifar10_final_model/norm_stats.pkl", "rb") as f:
    mean, std = pickle.load(f)
with open("cifar10_final_model/class_names.pkl", "rb") as f:
    class_names = pickle.load(f)

print(f"Model loaded successfully: {os.path.basename(model_path)}")
print("CIFAR-10 Classifier Web is ready!")

# Home page
@app.route("/")
def index():
    return render_template("index.html")

# Prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No image selected!"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No image selected!"}), 400

    try:
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
    except Exception as e:
        return jsonify({"error": "File is not a valid image!"}), 400

    # Preprocess image
    img_resized = img.resize((32, 32))
    img_array = np.array(img_resized).astype('float32')
    img_norm = (img_array - mean) / (std + 1e-7)
    img_input = np.expand_dims(img_norm, axis=0)

    # Predict
    try:
        pred = model.predict(img_input, verbose=0)[0]
    except Exception as e:
        return jsonify({"error": "Model prediction failed!"}), 500

    idx = np.argmax(pred)
    confidence = float(pred[idx])

    top3_idx = np.argsort(pred)[-3:][::-1]
    top3 = [
        {"rank": i+1, "class": class_names[j], "confidence": f"{pred[j]:.2%}"}
        for i, j in enumerate(top3_idx)
    ]

    return jsonify({
        "predicted": class_names[idx],
        "confidence": f"{confidence:.2%}",
        "top3": top3
    })

# Run app
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
