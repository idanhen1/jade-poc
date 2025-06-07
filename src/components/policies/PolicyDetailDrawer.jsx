
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

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

const DOMAIN_COLORS = {
  cloud: "bg-blue-100 text-blue-800",
  saas: "bg-purple-100 text-purple-800",
  infra: "bg-orange-100 text-orange-800",
  custom: "bg-gray-100 text-gray-800"
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

// Sample data for charts
const generateActivityData = (days = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    data.push({
      date: format(date, 'MMM d'),
      triggered: Math.floor(Math.random() * 5),
      approved: Math.floor(Math.random() * 3),
      denied: Math.floor(Math.random() * 2),
    });
  }
  return data;
};

const generateApprovalTimeData = () => {
  return [
    { name: "< 5 min", value: 45 },
    { name: "5-15 min", value: 30 },
    { name: "15-30 min", value: 15 },
    { name: "30+ min", value: 10 }
  ];
};

const generateApproverResponseData = () => {
  return [
    { name: "Approved", value: 75 },
    { name: "Denied", value: 15 },
    { name: "Expired", value: 10 }
  ];
};

export default function PolicyDetailDrawer({ open, onClose, policy, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState(defaultPolicy);
  const [activeTab, setActiveTab] = useState("details");
  const [activityData] = useState(generateActivityData());
  const [approvalTimeData] = useState(generateApprovalTimeData());
  const [approverResponseData] = useState(generateApproverResponseData());

  useEffect(() => {
    if (policy) {
      setEditedPolicy({
        ...defaultPolicy,
        ...policy,
        actions_covered: policy.actions_covered || [],
        identities_covered: policy.identities_covered || []
      });
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
      [field]: value || '' // Provide default empty string
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
    return (
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activityData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="triggered" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Triggered"
            />
            <Area 
              type="monotone" 
              dataKey="approved" 
              stackId="2"
              stroke="#4ade80" 
              fill="#4ade80" 
              name="Approved"
            />
            <Area 
              type="monotone" 
              dataKey="denied" 
              stackId="2"
              stroke="#f87171" 
              fill="#f87171" 
              name="Denied"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderApprovalTimeChart = () => {
    const COLORS = ['#4ade80', '#60a5fa', '#fbbf24', '#f87171'];

    return (
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={approvalTimeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {approvalTimeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderApproverResponseChart = () => {
    const COLORS = ['#4ade80', '#f87171', '#fbbf24'];

    return (
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={approverResponseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {approverResponseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
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
      <SheetContent className="w-[800px] max-w-[100vw] overflow-y-auto max-h-screen p-6">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Policy Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-6 grid w-full grid-cols-3">
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
                        <Badge className={`${editedPolicy.domain ? DOMAIN_COLORS[editedPolicy.domain] : 'bg-gray-100'}`}>
                          {editedPolicy.domain 
                            ? editedPolicy.domain.charAt(0).toUpperCase() + editedPolicy.domain.slice(1) 
                            : 'Not Set'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Scope</Label>
                      <div className="mt-1">
                        <Badge className={`${editedPolicy.scope ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}>
                          {editedPolicy.scope 
                            ? editedPolicy.scope.charAt(0).toUpperCase() + editedPolicy.scope.slice(1) 
                            : 'Not Set'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Created By</Label>
                    <p className="mt-1 font-medium">{editedPolicy.created_by || 'System'}</p>
                  </div>
                  
                  {renderMetricsCards()}
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Activity Over Time</CardTitle>
                  <CardDescription>Policy trigger and approval activity for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderActivityChart()}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Response Time Distribution</CardTitle>
                    <CardDescription>How quickly approvals are processed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderApprovalTimeChart()}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Approver Responses</CardTitle>
                    <CardDescription>Outcome of approval requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderApproverResponseChart()}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-start gap-4 p-3 border-b last:border-0">
                        <div className={`p-2 rounded-full ${
                          item % 3 === 0 ? 'bg-red-100' : 
                          item % 3 === 1 ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {item % 3 === 0 ? (
                            <X className="w-4 h-4 text-red-600" />
                          ) : item % 3 === 1 ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {item % 3 === 0 ? 'Request Denied' : 
                             item % 3 === 1 ? 'Request Approved' : 
                             'Pending Approval'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item % 3 === 0 ? 'John Smith denied "Delete S3 Bucket" request from Sarah Johnson' : 
                             item % 3 === 1 ? 'David Miller approved "Modify IAM Role" request from Alex Wong' : 
                             'Waiting for approval: "Grant Admin Access" request from Mike Thompson'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(new Date().setHours(new Date().getHours() - item * 8)), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
