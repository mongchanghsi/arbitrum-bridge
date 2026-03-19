import { LucideIcon } from "lucide-react";
import { createElement } from "react";
import "./style.css";

type ButtonProps = {
  label?: string;
  icon?: LucideIcon;
  width?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  width = "200px",
  ...rest
}) => {
  return (
    <button
      className="relative flex items-center justify-center ib__container rounded bg-[#83caee] px-6 py-3 overflow-hidden hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      style={{ width }}
      {...rest}
    >
      <p
        className={`font-bold font-poppins text-white ${icon ? "ib__label" : ""}`}
      >
        {label}
      </p>
      <div className="ib__icon absolute right-0 opacity-0">
        {icon && createElement(icon)}
      </div>
    </button>
  );
};

export default Button;
