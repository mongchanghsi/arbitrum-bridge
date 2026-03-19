type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const AmountInput = ({ value, onChange }: AmountInputProps) => {
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
      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md"
    />
  );
};

export default AmountInput;
