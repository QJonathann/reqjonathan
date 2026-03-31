
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"
import { format, addMonths, addYears, subMonths, subYears, isValid } from "date-fns"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0 w-full", className)}
      locale={pl}
      weekStartsOn={1}
      classNames={{
        months: "flex flex-col space-y-0 w-full",
        month: "space-y-0 w-full",
        month_caption: "relative w-full h-20 border-b border-gray-200 bg-white",        caption_label: "hidden", 
        nav: "absolute inset-0 flex items-center justify-between px-4 z-10 w-full h-full",        month_grid: "w-full border-collapse",
        weekdays: "flex bg-gray-50 border-b border-gray-200 w-full",
        weekday: "text-gray-900 w-full font-bold text-[10px] uppercase py-4 text-center border-r last:border-r-0 border-gray-200",
        week: "flex w-full border-b last:border-b-0 border-gray-100",
        day: "h-12 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20 border-r last:border-r-0 border-gray-100",
        day_button: cn(
          "h-full w-full p-0 font-medium transition-colors hover:bg-gray-50 text-gray-900 aria-selected:text-white"
        ),
        selected: "bg-primary text-white hover:bg-primary focus:bg-primary rounded-none shadow-none",
        today: "border-2 border-primary text-primary font-bold bg-primary/5 shadow-inner",
        outside: "text-gray-300 opacity-50",
        disabled: "text-gray-100 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Nav: () => {
          const { goToMonth, currentMonth } = useNavigation();
          
          if (!currentMonth || !isValid(currentMonth)) return null;

          const handlePrevYear = (e: React.MouseEvent) => { e.preventDefault(); goToMonth(subYears(currentMonth, 1)); };
          const handlePrevMonth = (e: React.MouseEvent) => { e.preventDefault(); goToMonth(subMonths(currentMonth, 1)); };
          const handleNextMonth = (e: React.MouseEvent) => { e.preventDefault(); goToMonth(addMonths(currentMonth, 1)); };
          const handleNextYear = (e: React.MouseEvent) => { e.preventDefault(); goToMonth(addYears(currentMonth, 1)); };

          return (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <button type="button" onClick={handlePrevYear} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">
                  {format(currentMonth, "MMMM", { locale: pl })}
                </span>
                <span className="text-[10px] font-bold text-gray-400 leading-none">
                  {format(currentMonth, "yyyy", { locale: pl })}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={handleNextYear} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
