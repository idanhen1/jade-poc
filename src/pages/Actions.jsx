
import React, { useState, useEffect, useMemo } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  Filter,
  X,
  Shield,
  Edit,
  Trash,
  Calendar,
  Tag,
  AlertTriangle,
  Clock,
  Hash,
  User,
  BarChart3,
  Database,
  CheckCircle,
  Mail,
  Bell,
  Users,
  ChevronRight,
  ChevronDown,
  Server
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BrainCircuit } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AddActionModal from '@/components/actions/AddActionModal';

// Replace SAMPLE_ACTIONS and ALL_ACTIONS with our direct list
const ACTIONS_LIST = [
  {
    id: 1,
    name: "Attach policy to user",
    domain: "cloud",
    data_source: "AWS",
    type: "observed",
    risk_level: "high",
    status: "uncontrolled",
    frequency: 2.5,
    last_seen: "2024-02-29T12:00:00Z",
    first_seen: "2023-11-15T08:30:00Z",
    location: "US-West-2",
    performed_by: "security_tool@example.com",
    risk_score: 65,
    tags: ["iam", "user_management"],
    low_risk_count: 15,
    medium_risk_count: 8,
    high_risk_count: 2,
    top_performers: [
      {"name": "security_tool@example.com", "count": 10},
      {"name": "john.doe@example.com", "count": 5}
    ]
  },
  {
    id: 2,
    name: "Create access key",
    domain: "cloud",
    data_source: "AWS",
    type: "observed",
    risk_level: "high",
    status: "uncontrolled",
    frequency: 1.0,
    last_seen: "2024-02-28T18:45:00Z",
    first_seen: "2023-10-01T09:00:00Z",
    location: "Europe-West",
    performed_by: "jane.smith@example.com",
    risk_score: 80,
    tags: ["iam", "access_keys"],
    low_risk_count: 5,
    medium_risk_count: 2,
    high_risk_count: 1,
    top_performers: [
      {"name": "jane.smith@example.com", "count": 1}
    ]
  },
  {
    id: 3,
    name: "Delete IAM user",
    domain: "cloud",
    data_source: "AWS",
    type: "observed",
    risk_level: "critical",
    status: "uncontrolled",
    frequency: 0.5,
    last_seen: "2024-02-27T22:30:00Z",
    first_seen: "2023-09-15T14:00:00Z",
    location: "US-East-1",
    performed_by: "cloud_monitor@example.com",
    risk_score: 95,
    tags: ["iam", "user_management"],
    low_risk_count: 0,
    medium_risk_count: 0,
    high_risk_count: 3,
    top_performers: [
      {"name": "cloud_monitor@example.com", "count": 3}
    ]
  },
  {
    id: 4,
    name: "Create role",
    domain: "cloud",
    data_source: "AWS",
    type: "observed",
    risk_level: "high",
    status: "uncontrolled",
    frequency: 1.2,
    last_seen: "2024-02-26T06:15:00Z",
    first_seen: "2023-08-01T10:45:00Z",
    location: "Asia-Southeast-1",
    performed_by: "data_auditor@example.com",
    risk_score: 85,
    tags: ["iam", "roles"],
    low_risk_count: 1,
    medium_risk_count: 1,
    high_risk_count: 1,
    top_performers: [
      {"name": "data_auditor@example.com", "count": 1}
    ]
  },
  {
    "id": 5,
    "name": "Firewall Rule Changed",
    "domain": "cloud",
    "data_source": "AWS",
    "type": "observed",
    "risk_level": "medium",
    "status": "controlled",
    "frequency": 3.0,
    "last_seen": "2024-02-25T15:30:00Z",
    "first_seen": "2023-07-15T16:00:00Z",
    "location": "US-West-1",
    "performed_by": "network_admin@example.com",
    "risk_score": 70,
    "tags": ["network_security", "firewall"],
    "low_risk_count": 18,
    "medium_risk_count": 10,
    "high_risk_count": 2,
    "top_performers": [
        {"name": "network_admin@example.com", "count": 10},
        {"name": "security_team@example.com", "count": 8}
    ]
  },
  {
    "id": 6,
    "name": "Password Policy Disabled",
    "domain": "identity",
    "data_source": "Okta",
    "type": "observed",
    "risk_level": "high",
    "status": "uncontrolled",
    "frequency": 0.8,
    "last_seen": "2024-02-24T09:00:00Z",
    "first_seen": "2023-06-01T11:30:00Z",
    "location": "Global",
    "performed_by": "security_admin@example.com",
    "risk_score": 90,
    "tags": ["password_security", "identity_management"],
    "low_risk_count": 2,
    "medium_risk_count": 1,
    "high_risk_count": 1,
    "top_performers": [
        {"name": "security_admin@example.com", "count": 1}
    ]
  },
  {
    "id": 7,
    "name": "API Key Exposed",
    "domain": "code",
    "data_source": "GitHub",
    "type": "observed",
    "risk_level": "critical",
    "status": "uncontrolled",
    "frequency": 0.3,
    "last_seen": "2024-02-23T14:45:00Z",
    "first_seen": "2023-05-15T13:00:00Z",
    "location": "Global",
    "performed_by": "code_scanner@example.com",
    "risk_score": 98,
    "tags": ["api_security", "code_analysis"],
    "low_risk_count": 0,
    "medium_risk_count": 0,
    "high_risk_count": 5,
    "top_performers": [
        {"name": "code_scanner@example.com", "count": 5}
    ]
  },
  {
    "id": 8,
    "name": "Database Backup Without Encryption",
    "domain": "database",
    "data_source": "MongoDB Atlas",
    "type": "observed",
    "risk_level": "high",
    "status": "uncontrolled",
    "frequency": 0.6,
    "last_seen": "2024-02-22T20:15:00Z",
    "first_seen": "2023-04-01T15:45:00Z",
    "location": "US-Central-1",
    "performed_by": "database_monitor@example.com",
    "risk_score": 88,
    "tags": ["data_security", "backup_policy"],
    "low_risk_count": 1,
    "medium_risk_count": 0,
    "high_risk_count": 2,
    "top_performers": [
        {"name": "database_monitor@example.com", "count": 2}
    ]
  },
  {
    "id": 9,
    "name": "New User Invited to Org",
    "domain": "saas",
    "data_source": "Slack",
    "type": "observed",
    "risk_level": "low",
    "status": "controlled",
    "frequency": 5.0,
    "last_seen": "2024-02-21T10:30:00Z",
    "first_seen": "2023-03-15T09:15:00Z",
    "location": "Global",
    "performed_by": "hr_team@example.com",
    "risk_score": 40,
    "tags": ["user_management", "saas_security"],
    "low_risk_count": 30,
    "medium_risk_count": 5,
    "high_risk_count": 0,
    "top_performers": [
        {"name": "hr_team@example.com", "count": 30}
    ]
  },
  {
    "id": 10,
    "name": "File Share Permissions Modified",
    "domain": "on_prem",
    "data_source": "Active Directory",
    "type": "observed",
    "risk_level": "medium",
    "status": "uncontrolled",
    "frequency": 1.8,
    "last_seen": "2024-02-20T16:00:00Z",
    "first_seen": "2023-02-01T17:00:00Z",
    "location": "Local Network",
    "performed_by": "it_admin@example.com",
    "risk_score": 60,
    "tags": ["access_control", "file_sharing"],
    "low_risk_count": 10,
    "medium_risk_count": 3,
    "high_risk_count": 0,
    "top_performers": [
        {"name": "it_admin@example.com", "count": 10}
    ]
  },
  {
    "id": 11,
    "name": "IAM Role Modified",
    "domain": "cloud",
    "data_source": "AWS",
    "type": "observed",
    "risk_level": "medium",
    "status": "uncontrolled",
    "frequency": 1.5,
    "last_seen": "2024-03-01T08:00:00Z",
    "first_seen": "2023-12-10T14:30:00Z",
    "location": "US-East-2",
    "performed_by": "security_tool@example.com",
    "risk_score": 72,
    "tags": ["iam", "role_management"],
    "low_risk_count": 8,
    "medium_risk_count": 5,
    "high_risk_count": 1,
    "top_performers": [
      {"name": "security_tool@example.com", "count": 8},
      {"name": "john.doe@example.com", "count": 3}
    ]
  },
  {
    "id": 12,
    "name": "New App Registration",
    "domain": "cloud",
    "data_source": "Azure",
    "type": "observed",
    "risk_level": "high",
    "status": "uncontrolled",
    "frequency": 0.9,
    "last_seen": "2024-02-29T19:15:00Z",
    "first_seen": "2023-11-05T10:00:00Z",
    "location": "Europe-North",
    "performed_by": "jane.smith@example.com",
    "risk_score": 88,
    "tags": ["application", "oauth"],
    "low_risk_count": 3,
    "medium_risk_count": 1,
    "high_risk_count": 1,
    "top_performers": [
      {"name": "jane.smith@example.com", "count": 1}
    ]
  },
  {
    "id": 13,
    "name": "Cloud Storage Access Modified",
    "domain": "cloud",
    "data_source": "GCP",
    "type": "observed",
    "risk_level": "critical",
    "status": "uncontrolled",
    "frequency": 0.4,
    "last_seen": "2024-02-28T23:45:00Z",
    "first_seen": "2023-10-20T15:30:00Z",
    "location": "US-Central-2",
    "performed_by": "cloud_monitor@example.com",
    "risk_score": 97,
    "tags": ["storage", "data_access"],
    "low_risk_count": 0,
    "medium_risk_count": 0,
    "high_risk_count": 4,
    "top_performers": [
      {"name": "cloud_monitor@example.com", "count": 4}
    ]
  },
  {
    "id": 14,
    "name": "Security Group Updated",
    "domain": "cloud",
    "data_source": "AWS",
    "type": "observed",
    "risk_level": "medium",
    "status": "controlled",
    "frequency": 2.8,
    "last_seen": "2024-02-27T07:30:00Z",
    "first_seen": "2023-09-01T11:15:00Z",
    "location": "US-West-2",
    "performed_by": "network_admin@example.com",
    "risk_score": 68,
    "tags": ["network_security", "access_control"],
    "low_risk_count": 16,
    "medium_risk_count": 9,
    "high_risk_count": 1,
    "top_performers": [
      {"name": "network_admin@example.com", "count": 9},
      {"name": "security_team@example.com", "count": 7}
    ]
  },
  {
    "id": 15,
    "name": "Service Account Created",
    "domain": "cloud",
    "data_source": "GCP",
    "type": "observed",
    "risk_level": "high",
    "status": "uncontrolled",
    "frequency": 0.7,
    "last_seen": "2024-02-26T16:45:00Z",
    "first_seen": "2023-08-15T09:45:00Z",
    "location": "Asia-East-1",
    "performed_by": "admin@example.com",
    "risk_score": 86,
    "tags": ["service_account", "iam"],
    "low_risk_count": 2,
    "medium_risk_count": 1,
    "high_risk_count": 1,
    "top_performers": [
      {"name": "admin@example.com", "count": 1}
    ]
  },
  {
    "id": 16,
    "name": "User Added to Privileged Group",
    "domain": "identity",
    "data_source": "Okta",
    "type": "observed",
    "risk_level": "high",
    "status": "uncontrolled",
    "frequency": 0.5,
    "last_seen": "2024-02-25T10:15:00Z",
    "first_seen": "2023-07-01T12:30:00Z",
    "location": "Global",
    "performed_by": "security_admin@example.com",
    "risk_score": 92,
    "tags": ["user_management", "privilege_escalation"],
    "low_risk_count": 1,
    "medium_risk_count": 0,
    "high_risk_count": 1,
    "top_performers": [
      {"name": "security_admin@example.com", "count": 1}
    ]
  },
  {
    "id": 17,
    "name": "Secret Stored in Code",
    "domain": "code",
    "data_source": "GitLab",
    "type": "observed",
    "risk_level": "critical",
    "status": "uncontrolled",
    "frequency": 0.2,
    "last_seen": "2024-02-24T15:00:00Z",
    "first_seen": "2023-06-15T16:45:00Z",
    "location": "Global",
    "performed_by": "code_scanner@example.com",
    "risk_score": 99,
    "tags": ["code_analysis", "secret_detection"],
    "low_risk_count": 0,
    "medium_risk_count": 0,
    "high_risk_count": 6,
    "top_performers": [
      {"name": "code_scanner@example.com", "count": 6}
    ]
  },
  {
    "id": 18,
    "name": "Database Publicly Accessible",
    "domain": "database",
    "data_source": "MongoDB Atlas",
    "type": "observed",
    "risk_level": "critical",
    "status": "uncontrolled",
    "frequency": 0.3,
    "last_seen": "2024-02-23T21:30:00Z",
    "first_seen": "2023-05-01T18:00:00Z",
    "location": "US-West-1",
    "performed_by": "database_monitor@example.com",
    "risk_score": 95,
    "tags": ["data_security", "public_exposure"],
    "low_risk_count": 0,
    "medium_risk_count": 0,
    "high_risk_count": 3,
    "top_performers": [
      {"name": "database_monitor@example.com", "count": 3}
    ]
  },
  {
    "id": 19,
    "name": "Third-Party App Connected",
    "domain": "saas",
    "data_source": "Salesforce",
    "type": "observed",
    "risk_level": "medium",
    "status": "uncontrolled",
    "frequency": 2.0,
    "last_seen": "2024-02-22T11:00:00Z",
    "first_seen": "2023-04-15T10:30:00Z",
    "location": "Global",
    "performed_by": "saas_admin@example.com",
    "risk_score": 75,
    "tags": ["saas_security", "third_party_access"],
    "low_risk_count": 12,
    "medium_risk_count": 6,
    "high_risk_count": 0,
    "top_performers": [
      {"name": "saas_admin@example.com", "count": 12}
    ]
  },
  {
    "id": 20,
    "name": "Admin Account Login Failed",
    "domain": "on_prem",
    "data_source": "Active Directory",
    "type": "observed",
    "risk_level": "low",
    "status": "controlled",
    "frequency": 8.0,
    "last_seen": "2024-02-21T17:15:00Z",
    "first_seen": "2023-03-01T19:00:00Z",
    "location": "Local Network",
    "performed_by": "security_system@example.com",
    "risk_score": 35,
    "tags": ["access_control", "login_attempt"],
    "low_risk_count": 45,
    "medium_risk_count": 10,
    "high_risk_count": 0,
    "top_performers": [
      {"name": "security_system@example.com", "count": 45}
    ]
  }
];

