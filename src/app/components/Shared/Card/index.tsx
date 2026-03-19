import React from "react";

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Card = ({ children }: IProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center px-6 py-8 backdrop-blur-md bg-white/10 rounded-2xl shadow-xl border border-white/20 max-w-md">
      {children}
    </div>
  );
};

export default Card;
