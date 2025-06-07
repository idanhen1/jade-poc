import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ChevronRight, 
  ChevronLeft, 
  Shield, 
  Users, 
  AlertTriangle,
  Search, 
  Plus, 
  X, 
  Check, 
  Command, 
  BrainCircuit,
  Bell,
  ShieldAlert,
  ArrowRight,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample actions for multi-select
const SAMPLE_ACTIONS = [
  { name: "Delete S3 Bucket", domain: "cloud", risk: "critical", source: "AWS" },
  { name: "Modify Security Group", domain: "cloud", risk: "high", source: "AWS" },
  { name: "Grant Admin Access", domain: "identity", risk: "critical", source: "Okta" },
  { name: "Reset Admin Password", domain: "identity", risk: "high", source: "Azure AD" },
  { name: "Delete Database", domain: "database", risk: "critical", source: "MongoDB" },
  { name: "Modify Schema", domain: "database", risk: "high", source: "PostgreSQL" },
  { name: "Change Default Branch", domain: "code", risk: "medium", source: "GitHub" },
  { name: "Delete Repository", domain: "code", risk: "high", source: "GitHub" },
  { name: "Deploy to Production", domain: "infra", risk: "high", source: "Kubernetes" },
  { name: "Modify Network Security", domain: "infra", risk: "high", source: "AWS" },
];

// Sample users and groups for scope selection
const SAMPLE_USERS = [
  { id: 1, name: "John Smith", email: "john.smith@company.com" },
  { id: 2, name: "Jane Doe", email: "jane.doe@company.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@company.com" },
  { id: 4, name: "Bob Williams", email: "bob.williams@company.com" },
  { id: 5, name: "Charlie Brown", email: "charlie.brown@company.com" },
];

const SAMPLE_GROUPS = [
  { id: 1, name: "DevOps Team" },
  { id: 2, name: "Security Team" },
  { id: 3, name: "Infrastructure Team" },
  { id: 4, name: "Data Science Team" },
  { id: 5, name: "Engineering Management" },
];

const SAMPLE_ROLES = [
  { id: 1, name: "Administrator" },
  { id: 2, name: "Developer" },
  { id: 3, name: "Security Analyst" },
  { id: 4, name: "Database Admin" },
  { id: 5, name: "Network Engineer" },
];

const STEPS = [
  { id: 1, name: 'Name Policy', icon: FileText },
  { id: 2, name: 'Select Actions', icon: Command },
  { id: 3, name: 'Define Scope', icon: Users },
  { id: 4, name: 'Attach Control', icon: Shield },
  { id: 5, name: 'Review', icon: Check }
];

const RISK_LEVEL_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

const DOMAIN_COLORS = {
  cloud: "bg-blue-100 text-blue-800",
  identity: "bg-purple-100 text-purple-800",
  infra: "bg-orange-100 text-orange-800",
  database: "bg-green-100 text-green-800",
  code: "bg-yellow-100 text-yellow-800",
  saas: "bg-indigo-100 text-indigo-800",
};

