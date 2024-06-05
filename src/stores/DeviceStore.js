import { create } from "zustand";

export const useDeviceStore = create((set) => ({
  selectedDevice: null,
  setSelectedDevice: (newDevice) => set({ selectedDevice: newDevice }),
}));


export const useAssignStore = create((set) => ({
  isDisabled: false,
  setIsDisabled: (isDisabled) => set({ isDisabled: isDisabled }),
}));

