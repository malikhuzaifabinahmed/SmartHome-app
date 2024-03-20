import { create } from "zustand";

export const useDeviceStore = create((set) => ({
  selectedDevice: null,
  setSelectedDevice: (newDevice) => set({ selectedDevice: newDevice }),
}));
