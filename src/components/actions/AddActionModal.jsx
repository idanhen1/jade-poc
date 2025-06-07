
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Database, X, Check } from "lucide-react";

// Updated DATA_SOURCE_LOGOS with more accurate logos
const DATA_SOURCE_LOGOS = {
  "AWS": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    domain: "cloud"
  },
  "GCP": {
    logo: "https://www.gstatic.com/images/icons/material/product/2x/googleg_64dp.png",
    domain: "cloud"
  },
  "Azure": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
    domain: "cloud"
  },
  "Okta": {
    logo: "https://www.svgrepo.com/show/354131/okta-icon.svg",
    domain: "identity"
  },
  "Azure AD": {
    logo: "https://www.svgrepo.com/show/448274/azure-active-directory.svg",
    domain: "identity"
  },
  "OneLogin": {
    logo: "https://www.svgrepo.com/show/473657/onelogin.svg",
    domain: "identity"
  },
  "Active Directory": {
    logo: "https://www.svgrepo.com/show/303223/microsoft-windows-22-logo.svg",
    domain: "on_prem"
  },
  "Salesforce": {
    logo: "https://www.svgrepo.com/show/303595/salesforce-2-logo.svg", // Updated to SVG
    domain: "saas"
  },
  "Slack": {
    logo: "https://www.svgrepo.com/show/475684/slack-color.svg", // Updated to SVG
    domain: "saas"
  },
  "Zoom": {
    logo: "https://www.svgrepo.com/show/475271/zoom.svg", // Updated to SVG
    domain: "saas"
  },
  "GitHub": {
    logo: "https://www.svgrepo.com/show/475654/github-color.svg", // Updated to SVG
    domain: "code"
  },
  "GitLab": {
    logo: "https://www.svgrepo.com/show/475700/gitlab-color.svg", // Updated to SVG
    domain: "code"
  },
  "Jira": {
    logo: "https://www.svgrepo.com/show/475688/jira-color.svg", // Updated to SVG
    domain: "saas"
  },
  "Monday.com": {
    logo: "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/monday-logo-x2.png",
    domain: "saas"
  },
  "SharePoint": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Microsoft_Office_SharePoint_%282019%E2%80%93present%29.svg",
    domain: "saas"
  },
  "Office365": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg",
    domain: "saas"
  },
  "MongoDB Atlas": {
    logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
    domain: "database"
  },
  "Amazon RDS": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    domain: "database"
  },
  "Azure SQL": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
    domain: "database"
  },
  "Google Cloud SQL": {
    logo: "https://www.gstatic.com/devrel-devsite/prod/v45f61267c2a379c5b36f2fb6a39551ea7c2760eede9a2daf960d8bbb/cloud/images/cloud-logo.svg",
    domain: "database"
  }
};

const PREDEFINED_ACTIONS = {
  "AWS": [
    "Create IAM User",
    "Delete S3 Bucket",
    "Modify Security Group Rules",
    "Update IAM Role",
    "Deploy Lambda Function",
    "Modify VPC Settings",
    "Create Access Keys",
    "Update KMS Key Policy"
  ],
  "GCP": [
    "Create Service Account",
    "Assign roles to service account",
    "Impersonate service account",
    "Grant Owner or Editor roles",
    "Disable audit log sink",
    "Create custom IAM role",
    "Modify firewall rules",
    "Stop or delete VM",
    "Disable GCP API",
    "Access Cloud Storage buckets"
  ],
  "Azure": [
    "Assign Owner role",
    "Create custom role",
    "Assign role to service principal",
    "Delete resource group",
    "Stop or delete virtual machine",
    "Update network security rules",
    "Disable diagnostic settings",
    "Disable diagnostic settings",
    "Grant Key Vault permissions",
    "Add user to privileged group",
    "Reset user password"
  ],
    "Azure AD": [
        "Assign Super Admin privileges",
        "Add users to sensitive groups",
        "Change user password",
        "Update authentication policies",
        "Disable MFA for users",
        "Modify lifecycle policies",
        "Create or deactivate users",
        "Push group membership",
        "Change SCIM settings",
        "Change SCIM settings",
        "Reset admin factors"
    ],
  "Okta": [
    "Assign Super Admin privileges",
    "Add users to sensitive groups",
    "Change user password",
    "Update authentication policies",
    "Disable MFA for users",
    "Modify lifecycle policies",
    "Create or deactivate users",
    "Push group membership",
    "Change SCIM settings",
    "Reset admin factors"
  ],
  "Salesforce": [
    "Assign System Administrator profile",
    "Grant Modify All Data permission",
    "Export reports or dashboards",
    "Install Apex code",
    "Access customer records",
    "Change sharing rules",
    "Create permission sets",
    "Modify session policies",
    "Delete users",
    "Add external integrations"
  ],
  "Slack": [
    "Add Workspace Admin",
    "Connect third-party integration",
    "Access private channels",
    "Modify org settings",
    "Change SSO configuration",
    "Deactivate users",
    "Delete messages",
    "Modify retention policies",
    "Enable exports"
  ],
  "GitHub": [
    "Add organization owner",
    "Grant admin access",
    "Approve GitHub App",
    "Disable branch protection",
    "Force-push to protected branches",
    "Add deploy keys",
    "Modify Actions permissions",
    "Delete repositories",
    "Change SAML settings",
    "Invite external collaborators"
  ],
  "GitLab": [
    "Assign Owner role",
    "Modify group permissions",
    "Push to protected branches",
    "Disable audit logging",
    "Access CI/CD secrets",
    "Manage runners",
    "Delete projects",
    "Update SSO configuration"
  ],
  "Active Directory": [
    "Add to Domain Admins",
    "Reset admin password",
    "Change Group Policy",
    "Modify domain trusts",
    "Create domain controller",
    "Change Kerberos policies",
    "Modify FSMO roles",
    "Update schema"
  ]
};

