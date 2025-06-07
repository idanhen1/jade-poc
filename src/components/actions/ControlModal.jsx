import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Users, Shield, Bell, AlertTriangle, Mail, BrainCircuit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SAMPLE_TEAMS = [
  { id: 1, name: "Security Team" },
  { id: 2, name: "DevOps Team" },
  { id: 3, name: "Infrastructure Team" },
  { id: 4, name: "Cloud Operations" },
  { id: 5, name: "Compliance Team" }
];

const SAMPLE_USERS = [
  { id: 1, name: "John Smith", email: "john.smith@company.com" },
  { id: 2, name: "Jane Doe", email: "jane.doe@company.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@company.com" },
  { id: 4, name: "Bob Williams", email: "bob.williams@company.com" }
];

export default function ControlModal({ open, onClose, target, type = "action" }) {
  const { toast } = useToast();
  const [controlType, setControlType] = useState('mpa');
  const [approvalType, setApprovalType] = useState('human');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState(['high', 'critical']);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Control applied successfully",
        description: `${type === 'action' ? target?.name : target?.name} is now controlled`,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Apply Control to {type === 'action' ? 'Action' : 'Identity'}</DialogTitle>
          <DialogDescription>
            Choose how to handle {target?.name || `this ${type}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup value={controlType} onValueChange={setControlType}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <RadioGroupItem value="mpa" id="mpa" className="peer sr-only" />
                <Label
                  htmlFor="mpa"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer shadow-sm"
                >
                  <User className="mb-2 h-5 w-5 text-blue-600" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium leading-none">Multi-Party Approval</p>
                    <p className="text-xs text-gray-500">
                      Require approval
                    </p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="mfa" id="mfa" className="peer sr-only" />
                <Label
                  htmlFor="mfa"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer shadow-sm"
                >
                  <Shield className="mb-2 h-5 w-5 text-purple-600" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium leading-none">MFA Challenge</p>
                    <p className="text-xs text-gray-500">
                      Additional authentication
                    </p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="notify" id="notify" className="peer sr-only" />
                <Label
                  htmlFor="notify"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer shadow-sm"
                >
                  <Bell className="mb-2 h-5 w-5 text-green-600" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium leading-none">Notify</p>
                    <p className="text-xs text-gray-500">
                      Send notifications
                    </p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="alert" id="alert" className="peer sr-only" />
                <Label
                  htmlFor="alert"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-3 h-[120px] hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer shadow-sm"
                >
                  <AlertTriangle className="mb-2 h-5 w-5 text-orange-600" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium leading-none">Alert</p>
                    <p className="text-xs text-gray-500">
                      Send security alerts
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

          {controlType === 'mpa' && (
            <div className="space-y-4">
              <RadioGroup value={approvalType} onValueChange={setApprovalType}>
                <div className="space-y-2">
                  <Label>Approval Type</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="human" id="approval-human" className="peer sr-only" />
                      <Label
                        htmlFor="approval-human"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                      >
                        <User className="mb-2 h-5 w-5" />
                        <span className="text-sm">Human</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="team" id="approval-team" className="peer sr-only" />
                      <Label
                        htmlFor="approval-team"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                      >
                        <Users className="mb-2 h-5 w-5" />
                        <span className="text-sm">Team</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="ai" id="approval-ai" className="peer sr-only" />
                      <Label
                        htmlFor="approval-ai"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
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
                        The AI agent analyzes action context, historical patterns, and security best practices to 
                        make approval decisions. It continuously learns from your organization's behavior 
                        and adapts to your security needs.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                          24/7 availability
                        </Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                          Reduces friction
                        </Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                          Context-aware
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {approvalType !== 'ai' && (
                <>
                  {approvalType === 'human' && (
                    <div>
                      <Label className="mb-2 block">Select Approvers</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                        {SAMPLE_USERS.map(user => (
                          <div 
                            key={user.id} 
                            className={`flex items-center p-2 rounded-md border cursor-pointer ${
                              selectedUsers.includes(user.id) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedUsers(prev => 
                                prev.includes(user.id)
                                  ? prev.filter(id => id !== user.id)
                                  : [...prev, user.id]
                              );
                            }}
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
                  )}

                  {approvalType === 'team' && (
                    <div>
                      <Label className="mb-2 block">Select Teams</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {SAMPLE_TEAMS.map(team => (
                          <div 
                            key={team.id} 
                            className={`flex items-center p-2 rounded-md border cursor-pointer ${
                              selectedTeams.includes(team.id) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedTeams(prev => 
                                prev.includes(team.id)
                                  ? prev.filter(id => id !== team.id)
                                  : [...prev, team.id]
                              );
                            }}
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

                  <div className="space-y-2">
                    <Label>Required Approvals</Label>
                    <Select defaultValue="2">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Number of approvals required" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 approval</SelectItem>
                        <SelectItem value="2">2 approvals</SelectItem>
                        <SelectItem value="majority">Majority</SelectItem>
                        <SelectItem value="all">All approvers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Channels</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {}}
                        className="gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {}}
                      >
                        Slack
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {}}
                      >
                        Teams
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Additional form sections for other control types would go here */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Applying..." : "Apply Control"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}