import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  User, 
  BarChart3, 
  Shield,
  MapPin,
  X,
  Tag
} from "lucide-react";
import { format } from "date-fns";

// Domain colors
const DOMAIN_COLORS = {
  cloud: "bg-blue-100 text-blue-800",
  saas: "bg-purple-100 text-purple-800",
  on_prem: "bg-green-100 text-green-800",
  code: "bg-yellow-100 text-yellow-800",
  database: "bg-orange-100 text-orange-800",
  identity: "bg-indigo-100 text-indigo-800"
};

// Risk level colors
const RISK_LEVEL_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

// Status colors
const STATUS_COLORS = {
  controlled: "bg-green-100 text-green-800",
  uncontrolled: "bg-red-100 text-red-800"
};

export default function ActionDetailDrawer({ open, onClose, action, onApplyControl }) {
  if (!action || !open) return null;

  // Calculate risk percentages for visualization
  const totalRiskCount = action.low_risk_count + action.medium_risk_count + action.high_risk_count;
  const lowRiskPercent = Math.round((action.low_risk_count / totalRiskCount) * 100) || 0;
  const mediumRiskPercent = Math.round((action.medium_risk_count / totalRiskCount) * 100) || 0;
  const highRiskPercent = Math.round((action.high_risk_count / totalRiskCount) * 100) || 0;

  return (
    <div className={`${open ? 'block' : 'hidden'} fixed inset-0 z-50 bg-black/50`}>
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[10px] border bg-white animate-in slide-in-from-bottom">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-200" />
        
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl">
            {/* Header */}
            <div className="grid gap-1.5 p-4 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{action.name}</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={DOMAIN_COLORS[action.domain]}>
                  {action.domain.charAt(0).toUpperCase() + action.domain.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                </Badge>
                <Badge className={RISK_LEVEL_COLORS[action.risk_level]}>
                  {action.risk_level.charAt(0).toUpperCase() + action.risk_level.slice(1)}
                </Badge>
                <Badge className={STATUS_COLORS[action.status]}>
                  {action.status === 'controlled' ? 'Controlled' : 'Uncontrolled'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Data source: <span className="font-medium">{action.data_source}</span>
              </p>
            </div>

            <div className="p-4 space-y-6">
              {/* Action Statistics */}
              <section>
                <h3 className="text-lg font-medium mb-4">Action Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Frequency</p>
                      <p className="font-medium">{action.frequency.toFixed(1)} times/month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Risk Score</p>
                      <p className="font-medium">{action.risk_score}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">First Seen</p>
                      <p className="font-medium">{format(new Date(action.first_seen), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Last Seen</p>
                      <p className="font-medium">{format(new Date(action.last_seen), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Last Performed By</p>
                      <p className="font-medium">{action.performed_by}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{action.location}</p>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Risk Analysis */}
              <section>
                <h3 className="text-lg font-medium mb-4">Risk Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Low Risk</span>
                      <span className="text-sm text-gray-500">{action.low_risk_count} occurrences ({lowRiskPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${lowRiskPercent}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Medium Risk</span>
                      <span className="text-sm text-gray-500">{action.medium_risk_count} occurrences ({mediumRiskPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${mediumRiskPercent}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">High Risk</span>
                      <span className="text-sm text-gray-500">{action.high_risk_count} occurrences ({highRiskPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${highRiskPercent}%` }}></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 italic">
                    This action has been performed {totalRiskCount} times with varying risk levels based on context.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Tags */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Tags</h3>
                  <Button variant="outline" size="sm" className="h-8">
                    <Tag className="w-4 h-4 mr-1" /> Edit Tags
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {action.tags && action.tags.length > 0 ? (
                    action.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tags added yet</p>
                  )}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-auto flex flex-col gap-2 p-4 border-t">
              {action.status === 'uncontrolled' ? (
                <Button 
                  onClick={() => {
                    onClose();
                    onApplyControl(action);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Apply Control
                </Button>
              ) : (
                <Button variant="outline" className="border-green-600 text-green-600">
                  <Shield className="w-4 h-4 mr-2" />
                  View Control Policy
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}