export default function PolicyWizard({ open, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    actions: [],
    domain: '',
    scope: {
      users: [],
      groups: [],
      roles: [],
      environments: []
    },
    control: {
      type: 'mpa',
      approverCount: 2,
      timeLimit: 60,
      useAI: false,
      notificationChannels: ['email']
    },
    status: 'active'
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Create policy logic here
    onComplete({
      ...formData,
      // Add any additional fields needed for the policy
      created_date: new Date().toISOString(),
      trigger_count: 0,
      last_triggered: null
    });
  };

  const filteredActions = SAMPLE_ACTIONS.filter(action => 
    searchTerm === '' || 
    action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAction = (action) => {
    const isSelected = formData.actions.some(a => a.name === action.name);
    if (isSelected) {
      setFormData({
        ...formData,
        actions: formData.actions.filter(a => a.name !== action.name)
      });
    } else {
      setFormData({
        ...formData,
        actions: [...formData.actions, action]
      });
    }
  };

  const toggleUser = (user) => {
    const isSelected = formData.scope.users.some(u => u.id === user.id);
    if (isSelected) {
      setFormData({
        ...formData,
        scope: {
          ...formData.scope,
          users: formData.scope.users.filter(u => u.id !== user.id)
        }
      });
    } else {
      setFormData({
        ...formData,
        scope: {
          ...formData.scope,
          users: [...formData.scope.users, user]
        }
      });
    }
  };

  const toggleGroup = (group) => {
    const isSelected = formData.scope.groups.some(g => g.id === group.id);
    if (isSelected) {
      setFormData({
        ...formData,
        scope: {
          ...formData.scope,
          groups: formData.scope.groups.filter(g => g.id !== group.id)
        }
      });
    } else {
      setFormData({
        ...formData,
        scope: {
          ...formData.scope,
          groups: [...formData.scope.groups, group]
        }
      });
    }
  };

  const toggleRole = (role) => {
    const isSelected = formData.scope.roles.some(r => r.id === role.id);
    if (isSelected) {
      setFormData({
        ...formData,
        scope: {
          ...formData.scope,
          roles: formData.scope.roles.filter(r => r.id !== role.id)
        }
      });
    } else {
      setFormData({
        ...formData,
        scope: {
          ...formData.scope,
          roles: [...formData.scope.roles, role]
        }
      });
    }
  };

  const toggleNotificationChannel = (channel) => {
    const channels = formData.control.notificationChannels;
    if (channels.includes(channel)) {
      setFormData({
        ...formData, 
        control: {
          ...formData.control,
          notificationChannels: channels.filter(c => c !== channel)
        }
      });
    } else {
      setFormData({
        ...formData, 
        control: {
          ...formData.control,
          notificationChannels: [...channels, channel]
        }
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Policy Name</Label>
              <Input
                placeholder="e.g., Critical Cloud Operations"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <p className="text-sm text-gray-500 mt-1">
                Name the policy based on what it protects
              </p>
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Describe the purpose of this policy"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="h-24"
              />
            </div>
            <div>
              <Label>Domain</Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => setFormData({...formData, domain: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud</SelectItem>
                  <SelectItem value="infra">Infrastructure</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="identity">Identity</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Choose the primary domain this policy will protect
              </p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Actions to Govern</Label>
              <p className="text-sm text-gray-500 mb-4">
                Choose which high-risk actions will be controlled by this policy
              </p>
              
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-50 p-2 border-b text-sm font-medium">
                  <div className="col-span-2">Action Name</div>
                  <div>Source</div>
                  <div>Domain</div>
                  <div>Risk Level</div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredActions.map((action, idx) => (
                    <div 
                      key={idx} 
                      className={`grid grid-cols-5 p-2 border-b last:border-0 items-center ${
                        formData.actions.some(a => a.name === action.name) 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      } cursor-pointer transition-colors`}
                      onClick={() => toggleAction(action)}
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <Checkbox 
                          checked={formData.actions.some(a => a.name === action.name)}
                          onCheckedChange={() => toggleAction(action)}
                        />
                        <span>{action.name}</span>
                      </div>
                      <div>{action.source}</div>
                      <div>
                        <Badge className={DOMAIN_COLORS[action.domain]}>
                          {action.domain}
                        </Badge>
                      </div>
                      <div>
                        <Badge className={RISK_LEVEL_COLORS[action.risk]}>
                          {action.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {filteredActions.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No actions found matching your search criteria
                    </div>
                  )}
                </div>
              </div>
              
              {formData.actions.length > 0 && (
                <div className="mt-4">
                  <Label className="mb-2 block">Selected Actions ({formData.actions.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.actions.map((action, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                        {action.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAction(action);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Define Scope</Label>
              <p className="text-sm text-gray-500 mb-4">
                Specify which users, groups, or roles this policy will apply to
              </p>
              
              <Tabs defaultValue="groups">
                <TabsList className="mb-4">
                  <TabsTrigger value="groups">Groups</TabsTrigger>
                  <TabsTrigger value="roles">Roles</TabsTrigger>
                  <TabsTrigger value="users">Individual Users</TabsTrigger>
                </TabsList>
                
                <div className="border rounded-md p-4">
                  <div value="groups" className="space-y-4">
                    <div className="mb-4 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search groups..."
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_GROUPS.map((group) => (
                        <div
                          key={group.id}
                          className={`flex items-center gap-2 p-3 border rounded-md ${
                            formData.scope.groups.some(g => g.id === group.id)
                              ? 'bg-blue-50 border-blue-200'
                              : 'hover:bg-gray-50'
                          } cursor-pointer`}
                          onClick={() => toggleGroup(group)}
                        >
                          <Checkbox
                            checked={formData.scope.groups.some(g => g.id === group.id)}
                            onCheckedChange={() => toggleGroup(group)}
                          />
                          <span>{group.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {formData.scope.groups.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Selected Groups ({formData.scope.groups.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.scope.groups.map((group) => (
                        <Badge key={group.id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                          {group.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGroup(group);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.scope.roles.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Selected Roles ({formData.scope.roles.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.scope.roles.map((role) => (
                        <Badge key={role.id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                          {role.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRole(role);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.scope.users.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Selected Users ({formData.scope.users.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.scope.users.map((user) => (
                        <Badge key={user.id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                          {user.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUser(user);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Control Type</Label>
              <p className="text-sm text-gray-500 mb-4">
                Select how this policy will govern high-risk actions
              </p>
              
              <RadioGroup
                value={formData.control.type}
                onValueChange={(value) => setFormData({
                  ...formData,
                  control: {
                    ...formData.control,
                    type: value
                  }
                })}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="mpa" id="mpa" className="peer sr-only" />
                  <Label
                    htmlFor="mpa"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 h-[140px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                  >
                    <Shield className="mb-3 h-6 w-6 text-blue-600" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">Multi-Party Approval</p>
                      <p className="text-xs text-gray-500">
                        Require approval before action completes
                      </p>
                    </div>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="mfa" id="mfa" className="peer sr-only" />
                  <Label
                    htmlFor="mfa"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 h-[140px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 [&:has([data-state=checked])]:bg-purple-50 cursor-pointer"
                  >
                    <ShieldAlert className="mb-3 h-6 w-6 text-purple-600" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">MFA Challenge</p>
                      <p className="text-xs text-gray-500">
                        Require additional authentication
                      </p>
                    </div>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="ai_approver" id="ai_approver" className="peer sr-only" />
                  <Label
                    htmlFor="ai_approver"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 h-[140px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 [&:has([data-state=checked])]:bg-green-50 cursor-pointer"
                  >
                    <BrainCircuit className="mb-3 h-6 w-6 text-green-600" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">AI Approver</p>
                      <p className="text-xs text-gray-500">
                        Intelligent automated approval
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              
              {formData.control.type === 'mpa' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label>Required Approvals</Label>
                    <Select
                      value={formData.control.approverCount.toString()}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        control: {
                          ...formData.control,
                          approverCount: parseInt(value)
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Number of approvers required" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 approver required</SelectItem>
                        <SelectItem value="2">2 approvers required</SelectItem>
                        <SelectItem value="3">3 approvers required</SelectItem>
                        <SelectItem value="4">4 approvers required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Approval Time Limit</Label>
                    <Select
                      value={formData.control.timeLimit.toString()}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        control: {
                          ...formData.control,
                          timeLimit: parseInt(value)
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Time limit for approvals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Label className="mb-2 block">Notification Channels</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={formData.control.notificationChannels.includes('email') ? 'default' : 'outline'}
                        className="gap-2"
                        onClick={() => toggleNotificationChannel('email')}
                      >
                        Email
                      </Button>
                      <Button
                        type="button"
                        variant={formData.control.notificationChannels.includes('slack') ? 'default' : 'outline'}
                        className="gap-2"
                        onClick={() => toggleNotificationChannel('slack')}
                      >
                        Slack
                      </Button>
                      <Button
                        type="button"
                        variant={formData.control.notificationChannels.includes('teams') ? 'default' : 'outline'}
                        className="gap-2"
                        onClick={() => toggleNotificationChannel('teams')}
                      >
                        Microsoft Teams
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.control.type === 'mfa' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label>MFA Type</Label>
                    <Select
                      defaultValue="totp"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select MFA type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="totp">Time-based OTP</SelectItem>
                        <SelectItem value="hardware">Hardware Key</SelectItem>
                        <SelectItem value="biometric">Biometric</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>MFA Timeout</Label>
                    <Select
                      defaultValue="5"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {formData.control.type === 'ai_approver' && (
                <div className="mt-6">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <BrainCircuit className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-green-800">Agentic AI Approver</h4>
                        <p className="text-sm text-green-700 mt-1">
                          The AI agent will analyze action context, historical patterns, and security best practices to 
                          automatically approve or deny actions. It continuously learns from your organization's behavior 
                          and adapts to new threats.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Adapts to security policies
                          </Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Reduces approval time
                          </Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            24/7 availability
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Review Your Policy</h3>
              
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle>Policy Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Policy Name</Label>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Domain</Label>
                      <Badge className={formData.domain ? DOMAIN_COLORS[formData.domain] : "bg-gray-100"}>
                        {formData.domain ? formData.domain.charAt(0).toUpperCase() + formData.domain.slice(1) : 'Not set'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Description</Label>
                    <p className="text-sm">{formData.description || 'No description provided'}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle>Actions Covered ({formData.actions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.actions.map((action, idx) => (
                      <Badge key={idx} variant="secondary">
                        {action.name}
                      </Badge>
                    ))}
                    {formData.actions.length === 0 && (
                      <p className="text-sm text-gray-500">No actions selected</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle>Scope</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">Groups</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.scope.groups.map((group) => (
                        <Badge key={group.id} variant="secondary">
                          {group.name}
                        </Badge>
                      ))}
                      {formData.scope.groups.length === 0 && (
                        <p className="text-sm text-gray-500">No groups selected</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Roles</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.scope.roles.map((role) => (
                        <Badge key={role.id} variant="secondary">
                          {role.name}
                        </Badge>
                      ))}
                      {formData.scope.roles.length === 0 && (
                        <p className="text-sm text-gray-500">No roles selected</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Users</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.scope.users.map((user) => (
                        <Badge key={user.id} variant="secondary">
                          {user.name}
                        </Badge>
                      ))}
                      {formData.scope.users.length === 0 && (
                        <p className="text-sm text-gray-500">No individual users selected</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Control Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Control Type</Label>
                      <Badge className={
                        formData.control.type === 'mpa' ? "bg-blue-100 text-blue-800" :
                        formData.control.type === 'mfa' ? "bg-purple-100 text-purple-800" :
                        "bg-green-100 text-green-800"
                      }>
                        {formData.control.type === 'mpa' ? "Multi-Party Approval" :
                         formData.control.type === 'mfa' ? "MFA Challenge" :
                         "AI Approver"}
                      </Badge>
                    </div>
                    
                    {formData.control.type === 'mpa' && (
                      <>
                        <div>
                          <Label className="text-sm text-gray-500">Required Approvals</Label>
                          <p className="font-medium">{formData.control.approverCount}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Time Limit</Label>
                          <p className="font-medium">
                            {formData.control.timeLimit < 60 ? 
                              `${formData.control.timeLimit} minutes` : 
                              `${formData.control.timeLimit / 60} hours`}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Notification Channels</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.control.notificationChannels.map((channel) => (
                              <Badge key={channel} variant="secondary">
                                {channel.charAt(0).toUpperCase() + channel.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex items-center gap-2">
                <Checkbox id="activate-policy" checked={formData.status === 'active'} onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    status: checked ? 'active' : 'disabled'
                  });
                }} />
                <Label htmlFor="activate-policy">Activate policy immediately</Label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Policy</DialogTitle>
          <DialogDescription>
            Define how high-risk actions should be governed in your environment
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Steps indicator */}
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  step.id < STEPS.length ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.id < currentStep
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : step.id === currentStep
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-300'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {step.id < STEPS.length && (
                  <div
                    className={`flex-1 h-[2px] mx-2 ${
                      step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-2 font-medium text-lg">
            {STEPS.find(s => s.id === currentStep)?.name}
          </div>

          {/* Step content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !formData.name) ||
                (currentStep === 2 && formData.actions.length === 0) ||
                (currentStep === 3 && 
                  formData.scope.groups.length === 0 && 
                  formData.scope.roles.length === 0 && 
                  formData.scope.users.length === 0)
              }
            >
              {currentStep === STEPS.length ? (
                'Create Policy'
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}