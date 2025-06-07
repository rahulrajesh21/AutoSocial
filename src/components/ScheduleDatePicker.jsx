import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';


const ScheduleDatePicker= ({
  date,
  time,
  onDateChange,
  onTimeChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5" />
          Schedule Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-primary",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent  className="w-auto p-3 bg-borderColor border text-white border-[#27272A] rounded-lg"
  align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        {date && time && (
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Scheduled for:</p>
            <p className="font-medium text-foreground">
              {format(date, "EEEE, MMMM do, yyyy")} at {time}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleDatePicker;
