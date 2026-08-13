import time
import json
import random
import os

# Animal profiles matching the dashboard data
ANIMALS = [
    {"id": "EL-001", "name": "Tembo", "species": "Elephant", "location": "North Region, Sector 1", "normal_hr": (35, 50), "stressed_hr": (55, 80)},
    {"id": "LI-002", "name": "Simba", "species": "Lion", "location": "East Region, Sector 5", "normal_hr": (60, 80), "stressed_hr": (90, 140)},
    {"id": "RH-003", "name": "Kifaru", "species": "Rhino", "location": "South Region, Sector 3", "normal_hr": (35, 50), "stressed_hr": (55, 75)},
    {"id": "TI-004", "name": "Raja", "species": "Tiger", "location": "West Region, Sector 8", "normal_hr": (60, 80), "stressed_hr": (110, 160)},
    {"id": "GO-005", "name": "Zuri", "species": "Gorilla", "location": "North Region, Sector 2", "normal_hr": (60, 80), "stressed_hr": (90, 130)},
]

def simulate_animal_data():
    """Generate simulated sensor data for all tracked animals every 2 seconds."""
    cycle = 0
    while True:
        readings = []
        for animal in ANIMALS:
            # ~20% chance of stress event per animal
            is_stressed = random.random() > 0.8
            is_critical = is_stressed and random.random() > 0.7  # ~6% chance critical

            if is_critical:
                status = "Critical"
                heart_rate = random.randint(animal["stressed_hr"][0] + 20, animal["stressed_hr"][1] + 30)
                body_temp = round(random.uniform(39.5, 41.0), 1)
                stress_level = random.randint(75, 100)
            elif is_stressed:
                status = "High Stress/Threat"
                heart_rate = random.randint(*animal["stressed_hr"])
                body_temp = round(random.uniform(38.5, 39.5), 1)
                stress_level = random.randint(50, 80)
            else:
                status = "Normal"
                heart_rate = random.randint(*animal["normal_hr"])
                body_temp = round(random.uniform(36.5, 38.0), 1)
                stress_level = random.randint(5, 30)

            reading = {
                "animal_id": animal["id"],
                "name": animal["name"],
                "species": animal["species"],
                "location": animal["location"],
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "heart_rate": heart_rate,
                "body_temp": body_temp,
                "stress_level": stress_level,
                "status": status,
                "battery_level": f"{random.randint(60, 100)}%",
                "signal_strength": f"{random.randint(70, 100)}%",
                "gps_accuracy": f"{round(random.uniform(1.0, 5.0), 1)}m",
            }
            readings.append(reading)

        payload = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "cycle": cycle,
            "total_animals": len(readings),
            "alerts": sum(1 for r in readings if r["status"] != "Normal"),
            "readings": readings,
        }

        # Write to sensor_data.json in project public directory
        output_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'sensor_data.json')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(payload, f, indent=2)

        statuses = [r["status"] for r in readings]
        alert_count = sum(1 for s in statuses if s != "Normal")
        print(f"[Cycle {cycle}] Generated {len(readings)} readings | {alert_count} alerts | {time.strftime('%H:%M:%S')}")
        for r in readings:
            if r["status"] != "Normal":
                print(f"  ALERT: {r['name']} ({r['animal_id']}) - {r['status']} | HR: {r['heart_rate']}bpm | Stress: {r['stress_level']}%")

        cycle += 1
        time.sleep(2)

if __name__ == "__main__":
    print("W.A.T.C.H. Sensor Simulation Started")
    print("=" * 50)
    print("Generating sensor data every 2 seconds...")
    print("Output: public/sensor_data.json")
    print("=" * 50)
    simulate_animal_data()
