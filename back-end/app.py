from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

model = YOLO("yolov8n.pt")  # Will auto-download if not found

@app.route('/detect', methods=['POST'])
def detect_car():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    img = Image.open(file.stream).convert("RGB")
    img_np = np.array(img)

    results = model.predict(source=img_np, conf=0.3, classes=[2], verbose=False)

    car_count = sum(len(result.boxes) for result in results)

    return jsonify({
        "car_detected": car_count > 0,
        "num_cars": car_count
    })

if __name__ == '__main__':
    app.run(debug=True)
