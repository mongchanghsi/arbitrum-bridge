type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
};

const AmountInput = ({ value, onChange, isError }: AmountInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (/^\d*\.?\d{0,6}$/.test(input)) {
      onChange(input);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="0.000000"
      inputMode="decimal"
      className={`w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition
        ${
          isError
            ? "border border-red-400 focus:ring-2 focus:ring-red-400/40 bg-red-500/10"
            : "border border-white/15 bg-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/15"
        }
      `}
    />
  );
};

export default AmountInput;