const DOMAIN_COLORS = {
  cloud: "bg-blue-100 text-blue-800",
  saas: "bg-purple-100 text-purple-800",
  on_prem: "bg-green-100 text-green-800",
  code: "bg-yellow-100 text-yellow-800",
  database: "bg-orange-100 text-orange-800",
  identity: "bg-indigo-100 text-indigo-800"
};

const RISK_LEVEL_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

const STATUS_COLORS = {
  controlled: "bg-green-100 text-green-800",
  uncontrolled: "bg-red-100 text-red-800"
};

const DATA_SOURCE_LOGOS = {
  "AWS": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  "GCP": "https://www.gstatic.com/images/icons/material/product/2x/googleg_64dp.png",
  "Azure": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
  "Okta": "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg",
  "Salesforce": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  "Slack": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
  "Zoom": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
  "GitHub": "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  "GitLab": "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg",
  "Active Directory": "https://www.svgrepo.com/show/303223/microsoft-windows-22-logo.svg",
  "MongoDB Atlas": "https://www.svgrepo.com/show/354190/mongodb.svg"
};

const GROUP_BY_OPTIONS = [
  { value: "none", label: "No Grouping" },
  { value: "domain", label: "Domain" },
  { value: "data_source", label: "Data Source" },
  { value: "risk_level", label: "Risk Level" },
  { value: "status", label: "Control Status" }
];

