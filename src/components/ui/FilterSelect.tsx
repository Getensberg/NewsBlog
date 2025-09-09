'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

type FilterSelectProps = {
  value: string;               // текущее значение ("all" | "category1" | ...)
  onChange: (v: string) => void;
  options: string[];           // ["all","category1","category2",...]
  placeholder?: string;
  className?: string;          // чтобы можно было переопределять ширину/стили
};

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Choose Category",
  className = "w-[180px]",
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
