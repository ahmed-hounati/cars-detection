from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

model = YOLO("yolov8n.pt")

@app.route('/detect', methods=['POST'])
def detect_vehicles():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    img = Image.open(file.stream).convert("RGB")
    img_np = np.array(img)

    height, width = img_np.shape[:2]
    image_center = width // 2

    vehicle_classes = [2, 3, 5, 7]
    results = model.predict(source=img_np, conf=0.3, classes=vehicle_classes, verbose=False)

    vehicles = []
    
    for result in results:
        if result.boxes is not None:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                
                center_x = (x1 + x2) / 2
                center_y = (y1 + y2) / 2
                
                position = "left" if center_x < image_center else "right"
                
                class_id = int(box.cls[0].cpu().numpy())
                confidence = float(box.conf[0].cpu().numpy())
                
                class_names = {2: "car", 3: "motorcycle", 5: "bus", 7: "truck"}
                vehicle_type = class_names.get(class_id, "vehicle")
                
                vehicles.append({
                    "type": vehicle_type,
                    "position": position,
                    "confidence": round(confidence, 2)
                })

    return jsonify({
        "vehicles_detected": len(vehicles) > 0,
        "num_vehicles": len(vehicles),
        "vehicles": vehicles
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'Backend is running!', 
        'message': 'Vehicle detection API is ready',
        'model': 'YOLOv8n'
    })

if __name__ == '__main__':
    print("Starting Vehicle Detection Backend with YOLOv8...")
    print("Backend will be available at: http://localhost:5000")
    print("Allowed origins: http://localhost:5173")
    app.run(debug=True, port=5000)
