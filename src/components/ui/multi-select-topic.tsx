import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (values: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange }) => {
    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="border rounded-md p-3 max-h-56 overflow-y-auto space-y-2">
            {options.length === 0 && <p className="text-sm text-muted-foreground">No topics available</p>}
            {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={selected.includes(opt.value)}
                        onCheckedChange={() => toggle(opt.value)}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
};
