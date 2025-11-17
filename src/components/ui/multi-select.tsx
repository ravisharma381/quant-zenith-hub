import * as React from "react";
import { Check, X } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    onSearch?: (text: string) => void; // NEW
    placeholder?: string;
    disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select items...",
    disabled,
    onSearch
}) => {
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const toggleValue = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    const handleRemove = (val: string) => {
        onChange(value.filter((v) => v !== val));
    };

    const selectedOptions = options.filter((opt) => value.includes(opt.value));

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal text-left"
                        disabled={disabled}
                    >
                        {value.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {selectedOptions.map((item) => (
                                    <Badge
                                        key={item.value}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        {item.label}
                                        <X
                                            className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(item.value);
                                            }}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            ref={inputRef}
                            placeholder="Search..."
                            className="h-9"
                            onValueChange={(text) => onSearch?.(text)}
                        />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((opt) => {
                                    const selected = value.includes(opt.value);
                                    return (
                                        <CommandItem
                                            key={opt.value}
                                            onSelect={() => toggleValue(opt.value)}
                                            className="flex justify-between"
                                        >
                                            {opt.label}
                                            {selected && <Check className="h-4 w-4 text-primary" />}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
