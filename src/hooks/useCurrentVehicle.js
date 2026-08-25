import { useParams } from "react-router";
import { useVehicleStore } from "../stores";

export function useCurrentVehicle() {
  const { vehicleId } = useParams();
  const vehicleStore = useVehicleStore();

  const vehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => v._id === vehicleId)
    : vehicleStore.activeVehicle;

  const currentVehicleId = vehicle?._id || vehicleId;
  const isVehicleLoading =
    vehicleStore.isLoading && vehicleStore.vehicles.length === 0;
  const hasNoVehicle = !isVehicleLoading && !vehicle;

  return {
    vehicle,
    vehicleId: currentVehicleId,
    isVehicleLoading,
    hasNoVehicle,
    vehicleStore,
  };
}

export default useCurrentVehicle;
