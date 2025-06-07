
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  User, 
  Shield, 
  Bell, 
  BrainCircuit,
} from "lucide-react";

// Sample users data
const SAMPLE_USERS = [
  { id: 1, name: "John Smith", email: "john.smith@company.com" },
  { id: 2, name: "Jane Doe", email: "jane.doe@company.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@company.com" },
  { id: 4, name: "Bob Williams", email: "bob.williams@company.com" },
];

// Add searchable user selection component
const UserSearchSelect = ({ users, selectedUsers, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className={`flex items-center p-2 rounded-md border cursor-pointer ${
              selectedUsers.includes(user.id) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => onUserSelect(user.id)}
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
  );
};

// Update the control type selector with better visual feedback
const ControlTypeCard = ({ value, title, icon: Icon, description, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 h-[120px] hover:bg-gray-50 hover:border-gray-300 cursor-pointer ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-muted'
    }`}
  >
    <Icon className={`mb-2 h-6 w-6 ${selected ? 'text-blue-600' : 'text-gray-600'}`} />
    <div className="space-y-1 text-center">
      <p className={`text-sm font-medium leading-none ${selected ? 'text-blue-700' : ''}`}>{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

export default function ControlModalContent({ action, onClose }) {
  const [controlType, setControlType] = useState('mpa');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notificationChannels, setNotificationChannels] = useState(['email']);

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-4 gap-4">
        <ControlTypeCard
          value="mpa"
          title="Multi-Party Approval"
          icon={User}
          description="Require approval before action completes"
          selected={controlType === 'mpa'}
          onClick={() => setControlType('mpa')}
        />
        <ControlTypeCard
          value="mfa"
          title="MFA Challenge"
          icon={Shield}
          description="Require additional authentication"
          selected={controlType === 'mfa'}
          onClick={() => setControlType('mfa')}
        />
        <ControlTypeCard
          value="notify"
          title="Notify"
          icon={Bell}
          description="Send notifications when action occurs"
          selected={controlType === 'notify'}
          onClick={() => setControlType('notify')}
        />
        <ControlTypeCard
          value="ai"
          title="Agentic AI"
          icon={BrainCircuit}
          description="AI-powered approval decisions"
          selected={controlType === 'ai'}
          onClick={() => setControlType('ai')}
        />
      </div>

      {controlType === 'ai' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BrainCircuit className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h4 className="font-medium text-purple-800">Agentic AI Approver</h4>
              <p className="text-sm text-purple-700 mt-1">
                Our AI agent will analyze each action request in real-time, considering:
                <ul className="list-disc ml-4 mt-2">
                  <li>Historical patterns and precedents</li>
                  <li>Security context and risk factors</li>
                  <li>Organizational policies and compliance requirements</li>
                  <li>User behavior and reputation</li>
                </ul>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  24/7 Availability
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  Consistent Decisions
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  Adaptive Learning
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {controlType !== 'ai' && (
        <>
          {controlType === 'mpa' && (
            <div>
              <Label>Select Approvers</Label>
              <UserSearchSelect
                users={SAMPLE_USERS}
                selectedUsers={selectedUsers}
                onUserSelect={toggleUser}
              />
              <div className="mt-4">
                <Label>Required Approvals</Label>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue placeholder="Number of approvals required" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 approval required</SelectItem>
                    <SelectItem value="2">2 approvals required</SelectItem>
                    <SelectItem value="3">3 approvals required</SelectItem>
                    <SelectItem value="all">All must approve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {controlType === 'notify' && (
            <div>
              <Label>Recipients</Label>
              <UserSearchSelect
                users={SAMPLE_USERS}
                selectedUsers={selectedUsers}
                onUserSelect={toggleUser}
              />
            </div>
          )}

          {(controlType === 'mpa' || controlType === 'notify') && (
            <div className="space-y-2">
              <Label>Notification Channels</Label>
              <div className="flex flex-wrap gap-2">
                {/* ... existing notification channel buttons ... */}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
