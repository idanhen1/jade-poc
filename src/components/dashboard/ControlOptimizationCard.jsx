
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Bot, ArrowUpRight, AlertTriangle } from "lucide-react";

export default function ControlOptimizationCard({ type, data, onClick }) {
  const renderSuggestion = (suggestion) => {
    const icons = {
      'add_approvers': <Users className="w-4 h-4" />,
      'adjust_quorum': <Users className="w-4 h-4" />,
      'use_ai': <Bot className="w-4 h-4" />,
      'disable': <AlertTriangle className="w-4 h-4" />,
      'rescope': <ArrowUpRight className="w-4 h-4" />
    };

    return (
      <Button 
        key={suggestion.type}
        variant="outline" 
        className="flex items-center gap-2 text-sm"
        onClick={(e) => {
          e.stopPropagation();
          suggestion.onClick();
        }}
      >
        {icons[suggestion.type]}
        {suggestion.text}
      </Button>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {type === 'non_optimized' ? 'Non-Optimized Controls' : 'Unused Controls'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              {type === 'non_optimized' ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.avg_time}h
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  {item.last_trigger} days ago
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {item.suggestions.map(renderSuggestion)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
