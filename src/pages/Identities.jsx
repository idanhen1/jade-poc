
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  User, 
  Users, 
  Shield, 
  Database, 
  Server, 
  Info, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Layers, 
  Activity, 
  Bot, 
  Workflow,
  Bell,
  BrainCircuit
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ControlModalContent from "@/components/actions/ControlModalContent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const RISK_LEVEL_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

const IDENTITY_TYPE_ICONS = {
  human: User,
  service: Server,
  ai_agent: Bot
};

const DOMAIN_COLORS = {
  cloud: "bg-blue-100 text-blue-800",
  saas: "bg-purple-100 text-purple-800",
  on_prem: "bg-green-100 text-green-800",
  code: "bg-yellow-100 text-yellow-800",
  database: "bg-orange-100 text-orange-800",
  identity: "bg-indigo-100 text-indigo-800"
};

// Sample identity data with human, service account and AI agent types
const SAMPLE_IDENTITIES = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    type: "human",
    subtype: "human",
    domain: "cloud",
    risk_level: "medium",
    risk_score: 65,
    control_status: "controlled",
    groups: ["DevOps", "Cloud Team"],
    roles: ["Admin", "Developer"],
    last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    activity_frequency: 25,
    peak_hours: "9 AM - 5 PM",
    top_actions: ["Create EC2 instance", "Modify security group"],
    location: "US-East",
    risk_factors: ["Regular activity patterns", "Restricted access patterns"]
  },
  { 
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@company.com",
    type: "human",
    subtype: "human",
    domain: "cloud",
    risk_level: "high",
    risk_score: 82,
    control_status: "uncontrolled",
    groups: ["Security", "Infrastructure"],
    roles: ["Admin", "Security Officer"],
    last_activity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    activity_frequency: 18,
    peak_hours: "10 AM - 6 PM",
    top_actions: ["Delete IAM user", "Attach policy to role"],
    location: "EU-West",
    risk_factors: ["Privileged access", "Access to sensitive resources"]
  },
  {
    id: 3,
    name: "Jenkins CI Pipeline",
    email: "jenkins@company.com",
    type: "non_human",
    subtype: "service",
    domain: "cloud",
    risk_level: "critical",
    risk_score: 92,
    control_status: "uncontrolled",
    groups: ["CI/CD"],
    roles: ["ServiceAccount", "Builder"],
    last_activity: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    activity_frequency: 120,
    peak_hours: "24/7",
    top_actions: ["Create S3 bucket", "Delete S3 bucket"],
    location: "US-East",
    risk_factors: ["High privileges", "Automated workflows", "Unreviewed changes"]
  },
  {
    id: 4,
    name: "Data Processor",
    email: "data.processor@company.com",
    type: "non_human",
    subtype: "service",
    domain: "database",
    risk_level: "medium",
    risk_score: 60,
    control_status: "controlled",
    groups: ["ETL", "Data"],
    roles: ["ServiceAccount", "Reader"],
    last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    activity_frequency: 48,
    peak_hours: "1 AM - 5 AM",
    top_actions: ["Start RDS instance", "Stop RDS instance"],
    location: "US-West",
    risk_factors: ["Database access", "Scheduled jobs"]
  },
  {
    id: 5,
    name: "Security Scanner",
    email: "security.scanner@company.com",
    type: "non_human",
    subtype: "service",
    domain: "security",
    risk_level: "low",
    risk_score: 30,
    control_status: "controlled",
    groups: ["Security"],
    roles: ["Scanner", "Reader"],
    last_activity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    activity_frequency: 24,
    peak_hours: "Random",
    top_actions: ["Create access key", "Delete access key"],
    location: "Global",
    risk_factors: ["Regular scanning patterns"]
  },
  {
    id: 6,
    name: "AI Code Review Assistant",
    email: "ai.code.review@company.com",
    type: "non_human",
    subtype: "ai_agent",
    domain: "code",
    risk_level: "high",
    risk_score: 75,
    control_status: "controlled",
    groups: ["Development"],
    roles: ["Reviewer", "Reader"],
    last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    activity_frequency: 85,
    peak_hours: "Working hours",
    top_actions: ["Access code repositories", "Comment on PRs"],
    location: "Global",
    risk_factors: ["Access to secrets", "Code analysis capabilities"]
  },
  {
    id: 7,
    name: "Security AI Agent",
    email: "ai.security@company.com",
    type: "non_human",
    subtype: "ai_agent",
    domain: "security",
    risk_level: "critical",
    risk_score: 88,
    control_status: "controlled",
    groups: ["Security", "AI"],
    roles: ["Analyst", "Responder"],
    last_activity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    activity_frequency: 95,
    peak_hours: "24/7",
    top_actions: ["Analyze threats", "Recommend mitigations"],
    location: "Global",
    risk_factors: ["High privileges", "Automated response actions"]
  },
  {
    id: 8,
    name: "Bob Williams",
    email: "bob.williams@company.com",
    type: "human",
    subtype: "human",
    domain: "cloud",
    risk_level: "low",
    risk_score: 35,
    control_status: "controlled",
    groups: ["Development"],
    roles: ["Developer"],
    last_activity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    activity_frequency: 10,
    peak_hours: "10 AM - 4 PM",
    top_actions: ["Create EC2 instance"],
    location: "US-Central",
    risk_factors: ["Limited privileges"]
  },
  {
    id: 9,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    type: "human",
    subtype: "human",
    domain: "database",
    risk_level: "high",
    risk_score: 78,
    control_status: "uncontrolled",
    groups: ["Database Admin"],
    roles: ["DBA", "Admin"],
    last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    activity_frequency: 22,
    peak_hours: "9 AM - 5 PM",
    top_actions: ["Modify RDS settings", "Start RDS instance"],
    location: "EU-Central",
    risk_factors: ["Database admin privileges", "Access to sensitive data"]
  },
  {
    id: 10,
    name: "Cloud Optimizer AI",
    email: "ai.cloud.optimize@company.com",
    type: "non_human",
    subtype: "ai_agent",
    domain: "cloud",
    risk_level: "medium",
    risk_score: 62,
    control_status: "controlled",
    groups: ["Operations", "Cost Management"],
    roles: ["Optimizer"],
    last_activity: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    activity_frequency: 72,
    peak_hours: "Off-hours",
    top_actions: ["Stop EC2 instance", "Modify EC2 instance type"],
    location: "Global",
    risk_factors: ["Resource modification capabilities"]
  }
];