export default function AddActionModal({ open, onClose, onAdd }) {
  const [tab, setTab] = useState("predefined");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedActions, setSelectedActions] = useState([]);
  const [customAction, setCustomAction] = useState({
    name: "",
    provider: "",
    description: "",
    conditions: []
  });

  const handleAdd = () => {
    if (tab === "predefined" && selectedProvider && selectedActions.length > 0) {
      // If multiple actions are selected, add them all
      selectedActions.forEach(actionName => {
        onAdd({
          name: actionName,
          provider: selectedProvider,
          type: "predefined"
        });
      });
    } else if (tab === "custom" && customAction.name && customAction.provider) {
      onAdd({
        ...customAction,
        type: "custom"
      });
    }
    
    // Reset selections
    setSelectedActions([]);
    setSelectedProvider("");
    setCustomAction({
      name: "",
      provider: "",
      description: "",
      conditions: []
    });
    
    onClose();
  };

  const toggleActionSelection = (actionName) => {
    setSelectedActions(prev => 
      prev.includes(actionName)
        ? prev.filter(name => name !== actionName)
        : [...prev, actionName]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Action</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="predefined" className="flex-1 overflow-hidden" onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predefined">Predefined Actions</TabsTrigger>
            <TabsTrigger value="custom">Custom Action</TabsTrigger>
          </TabsList>

          <TabsContent value="predefined" className="h-full overflow-hidden">
            <div className="grid grid-cols-4 gap-6 h-full"> {/* Changed to 4 columns */}
              {/* Providers sidebar with better scrolling */}
              <div className="col-span-1 border-r pr-4 overflow-y-auto max-h-[60vh]">
                <div className="py-2">
                  <div className="mb-4">
                    <Label className="text-xs text-gray-500 uppercase mb-2 block">Cloud</Label>
                    {Object.entries(DATA_SOURCE_LOGOS)
                      .filter(([_, info]) => info.domain === 'cloud')
                      .map(([provider, info]) => (
                        <div
                          key={provider}
                          onClick={() => setSelectedProvider(provider)}
                          className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 ${
                            selectedProvider === provider ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center mr-2">
                            <img 
                              src={info.logo} 
                              alt={provider} 
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider)}&background=random`;
                              }}
                            />
                          </div>
                          <span className="text-sm">{provider}</span>
                        </div>
                      ))
                    }
                  </div>
                  
                  <div className="mb-4">
                    <Label className="text-xs text-gray-500 uppercase mb-2 block">Identity</Label>
                    {Object.entries(DATA_SOURCE_LOGOS)
                      .filter(([_, info]) => info.domain === 'identity')
                      .map(([provider, info]) => (
                        <div
                          key={provider}
                          onClick={() => setSelectedProvider(provider)}
                          className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 ${
                            selectedProvider === provider ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center mr-2">
                            <img 
                              src={info.logo} 
                              alt={provider} 
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider)}&background=random`;
                              }}
                            />
                          </div>
                          <span className="text-sm">{provider}</span>
                        </div>
                      ))
                    }
                  </div>
                  
                  <div className="mb-4">
                    <Label className="text-xs text-gray-500 uppercase mb-2 block">SaaS</Label>
                    {Object.entries(DATA_SOURCE_LOGOS)
                      .filter(([_, info]) => info.domain === 'saas')
                      .map(([provider, info]) => (
                        <div
                          key={provider}
                          onClick={() => setSelectedProvider(provider)}
                          className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 ${
                            selectedProvider === provider ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center mr-2">
                            <img 
                              src={info.logo} 
                              alt={provider} 
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider)}&background=random`;
                              }}
                            />
                          </div>
                          <span className="text-sm">{provider}</span>
                        </div>
                      ))
                    }
                  </div>
                  
                  <div className="mb-4">
                    <Label className="text-xs text-gray-500 uppercase mb-2 block">Code</Label>
                    {Object.entries(DATA_SOURCE_LOGOS)
                      .filter(([_, info]) => info.domain === 'code')
                      .map(([provider, info]) => (
                        <div
                          key={provider}
                          onClick={() => setSelectedProvider(provider)}
                          className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 ${
                            selectedProvider === provider ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center mr-2">
                            <img 
                              src={info.logo} 
                              alt={provider} 
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider)}&background=random`;
                              }}
                            />
                          </div>
                          <span className="text-sm">{provider}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              {/* Actions list with multi-select */}
              <div className="col-span-3 pl-4 overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search actions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {selectedActions.length > 0 && (
                    <div className="ml-2 flex items-center gap-2">
                      <Badge variant="secondary">{selectedActions.length} selected</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedActions([])}
                        className="h-8 px-2"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {selectedProvider && PREDEFINED_ACTIONS[selectedProvider]?.map(action => (
                    <div
                      key={action}
                      onClick={() => toggleActionSelection(action)}
                      className={`p-3 rounded-lg border cursor-pointer ${
                        selectedActions.includes(action) 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                            selectedActions.includes(action)
                              ? 'bg-blue-500 text-white'
                              : 'border border-gray-300'
                          }`}>
                            {selectedActions.includes(action) && <Check className="w-3 h-3" />}
                          </div>
                          <span className="font-medium">{action}</span>
                        </div>
                        <Badge variant="outline">High Risk</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="h-full overflow-hidden">
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Action Name</Label>
                    <Input
                      value={customAction.name}
                      onChange={(e) => setCustomAction({...customAction, name: e.target.value})}
                      placeholder="Enter a descriptive name"
                    />
                  </div>
                  <div>
                    <Label>Provider</Label>
                    <Select
                      value={customAction.provider}
                      onValueChange={(value) => setCustomAction({...customAction, provider: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(DATA_SOURCE_LOGOS).map(provider => (
                          <SelectItem key={provider} value={provider}>
                            <div className="flex items-center">
                              <img 
                                src={DATA_SOURCE_LOGOS[provider].logo} 
                                alt={provider} 
                                className="w-4 h-4 mr-2"
                              />
                              {provider}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={customAction.description}
                    onChange={(e) => setCustomAction({...customAction, description: e.target.value})}
                    placeholder="Describe what this action does and why it needs to be monitored"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Query Builder</Label>
                  <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Button variant="outline" size="sm">Add Condition</Button>
                      <Button variant="outline" size="sm">Add Group</Button>
                      <span className="text-sm text-gray-500">Use AND/OR operators to combine conditions</span>
                    </div>

                    {/* Query Builder UI here */}
                    <div className="space-y-2">
                      {/* Sample condition */}
                      <div className="flex items-center gap-2 p-2 bg-white rounded border">
                        <Select defaultValue="action">
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="action">Action Name</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="resource">Resource</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select defaultValue="contains">
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contains">contains</SelectItem>
                            <SelectItem value="equals">equals</SelectItem>
                            <SelectItem value="startsWith">starts with</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input placeholder="Enter value" className="flex-1" />
                        
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleAdd}
            disabled={(tab === "predefined" && (!selectedProvider || selectedActions.length === 0)) || 
                    (tab === "custom" && (!customAction.name || !customAction.provider))}
          >
            {selectedActions.length > 1 ? `Add ${selectedActions.length} Actions` : 'Add Action'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
