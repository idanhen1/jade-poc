import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

export default function TimeRangeFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
      <Calendar className="w-4 h-4 text-gray-500" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] border-none">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1d">Last Day</SelectItem>
          <SelectItem value="7d">Last Week</SelectItem>
          <SelectItem value="30d">Last Month</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}