const SAMPLE_TEAMS = [
  { id: 1, name: "Security Team" },
  { id: 2, name: "DevOps Team" },
  { id: 3, name: "Infrastructure Team" },
  { id: 4, name: "Cloud Operations" },
  { id: 5, name: "Compliance Team" },
  { id: 6, name: "Platform Engineering" }
];

const SAMPLE_USERS = [
  { id: 1, name: "John Smith", email: "john.smith@company.com" },
  { id: 2, name: "Jane Doe", email: "jane.doe@company.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@company.com" },
  { id: 4, name: "Bob Williams", email: "bob.williams@company.com" },
  { id: 5, name: "Charlie Brown", email: "charlie.brown@company.com" },
  { id: 6, name: "Diana Prince", email: "diana.prince@company.com" }
];

const SAMPLE_PERFORMERS = [
  { name: "John Smith", email: "john.smith@company.com", count: 15 },
  { name: "Sarah Johnson", email: "sarah.j@company.com", count: 12 },
  { name: "Michael Chen", email: "m.chen@company.com", count: 8 },
  { name: "Emma Davis", email: "emma.d@company.com", count: 7 }
];

// Updated StatCard component for more compact design
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-3 rounded-lg border shadow-sm">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-xs font-medium text-gray-600">{title}</h3>
      <Icon className="h-4 w-4 text-gray-400" />
    </div>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

