import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Building2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Location } from '../types';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  locations: Location[];
  onLocationClick: (id: string) => void;
}

export function CalendarView({ locations, onLocationClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getLocationsForDay = (day: Date) => {
    return locations.filter(loc => {
      if (!loc.nextDueDate) return false;
      try {
        return isSameDay(parseISO(loc.nextDueDate), day);
      } catch (e) {
        return false;
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-slate-900 italic serif">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center gap-1">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span>Overdue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>Due Soon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/30">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          const dayLocations = getLocationsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={idx} 
              className={cn(
                "min-h-[120px] p-2 border-r border-b border-slate-100 transition-colors",
                !isCurrentMonth ? "bg-slate-50/50" : "bg-white",
                isToday && "bg-[#007AFF]/5"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                  isToday ? "bg-[#007AFF] text-white" : "text-slate-400",
                  !isCurrentMonth && "opacity-30"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-1">
                {dayLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => onLocationClick(loc.id)}
                    className={cn(
                      "w-full text-left p-1.5 rounded-lg border text-[10px] font-bold transition-all truncate group relative",
                      loc.status === 'Active' ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                      loc.status === 'Due Soon' ? "bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100" :
                      "bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <Building2 size={10} />
                      <span className="truncate">{loc.name}</span>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-48 p-2 bg-slate-900 text-white rounded-lg shadow-xl pointer-events-none">
                      <div className="text-[10px] font-bold mb-1">{loc.name}</div>
                      <div className="text-[9px] opacity-70 mb-2">{loc.city}, {loc.state}</div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-1">
                        <span className="text-[8px] uppercase tracking-wider">Amount</span>
                        <span className="text-[9px] font-bold">₹{loc.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
