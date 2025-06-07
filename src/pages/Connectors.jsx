
import React, { useState, useEffect } from 'react';
import { Connector } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  TabsList,
  TabsTrigger,
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import { 
  Check, Clock, Filter, Link, Unlink, Info, Search, Shield, 
  Play, X, Plus, MessageCirclePlus, Copy, RefreshCw, Clipboard,
  TerminalSquare, Server, Database, AlertOctagon, CheckCircle2,
  Edit2, Trash2, LayoutGrid, List as ListIcon
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/components/lib/store";
import { cn } from "@/lib/utils";

// Update the logo URLs to more reliable sources
const DATA_SOURCE_LOGOS = {
  // Cloud Infrastructure
  "AWS": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  "Azure": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
  "GCP": "https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Cloud_Logo.svg",

  // IAM & Directory Services
  "Okta": "https://upload.wikimedia.org/wikipedia/commons/0/06/Okta_Logo.svg",
  "Azure Active Directory": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_Azure_Active_Directory.svg",
  "Active Directory": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Microsoft_Active_Directory.svg",
  
  // Developer Platforms
  "GitHub": "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  "GitLab": "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg",
  
  // SaaS Applications
  "Salesforce": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  "Monday.com": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Monday_logo.svg",
  "Jira": "https://upload.wikimedia.org/wikipedia/commons/8/82/Jira_%28Software%29_logo.svg",
  "Zoom": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Zoom_logo.svg",
  "Slack": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
  
  // EDR
  "CrowdStrike Falcon": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Crowdstrike_logo.svg",
  "SentinelOne": "https://upload.wikimedia.org/wikipedia/commons/7/7a/SentinelOne_logo.svg",
  "Microsoft Defender": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Microsoft_Defender_logo.svg",
  "Palo Alto Cortex XDR": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Palo_Alto_Networks_logo.svg",
  
  // CI/CD & Automation
  "Jenkins": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg",
  "GitHub Actions": "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  "CircleCI": "https://upload.wikimedia.org/wikipedia/commons/8/82/CircleCI_logo.svg",
  
  // ITSM
  "ServiceNow": "https://www.svgrepo.com/show/448244/servicenow.svg",
  
  // Monitoring & Logging
  "Datadog": "https://www.svgrepo.com/show/448232/datadog.svg",
  "Splunk": "https://www.svgrepo.com/show/448246/splunk.svg",
  "Elastic": "https://www.svgrepo.com/show/448230/elastic.svg",
  "Microsoft Sentinel": "https://www.svgrepo.com/show/448240/sentinel.svg",
  "CloudTrail": "https://www.svgrepo.com/show/448228/cloudtrail.svg",
  
  // Secrets & Key Management
  "AWS Secrets Manager": "https://www.svgrepo.com/show/448267/aws-secrets.svg",
  "Azure Key Vault": "https://www.svgrepo.com/show/448278/azure-key-vault.svg",
  "GCP Secret Manager": "https://www.svgrepo.com/show/448284/gcp-secrets.svg",
  "HashiCorp Vault": "https://www.svgrepo.com/show/448285/vault.svg",
  
  // Identity Governance
  "Saviynt": "https://www.svgrepo.com/show/448243/saviynt.svg",
  "SailPoint": "https://www.svgrepo.com/show/448242/sailpoint.svg"
};

// Helper function to create connector state objects
const createConnectorState = (connector, connected = false, controlEnabled = false) => {
  return {
    id: Math.floor(Math.random() * 10000),
    name: connector.name,
    type: connector.type,
    provider: connector.provider,
    description: connector.description,
    logo_url: DATA_SOURCE_LOGOS[connector.provider] || "",
    connection_status: connected ? "connected" : "not_connected",
    control_status: connected && controlEnabled ? "enabled" : "disabled",
    supported_controls: connector.supported_controls || [],
    domains_covered: [connector.type],
    last_sync: connected ? new Date().toISOString() : null,
    connected_since: connected ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    action_count: connected ? Math.floor(Math.random() * 200) : 0
  };
};

export default function Connectors() {
  const { toast } = useToast();
  const { 
    connectors: connectorStates, 
    totalConnectors, 
    updateConnectorState, 
    initializeConnectors,
    manualIntegrations,
    addManualIntegration,
    deleteManualIntegration,
    updateManualIntegration,
    addManualIntegrationEvent,
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    controlStatus: '',
    type: ''
  });
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [showConnectorDetails, setShowConnectorDetails] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingConnector, setConnectingConnector] = useState(null);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [showManualIntegrationModal, setShowManualIntegrationModal] = useState(false);
  const [showAddConnectorModal, setShowAddConnectorModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [integrationToDelete, setIntegrationToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showIntegrationEvents, setShowIntegrationEvents] = useState(false);
  const [activeIntegration, setActiveIntegration] = useState(null);
  const [showRegenerateKeyConfirm, setShowRegenerateKeyConfirm] = useState(false);
  const [view, setView] = useState('grid');
  const [showManualIntegrationDetails, setShowManualIntegrationDetails] = useState(false);

  // Initialize connector states from categories
  useEffect(() => {
    if (Object.keys(connectorStates).length === 0) {
      initializeConnectors(CONNECTOR_CATEGORIES);
    }
    setLoading(false);
  }, []);

  const handleConnect = (connector) => {
    setConnectingConnector(connector);
    setShowConnectModal(true);
  };

  const handleDisconnect = (connector) => {
    toast({
      title: `Disconnected ${connector.name}`,
      description: "The connector has been disconnected successfully."
    });
    
    // Update connector state to reflect disconnect
    updateConnectorState(connector, {
      connection_status: "not_connected",
      control_status: "disabled",
      last_sync: null
    });
  };

  const handleToggleControl = (connector, enabled) => {
    toast({
      title: `${enabled ? 'Enabled' : 'Disabled'} control for ${connector.name}`,
      description: `Control has been ${enabled ? 'enabled' : 'disabled'} successfully.`
    });
    
    // Update connector state to reflect control status change
    updateConnectorState(connector, {
      control_status: enabled ? "enabled" : "disabled"
    });
  };

  const handleViewDetails = (connector) => {
    setSelectedConnector(connector);
    setShowConnectorDetails(true);
  };

  const handleConnectConfirm = (connector) => {
    toast({
      title: `Connected to ${connector.name}`,
      description: "The connector has been connected successfully."
    });
    
    // Update connector state to reflect connection
    updateConnectorState(connector, {
      connection_status: "connected",
      last_sync: new Date().toISOString(),
      connected_since: new Date().toISOString(),
      action_count: Math.floor(Math.random() * 100)
    });
    
    setShowConnectModal(false);
  };

  const handleSuggestConnector = () => {
    // Show suggestion form
    setShowAddConnectorModal(true);
  };

  const handleAddManualIntegration = (data) => {
    if (selectedIntegration) {
      updateManualIntegration({ ...selectedIntegration, ...data });
      toast({
        title: "Manual Integration Updated",
        description: "Your integration has been updated successfully."
      });
    } else {
      addManualIntegration(data);
      toast({
        title: "Manual Integration Created",
        description: "Your integration has been created successfully."
      });
    }
    
    setShowManualIntegrationModal(false);
    setSelectedIntegration(null); // Reset selected integration after adding/editing

    // Set a timeout to refresh the page after closing the modal
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleEditManualIntegration = (integration) => {
    setSelectedIntegration(integration);
    setShowManualIntegrationModal(true);
  };

  const handleDeleteManualIntegration = (integration) => {
    // First show confirmation dialog
    setIntegrationToDelete(integration);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteIntegration = () => {
    if (integrationToDelete) {
      deleteManualIntegration(integrationToDelete.id);
      
      toast({
        title: "Integration deleted",
        description: "The manual integration has been removed successfully."
      });
      
      setShowDeleteConfirmation(false);
      setIntegrationToDelete(null);
    }
  };

  const handleViewManualIntegration = (integration) => {
    setActiveIntegration(integration);
    setShowManualIntegrationDetails(true);
  };

  const handleCopyWebhookUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Webhook URL copied",
        description: "Webhook URL has been copied to clipboard."
      });
    });
  };

  const handleCopyApiKey = (key) => {
    navigator.clipboard.writeText(key).then(() => {
      toast({
        title: "API Key copied",
        description: "API key has been copied to clipboard."
      });
    });
  };

  const handleRegenerateApiKey = (integration) => {
    setActiveIntegration(integration);
    setShowRegenerateKeyConfirm(true);
  };

  const confirmRegenerateKey = () => {
    if (activeIntegration) {
      const newApiKey = generateApiKey();
      updateManualIntegration({ 
        ...activeIntegration, 
        api_key: newApiKey 
      });
      
      toast({
        title: "API Key regenerated",
        description: "A new API key has been generated for this integration."
      });
      
      setShowRegenerateKeyConfirm(false);
    }
  };

  // Helper function to generate API key
  const generateApiKey = () => {
    return 'js_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 32);
  };

  // Filter connectors based on search and filters
  const filteredConnectors = React.useMemo(() => {
    if (Object.keys(connectorStates).length === 0) {
      return {};
    }
    
    const filtered = {};
    let count = 0;
    
    Object.entries(connectorStates).forEach(([category, connectors]) => {
      filtered[category] = connectors.filter(connector => {
        // Apply search filter
        if (searchTerm && !connector.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !connector.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Apply status filter
        if (filters.status && connector.connection_status !== filters.status) {
          return false;
        }
        
        // Apply control status filter
        if (filters.controlStatus && connector.control_status !== filters.controlStatus) {
          return false;
        }
        
        // Apply type filter
        if (filters.type && connector.type !== filters.type) {
          return false;
        }
        
        count++;
        return true;
      });
    });
    
    setFilteredTotal(count);
    return filtered;
  }, [connectorStates, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      status: '',
      controlStatus: '',
      type: ''
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Connectors</h1>
          <div className="mt-8 text-center">Loading connectors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Connectors</h1>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "px-2 py-1",
                  view === 'grid' && "bg-white shadow-sm"
                )}
                onClick={() => setView('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "px-2 py-1",
                  view === 'list' && "bg-white shadow-sm"
                )}
                onClick={() => setView('list')}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleSuggestConnector}
                className="gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <MessageCirclePlus className="w-4 h-4" />
                Suggest a Connector
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => setShowManualIntegrationModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Connector
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search connectors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Connection Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Statuses</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="not_connected">Not Connected</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.controlStatus} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, controlStatus: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Control Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Control Statuses</SelectItem>
                <SelectItem value="enabled">Control Enabled</SelectItem>
                <SelectItem value="disabled">Control Disabled</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.type} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Types</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="identity">Identity</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="cicd">CI/CD</SelectItem>
                <SelectItem value="itsm">ITSM</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="secrets">Secrets</SelectItem>
                <SelectItem value="governance">Governance</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || filters.status || filters.controlStatus || filters.type) && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Connectors Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredTotal} of {totalConnectors} connectors
        </div>

        {/* Connectors Categories */}
        <div className="space-y-8">
          {Object.entries(CONNECTOR_CATEGORIES).map(([key, category]) => {
            // Skip categories with no matching connectors
            if (!filteredConnectors[key] || filteredConnectors[key]?.length === 0) {
              return null;
            }

            return (
              <div key={key} className="space-y-4">
                <h2 className="text-lg font-medium">
                  {category.name}
                </h2>
                {view === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredConnectors[key]?.map((connector) => (
                      <ConnectorCard
                        key={connector.id}
                        connector={connector}
                        onConnect={() => handleConnect(connector)}
                        onDisconnect={() => handleDisconnect(connector)}
                        onToggleControl={(enabled) => handleToggleControl(connector, enabled)}
                        onViewDetails={() => handleViewDetails(connector)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConnectors[key]?.map((connector) => (
                      <ConnectorListItem
                        key={connector.id}
                        connector={connector}
                        onConnect={() => handleConnect(connector)}
                        onDisconnect={() => handleDisconnect(connector)}
                        onToggleControl={(enabled) => handleToggleControl(connector, enabled)}
                        onViewDetails={() => handleViewDetails(connector)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Manual Integrations Section */}
          {manualIntegrations && manualIntegrations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">
                Manual Integrations
              </h2>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {manualIntegrations.map((integration) => (
                    <ManualIntegrationCard
                      key={integration.id}
                      integration={integration}
                      onViewDetails={() => handleViewManualIntegration(integration)}
                      onEdit={handleEditManualIntegration}
                      onDelete={handleDeleteManualIntegration}
                      view={view}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {manualIntegrations.map((integration) => (
                    <ManualIntegrationCard
                      key={integration.id}
                      integration={integration}
                      onViewDetails={() => handleViewManualIntegration(integration)}
                      onEdit={handleEditManualIntegration}
                      onDelete={handleDeleteManualIntegration}
                      view={view}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Connector Details Sheet */}
      <ConnectorDetailsSheet
        open={showConnectorDetails}
        onClose={() => setShowConnectorDetails(false)}
        connector={selectedConnector}
        onDisconnect={() => {
          handleDisconnect(selectedConnector);
          setShowConnectorDetails(false);
        }}
        onConnect={() => {
          handleConnect(selectedConnector);
          setShowConnectorDetails(false);
        }}
        onToggleControl={(enabled) => handleToggleControl(selectedConnector, enabled)}
      />

      {/* Connect Modal */}
      <ConnectModal
        open={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        connector={connectingConnector}
        onConnect={handleConnectConfirm}
      />

      {/* Manual Integration Modal */}
      <ManualIntegrationDrawer
        open={showManualIntegrationModal}
        onClose={() => setShowManualIntegrationModal(false)}
        onAdd={handleAddManualIntegration}
        integration={selectedIntegration}
      />

      {/* Add Connector Modal */}
      <SuggestConnectorModal
        open={showAddConnectorModal}
        onClose={() => setShowAddConnectorModal(false)}
      />

      {/* Delete Integration Confirmation */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <div className="flex justify-between items-start">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Integration</AlertDialogTitle>
            </AlertDialogHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete the "{integrationToDelete?.name}" integration? This action cannot be undone.
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-medium">Deleting this integration will:</p>
              <ul className="list-disc pl-5 mt-2 text-orange-700 text-sm space-y-1">
                <li>Remove all associated webhook endpoints</li>
                <li>Invalidate the API key</li>
                <li>Delete all event history</li>
                <li>Remove any actions mapped to this integration</li>
              </ul>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 text-white hover:bg-red-700" 
              onClick={confirmDeleteIntegration}
            >
              Delete Integration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manual Integration Details */}
      <ManualIntegrationDetails 
        integration={activeIntegration}
        open={showManualIntegrationDetails}
        onClose={() => {
          setShowManualIntegrationDetails(false);
          setActiveIntegration(null);  // Clear the active integration when closing
        }}
        onDelete={handleDeleteManualIntegration}
        onCopyWebhook={handleCopyWebhookUrl}
        onCopyApiKey={handleCopyApiKey}
        onRegenerateKey={handleRegenerateApiKey}
      />

      {/* Regenerate API Key Confirmation */}
      <AlertDialog open={showRegenerateKeyConfirm} onOpenChange={setShowRegenerateKeyConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to regenerate the API key for "{activeIntegration?.name}"?
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">Warning:</p>
                <p className="text-yellow-700 text-sm mt-1">This will invalidate the current API key. Any systems using the existing key will need to be updated with the new key to continue sending events.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRegenerateKey}>
              Regenerate Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Connector Card Component
function ConnectorCard({ connector, onConnect, onDisconnect, onToggleControl, onViewDetails }) {
  const logoUrl = DATA_SOURCE_LOGOS[connector.provider] || `https://ui-avatars.com/api/?name=${encodeURIComponent(connector.name)}&background=random`;
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <img 
                src={logoUrl} 
                alt={connector.name} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(connector.name)}&background=random`;
                }}
              />
            </div>
            <div>
              <h3 className="font-medium">{connector.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge
                  variant={connector.connection_status === 'connected' ? 'success' : 'outline'}
                  className="text-xs"
                >
                  {connector.connection_status === 'connected' ? 'Connected' : 'Not Connected'}
                </Badge>
                {connector.connection_status === 'connected' && (
                  <Badge
                    variant={connector.control_status === 'enabled' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {connector.control_status === 'enabled' ? 'Control Enabled' : 'Control Disabled'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onViewDetails}>
            <Info className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{connector.description}</p>
        
        <div className="flex gap-2 mt-4">
          {connector.connection_status === 'connected' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onDisconnect}
              >
                <Unlink className="w-3 h-3 mr-1" />
                Disconnect
              </Button>
              <Button
                variant={connector.control_status === 'enabled' ? 'destructive' : 'default'}
                size="sm"
                className="flex-1"
                onClick={() => onToggleControl(connector.control_status !== 'enabled')}
              >
                <Shield className="w-3 h-3 mr-1" />
                {connector.control_status === 'enabled' ? 'Disable Control' : 'Enable Control'}
              </Button>
            </>
          ) : (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={onConnect}
            >
              <Link className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Update the ManualIntegrationCard to support list view
function ManualIntegrationCard({ integration, onViewDetails, onEdit, onDelete, view = 'grid' }) {
  if (view === 'list') {
    return (
      <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{integration.name}</h3>
              <p className="text-sm text-gray-500">{integration.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Badge variant="secondary">Custom Integration</Badge>
              <Badge variant={integration.events?.length > 0 ? 'success' : 'outline'}>
                {integration.events?.length > 0 ? 'Active' : 'No Events'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(integration)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(integration)} className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(integration)}>
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (existing card layout)
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{integration.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Custom Integration
                </Badge>
                <Badge
                  variant={integration.events?.length > 0 ? 'success' : 'outline'}
                  className="text-xs"
                >
                  {integration.events?.length > 0 ? 'Active' : 'No Events'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(integration)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(integration)} className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onViewDetails(integration)}>
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {integration.description || 'Custom integration using webhook API'}
        </p>
      </CardContent>
    </Card>
  );
}

// Connector Details Sheet
function ConnectorDetailsSheet({ open, onClose, connector, onDisconnect, onConnect, onToggleControl }) {
  if (!connector) return null;
  const logoUrl = DATA_SOURCE_LOGOS[connector.provider] || `https://ui-avatars.com/api/?name=${encodeURIComponent(connector.name)}&background=random`;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <img 
                src={logoUrl} 
                alt={connector.name} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(connector.name)}&background=random`;
                }}
              />
            </div>
            <SheetTitle>{connector.name}</SheetTitle>
          </div>
          <SheetDescription>{connector.description}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Connection Status</h4>
                <div className="flex items-center gap-2">
                  {connector.connection_status === 'connected' ? (
                    <>
                      <Check className="text-green-500 h-4 w-4" />
                      <span className="font-medium">Connected</span>
                    </>
                  ) : (
                    <>
                      <X className="text-red-500 h-4 w-4" />
                      <span className="font-medium">Not Connected</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Control Status</h4>
                <div className="flex items-center gap-2">
                  {connector.control_status === 'enabled' ? (
                    <>
                      <Shield className="text-blue-500 h-4 w-4" />
                      <span className="font-medium">Control Enabled</span>
                    </>
                  ) : (
                    <>
                      <Shield className="text-gray-400 h-4 w-4" />
                      <span className="font-medium">Control Disabled</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {connector.connection_status === 'connected' && (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Connected Since</h4>
                      <p className="font-medium">{format(new Date(connector.connected_since), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Last Sync</h4>
                      <p className="font-medium">{format(new Date(connector.last_sync), 'MMM d, yyyy HH:mm')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Domains Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {connector.domains_covered?.map(domain => (
                      <Badge key={domain} variant="secondary" className="capitalize">
                        {domain === 'saas' ? 'SaaS' : 
                         domain === 'on_prem' ? 'On-Premise' : 
                         domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Actions Discovered</h4>
                  <p className="font-medium">{connector.action_count} actions</p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Control Status</h4>
                <Switch 
                  checked={connector.control_status === 'enabled'} 
                  onCheckedChange={(checked) => onToggleControl(checked)}
                  disabled={connector.connection_status !== 'connected'}
                />
              </div>
              <p className="text-sm text-gray-500">
                {connector.connection_status !== 'connected' 
                  ? 'Connect this system first to enable controls.'
                  : connector.control_status === 'enabled' 
                    ? 'Controls are currently enabled for this connector.' 
                    : 'Enable controls to enforce policies on actions from this connector.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Supported Controls</h4>
              <div className="space-y-2">
                {connector.supported_controls?.includes('mpa') && (
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Multi-Party Approval</h5>
                      <p className="text-sm text-gray-600">Require approvals for sensitive actions</p>
                    </div>
                  </div>
                )}
                {connector.supported_controls?.includes('mfa') && (
                  <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium">MFA Challenge</h5>
                      <p className="text-sm text-gray-600">Require additional authentication</p>
                    </div>
                  </div>
                )}
                {connector.supported_controls?.includes('notification') && (
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Notifications</h5>
                      <p className="text-sm text-gray-600">Notify relevant users when actions happen</p>
                    </div>
                  </div>
                )}
                {connector.supported_controls?.includes('alert') && (
                  <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                    <AlertOctagon className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Alert</h5>
                      <p className="text-sm text-gray-600">Generate alerts for suspicious actions</p>
                    </div>
                  </div>
                )}
                {(!connector.supported_controls || connector.supported_controls.length === 0) && (
                  <div className="text-center py-6 text-gray-500">No controls supported</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            {connector.connection_status === 'connected' ? (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Top Actions</h4>
                <div className="space-y-2">
                  {connector.action_count > 0 ? (
                    ['Create User', 'Delete Resource', 'Modify Permissions', 'Admin Login'].map((action, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-gray-400" />
                          <span>{action}</span>
                        </div>
                        <Badge variant={idx % 3 === 0 ? 'destructive' : 'outline'}>
                          {idx % 3 === 0 ? 'High Risk' : 'Medium Risk'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No actions discovered yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Link className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <h4 className="font-medium mb-1">Not Connected</h4>
                <p className="text-sm text-gray-500 mb-4">Connect this system to discover actions</p>
                <Button onClick={onConnect}>Connect Now</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6 flex gap-2">
          {connector.connection_status === 'connected' ? (
            <>
              <Button
                variant="outline"
                onClick={onDisconnect}
                className="flex-1"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
              <Button
                variant={connector.control_status === 'enabled' ? 'destructive' : 'default'}
                onClick={() => onToggleControl(connector.control_status !== 'enabled')}
                className="flex-1"
              >
                <Shield className="w-4 h-4 mr-2" />
                {connector.control_status === 'enabled' ? 'Disable Control' : 'Enable Control'}
              </Button>
            </>
          ) : (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={onConnect}
            >
              <Link className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Connect Modal Component
function ConnectModal({ open, onClose, connector, onConnect }) {
  if (!connector) return null;
  const logoUrl = DATA_SOURCE_LOGOS[connector.provider] || `https://ui-avatars.com/api/?name=${encodeURIComponent(connector.name)}&background=random`;

  const [authType, setAuthType] = useState('oauth');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onConnect(connector);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <img 
                src={logoUrl} 
                alt={connector.name} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            Connect to {connector.name}
          </SheetTitle>
          <SheetDescription>
            Configure connection settings to enable monitoring and control.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Authentication Method</Label>
            <Select defaultValue={authType} onValueChange={setAuthType}>
              <SelectTrigger>
                <SelectValue placeholder="Select authentication method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oauth">OAuth 2.0</SelectItem>
                <SelectItem value="apikey">API Key</SelectItem>
                <SelectItem value="credentials">Username/Password</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {authType === 'apikey' && (
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input 
                type="password" 
                placeholder="Enter API key" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
              />
              <p className="text-xs text-gray-500">
                You can find your API key in the {connector.name} dashboard under settings.
              </p>
            </div>
          )}

          {authType === 'oauth' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                You'll be redirected to {connector.name} to authorize access. Jade Security requires the following permissions:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc">
                <li>Read access to users and groups</li>
                <li>Read access to activity logs and events</li>
                <li>Write access to apply controls (if enabled)</li>
              </ul>
            </div>
          )}

          {authType === 'credentials' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input placeholder="Enter username" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Enter password" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Enable Controls After Connection</Label>
              <Switch />
            </div>
            <p className="text-xs text-gray-500">
              Controls will be available but inactive until explicitly enabled.
            </p>
          </div>
        </div>

        <SheetFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700" 
            onClick={handleConnect}
            disabled={isLoading || (authType === 'apikey' && !apiKey)}
          >
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        </SheetFooter>
      </DialogContent>
    </Dialog>
  );
}

// Update the manual integration drawer to fix text overflow
function ManualIntegrationDrawer({ open, onClose, onAdd, integration }) {
  const [name, setName] = useState(integration?.name || '');
  const [description, setDescription] = useState(integration?.description || '');
  const [systemType, setSystemType] = useState(integration?.system_type || 'custom');

  useEffect(() => {
    if (integration) {
      setName(integration.name || '');
      setDescription(integration.description || '');
      setSystemType(integration.system_type || 'custom');
    } else {
      setName('');
      setDescription('');
      setSystemType('custom');
    }
  }, [integration]);

  const handleSubmit = () => {
    onAdd({
      name,
      description,
      system_type: systemType,
      label: name,
      id: integration?.id
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {integration ? 'Edit Manual Integration' : 'Add Manual Integration'}
          </SheetTitle>
          <SheetDescription>
            Create a webhook endpoint to receive events from custom or internal systems
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Integration Name</Label>
            <Input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Internal HR System"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this integration is for"
            />
          </div>

          <div className="space-y-2">
            <Label>System Type</Label>
            <Select value={systemType} onValueChange={setSystemType}>
              <SelectTrigger>
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Internal System</SelectItem>
                <SelectItem value="webhook">Generic Webhook</SelectItem>
                <SelectItem value="siem">SIEM Integration</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">What You'll Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Unique webhook URL for event ingestion</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Secure API key for authentication</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Built-in event viewer and monitoring</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {integration ? 'Update Integration' : 'Create Integration'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SuggestConnectorModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = () => {
    toast({
      title: "Connector suggested",
      description: "Thank you for your suggestion! We'll review it and get back to you."
    });
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCirclePlus className="w-6 h-6 text-green-600" />
            Suggest a Connector
          </DialogTitle>
          <DialogDescription className="text-base">
            Help us expand our ecosystem! Suggest a connector you'd like to see integrated with Jade Security.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Connector Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., MongoDB Atlas"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cloud">Cloud Infrastructure</SelectItem>
                <SelectItem value="identity">Identity Management</SelectItem>
                <SelectItem value="saas">SaaS Application</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="security">Security Tool</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="useCase">Your Use Case</Label>
            <Textarea 
              id="useCase" 
              placeholder="How would you use this connector?"
              value={useCase}
              onChange={e => setUseCase(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Your Email (Optional)</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="To notify you when this connector is available"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!name.trim() || !category}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Complete connector categories
const CONNECTOR_CATEGORIES = {
  cloud_infrastructure: {
    name: "Cloud Infrastructure",
    connectors: [
      {
        name: "AWS",
        description: "Amazon Web Services cloud infrastructure and services",
        provider: "AWS",
        type: "cloud",
        supported_controls: ["mpa", "mfa", "notification", "alert"]
      },
      {
        name: "Microsoft Azure",
        description: "Microsoft Azure cloud platform and services",
        provider: "Azure",
        type: "cloud",
        supported_controls: ["mpa", "mfa", "notification", "alert"]
      },
      {
        name: "Google Cloud Platform",
        description: "Google Cloud Platform infrastructure and services",
        provider: "GCP",
        type: "cloud",
        supported_controls: ["mpa", "mfa", "notification", "alert"]
      }
    ]
  },
  iam_directory: {
    name: "IAM & Directory Services",
    connectors: [
      {
        name: "Okta",
        description: "Cloud identity and access management platform",
        provider: "Okta",
        type: "identity",
        supported_controls: ["mpa", "mfa", "notification"]
      },
      {
        name: "Azure Active Directory",
        description: "Microsoft's cloud-based identity and access management service",
        provider: "Azure Active Directory",
        type: "identity",
        supported_controls: ["mpa", "mfa", "notification", "alert"]
      },
      {
        name: "Active Directory",
        description: "On-premises directory service by Microsoft",
        provider: "Active Directory",
        type: "identity",
        supported_controls: ["mpa", "mfa", "notification", "alert"]
      }
    ]
  },
  developer_platforms: {
    name: "Developer Platforms",
    connectors: [
      {
        name: "GitHub",
        description: "Code hosting and collaboration platform",
        provider: "GitHub",
        type: "code",
        supported_controls: ["mpa", "notification"]
      },
      {
        name: "GitLab",
        description: "DevOps lifecycle tool",
        provider: "GitLab",
        type: "code",
        supported_controls: ["mpa", "notification"]
      }
    ]
  },
  saas_applications: {
    name: "SaaS Applications",
    connectors: [
      {
        name: "Salesforce",
        description: "CRM and cloud computing platform",
        provider: "Salesforce",
        type: "saas",
        supported_controls: ["mpa", "notification", "alert"]
      },
      {
        name: "Monday.com",
        description: "Project management and team collaboration platform",
        provider: "Monday.com",
        type: "saas",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "Jira",
        description: "Project and issue tracking software",
        provider: "Jira",
        type: "saas",
        supported_controls: ["notification"]
      },
      {
        name: "Zoom",
        description: "Video conferencing platform",
        provider: "Zoom",
        type: "saas",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "Slack",
        description: "Business communication platform",
        provider: "Slack",
        type: "saas",
        supported_controls: ["notification", "alert"]
      }
    ]
  },
  edr: {
    name: "Endpoint Detection & Response",
    connectors: [
      {
        name: "CrowdStrike Falcon",
        description: "Cloud-native endpoint protection platform",
        provider: "CrowdStrike Falcon",
        type: "security",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "SentinelOne",
        description: "Autonomous endpoint protection platform",
        provider: "SentinelOne",
        type: "security",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "Microsoft Defender for Endpoint",
        description: "Enterprise endpoint security platform",
        provider: "Microsoft Defender",
        type: "security",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "Palo Alto Cortex XDR",
        description: "Extended detection and response platform",
        provider: "Palo Alto Cortex XDR",
        type: "security",
        supported_controls: ["notification", "alert"]
      }
    ]
  },
  cicd_automation: {
    name: "CI/CD & Automation",
    connectors: [
      {
        name: "Jenkins",
        description: "Open-source automation server",
        provider: "Jenkins",
        type: "cicd",
        supported_controls: ["mpa", "notification"]
      },
      {
        name: "GitHub Actions",
        description: "CI/CD and automation platform",
        provider: "GitHub Actions",
        type: "cicd",
        supported_controls: ["mpa", "notification"]
      },
      {
        name: "CircleCI",
        description: "Continuous integration and delivery platform",
        provider: "CircleCI",
        type: "cicd",
        supported_controls: ["mpa", "notification"]
      }
    ]
  },
  itsm: {
    name: "IT Service Management",
    connectors: [
      {
        name: "ServiceNow",
        description: "Enterprise service management platform",
        provider: "ServiceNow",
        type: "itsm",
        supported_controls: ["mpa", "notification", "alert"]
      }
    ]
  },
  monitoring_logging: {
    name: "Monitoring & Logging",
    connectors: [
      {
        name: "Datadog",
        description: "Monitoring and analytics platform",
        provider: "Datadog",
        type: "monitoring",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "Splunk",
        description: "Data platform for security and observability",
        provider: "Splunk",
        type: "monitoring",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "Elastic",
        description: "Search and analytics engine",
        provider: "Elastic",
        type: "monitoring",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "Microsoft Sentinel",
        description: "Cloud-native SIEM and SOAR solution",
        provider: "Microsoft Sentinel",
        type: "monitoring",
        supported_controls: ["notification", "alert"]
      },
      {
        name: "CloudTrail",
        description: "AWS activity and API usage tracking",
        provider: "CloudTrail",
        type: "monitoring",
        supported_controls: ["notification", "alert"]
      }
    ]
  },
  secrets_management: {
    name: "Secrets & Key Management",
    connectors: [
      {
        name: "AWS Secrets Manager",
        description: "Secrets management service",
        provider: "AWS Secrets Manager",
        type: "secrets",
        supported_controls: ["mpa", "notification", "alert"]
      },
      {
        name: "Azure Key Vault",
        description: "Key management and secret storage",
        provider: "Azure Key Vault",
        type: "secrets",
        supported_controls: ["mpa", "notification", "alert"]
      },
      {
        name: "GCP Secret Manager",
        description: "Secrets management and storage",
        provider: "GCP Secret Manager",
        type: "secrets",
        supported_controls: ["mpa", "notification", "alert"]
      },
      {
        name: "HashiCorp Vault",
        description: "Secrets and encryption management platform",
        provider: "HashiCorp Vault",
        type: "secrets",
        supported_controls: ["mpa", "notification", "alert"]
      }
    ]
  },
  identity_governance: {
    name: "Identity Governance",
    connectors: [
      {
        name: "Saviynt",
        description: "Cloud identity governance platform",
        provider: "Saviynt",
        type: "governance",
        supported_controls: ["mpa", "notification", "alert"]
      },
      {
        name: "SailPoint",
        description: "Identity security platform",
        provider: "SailPoint",
        type: "governance",
        supported_controls: ["mpa", "notification", "alert"]
      }
    ]
  }
};

function ConnectorListItem({ connector, onConnect, onDisconnect, onToggleControl, onViewDetails }) {
  const logoUrl = DATA_SOURCE_LOGOS[connector.provider] || `https://ui-avatars.com/api/?name=${encodeURIComponent(connector.name)}&background=random`;
  
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
            <img 
              src={logoUrl} 
              alt={connector.name} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(connector.name)}&background=random`;
              }}
            />
          </div>
          <div>
            <h3 className="font-medium">{connector.name}</h3>
            <p className="text-sm text-gray-500">{connector.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge
              variant={connector.connection_status === 'connected' ? 'success' : 'outline'}
              className="text-xs"
            >
              {connector.connection_status === 'connected' ? 'Connected' : 'Not Connected'}
            </Badge>
            {connector.connection_status === 'connected' && (
              <Badge
                variant={connector.control_status === 'enabled' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {connector.control_status === 'enabled' ? 'Control Enabled' : 'Control Disabled'}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {connector.connection_status === 'connected' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDisconnect}
                >
                  <Unlink className="w-3 h-3 mr-1" />
                  Disconnect
                </Button>
                <Button
                  variant={connector.control_status === 'enabled' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => onToggleControl(connector.control_status !== 'enabled')}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {connector.control_status === 'enabled' ? 'Disable Control' : 'Enable Control'}
                </Button>
              </>
            ) : (
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                size="sm"
                onClick={onConnect}
              >
                <Link className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onViewDetails}>
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Update the manual integration details to use a side panel
function ManualIntegrationDetails({ integration, open, onClose, onDelete, onCopyWebhook, onCopyApiKey, onRegenerateKey }) {
  if (!integration) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Server className="w-6 h-6 text-blue-600" />
            {integration?.name || 'Integration Details'}
          </SheetTitle>
          <SheetDescription>
            Manual integration details and configuration
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1">{integration.description || 'No description provided'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Webhook URL</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 p-2 bg-gray-50 rounded text-sm font-mono break-all">
                      {integration.webhook_url}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onCopyWebhook && onCopyWebhook(integration.webhook_url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">API Key</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 p-2 bg-gray-50 rounded text-sm font-mono break-all">
                      {integration.api_key}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onCopyApiKey && onCopyApiKey(integration.api_key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onRegenerateKey && onRegenerateKey(integration)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Integration Type</h4>
                  <p className="mt-1">{integration.system_type || 'Custom Integration'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="mt-1">
                    {integration.created_date ? 
                      format(new Date(integration.created_date), 'PPP') : 
                      'Unknown date'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-4">
                {integration.events && integration.events.length > 0 ? (
                  integration.events.map((event, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{event.type}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(event.timestamp), 'PPP p')}
                            </p>
                          </div>
                          <Badge variant={event.status === 'success' ? 'success' : 'destructive'}>
                            {event.status}
                          </Badge>
                        </div>
                        <pre className="mt-2 p-2 bg-gray-50 rounded-md text-sm overflow-x-auto">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <TerminalSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 font-medium">No events received</h3>
                    <p className="text-sm text-gray-500">Integration hasn't sent any events yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Delete Integration</h4>
                    <p className="text-sm text-gray-500">
                      Remove this integration and all its associated data
                    </p>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={() => onDelete && onDelete(integration)}
                  >
                    Delete Integration
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
