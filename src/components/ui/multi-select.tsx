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
    onSearch,
}) => {
    const [open, setOpen] = React.useState(false);

    // 🔹 internal cache for selected options
    const [selectedMap, setSelectedMap] = React.useState<
        Record<string, Option>
    >({});

    // 🔹 whenever options or value change, reconcile cache
    React.useEffect(() => {
        setSelectedMap(prev => {
            const next = { ...prev };

            // add/update from options
            options.forEach(opt => {
                if (value.includes(opt.value)) {
                    next[opt.value] = opt;
                }
            });

            // remove unselected
            Object.keys(next).forEach(key => {
                if (!value.includes(key)) {
                    delete next[key];
                }
            });

            return next;
        });
    }, [options, value]);

    const selectedOptions = Object.values(selectedMap);

    const toggle = (opt: Option) => {
        if (value.includes(opt.value)) {
            onChange(value.filter(v => v !== opt.value));
        } else {
            onChange([...value, opt.value]);
        }
    };

    const remove = (val: string) => {
        onChange(value.filter(v => v !== val));
    };

    return (
        <div className="w-full space-y-2">
            {/* Selected chips */}
            <div className="min-h-[44px] rounded-md border px-2 py-2 flex flex-wrap gap-1 bg-background">
                {selectedOptions.length === 0 && (
                    <span className="text-muted-foreground text-sm">
                        {placeholder}
                    </span>
                )}

                {selectedOptions.map(opt => (
                    <Badge
                        key={opt.value}
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        {opt.label}
                        <X
                            className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                            onClick={() => remove(opt.value)}
                        />
                    </Badge>
                ))}
            </div>

            {/* Search dropdown */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className="w-full justify-start"
                    >
                        Search topics
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search..."
                            onValueChange={(text) => onSearch?.(text)}
                        />

                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options.map(opt => {
                                    const checked = value.includes(opt.value);
                                    return (
                                        <CommandItem
                                            key={opt.value}
                                            onSelect={() => toggle(opt)}
                                            className="flex justify-between"
                                        >
                                            {opt.label}
                                            {checked && <Check className="h-4 w-4" />}
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

