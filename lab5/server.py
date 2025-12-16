from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = 'lamps_data.json'

initial_lamps = [
    {"id": 1, "type": "LED Ceiling", "power": 18, "ledCount": 4, "manufacturer": "Philips", "price": 50},
    {"id": 2, "type": "Desk Lamp", "power": 12, "ledCount": 2, "manufacturer": "IKEA", "price": 30},
    {"id": 3, "type": "Floor Lamp", "power": 25, "ledCount": 6, "manufacturer": "Osram", "price": 80},
    {"id": 4, "type": "Pendant Lamp", "power": 20, "ledCount": 3, "manufacturer": "Xiaomi", "price": 60},
    {"id": 5, "type": "Wall Lamp", "power": 15, "ledCount": 1, "manufacturer": "Philips", "price": 40}
]

def read_lamps():
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error reading lamps: {e}")
    return initial_lamps.copy()

def write_lamps(lamps):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(lamps, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error writing lamps: {e}")
        return False

if not os.path.exists(DATA_FILE):
    write_lamps(initial_lamps)

@app.route('/api/lamps', methods=['GET'])
def get_lamps():
    lamps = read_lamps()

    sort_by = request.args.get('sort_by')
    order = request.args.get('order', 'asc')

    if sort_by == 'price':
        if order == 'desc':
            lamps.sort(key=lambda x: x['price'], reverse=True)
        else:
            lamps.sort(key=lambda x: x['price'])
    
    search = request.args.get('search')
    if search:
        search = search.lower()
        lamps = [lamp for lamp in lamps if 
                search in lamp['type'].lower() or 
                search in lamp['manufacturer'].lower()]
    
    return jsonify(lamps)

@app.route('/api/lamps/total-price', methods=['GET'])
def get_total_price():
    lamps = read_lamps()
    total = sum(lamp['price'] for lamp in lamps)
    return jsonify({"total_price": total})

@app.route('/api/lamps/<int:lamp_id>', methods=['GET'])
def get_lamp(lamp_id):
    lamps = read_lamps()
    lamp = next((l for l in lamps if l['id'] == lamp_id), None)
    if lamp:
        return jsonify(lamp)
    return jsonify({"error": "Lamp not found"}), 404

@app.route('/api/lamps', methods=['POST'])
def create_lamp():
    lamps = read_lamps()
    
    new_id = max([l['id'] for l in lamps]) + 1 if lamps else 1
    
    new_lamp = {
        "id": new_id,
        "type": request.json.get('type'),
        "manufacturer": request.json.get('manufacturer'),
        "power": request.json.get('power'),
        "ledCount": request.json.get('ledCount'),
        "price": request.json.get('price')
    }
    
    lamps.append(new_lamp)
    
    if write_lamps(lamps):
        return jsonify(new_lamp), 201
    else:
        return jsonify({"error": "Failed to create lamp"}), 500

@app.route('/api/lamps/<int:lamp_id>', methods=['PUT'])
def update_lamp(lamp_id):
    lamps = read_lamps()
    
    for i, lamp in enumerate(lamps):
        if lamp['id'] == lamp_id:
            updated_lamp = {
                "id": lamp_id,
                "type": request.json.get('type', lamp['type']),
                "manufacturer": request.json.get('manufacturer', lamp['manufacturer']),
                "power": request.json.get('power', lamp['power']),
                "ledCount": request.json.get('ledCount', lamp['ledCount']),
                "price": request.json.get('price', lamp['price'])
            }
            lamps[i] = updated_lamp
            
            if write_lamps(lamps):
                return jsonify(updated_lamp)
            else:
                return jsonify({"error": "Failed to update lamp"}), 500
    
    return jsonify({"error": "Lamp not found"}), 404

@app.route('/api/lamps/<int:lamp_id>', methods=['DELETE'])
def delete_lamp(lamp_id):
    lamps = read_lamps()
    
    for i, lamp in enumerate(lamps):
        if lamp['id'] == lamp_id:
            deleted_lamp = lamps.pop(i)
            
            if write_lamps(lamps):
                return jsonify(deleted_lamp)
            else:
                return jsonify({"error": "Failed to delete lamp"}), 500
    
    return jsonify({"error": "Lamp not found"}), 404

@app.route('/')
def home():
    return "Flask server is working! Visit /api/lamps to see lamps data"

if __name__ == '__main__':
    app.run(debug=True, port=3000)