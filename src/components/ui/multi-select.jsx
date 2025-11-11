"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon, Check } from "lucide-react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";

const MultiSelectContext = createContext(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

/**
 * MultiSelect Docs: {@link: https://shadcn-extension.vercel.app/docs/multi-select}
 */

// TODO : expose the visibility of the popup

function searchForValue(source, value) {
  for (let i = 0; i < source.length; i++) {
    if (source[i].value === value.value) {
      return i;
    }
  }
  return -1;
}

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  loop = false,
  className,
  children,
  dir,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = React.useRef(null);

  const onValueChangeHandler = useCallback(
    (val) => {
      const element = searchForValue(value, val);
      if (element !== -1) {
        onValueChange(value.filter((_, index) => index !== element));
      } else {
        onValueChange([...value, val]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  const handleCreate = () => {
    if (inputValue.trim()) {
      const newOption = {
        value: inputValue.toLowerCase(),
        label: inputValue.toUpperCase(),
      };
      onValueChange(newOption);
      setInputValue("");
    }
  };

  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      const target = inputRef.current;

      if (!target) return;

      const selectionStart = target.selectionStart ?? 0;
      const selectionEnd = target.selectionEnd ?? 0;

      // If there's a selection, do nothing and let the default behavior take over
      if (selectionStart !== selectionEnd) {
        return;
      }

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex,
        );
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1;
        setActiveIndex(newIndex);
      };

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          } else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          }
          break;

        case "ArrowRight":
          if (dir === "rtl") {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          }
          break;

        case "Backspace":
        case "Delete":
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              onValueChangeHandler(value[activeIndex]);
              moveCurrent();
            } else {
              if (target.selectionStart === 0) {
                onValueChangeHandler(value[value.length - 1]);
              }
            }
          }
          break;

        case "Enter":
          setOpen(true);
          break;

        case "Escape":
          if (activeIndex !== -1) {
            setActiveIndex(-1);
          } else if (open) {
            setInputValue("");
            setOpen(false);
          }
          break;
      }
    },
    [value, activeIndex, loop, dir, onValueChangeHandler, open],
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        ref: inputRef,
        handleCreate,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn(
          "overflow-visible bg-transparent flex flex-col space-y-2",
          className,
        )}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef(
  ({ className, children, error, ...props }, ref) => {
    const { value, onValueChange, activeIndex } = useMultiSelect();

    const mousePreventDefault = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "flex overflow-x-auto overflow-y-hidden gap-1 py-2 ring-1 ring-muted  ",
          " scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent",
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
          "transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm",
          "file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          {
            " focus-within:border-ring  focus-within:ring-ring/50 focus-within:ring-[3px] ":
              activeIndex === -1,
          },
          {
            " border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20 focus-within:ring-[3px] ":
              !!error,
          },
          className,
        )}
        {...props}
      >
        {value.map((item, index) => (
          <Badge
            key={item.value}
            className={cn(
              "px-1.5 rounded-md flex items-center gap-1",
              activeIndex === index && "ring-2 ring-muted-foreground ",
            )}
            variant={"secondary"}
          >
            <span className="text-xs text-nowrap">{item.label}</span>
            <button
              aria-label={`Remove ${item} option`}
              aria-roledescription="button to remove option"
              type="button"
              onMouseDown={mousePreventDefault}
              onClick={() => onValueChange(item)}
            >
              <span className="sr-only">Remove {item.label} option</span>
              <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
            </button>
          </Badge>
        ))}
        {children}
      </div>
    );
  },
);

MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorInput = forwardRef(({ className, ...props }, ref) => {
  const {
    setOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    ref: inputRef,
  } = useMultiSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      tabIndex={0}
      ref={inputRef}
      value={inputValue}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      onBlur={() => {
        setInputValue("");
        setOpen(false);
      }}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      className={cn(
        "ml-1 placeholder:text-muted-foreground w-15 flex-grow",
        "focus-visible:border-0 focus-visible:ring-0 border-0 focus-visible:outline-0",
        className,
        activeIndex !== -1 && "caret-transparent",
      )}
    />
  );
});

MultiSelectorInput.displayName = "MultiSelectorInput";

const MultiSelectorContent = forwardRef(({ children }, ref) => {
  const { open } = useMultiSelect();
  return (
    <div ref={ref} className="relative">
      {open ? children : null}
    </div>
  );
});

MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorList = forwardRef(({ className, children }, ref) => {
  const { inputValue, handleCreate } = useMultiSelect();
  return (
    <CommandList
      ref={ref}
      className={cn(
        "p-2 flex flex-col gap-2 rounded-md scrollbar-thin scrollbar-track-transparent transition-colors scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg w-full absolute bg-background shadow-md z-10 border border-muted top-0",
        className,
      )}
    >
      {children}
      <CommandEmpty>
        <button
          onClick={handleCreate}
          className="w-full text-left px-2 py-1 hover:bg-accent rounded-md"
        >
          <span className="text-muted-foreground">Create: </span>
          <span className="font-medium">{inputValue}</span>
        </button>
      </CommandEmpty>
    </CommandList>
  );
});

MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorItem = forwardRef(
  ({ className, value, label, children, ...props }, ref) => {
    const { value: Options, onValueChange, setInputValue } = useMultiSelect();

    const mousePreventDefault = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const isIncluded =
      searchForValue(Options, {
        value: value,
        label: label,
      }) !== -1;

    return (
      <CommandItem
        ref={ref}
        {...props}
        onSelect={() => {
          onValueChange({
            value: value,
            label: label,
          });
          setInputValue("");
        }}
        className={cn(
          "rounded-md cursor-pointer px-2 py-1 transition-colors flex justify-between ",
          className,
          isIncluded && "opacity-50 cursor-default",
          props.disabled && "opacity-50 cursor-not-allowed",
        )}
        onMouseDown={mousePreventDefault}
      >
        {children}
        {isIncluded && <Check className="h-4 w-4" />}
      </CommandItem>
    );
  },
);

MultiSelectorItem.displayName = "MultiSelectorItem";

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