// Updated RiskBar component for more compact design
const RiskBar = ({ label, count, total, color }) => {
  const percentage = Math.round((count / total) * 100) || 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">{count} ({percentage}%)</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function Actions() {
  // Update the initial state to use the full actions list
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedActionId, setExpandedActionId] = useState(null);
  const { toast } = useToast();
  const [selectedAction, setSelectedAction] = useState(null);
  const [showControlModal, setShowControlModal] = useState(false);
  const [showAddActionModal, setShowAddActionModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionToDelete, setActionToDelete] = useState(null);
  const [showTagEditModal, setShowTagEditModal] = useState(false);
  const [actionToEdit, setActionToEdit] = useState(null);
  const [editingTags, setEditingTags] = useState([]);
  const [activeTab, setActiveTab] = useState("actions");

  const [groupBy, setGroupBy] = useState("none");

  // Update the initial state of filters to show all actions by default
  const [filters, setFilters] = useState({
    timeRange: 'all-time',
    dataSources: [],
    domains: [],
    riskLevels: [],
    statuses: [],
    searchTerm: '',
    sortBy: 'risk_level',
    sortOrder: 'desc',
  });

  const [addActionProvider, setAddActionProvider] = useState("");
  const [addActionName, setAddActionName] = useState("");
  const [addCustomActionName, setAddCustomActionName] = useState("");
  const [addCustomActionProvider, setAddCustomActionProvider] = useState("");
  const [addActionTab, setAddActionTab] = useState("predefined");

  // Update the useEffect to use our direct list
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setActions([]); // Clear current actions
      
      setTimeout(() => {
        setActions(ACTIONS_LIST);
        setLoading(false);
      }, 100);
    };
    
    loadData();
    
    setFilters(prev => ({
      ...prev,
      timeRange: 'all-time'
    }));
  }, []);

  const getTimeRangeDate = (range) => {
    const now = new Date();
    switch (range) {
      case 'last-day':
        return new Date(now.setDate(now.getDate() - 1));
      case 'last-week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'last-month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'all-time':
        return new Date(0); // January 1, 1970 - showing all actions
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  };

  const filteredActions = useMemo(() => {
    if (!actions) return [];
    
    let filtered = actions.filter(action => {
      // Skip time range filtering if 'all-time' is selected
      if (filters.timeRange !== 'all-time') {
        const timeRangeDate = getTimeRangeDate(filters.timeRange);
        if (new Date(action.last_seen) < timeRangeDate) {
          return false;
        }
      }

      // Search term filtering
      if (filters.searchTerm && !action.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Data source filtering
      if (filters.dataSources.length > 0 && !filters.dataSources.includes(action.data_source)) {
        return false;
      }

      // Domain filtering
      if (filters.domains.length > 0 && !filters.domains.includes(action.domain)) {
        return false;
      }

      // Risk level filtering
      if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(action.risk_level)) {
        return false;
      }

      // Status filtering
      if (filters.statuses.length > 0 && !filters.statuses.includes(action.status)) {
        return false;
      }

      return true;
    });

    // Sort filtered actions
    if (filters.sortBy === 'risk_level') {
      const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => {
        const orderA = riskOrder[a.risk_level];
        const orderB = riskOrder[b.risk_level];
        return filters.sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
      });
    } else if (filters.sortBy === 'last_seen') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.last_seen);
        const dateB = new Date(b.last_seen);
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (filters.sortBy === 'name') {
      filtered.sort((a, b) => {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      });
    }

    return filtered;
  }, [actions, filters]);

  const groupedActions = useMemo(() => {
    if (!filteredActions) return [];
  
    if (groupBy === "none") {
      return [{ name: "All Actions", items: filteredActions }];
    }
  
    const grouped = filteredActions.reduce((acc, action) => {
      const key = action[groupBy];
      if (!acc[key]) {
        acc[key] = { name: key, items: [] };
      }
      acc[key].items.push(action);
      return acc;
    }, {});
  
    if (groupBy === "risk_level") {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return Object.values(grouped).sort((a, b) => {
        return order[a.name] - order[b.name];
      });
    }
  
    return Object.values(grouped);
  }, [filteredActions, groupBy]);

  const handleRowClick = (actionId) => {
    setExpandedActionId(expandedActionId === actionId ? null : actionId);
  };

  const handleApplyControl = (action) => {
    setSelectedAction(action);
    setShowControlModal(true);
  };

  const handleDeleteAction = (action) => {
    setActionToDelete(action);
    setShowDeleteDialog(true);
  };

  const handleEditTags = (action, e) => {
    e.stopPropagation();
    setActionToEdit(action);
    setEditingTags(action.tags || []);
    setShowTagEditModal(true);
  };

  const handleClearFilters = () => {
    setFilters({
      timeRange: 'all-time',
      dataSources: [],
      domains: [],
      riskLevels: [],
      statuses: [],
      searchTerm: '',
      sortBy: 'risk_level',
      sortOrder: 'desc',
    });
  };

  const confirmDelete = async () => {
    try {
      const updatedActions = actions.filter(a => a.id !== actionToDelete.id);
      setActions(updatedActions);
      toast({
        title: "Action deleted",
        description: "The action has been removed from your inventory."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting action",
        description: "Please try again later."
      });
    }
    setShowDeleteDialog(false);
    setActionToDelete(null);
  };

  const handleSaveTags = () => {
    const updatedActions = actions.map(action => {
      if (action.id === actionToEdit.id) {
        return { ...action, tags: editingTags };
      }
      return action;
    });
    setActions(updatedActions);
    setShowTagEditModal(false);
    setActionToEdit(null);
    toast({
      title: "Tags updated",
      description: "Tags have been updated successfully."
    });
  };

  const handleAddAction = (newAction) => {
    const id = actions.length > 0 ? Math.max(...actions.map(a => a.id)) + 1 : 1;
    const actionToAdd = {
      id,
      name: newAction.name,
      domain: "cloud",
      data_source: newAction.provider,
      type: newAction.type === "custom" ? "custom" : "observed",
      risk_level: "medium",
      status: "uncontrolled",
      frequency: 1.0,
      last_seen: new Date().toISOString(),
      first_seen: new Date().toISOString(),
      location: "US-East",
      performed_by: "admin@company.com",
      risk_score: 75,
      tags: [],
      low_risk_count: 5,
      medium_risk_count: 10,
      high_risk_count: 0,
      top_performers: [
        { name: "admin@company.com", count: 5 }
      ]
    };
    
    setActions([...actions, actionToAdd]);
    toast({
      title: "Action added",
      description: `${newAction.name} has been added to your inventory.`
    });
  };

  // Updated renderExpandedContent for more compact design
  const renderExpandedContent = (action) => {
    const totalRiskCount = action.low_risk_count + action.medium_risk_count + action.high_risk_count;
    
    return (
      <div className="bg-gray-50 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatCard
            title="Frequency"
            value={`${action.frequency.toFixed(1)}/month`}
            icon={Clock}
          />
          <StatCard
            title="Risk Score"
            value={action.risk_score}
            icon={AlertTriangle}
          />
          <StatCard
            title="Total Occurrences"
            value={totalRiskCount}
            icon={Hash}
          />
          <StatCard
            title="Last Performed"
            value={format(new Date(action.last_seen), 'MMM d, yyyy')}
            icon={Calendar}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <h3 className="text-sm font-medium mb-2">Risk Analysis</h3>
            <div className="space-y-2">
              <RiskBar
                label="High Risk"
                count={action.high_risk_count}
                total={totalRiskCount}
                color="bg-red-500"
              />
              <RiskBar
                label="Medium Risk"
                count={action.medium_risk_count}
                total={totalRiskCount}
                color="bg-yellow-500"
              />
              <RiskBar
                label="Low Risk"
                count={action.low_risk_count}
                total={totalRiskCount}
                color="bg-green-500"
              />
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border">
            <h3 className="text-sm font-medium mb-2">Applied Controls</h3>
            {action.status === 'controlled' ? (
              <div className="flex items-start gap-2">
                <div className="p-1 bg-green-100 rounded-full">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Multi-Party Approval</h4>
                  <p className="text-xs text-gray-600">Requires approval from 2 team members</p>
                  <p className="text-xs text-gray-500">Applied: April 10, 2024</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-2">No controls applied</p>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleApplyControl(action)}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Apply Control
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <h3 className="text-sm font-medium mb-2">Top Performers</h3>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_PERFORMERS.map((performer, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {performer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium">{performer.name}</span>
                    <span className="text-xs text-gray-500 block">{performer.email}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{performer.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActionsTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => setFilters(prev => ({
                ...prev,
                sortBy: 'name',
                sortOrder: prev.sortBy === 'name' && prev.sortOrder === 'asc' ? 'desc' : 'asc',
              }))}
              className="cursor-pointer"
            >
              Action Name
              {filters.sortBy === 'name' && (filters.sortOrder === 'asc' ? <ChevronDown className="inline-block w-4 h-4 ml-1" /> : <ChevronRight className="inline-block w-4 h-4 ml-1 rotate-90" />)}
            </TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead onClick={() => setFilters(prev => ({
                ...prev,
                sortBy: 'risk_level',
                sortOrder: prev.sortBy === 'risk_level' && prev.sortOrder === 'asc' ? 'desc' : 'asc',
              }))}
              className="cursor-pointer"
            >
              Risk Level
              {filters.sortBy === 'risk_level' && (filters.sortOrder === 'asc' ? <ChevronDown className="inline-block w-4 h-4 ml-1" /> : <ChevronRight className="inline-block w-4 h-4 ml-1 rotate-90" />)}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead onClick={() => setFilters(prev => ({
                ...prev,
                sortBy: 'last_seen',
                sortOrder: prev.sortBy === 'last_seen' && prev.sortOrder === 'asc' ? 'desc' : 'asc',
              }))}
              className="cursor-pointer"
            >
              Last Seen
              {filters.sortBy === 'last_seen' && (filters.sortOrder === 'asc' ? <ChevronDown className="inline-block w-4 h-4 ml-1" /> : <ChevronRight className="inline-block w-4 h-4 ml-1 rotate-90" />)}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedActions.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {groupBy !== 'none' && (
                <TableRow>
                  <TableCell 
                    colSpan={8} 
                    className="bg-gray-100 font-semibold text-gray-800 py-2 border-t border-b"
                  >
                    <div className="flex items-center gap-2">
                      {groupBy === 'domain' && <Database className="h-4 w-4" />}
                      {groupBy === 'data_source' && <Server className="h-4 w-4" />}
                      {groupBy === 'risk_level' && <AlertTriangle className="h-4 w-4" />}
                      {groupBy === 'status' && <Shield className="h-4 w-4" />}
                      {group.name.charAt(0).toUpperCase() + group.name.slice(1)}
                      <Badge variant="secondary">{group.items.length}</Badge>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {group.items.map((action) => (
                <React.Fragment key={action.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() => handleRowClick(action.id)}
                  >
                    <TableCell className="font-medium">{action.name}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                              {DATA_SOURCE_LOGOS[action.data_source] ? (
                                <img 
                                  src={DATA_SOURCE_LOGOS[action.data_source]} 
                                  alt={action.data_source} 
                                  className="w-6 h-6 object-contain"
                                />
                              ) : (
                                <Database className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {action.data_source}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge className={DOMAIN_COLORS[action.domain]}>
                        {action.domain.charAt(0).toUpperCase() + action.domain.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={RISK_LEVEL_COLORS[action.risk_level]}>
                        {action.risk_level.charAt(0).toUpperCase() + action.risk_level.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[action.status]}>
                        {action.status === 'controlled' ? 'Controlled' : 'Uncontrolled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {action.tags && action.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(action.last_seen), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyControl(action);
                          }}
                          className="h-8 w-8 text-blue-600"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => handleEditTags(action, e)}
                          className="h-8 w-8"
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAction(action);
                          }}
                          className="h-8 w-8 text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedActionId === action.id && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-0">
                        {renderExpandedContent(action)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderPoliciesScreen = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Policies</h1>
      <p className="text-gray-600">This is where you can manage and create policies.</p>
      {/* Policy Management UI elements would go here */}
      <div className="mt-4">
        <Button className="bg-blue-600 hover:bg-blue-700">Create New Policy</Button>
      </div>
    </div>
  );

  // Update the table to make group headers more distinct
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{activeTab === "actions" ? "Actions" : "Policies"}</h1>
          {activeTab === "actions" && (
            <Button onClick={() => setShowAddActionModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Action
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>
          <TabsContent value="actions">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search actions..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.dataSources.length > 0 ? filters.dataSources[0] : ''}
                  onValueChange={(value) => setFilters(prev => ({
                    ...prev,
                    dataSources: value ? [value] : []
                  }))}
                >
                  <SelectTrigger className={cn(
                    "w-[160px]",
                    filters.dataSources.length > 0 && "border-blue-600 text-blue-600"
                  )}>
                    <SelectValue placeholder="Data Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All Sources</SelectItem>
                    {Object.keys(DATA_SOURCE_LOGOS).map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
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
                    {Object.keys(DOMAIN_COLORS).map(domain => (
                      <SelectItem key={domain} value={domain}>
                        {domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </SelectItem>
                    ))}
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
                    {Object.keys(RISK_LEVEL_COLORS).map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.statuses.length > 0 ? filters.statuses[0] : ''}
                  onValueChange={(value) => setFilters(prev => ({
                    ...prev,
                    statuses: value ? [value] : []
                  }))}
                >
                  <SelectTrigger className={cn(
                    "w-[140px]",
                    filters.statuses.length > 0 && "border-blue-600 text-blue-600"
                  )}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All Statuses</SelectItem>
                    <SelectItem value="controlled">Controlled</SelectItem>
                    <SelectItem value="uncontrolled">Uncontrolled</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={groupBy}
                  onValueChange={setGroupBy}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Group By" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUP_BY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.timeRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-day">Last 24 Hours</SelectItem>
                    <SelectItem value="last-week">Last 7 Days</SelectItem>
                    <SelectItem value="last-month">Last 30 Days</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>

                {(filters.searchTerm || 
                  filters.dataSources.length > 0 || 
                  filters.domains.length > 0 || 
                  filters.riskLevels.length > 0 || 
                  filters.statuses.length > 0 || 
                  filters.timeRange !== 'all-time') && (
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

            {renderActionsTable()}
          </TabsContent>
          <TabsContent value="policies">
            {renderPoliciesScreen()}
          </TabsContent>
        </Tabs>

        <AddActionModal 
          open={showAddActionModal} 
          onClose={() => setShowAddActionModal(false)} 
          onAdd={handleAddAction}
        />

        <Dialog open={showTagEditModal} onOpenChange={setShowTagEditModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Tags</DialogTitle>
              <DialogDescription>
                Add or remove tags for {actionToEdit?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {editingTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => setEditingTags(editingTags.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Add Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {["security", "iam", "compliance", "critical", "monitored", "sensitive"].map((tag) => (
                    !editingTags.includes(tag) && (
                      <Badge 
                        key={tag} 
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setEditingTags([...editingTags, tag])}
                      >
                        + {tag}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Custom Tag</Label>
                <div className="flex mt-2">
                  <Input
                    placeholder="Enter custom tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        setEditingTags([...editingTags, e.target.value]);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button 
                    className="ml-2"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Enter custom tag"]');
                      if (input && input.value) {
                        setEditingTags([...editingTags, input.value]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTagEditModal(false)}>Cancel</Button>
              <Button onClick={handleSaveTags}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showControlModal} onOpenChange={setShowControlModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Apply Control to Action</DialogTitle>
              <DialogDescription>
                Choose how to handle {selectedAction?.name || 'this action'} when it occurs
              </DialogDescription>
            </DialogHeader>

            <ControlModalContent action={selectedAction} onClose={() => setShowControlModal(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this action? This will remove it from your inventory.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ControlModalContent({ action, onClose }) {
  const { toast } = useToast();
  const [controlType, setControlType] = useState('mpa');
  const [approvalType, setApprovalType] = useState('human');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState(['high', 'critical']);
  const [vetoRights, setVetoRights] = useState({});
  const [notificationChannels, setNotificationChannels] = useState(['email']);
  const [loading, setLoading] = useState(false);
  const [requiredApprovals, setRequiredApprovals] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');

  const handleApply = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Control applied successfully",
        description: `${action?.name || 'This action'} is now controlled`,
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error applying control",
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTeam = (teamId) => {
    setSelectedTeams(prev => 
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleVetoRights = (userId) => {
    setVetoRights(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Filter users based on search term
  const filteredUsers = SAMPLE_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 py-4">
      <RadioGroup value={controlType} onValueChange={setControlType}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <RadioGroupItem value="mpa" id="mpa" className="peer sr-only" />
            <Label
              htmlFor="mpa"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer shadow-sm"
            >
              <User className="mb-3 h-6 w-6 text-blue-600" />
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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer shadow-sm"
            >
              <Shield className="mb-3 h-6 w-6 text-purple-600" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">MFA Challenge</p>
                <p className="text-xs text-gray-500">
                  Require additional authentication
                </p>
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="notify" id="notify" className="peer sr-only" />
            <Label
              htmlFor="notify"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer shadow-sm"
            >
              <Bell className="mb-3 h-6 w-6 text-green-600" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">Notify</p>
                <p className="text-xs text-gray-500">
                  Send notifications when action occurs
                </p>
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="ai" id="ai" className="peer sr-only" />
            <Label
              htmlFor="ai"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer shadow-sm"
            >
              <BrainCircuit className="mb-3 h-6 w-6 text-orange-600" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">Alert</p>
                <p className="text-xs text-gray-500">
                  Send alerts to security systems
                </p>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-sm font-medium mb-3">Apply control to risk levels:</h3>
        <div className="flex flex-wrap gap-2">
          {['low', 'medium', 'high', 'critical'].map((level) => (
            <Badge 
              key={level}
              variant={selectedRiskLevels.includes(level) ? 'default' : 'outline'}
              className={`cursor-pointer hover:opacity-80 ${
                selectedRiskLevels.includes(level) ? 'bg-blue-500' : ''
              }`}
              onClick={() => {
                setSelectedRiskLevels(prev => 
                  prev.includes(level) 
                    ? prev.filter(l => l !== level)
                    : [...prev, level]
                );
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {controlType === 'ai' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BrainCircuit className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h4 className="font-medium text-purple-800">Agentic AI Approver</h4>
              <p className="text-sm text-purple-700 mt-1">
                The AI agent will analyze action context, historical patterns, and security best practices to 
                automatically approve or deny actions. It continuously learns from your organization's behavior 
                and adapts to new threats.
              </p>
              <div className="mt-3">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  Adapts to security policies
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 ml-2">
                  Reduces approval time
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 ml-2">
                  24/7 availability
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {controlType === 'mpa' && (
        <div className="space-y-4">
          <RadioGroup value={approvalType} onValueChange={setApprovalType}>
            <div className="space-y-2">
              <Label>Approval Type</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="human" id="human" className="peer sr-only" />
                  <Label
                    htmlFor="human"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                  >
                    <User className="mb-2 h-5 w-5" />
                    <span className="text-sm">Human Approval</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="team" id="team" className="peer sr-only" />
                  <Label
                    htmlFor="team"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                  >
                    <Users className="mb-2 h-5 w-5" />
                    <span className="text-sm">Team-based</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="ai" id="approval_ai" className="peer sr-only" />
                  <Label
                    htmlFor="approval_ai"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                  >
                    <BrainCircuit className="mb-2 h-5 w-5" />
                    <span className="text-sm">Agentic AI</span>
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>

          {approvalType === 'ai' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BrainCircuit className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-medium text-purple-800">Agentic AI Approver</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    The AI agent will analyze action context, historical patterns, and security best practices to 
                    automatically approve or deny actions. It continuously learns from your organization's behavior 
                    and adapts to new threats.
                  </p>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Adapts to security policies
                    </Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 ml-2">
                      Reduces approval time
                    </Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 ml-2">
                      24/7 availability
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {approvalType === 'human' && (
            <div>
              <Label className="mb-2 block">Select Approvers</Label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-2">
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedUsers.map(userId => {
                      const user = SAMPLE_USERS.find(u => u.id === userId);
                      return (
                        <div key={userId} className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                          <span>{user?.name}</span>
                          <div className="flex items-center ml-2 gap-1 text-xs">
                            <Checkbox 
                              id={`veto-${userId}`}
                              checked={vetoRights[userId] || false}
                              onCheckedChange={() => toggleVetoRights(userId)}
                            />
                            <label htmlFor={`veto-${userId}`} className="cursor-pointer">Veto</label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 ml-1"
                            onClick={() => toggleUser(userId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  {filteredUsers.map(user => (
                    <div 
                      key={user.id} 
                      className={`flex items-center p-2 rounded-md border cursor-pointer ${
                        selectedUsers.includes(user.id) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleUser(user.id)}
                    >
                      <Checkbox 
                        checked={selectedUsers.includes(user.id)}
                        className="mr-2"
                      />
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {approvalType === 'team' && (
            <div>
              <Label className="mb-2 block">Select Teams</Label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search teams..."
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_TEAMS.map(team => (
                  <div 
                    key={team.id} 
                    className={`flex items-center p-2 rounded-md border cursor-pointer ${
                      selectedTeams.includes(team.id) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleTeam(team.id)}
                  >
                    <Checkbox 
                      checked={selectedTeams.includes(team.id)}
                      className="mr-2"
                    />
                    <div>{team.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Only show required approvals section if not using AI approver */}
          {approvalType !== 'ai' && (
            <div className="space-y-2">
              <Label>Required Approvals</Label>
              <Select value={requiredApprovals} onValueChange={setRequiredApprovals}>
                <SelectTrigger>
                  <SelectValue placeholder="Number of approvals required" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 approval required</SelectItem>
                  <SelectItem value="2">2 approvals required</SelectItem>
                  <SelectItem value="3">3 approvals required</SelectItem>
                  <SelectItem value="all">All must approve</SelectItem>
                  <SelectItem value="majority">Majority required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Only show notification channels if not using AI approver */}
          {approvalType !== 'ai' && (
            <div className="space-y-2">
              <Label>Notification Channels</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={notificationChannels.includes('slack') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('slack')
                        ? prev.filter(c => c !== 'slack')
                        : [...prev, 'slack']
                    )
                  }}
                  className="gap-2"
                >
                  Slack
                </Button>
                <Button
                  variant={notificationChannels.includes('teams') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('teams')
                        ? prev.filter(c => c !== 'teams')
                        : [...prev, 'teams']
                    )
                  }}
                >
                  Teams
                </Button>
                <Button
                  variant={notificationChannels.includes('email') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('email')
                        ? prev.filter(c => c !== 'email')
                        : [...prev, 'email']
                    )
                  }}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button
                  variant={notificationChannels.includes('whatsapp') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('whatsapp')
                        ? prev.filter(c => c !== 'whatsapp')
                        : [...prev, 'whatsapp']
                    )
                  }}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {controlType === 'notify' && (
        <div className="space-y-4">
          <div>
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search users or teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="col-span-2 md:col-span-3 font-medium text-sm mb-2">Individual Users</div>
                {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={`flex items-center p-2 rounded-md border cursor-pointer ${
                      selectedUsers.includes(user.id) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleUser(user.id)}
                  >
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      className="mr-2"
                    />
                    <div>
                      <div>{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ))}
                
                <div className="col-span-2 md:col-span-3 font-medium text-sm mt-4 mb-2">Teams</div>
                {SAMPLE_TEAMS.map(team => (
                  <div 
                    key={team.id} 
                    className={`flex items-center p-2 rounded-md border cursor-pointer ${
                      selectedTeams.includes(team.id) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleTeam(team.id)}
                  >
                    <Checkbox 
                      checked={selectedTeams.includes(team.id)}
                      className="mr-2"
                    />
                    <div>{team.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label>Notification Channels</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={notificationChannels.includes('slack') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('slack')
                        ? prev.filter(c => c !== 'slack')
                        : [...prev, 'slack']
                    )
                  }}
                  className="gap-2"
                >
                  Slack
                </Button>
                <Button
                  variant={notificationChannels.includes('teams') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('teams')
                        ? prev.filter(c => c !== 'teams')
                        : [...prev, 'teams']
                    )
                  }}
                >
                  Teams
                </Button>
                <Button
                  variant={notificationChannels.includes('email') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('email')
                        ? prev.filter(c => c !== 'email')
                        : [...prev, 'email']
                    )
                  }}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button
                  variant={notificationChannels.includes('whatsapp') ? 'default' : 'outline'}
                  onClick={() => {
                    setNotificationChannels(prev =>
                      prev.includes('whatsapp')
                        ? prev.filter(c => c !== 'whatsapp')
                        : [...prev, 'whatsapp']
                    )
                  }}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {controlType === 'mfa' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>MFA Type</Label>
            <Select defaultValue="totp">
              <SelectTrigger>
                <SelectValue placeholder="Select MFA type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totp">Time-based OTP</SelectItem>
                <SelectItem value="hardware">Hardware Key</SelectItem>
                <SelectItem value="biometric">Biometric</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>MFA Timeout</Label>
            <Select defaultValue="5">
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

      {controlType === 'alert' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Alert Destination</Label>
            <Select defaultValue="siem">
              <SelectTrigger>
                <SelectValue placeholder="Select alert destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="siem">SIEM System</SelectItem>
                <SelectItem value="ticketing">Ticketing System</SelectItem>
                <SelectItem value="webhook">Custom Webhook</SelectItem>
                <SelectItem value="logging">Log Analytics</SelectItem>
                <SelectItem value="security_platform">Security Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Alert Severity</Label>
            <Select defaultValue="high">
              <SelectTrigger>
                <SelectValue placeholder="Select alert severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleApply}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Applying..." : "Apply Control"}
        </Button>
      </DialogFooter>
    </div>
  );
}

export { ControlModalContent };
