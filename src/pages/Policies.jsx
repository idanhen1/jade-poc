
import React, { useState, useEffect, useMemo } from 'react';
import { Policy } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Plus, 
  Search, 
  Filter, 
  X, 
  Edit2, 
  Settings2, 
  Trash2, 
  Shield,
  Calendar, 
  Users, 
  Zap,
  Clock,
  Tag,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  BarChart3,
  BrainCircuit,
  ChevronUp,
  Settings,
  Activity,
  Key,
  Check,
  PencilLine,
  Save,
  ArrowUpRight,
  Command
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PolicyWizard from '../components/policies/PolicyWizard';
import { useToast } from "@/components/ui/use-toast";
import { SAMPLE_POLICIES } from '@/components/utils/mockData';

// Add system logo mapping (simple version for now, could be moved to a util)
const SYSTEM_LOGOS = {
  "AWS": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  "Azure": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
  "GCP": "https://www.gstatic.com/images/icons/material/product/2x/googleg_64dp.png", // Google icon as proxy
  "GitHub": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  "Okta": "https://www.okta.com/sites/default/files/Okta_Logo_BrightBlue_Name.png",
  "Salesforce": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1200px-Salesforce.com_logo.svg.png",
  "Workday": "https://www.workday.com/content/dam/web/en-us/images/icons/workday-logo-black.svg",
  // Add more as needed, or use a fallback if a logo isn't found
};

// Constants for styling
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
  custom: "bg-gray-100 text-gray-800",
  database: "bg-green-100 text-green-800",
  code: "bg-yellow-100 text-yellow-800",
  identity: "bg-indigo-100 text-indigo-800"
};

