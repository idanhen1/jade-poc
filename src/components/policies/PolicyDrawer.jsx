import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { 
  Shield, 
  Users, 
  Activity, 
  X, 
  Clock, 
  Check, 
  PlayCircle, 
  BarChart3, 
  Trash2,
  CalendarClock,
  User,
  Zap,
  Settings,
  Plus,
  Tag,
  AlertTriangle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CONTROL_TYPE_COLORS = {
  mpa: "bg-blue-100 text-blue-800",
  mfa: "bg-purple-100 text-purple-800",
  ai_approver: "bg-green-100 text-green-800",
  notification: "bg-yellow-100 text-yellow-800",
  alert: "bg-orange-100 text-orange-800"
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  disabled: "bg-gray-100 text-gray-600"
};

const defaultPolicy = {
  name: '',
  description: '',
  status: 'disabled',
  control_type: '',
  actions_covered: [],
  identities_covered: [],
  domain: '',
  scope: '',
  trigger_count: 0,
  last_triggered: new Date().toISOString()
};

export default function PolicyDrawer({ open, onClose, policy, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState(defaultPolicy);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (policy) {
      setEditedPolicy(policy);
    }
  }, [policy]);

  if (!open || !policy) return null;

  const handleSave = async () => {
    if (onUpdate) {
      onUpdate(editedPolicy);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedPolicy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleStatus = () => {
    const newStatus = editedPolicy.status === 'active' ? 'disabled' : 'active';
    setEditedPolicy(prev => ({
      ...prev,
      status: newStatus
    }));
    
    // If not in edit mode, update immediately
    if (!isEditing && onUpdate) {
      onUpdate({
        ...editedPolicy,
        status: newStatus
      });
    }
  };

  const handleRemoveAction = (actionToRemove) => {
    setEditedPolicy(prev => ({
      ...prev,
      actions_covered: prev.actions_covered.filter(action => action !== actionToRemove)
    }));
  };

  const handleRemoveIdentity = (identityToRemove) => {
    setEditedPolicy(prev => ({
      ...prev,
      identities_covered: prev.identities_covered.filter(identity => identity !== identityToRemove)
    }));
  };

  const renderActivityChart = () => {
    // Placeholder for activity chart
    return (
      <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
        <span className="text-gray-500">Activity chart visualization would go here</span>
      </div>
    );
  };

  const renderMetricsCards = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Trigger Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policy.trigger_count || 0}
              <span className="text-sm font-normal text-gray-500 ml-1">events / 30d</span>
            </div>
            {policy.trigger_trend && (
              <p className={`text-sm ${policy.trigger_trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {policy.trigger_trend} vs previous period
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Avg. Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policy.avg_approval_time ? `${policy.avg_approval_time}m` : 'N/A'}
            </div>
            <p className="text-sm text-gray-500">
              {policy.control_type === 'mpa' ? 'Time to approve requests' : 
               policy.control_type === 'mfa' ? 'Authentication time' : 'Processing time'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policy.effectiveness !== undefined ? `${policy.effectiveness}%` : 'N/A'}
            </div>
            <p className="text-sm text-gray-500">
              Policy enforcement rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarClock className="w-4 h-4 mr-2" />
              Last Triggered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policy.last_triggered ? format(new Date(policy.last_triggered), 'MMM d') : 'Never'}
            </div>
            {policy.last_triggered && (
              <p className="text-sm text-gray-500">
                {format(new Date(policy.last_triggered), 'h:mm a')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPeople = () => {
    const { top_approvers = [], top_requesters = [] } = policy;
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Top Approvers</h3>
          {top_approvers.length > 0 ? (
            <div className="space-y-2">
              {top_approvers.map((approver, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{approver.name}</span>
                  </div>
                  <Badge variant="outline">{approver.count} approvals</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No approval data available</p>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Top Requesters</h3>
          {top_requesters.length > 0 ? (
            <div className="space-y-2">
              {top_requesters.map((requester, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span>{requester.name}</span>
                  </div>
                  <Badge variant="outline">{requester.count} requests</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No request data available</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[650px] sm:w-[600px] overflow-y-auto max-h-screen">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Policy Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {isEditing ? (
              <>
                <div className="space-y-4">
                  <div>
                    <Label>Policy Name</Label>
                    <Input
                      value={editedPolicy.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editedPolicy.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Control Type</Label>
                      <Select
                        value={editedPolicy.control_type}
                        onValueChange={(value) => handleInputChange('control_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select control type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpa">Multi-Party Approval</SelectItem>
                          <SelectItem value="mfa">MFA Challenge</SelectItem>
                          <SelectItem value="ai_approver">AI Approver</SelectItem>
                          <SelectItem value="notification">Notification</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Domain</Label>
                      <Select
                        value={editedPolicy.domain}
                        onValueChange={(value) => handleInputChange('domain', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cloud">Cloud</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="infra">Infrastructure</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="code">Code</SelectItem>
                          <SelectItem value="identity">Identity</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Scope</Label>
                      <Select
                        value={editedPolicy.scope}
                        onValueChange={(value) => handleInputChange('scope', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group">Group</SelectItem>
                          <SelectItem value="role">Role</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={editedPolicy.status === 'active'} 
                        onCheckedChange={() => handleInputChange('status', editedPolicy.status === 'active' ? 'disabled' : 'active')}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Actions Covered</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedPolicy.actions_covered.map((action, index) => (
                        <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                          {action}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveAction(action)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-3 w-3" /> Add Action
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Identities Covered</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedPolicy.identities_covered.map((identity, index) => (
                        <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                          {identity}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveIdentity(identity)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-3 w-3" /> Add Identity
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm text-gray-500">Policy Name</Label>
                    <h3 className="text-lg font-medium mt-1">{editedPolicy.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{editedPolicy.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm text-gray-500">Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Switch 
                          checked={editedPolicy.status === 'active'} 
                          onCheckedChange={handleToggleStatus}
                        />
                        <span className="font-medium">
                          {editedPolicy.status === 'active' ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <Badge className={CONTROL_TYPE_COLORS[editedPolicy.control_type]}>
                      {editedPolicy.control_type === 'mpa' ? 'Multi-Party Approval' : 
                       editedPolicy.control_type === 'mfa' ? 'MFA Challenge' : 
                       editedPolicy.control_type === 'ai_approver' ? 'AI Approver' : 
                       editedPolicy.control_type === 'notification' ? 'Notification' : 
                       'Alert'}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Actions Covered</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editedPolicy.actions_covered.map((action, index) => (
                        <Badge key={index} variant="secondary">{action}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Identities Covered</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editedPolicy.identities_covered.map((identity, index) => (
                        <Badge key={index} variant="secondary">{identity}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Domain</Label>
                      <div className="mt-1">
                        <Badge className={`${editedPolicy.domain ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {editedPolicy.domain ? editedPolicy.domain.charAt(0).toUpperCase() + editedPolicy.domain.slice(1) : 'Not Set'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Scope</Label>
                      <div className="mt-1">
                        <Badge className={`${editedPolicy.scope ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {editedPolicy.scope ? editedPolicy.scope.charAt(0).toUpperCase() + editedPolicy.scope.slice(1) : 'Not Set'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Created By</Label>
                    <p className="mt-1 font-medium">{editedPolicy.created_by || 'System'}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Policy</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleToggleStatus}>
                        {editedPolicy.status === 'active' ? (
                          <>
                            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                            Disable Policy
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                            Enable Policy
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Policy
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-6">
              {renderMetricsCards()}
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderActivityChart()}
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" className="w-full">
                      View Full Activity Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="people">
            <div className="space-y-6">
              {renderPeople()}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}