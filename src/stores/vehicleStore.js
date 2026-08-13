import { makeAutoObservable } from "mobx";

class VehicleStore {
  vehicles = [
    {
      id: "v1",
      plateNumber: "123-45-678",
      make: "Toyota",
      model: "Corolla Hybrid",
      year: 2022,
      color: "לבן פנינה",
      fuelType: "היברידי",
      mileage: 45000,
      manualUrl: null,
      manualFileName: "toyota_corolla_manual.pdf",
      lastServiceDate: "2024-01-15",
      lastServiceMileage: 40000,
      serviceInterval: "כל 15,000 ק\"מ / שנה",
      testExpiryDate: "2025-05-20",
      insuranceExpiryDate: "2025-06-30"
    }
  ];

  activeVehicleId = "v1";

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  get activeVehicle() {
    return this.vehicles.find((v) => v.id === this.activeVehicleId) || this.vehicles[0] || null;
  }

  setActiveVehicle(id) {
    this.activeVehicleId = id;
    this.saveToStorage();
  }

  addVehicle(vehicleData) {
    const newVehicle = {
      id: `v_${Date.now()}`,
      ...vehicleData
    };
    this.vehicles.push(newVehicle);
    this.activeVehicleId = newVehicle.id;
    this.saveToStorage();
    return newVehicle;
  }

  updateVehicle(id, updatedFields) {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index !== -1) {
      this.vehicles[index] = { ...this.vehicles[index], ...updatedFields };
      this.saveToStorage();
    }
  }

  deleteVehicle(id) {
    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    if (this.activeVehicleId === id) {
      this.activeVehicleId = this.vehicles[0]?.id || null;
    }
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem("autopia_vehicles", JSON.stringify(this.vehicles));
      if (this.activeVehicleId) {
        localStorage.setItem("autopia_active_vehicle_id", this.activeVehicleId);
      }
    } catch {
      // TODO: handle storage error
    }
  }

  loadFromStorage() {
    try {
      const storedVehicles = localStorage.getItem("autopia_vehicles");
      const storedActiveId = localStorage.getItem("autopia_active_vehicle_id");
      if (storedVehicles) {
        const parsed = JSON.parse(storedVehicles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.vehicles = parsed;
        }
      }
      if (storedActiveId) {
        this.activeVehicleId = storedActiveId;
      }
    } catch {
      // TODO: handle storage load error
    }
  }
}

export const vehicleStore = new VehicleStore();