export default function Policies() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [policies, setPolicies] = useState([]); // Initialize as empty, will load in useEffect
  const [loading, setLoading] = useState(true); // Set to true initially
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [filters, setFilters] = useState({
    controlType: '',
    status: '',
    triggered: '',
    domain: '',
    scope: ''
  });
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'updated_date', direction: 'desc' });
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState(null);
  const [policyToFocusId, setPolicyToFocusId] = useState(null);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    // Check for pending policy from localStorage
    const pendingPolicyJSON = localStorage.getItem('pendingPolicy');
    let currentPolicies = [...SAMPLE_POLICIES];

    if (pendingPolicyJSON) {
      try {
        const pendingPolicy = JSON.parse(pendingPolicyJSON);
        // Add to the beginning of the list for visibility, filter out if it already exists by ID
        currentPolicies = [pendingPolicy, ...currentPolicies.filter(p => String(p.id) !== String(pendingPolicy.id))];
        localStorage.removeItem('pendingPolicy');
        
        // Check for focusPolicyId from URL to auto-open details
        const urlParams = new URLSearchParams(window.location.search);
        const focusId = urlParams.get('focusPolicyId');
        if (focusId && String(focusId) === String(pendingPolicy.id)) {
          setPolicyToFocusId(String(focusId)); // Store ID to focus
        }
      } catch (error) {
        console.error("Error parsing pending policy from localStorage:", error);
        localStorage.removeItem('pendingPolicy'); // Clear corrupted data
      }
    }
    setPolicies(currentPolicies);
    setLoading(false);
  }, []); // Run once on mount

  useEffect(() => {
    if (policyToFocusId && policies.length > 0) {
      const policyToSelect = policies.find(p => String(p.id) === policyToFocusId);
      if (policyToSelect) {
        setSelectedPolicy(policyToSelect);
        setEditedPolicy({...policyToSelect});
        setShowPolicyDetails(true);
        setPolicyToFocusId(null); // Reset after focusing
      }
    }
  }, [policyToFocusId, policies, setSelectedPolicy, setEditedPolicy, setShowPolicyDetails]);

  // Sorting logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedPolicies = useMemo(() => {
    const sortablePolicies = [...policies];
    return sortablePolicies.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' 
        ? (aValue < bValue ? -1 : 1)
        : (bValue < aValue ? -1 : 1);
    });
  }, [policies, sortConfig]);

  // Apply filters
  const filteredPolicies = useMemo(() => {
    return sortedPolicies.filter(policy => {
      // Search term
      if (searchTerm && !policy.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !policy.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !policy.actions_covered?.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Control type filter
      if (filters.controlType && policy.control_type !== filters.controlType) {
        return false;
      }
      
      // Status filter
      if (filters.status && policy.status !== filters.status) {
        return false;
      }
      
      // Triggered filter
      if (filters.triggered) {
        const now = new Date();
        const lastTriggered = policy.last_triggered ? new Date(policy.last_triggered) : null;
        
        if (filters.triggered === 'last-7-days') {
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          if (!lastTriggered || lastTriggered < sevenDaysAgo) {
            return false;
          }
        } else if (filters.triggered === 'last-30-days') {
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          if (!lastTriggered || lastTriggered < thirtyDaysAgo) {
            return false;
          }
        } else if (filters.triggered === 'never') {
          if (lastTriggered) {
            return false;
          }
        }
      }
      
      // Domain filter
      if (filters.domain && policy.domain !== filters.domain) {
        return false;
      }
      
      // Scope filter
      if (filters.scope && policy.scope !== filters.scope) {
        return false;
      }
      
      return true;
    });
  }, [sortedPolicies, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      controlType: '',
      status: '',
      triggered: '',
      domain: '',
      scope: ''
    });
    setSearchTerm('');
  };

  const handleRowClick = (policy) => {
    setSelectedPolicy(policy);
    setEditedPolicy({...policy});
    setShowPolicyDetails(true);
  };

  const handleCreatePolicy = () => {
    setShowWizard(true);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditingPolicy(true);
  };

  const handleSaveEdit = () => {
    const updatedPolicies = policies.map(p => 
      p.id === editedPolicy.id ? editedPolicy : p
    );
    
    setPolicies(updatedPolicies);
    setSelectedPolicy(editedPolicy);
    setIsEditingPolicy(false);
    
    toast({
      title: "Policy updated",
      description: "The policy has been updated successfully."
    });
  };

  const handleCancelEdit = () => {
    setEditedPolicy({...selectedPolicy});
    setIsEditingPolicy(false);
  };

  const handleInputChange = (field, value) => {
    setEditedPolicy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteClick = (policy, e) => {
    e.stopPropagation();
    setPolicyToDelete(policy);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const updatedPolicies = policies.filter(p => p.id !== policyToDelete.id);
      setPolicies(updatedPolicies);
      toast({
        title: "Policy deleted",
        description: "The policy has been deleted successfully."
      });
      
      if (selectedPolicy && selectedPolicy.id === policyToDelete.id) {
        setShowPolicyDetails(false);
        setSelectedPolicy(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting policy",
        description: "Please try again later."
      });
    }
    setShowDeleteDialog(false);
    setPolicyToDelete(null);
  };

  const handlePolicyCreated = (newPolicy) => {
    setShowWizard(false);
    setPolicies([...policies, {
      id: policies.length + 1, // Simple ID for mock data
      ...newPolicy,
      trigger_count: 0,
      last_triggered: null,
      updated_date: new Date().toISOString(),
      created_by: "Current User",
      effectiveness: 0,
      top_approvers: [],
      top_requesters: []
    }]);
    
    toast({
      title: "Policy created",
      description: "New policy has been created successfully."
    });
  };

  const handleToggleStatus = () => {
    const newStatus = editedPolicy.status === 'active' ? 'disabled' : 'active';
    
    setEditedPolicy(prev => ({
      ...prev,
      status: newStatus
    }));
    
    if (!isEditingPolicy) {
      // If not in edit mode, update immediately
      const updatedPolicies = policies.map(p => {
        if (p.id === selectedPolicy.id) {
          return {
            ...p,
            status: newStatus
          };
        }
        return p;
      });
      
      setPolicies(updatedPolicies);
      setSelectedPolicy({
        ...selectedPolicy,
        status: newStatus
      });
      
      toast({
        title: `Policy ${newStatus === 'active' ? 'enabled' : 'disabled'}`,
        description: `The policy has been ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully.`
      });
    }
  };

  // Empty state rendering
  if (!loading && policies.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Action Policies</h1>
            <Button onClick={handleCreatePolicy} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Policy
            </Button>
          </div>
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
            <Settings2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies created yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first policy to govern high-risk actions.</p>
            <Button onClick={handleCreatePolicy} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Policy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Action Policies</h1>
          <Button onClick={handleCreatePolicy} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Policy
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg border space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by policy name, action, or control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          
            <Select 
              value={filters.controlType} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, controlType: value }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.controlType && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Control Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Controls</SelectItem>
                <SelectItem value="mpa">MPA</SelectItem>
                <SelectItem value="mfa">MFA</SelectItem>
                <SelectItem value="ai_approver">AI Approver</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.status && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.triggered} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, triggered: value }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.triggered && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Triggered" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Any Time</SelectItem>
                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="never">Never triggered</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.domain} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, domain: value }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.domain && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Domains</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="infra">Infrastructure</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="identity">Identity</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.scope} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, scope: value }))}
            >
              <SelectTrigger className={cn(
                "w-[140px]",
                filters.scope && "border-blue-600 text-blue-600"
              )}>
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Scopes</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || filters.controlType || filters.status || filters.triggered || filters.domain || filters.scope) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Table Stats */}
        <div className="text-sm text-gray-500">
          Showing {filteredPolicies.length} {filteredPolicies.length === 1 ? 'policy' : 'policies'}
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Policy Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('control_type')}
                >
                  <div className="flex items-center">
                    Control Type
                    {sortConfig.key === 'control_type' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Actions Covered</TableHead>
                <TableHead>Identities Covered</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('trigger_count')}
                >
                  <div className="flex items-center">
                    Triggered (30d)
                    {sortConfig.key === 'trigger_count' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('updated_date')}
                >
                  <div className="flex items-center">
                    Last Modified
                    {sortConfig.key === 'updated_date' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow 
                  key={policy.id}
                  className="cursor-pointer hover:bg-gray-50 group"
                  onClick={() => handleRowClick(policy)}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      {policy.name}
                      <span className="text-xs text-gray-500 truncate max-w-[250px]">
                        {policy.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={CONTROL_TYPE_COLORS[policy.control_type] || 'bg-gray-100'}>
                      {policy.control_type === 'mpa' ? 'MPA' : 
                       policy.control_type === 'mfa' ? 'MFA' : 
                       policy.control_type === 'ai_approver' ? 'AI Approver' : 
                       policy.control_type === 'notification' ? 'Notification' : 
                       'Alert'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {policy.actions_covered && policy.actions_covered.slice(0, 2).map((action) => (
                        <Badge key={action} variant="secondary" className="truncate max-w-[120px]">
                          {action}
                        </Badge>
                      ))}
                      {policy.actions_covered && policy.actions_covered.length > 2 && (
                        <Badge variant="secondary">+{policy.actions_covered.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {policy.identities_covered && policy.identities_covered.slice(0, 2).map((identity) => (
                        <Badge key={identity} variant="secondary" className="truncate max-w-[120px]">
                          {identity}
                        </Badge>
                      ))}
                      {policy.identities_covered && policy.identities_covered.length > 2 && (
                        <Badge variant="secondary">+{policy.identities_covered.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {policy.trigger_count}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[policy.status] || 'bg-gray-100'}>
                      {policy.status === 'active' ? 'Active' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {policy.updated_date ? format(new Date(policy.updated_date), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(policy);
                          setIsEditingPolicy(true);
                        }}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => handleDeleteClick(policy, e)}
                        className="h-8 w-8 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPolicies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Filter className="h-12 w-12 mb-3 opacity-20" />
                      <h3 className="text-lg font-medium mb-1">No policies match your filters</h3>
                      <p className="text-sm mb-3">Try adjusting your search or filter criteria</p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Policy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this policy? This will remove all controls tied to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Policy Details Dialog */}
      <Dialog open={showPolicyDetails} onOpenChange={setShowPolicyDetails}>
        <DialogContent className="max-w-[900px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>Policy Details</span>
              {!isEditingPolicy ? (
                <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                  <PencilLine className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedPolicy && (
            <div className="mt-6">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="approvers">Approvers</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="space-y-6">
                    {isEditingPolicy ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Policy Name</Label>
                            <Input 
                              value={editedPolicy.name} 
                              onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Status</Label>
                            <div className="flex items-center gap-2 h-10">
                              <Button
                                variant={editedPolicy.status === 'active' ? 'default' : 'outline'}
                                size="sm"
                                onClick={handleToggleStatus}
                                className={editedPolicy.status === 'active' ? 'bg-green-600' : ''}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Active
                              </Button>
                              <Button
                                variant={editedPolicy.status === 'disabled' ? 'default' : 'outline'}
                                size="sm"
                                onClick={handleToggleStatus}
                                className={editedPolicy.status === 'disabled' ? 'bg-gray-500' : ''}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Disabled
                              </Button>
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea 
                              value={editedPolicy.description} 
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <Label>Control Type</Label>
                            <Select
                              value={editedPolicy.control_type}
                              onValueChange={(value) => handleInputChange('control_type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
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
                              value={editedPolicy.domain || ''}
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
                        </div>
                        
                        {/* Actions and Identities sections */}
                        <div>
                          <Label className="mb-2 block">Actions Covered</Label>
                          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                            {(editedPolicy.actions_covered || []).map((action, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 pl-2 pr-1">
                                {action}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => {
                                    const updatedActions = [...(editedPolicy.actions_covered || [])];
                                    updatedActions.splice(index, 1);
                                    handleInputChange('actions_covered', updatedActions);
                                  }}
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
                          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                            {(editedPolicy.identities_covered || []).map((identity, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 pl-2 pr-1">
                                {identity}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => {
                                    const updatedIdentities = [...(editedPolicy.identities_covered || [])];
                                    updatedIdentities.splice(index, 1);
                                    handleInputChange('identities_covered', updatedIdentities);
                                  }}
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

                        {editedPolicy.governedSystems && editedPolicy.governedSystems.length > 0 && (
                           <div className="mt-4">
                            <Label className="mb-2 block">Governed Systems</Label>
                            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                              {(editedPolicy.governedSystems || []).map((system, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 pl-2 pr-1">
                                  {SYSTEM_LOGOS[system] ? (
                                    <img src={SYSTEM_LOGOS[system]} alt={system} className="h-4 w-4 mr-1 object-contain"/>
                                  ) : (
                                    <Shield className="w-3 h-3 mr-1 text-gray-400"/>
                                  )}
                                  {system}
                                  {/* Button to remove system - can be added if needed 
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                    onClick={() => {
                                      const updatedSystems = [...(editedPolicy.governedSystems || [])];
                                      updatedSystems.splice(index, 1);
                                      handleInputChange('governedSystems', updatedSystems);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  */}
                                </Badge>
                              ))}
                              {/* Button to add system - can be added if needed
                              <Button variant="outline" size="sm" className="gap-1">
                                <Plus className="h-3 w-3" /> Add System
                              </Button>
                              */}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium">{selectedPolicy.name}</h3>
                            <p className="text-gray-600 mt-1">{selectedPolicy.description}</p>
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Badge className={CONTROL_TYPE_COLORS[selectedPolicy.control_type || '']}>
                                {selectedPolicy.control_type === 'mpa' ? 'Multi-Party Approval' : 
                                 selectedPolicy.control_type === 'mfa' ? 'MFA Challenge' : 
                                 selectedPolicy.control_type === 'ai_approver' ? 'AI Approver' : 
                                 selectedPolicy.control_type === 'notification' ? 'Notification' : 'Alert'}
                              </Badge>
                              
                              <Badge className={STATUS_COLORS[selectedPolicy.status || '']}>
                                {selectedPolicy.status === 'active' ? 'Active' : 'Disabled'}
                              </Badge>
                              
                              {selectedPolicy.domain && (
                                <Badge className={DOMAIN_COLORS[selectedPolicy.domain] || 'bg-gray-100'}>
                                  {selectedPolicy.domain.charAt(0).toUpperCase() + selectedPolicy.domain.slice(1)}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="mt-6 space-y-4">
                              <div>
                                <Label className="text-sm text-gray-500 mb-1 block">Created By</Label>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                                    {selectedPolicy.created_by?.charAt(0) || 'U'}
                                  </div>
                                  <span>{selectedPolicy.created_by || 'Unknown'}</span>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm text-gray-500 mb-1 block">Last Modified</Label>
                                <p>{selectedPolicy.updated_date ? format(new Date(selectedPolicy.updated_date), 'MMM d, yyyy, h:mm a') : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          
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
                                  {selectedPolicy.trigger_count || 0}
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
                                  {selectedPolicy.avg_approval_time ? `${selectedPolicy.avg_approval_time}m` : 'N/A'}
                                </div>
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
                                  {selectedPolicy.effectiveness !== undefined ? `${selectedPolicy.effectiveness}%` : 'N/A'}
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Last Triggered
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {selectedPolicy.last_triggered ? format(new Date(selectedPolicy.last_triggered), 'MMM d') : 'Never'}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Actions Covered</h4>
                            <div className="space-y-1">
                              {(selectedPolicy.actions_covered || []).map((action, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded flex items-center">
                                  <Command className="w-4 h-4 text-gray-500 mr-2" />
                                  {action}
                                </div>
                              ))}
                              {(selectedPolicy.actions_covered || []).length === 0 && (
                                <p className="text-sm text-gray-500 italic">No actions specified</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Identities Covered</h4>
                            <div className="space-y-1">
                              {(selectedPolicy.identities_covered || []).map((identity, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded flex items-center">
                                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                                  {identity}
                                </div>
                              ))}
                              {(selectedPolicy.identities_covered || []).length === 0 && (
                                <p className="text-sm text-gray-500 italic">No identities specified</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedPolicy.governedSystems && selectedPolicy.governedSystems.length > 0 && !isEditingPolicy && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Governed Systems</h4>
                            <div className="flex flex-wrap gap-3 items-center p-3 bg-gray-50 rounded-md">
                              {selectedPolicy.governedSystems.map((systemName, index) => (
                                <TooltipProvider key={index}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-2 p-2 border rounded-md bg-white shadow-sm">
                                        {SYSTEM_LOGOS[systemName] ? (
                                          <img 
                                            src={SYSTEM_LOGOS[systemName]} 
                                            alt={`${systemName} logo`} 
                                            className="h-5 w-5 object-contain"
                                            onError={(e) => { 
                                              e.currentTarget.style.display = 'none'; // Hide the image
                                              e.currentTarget.parentElement.querySelector('.text-fallback').style.display = 'inline'; // Show fallback text
                                            }}
                                          />
                                        ) : (
                                          <Shield className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span className={SYSTEM_LOGOS[systemName] ? "hidden text-fallback" : "text-fallback" /* For fallback text if image fails */ }>{/* Empty span for alignment */}</span> 
                                        <span className="text-sm">{systemName}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>This policy may apply to {systemName}.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedPolicy.control_type === 'mpa' && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium flex items-center text-blue-800">
                              <Shield className="w-4 h-4 mr-2" />
                              Multi-Party Approval Configuration
                            </h4>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>Requires approval from authorized users before action can complete.</p>
                              <div className="mt-2 grid grid-cols-2 gap-4">
                                <div>
                                  <span className="font-medium">Required Approvals:</span> 2
                                </div>
                                <div>
                                  <span className="font-medium">Time Limit:</span> 60 minutes
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {selectedPolicy.control_type === 'mfa' && (
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="font-medium flex items-center text-purple-800">
                              <Key className="w-4 h-4 mr-2" />
                              MFA Challenge Configuration
                            </h4>
                            <div className="mt-2 text-sm text-purple-700">
                              <p>Requires additional authentication factor before action can complete.</p>
                              <div className="mt-2">
                                <span className="font-medium">MFA Type:</span> Time-based OTP
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {selectedPolicy.control_type === 'ai_approver' && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-medium flex items-center text-green-800">
                              <BrainCircuit className="w-4 h-4 mr-2" />
                              AI Approver Configuration
                            </h4>
                            <div className="mt-2 text-sm text-green-700">
                              <p>Uses artificial intelligence to automatically approve or deny actions based on patterns and context.</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Recent Activity</CardTitle>
                        <CardDescription>Policy trigger and approval activity for the last 30 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-center py-8 text-gray-500">Activity chart will be displayed here</p>
                          
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="p-3 border rounded-md flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  i === 1 ? 'bg-green-100' : i === 2 ? 'bg-red-100' : 'bg-yellow-100'
                                }`}>
                                  {i === 1 ? (
                                    <Check className={`h-4 w-4 text-green-600`} />
                                  ) : i === 2 ? (
                                    <X className={`h-4 w-4 text-red-600`} />
                                  ) : (
                                    <Clock className={`h-4 w-4 text-yellow-600`} />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {i === 1 ? 'Policy Triggered - Request Approved' : 
                                     i === 2 ? 'Policy Triggered - Request Denied' : 
                                     'Policy Triggered - Awaiting Approval'}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {i === 1 ? 'Daniel Park requested to modify S3 bucket permissions' : 
                                     i === 2 ? 'Alex Wong attempted to delete production database instance' : 
                                     'Jennifer Lee requested to grant admin access to cloud account'}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {format(new Date(new Date().setDate(new Date().getDate() - i)), 'MMM d, yyyy h:mm a')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            View All Activity
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="approvers">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Top Approvers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {(selectedPolicy.top_approvers || []).length > 0 ? (
                            (selectedPolicy.top_approvers || []).map((approver, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                                    {approver.name.charAt(0)}
                                  </div>
                                  <span>{approver.name}</span>
                                </div>
                                <Badge variant="outline">{approver.count} approvals</Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-6 text-gray-500">No approver data available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Top Requesters</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {(selectedPolicy.top_requesters || []).length > 0 ? (
                            (selectedPolicy.top_requesters || []).map((requester, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm">
                                    {requester.name.charAt(0)}
                                  </div>
                                  <span>{requester.name}</span>
                                </div>
                                <Badge variant="outline">{requester.count} requests</Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-6 text-gray-500">No requester data available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Policy Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Policy Status</h4>
                              <p className="text-sm text-gray-500">Enable or disable this policy</p>
                            </div>
                            <Button
                              variant={selectedPolicy.status === 'active' ? 'default' : 'outline'}
                              onClick={handleToggleStatus}
                              className={selectedPolicy.status === 'active' ? 'bg-green-600' : ''}
                            >
                              {selectedPolicy.status === 'active' ? 'Enabled' : 'Disabled'}
                            </Button>
                          </div>
                          
                          <div className="border-t pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-red-600">Delete Policy</h4>
                                <p className="text-sm text-gray-500">Permanently remove this policy</p>
                              </div>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  setPolicyToDelete(selectedPolicy);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                Delete Policy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Policy Creation Wizard */}
      <PolicyWizard
        open={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handlePolicyCreated}
      />
    </div>
  );
}
