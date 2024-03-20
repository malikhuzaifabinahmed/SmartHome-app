// InputField.js

import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";
import ShowError from "../showError";

const InputField = ({
  isOnlyNumber = false,
  isPassword = false,
  isPhoneNumber = false,
  showEuro = true,
  labelClassName,
  optional = false,
  label = "Input Field",
  type = "text",
  name,
  value,
  disabled = false,
  placeholder = "Input Here",
  inputClassName = "",
  onChange = () => {},
  onBlur = () => {},
  error = "",
}) => {
  const formattedNumber = new Intl.NumberFormat().format(value);
  const handleNumericChange = (e) => {
    let localeString = e.target.value;

    const cleanedString = localeString.replace(/[^0-9.-]/g, "");
    const numberValue = parseFloat(cleanedString);

    let changehandler = onChange(name);
    e.target.value = numberValue;
    if (isNaN(numberValue)) {
      e.target.value = "";
      changehandler(e);
    }

    if (!isNaN(numberValue)) changehandler(e);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className={cn("font-rubik", labelClassName)} htmlFor={name}>
        {label}
        {optional && <div className="inline font-light">&emsp;(optional)</div>}
      </Label>

      <Input
        type={type}
        className={cn("  text-[1rem] ", inputClassName)}
        name={name}
        onChange={
          type == "number" && !isPhoneNumber && !isOnlyNumber
            ? (e) => handleNumericChange(e)
            : onChange
        }
        onBlur={onBlur}
        value={
          type == "number" && !isPhoneNumber && !isOnlyNumber
            ? value !== ""
              ? formattedNumber
              : value
            : value
        }
        placeholder={placeholder}
        disabled={disabled}
      />

      {error && <ShowError type={error} />}
    </div>
  );
};
export default InputField;
