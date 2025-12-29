import { Eye, EyeOff } from "lucide-react";

type PasswordToggleButtonProps = {
  isVisible: boolean;
  onToggle: () => void;
};

const PasswordToggleButton = ({
  isVisible,
  onToggle,
}: PasswordToggleButtonProps) => {
  return (
    <button
      type="button"
      title={isVisible ? "Hide" : "Show"}
      onClick={onToggle}
      className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-(--text-clr)"
    >
      {isVisible ? <EyeOff /> : <Eye />}
    </button>
  );
};

export default PasswordToggleButton;