export default function Identities() {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIdentityId, setExpandedIdentityId] = useState(null);
  const [showControlModal, setShowControlModal] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [controlType, setControlType] = useState("mpa");
  const [filters, setFilters] = useState({
    searchTerm: '',
    types: [],
    domains: [],
    riskLevels: [],
    controlStatus: [],
    sortBy: 'risk_score',
    sortOrder: 'desc'
  });

  useEffect(() => {
    // Simulating API call to fetch identities
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set the identity data
      setIdentities(SAMPLE_IDENTITIES);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const filteredIdentities = useMemo(() => {
    if (!identities) return [];
    
    let filtered = identities.filter(identity => {
      // Handle search term filter
      if (filters.searchTerm && 
          !identity.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !identity.email.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Handle type filter
      if (filters.types.length > 0 && !filters.types.includes(identity.subtype)) {
        return false;
      }
      
      // Handle domain filter
      if (filters.domains.length > 0 && !filters.domains.includes(identity.domain)) {
        return false;
      }
      
      // Handle risk level filter
      if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(identity.risk_level)) {
        return false;
      }
      
      // Handle control status filter
      if (filters.controlStatus.length > 0 && !filters.controlStatus.includes(identity.control_status)) {
        return false;
      }
      
      return true;
    });
    
    // Handle sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'risk_score') {
        return filters.sortOrder === 'asc' ? a.risk_score - b.risk_score : b.risk_score - a.risk_score;
      } else if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'last_activity') {
        return filters.sortOrder === 'asc'
          ? new Date(a.last_activity) - new Date(b.last_activity)
          : new Date(b.last_activity) - new Date(a.last_activity);
      }
      return 0;
    });
    
    return filtered;
  }, [identities, filters]);

  const handleRowClick = (identityId) => {
    setExpandedIdentityId(expandedIdentityId === identityId ? null : identityId);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      types: [],
      domains: [],
      riskLevels: [],
      controlStatus: [],
      sortBy: 'risk_score',
      sortOrder: 'desc'
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (Array.isArray(newFilters[filterType])) {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(v => v !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = value;
      }
      
      return newFilters;
    });
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleApplyControl = (identity, e) => {
    if (e) e.stopPropagation();
    setSelectedIdentity(identity);
    setShowControlModal(true);
  };

  const renderExpandedContent = (identity) => (
    <div className="bg-gray-50 p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2 text-gray-500" />
              Activity Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-gray-500">Frequency</dt>
                <dd className="font-medium">{identity.activity_frequency} actions/day</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Peak Hours</dt>
                <dd className="font-medium">{identity.peak_hours}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Last Active</dt>
                <dd className="font-medium">
                  {format(new Date(identity.last_activity), "MMM d, yyyy HH:mm")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Location</dt>
                <dd className="font-medium">{identity.location}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="w-4 h-4 mr-2 text-gray-500" />
              Access & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Groups</div>
                <div className="flex flex-wrap gap-1">
                  {identity.groups.map(group => (
                    <Badge key={group} variant="outline">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Roles</div>
                <div className="flex flex-wrap gap-1">
                  {identity.roles.map(role => (
                    <Badge key={role} variant="outline" className="bg-blue-50">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-gray-500" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {identity.risk_factors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${
                    i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-sm">{factor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Workflow className="w-4 h-4 mr-2 text-gray-500" />
            Top Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {identity.top_actions.map((action, i) => (
              <div key={i} className="flex items-start p-2 bg-white border rounded-md">
                <div className={`p-1.5 rounded mr-2 ${
                  i === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {i === 0 ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{action}</div>
                  <div className="text-xs text-gray-500">High frequency</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Identity Type Display component
  const IdentityTypeIcon = ({ type }) => {
    const IconComponent = IDENTITY_TYPE_ICONS[type] || User;
    
    return (
      <div className={`p-2 rounded-full ${
        type === 'ai_agent' 
          ? 'bg-purple-100' 
          : type === 'service' 
              ? 'bg-blue-100' 
              : 'bg-green-100'
      }`}>
        <IconComponent className={`h-4 w-4 ${
          type === 'ai_agent' 
            ? 'text-purple-600' 
            : type === 'service' 
                ? 'text-blue-600' 
                : 'text-green-600'
        }`} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Identities</h1>
          <div className="h-96 flex items-center justify-center">
            <p>Loading identities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Identities</h1>
        </div>

        {/* Updated Filter Design to match Actions page */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search identities..." 
                className="pl-10"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              />
            </div>

            <Select
              value={filters.types.length > 0 ? filters.types[0] : ''}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                types: value ? [value] : []
              }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.types.length > 0 && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Identity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Types</SelectItem>
                <SelectItem value="human">Humans</SelectItem>
                <SelectItem value="service">Service Accounts</SelectItem>
                <SelectItem value="ai_agent">AI Agents</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.domains.length > 0 ? filters.domains[0] : ''}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                domains: value ? [value] : []
              }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.domains.length > 0 && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Domains</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="identity">Identity</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.riskLevels.length > 0 ? filters.riskLevels[0] : ''}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                riskLevels: value ? [value] : []
              }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.riskLevels.length > 0 && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.controlStatus.length > 0 ? filters.controlStatus[0] : ''}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                controlStatus: value ? [value] : []
              }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.controlStatus.length > 0 && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Control Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Statuses</SelectItem>
                <SelectItem value="controlled">Controlled</SelectItem>
                <SelectItem value="uncontrolled">Uncontrolled</SelectItem>
              </SelectContent>
            </Select>

            {(filters.searchTerm || filters.types.length > 0 || filters.domains.length > 0 || 
             filters.riskLevels.length > 0 || filters.controlStatus.length > 0) && (
              <Button
                variant="outline" 
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-3 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Identity
                    {filters.sortBy === 'name' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('risk_score')}
                  >
                    Risk Level
                    {filters.sortBy === 'risk_score' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Control Status</TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('last_activity')}
                  >
                    Last Activity
                    {filters.sortBy === 'last_activity' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIdentities.map((identity) => (
                <React.Fragment key={identity.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50 group" 
                    onClick={() => handleRowClick(identity.id)}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          {identity.subtype === 'human' ? (
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(identity.name)}&background=random`} />
                          ) : (
                            <AvatarFallback className={`${
                              identity.subtype === 'ai_agent' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {identity.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{identity.name}</div>
                          <div className="text-sm text-gray-500">{identity.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IdentityTypeIcon type={identity.subtype} />
                        <span className="capitalize">
                          {identity.subtype === 'ai_agent' ? 'AI Agent' : 
                           identity.subtype === 'service' ? 'Service Account' : 'Human'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${DOMAIN_COLORS[identity.domain] || "bg-gray-100 text-gray-800"}`}>
                        {identity.domain.charAt(0).toUpperCase() + identity.domain.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          identity.risk_level === 'critical' ? 'bg-red-500' :
                          identity.risk_level === 'high' ? 'bg-orange-500' :
                          identity.risk_level === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`} />
                        <Badge className={RISK_LEVEL_COLORS[identity.risk_level]}>
                          {identity.risk_level.charAt(0).toUpperCase() + identity.risk_level.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={identity.control_status === 'controlled' ? 'outline' : 'default'}
                        className={identity.control_status === 'controlled' 
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800'
                        }
                      >
                        {identity.control_status === 'controlled' ? 'Controlled' : 'Uncontrolled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600 text-sm">
                        {format(new Date(identity.last_activity), 'MMM d, HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleApplyControl(identity, e)}
                          className="h-8 w-8 text-blue-600"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedIdentityId === identity.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        {renderExpandedContent(identity)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Control Modal - Exactly the same as in Actions screen */}
        <Dialog open={showControlModal} onOpenChange={setShowControlModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Apply Control to Identity</DialogTitle>
              <DialogDescription>
                Choose how to handle {selectedIdentity?.name} when they perform actions
              </DialogDescription>
            </DialogHeader>

            <ControlModalContent 
              action={selectedIdentity} 
              onClose={() => setShowControlModal(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
