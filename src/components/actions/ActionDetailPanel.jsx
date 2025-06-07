import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  BarChart3, 
  Shield,
  MapPin,
  AlertTriangle,
  X
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

export default function ActionDetailPanel({ open, onClose, action, onApplyControl }) {
  if (!action) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Action Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Basic info */}
          <div>
            <h2 className="text-xl font-bold mb-2">{action.name}</h2>
            <div className="flex flex-wrap gap-2 my-3">
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
            <p className="text-sm text-gray-500">
              Observed from <span className="font-medium">{action.data_source}</span>
            </p>
          </div>

          <Separator />

          {/* Action Statistics */}
          <div>
            <h3 className="text-lg font-medium mb-3">Action Statistics</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p className="font-medium">{action.frequency.toFixed(1)} times/month</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Risk Score</p>
                  <p className="font-medium">{action.risk_score}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">First Seen</p>
                  <p className="font-medium">{format(new Date(action.first_seen), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Last Seen</p>
                  <p className="font-medium">{format(new Date(action.last_seen), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Last Performed By</p>
                  <p className="font-medium">{action.performed_by}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{action.location}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Risk Assessment */}
          <div>
            <h3 className="text-lg font-medium mb-3">Risk Assessment</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                This action is considered <span className="font-semibold">{action.risk_level}</span> risk
                because it can lead to data loss, service disruption, or security compromise.
              </p>
              {action.status === 'uncontrolled' && (
                <div className="flex items-start gap-2 mt-3 text-amber-600">
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                  <p className="text-sm">This high-risk action is currently uncontrolled.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          {action.status === 'uncontrolled' && (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onApplyControl(action);
                onClose();
              }}
            >
              <Shield className="w-4 h-4 mr-2" />
              Apply Control
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}