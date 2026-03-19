import type { AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";
import PasswordToggleButton from "./PasswordToggleButton";

type FormInputFieldProps = {
  field: AnyFieldApi;
  type: React.HTMLInputTypeAttribute;
  label: string;
  Icon?: React.ElementType;
};

const FormInputField = ({ field, type, label, Icon }: FormInputFieldProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {Icon && (
          <Icon className="absolute top-1/2 left-2 -translate-y-1/2 text-(--text-clr)/60" />
        )}
        <input
          type={type === "password" && isShowPassword ? "text" : type}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder=""
          required
          className="peer border border-(--text-clr)/60 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
        />
        <label
          htmlFor={field.name}
          className="absolute top-1/2 left-9 -translate-y-1/2 
                            peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
                            peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
        >
          {label}
        </label>
        {type === "password" && (
          <PasswordToggleButton
            isVisible={isShowPassword}
            onToggle={() => setIsShowPassword((prev) => !prev)}
          />
        )}
      </div>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <em className="text-red-500 text-sm text-left">
          {field.state.meta.errors.map((err) => err?.message).join(", ")}
        </em>
      )}
    </div>
  );
};

export default FormInputField;
