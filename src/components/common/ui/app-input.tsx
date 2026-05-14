import type { InputHTMLAttributes } from "react";

type AppInputProps = InputHTMLAttributes<HTMLInputElement>;

export function AppInput({ className = "", ...props }: AppInputProps) {
  return (
    <input
      className={`w-full rounded-[10px] border border-gray-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#3ba6f1] focus:ring-2 focus:ring-[#c1e1f7] ${className}`}
      {...props}
    />
  );
}
