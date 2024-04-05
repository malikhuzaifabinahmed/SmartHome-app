"use client";
import MyButton, { myButtonVariants } from "@/components/ui/MyButton";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useDeviceStore } from "@/stores/DeviceStore";

export default function AddDevice() {
  const [selectedValue, setSelectedValue] = useState();
  const setSelectedDevice = useDeviceStore((state) => state.setSelectedDevice);
  const selectedDevice = useDeviceStore((state) => state.selectedDevice);

  return (
    <Dialog>
      <DialogTrigger
        className={cn(myButtonVariants(), "flex gap-5 ml-auto self-end")}
      >
        Add New Device <PlusCircle className="  size-5 active:scale-95 " />{" "}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select from available devices</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <Select
            onValueChange={(selectedDevice) => {
              setSelectedValue(selectedDevice);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Device A" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dadf">Device A</SelectItem>
              <SelectItem value="dark">Device B</SelectItem>
              <SelectItem value="system">Device C</SelectItem>
            </SelectContent>
          </Select>
        </DialogDescription>
        <DialogFooter>
          <DialogClose
            onClick={() => {
              setSelectedDevice(selectedValue);
            }}
            asChild={true}
          >
            <MyButton htmlFor="dialog">Add</MyButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
