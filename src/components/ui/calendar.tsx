"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-6",
        caption: "flex justify-center pt-2 relative items-center w-full mb-2",
        caption_label: "text-[18px]",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-10 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-xl border-gray-300 hover:bg-amber-50 hover:border-amber-400",
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse",
        head_row: "flex gap-1 mb-2",
        head_cell:
          "text-gray-600 rounded-md w-12 text-[16px]",
        row: "flex w-full gap-1 mt-1",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-amber-50 [&:has([aria-selected].day-range-end)]:rounded-r-xl",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-xl [&:has(>.day-range-start)]:rounded-l-xl first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl"
            : "[&:has([aria-selected])]:rounded-xl",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-12 p-0 aria-selected:opacity-100 text-[18px] rounded-xl hover:bg-amber-50 hover:text-gray-900",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-amber-500 aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-amber-500 aria-selected:text-white",
        day_selected:
          "bg-amber-500 text-white hover:bg-amber-600 hover:text-white focus:bg-amber-600 focus:text-white",
        day_today: "bg-orange-100 text-gray-900 font-medium",
        day_outside:
          "day-outside text-gray-400 aria-selected:text-gray-400",
        day_disabled: "text-gray-300 opacity-50",
        day_range_middle:
          "aria-selected:bg-amber-50 aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-6", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-6", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
