import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Sparkles, Lightbulb, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { OPPORTUNITIES_DATA } from '@/components/utils/opportunitiesData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OpportunitiesPage() {
  const navigate = useNavigate();

  const handleSeizeOpportunity = (opportunity) => {
    const newPolicy = {
      ...opportunity.policyTemplate, // This will include governedSystems
      id: `policy_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_by: "System (Opportunity Seized)",
      updated_date: new Date().toISOString(),
      trigger_count: 0,
      last_triggered: null,
      effectiveness: 0,
      avg_approval_time: null,
      top_approvers: [],
      top_requesters: [],
      identities_covered: Array.isArray(opportunity.policyTemplate.identities_covered) ? opportunity.policyTemplate.identities_covered : [],
      actions_covered: Array.isArray(opportunity.policyTemplate.actions_covered) ? opportunity.policyTemplate.actions_covered : [],
    };
    localStorage.setItem('pendingPolicy', JSON.stringify(newPolicy));
    navigate(createPageUrl(`Policies?focusPolicyId=${newPolicy.id}`));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-yellow-400/20 rounded-full">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Governance Opportunities</h1>
            <p className="text-gray-600 mt-1">
              Actionable insights to enhance your security posture and streamline governance.
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[30%] px-6 py-4 text-sm font-semibold text-slate-700">Opportunity</TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700">Impact</TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700">Factors</TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700">Compliance</TableHead>
                  <TableHead className="px-6 py-4 text-sm font-semibold text-slate-700">Time to Govern</TableHead>
                  <TableHead className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {OPPORTUNITIES_DATA.map((opportunity) => (
                  <TableRow key={opportunity.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-6 py-4 align-top">
                      <div className="font-semibold text-slate-800 text-base">{opportunity.title}</div>
                      <p className="text-xs text-slate-600 mt-1 max-w-md">{opportunity.policyTemplate.description}</p>
                    </TableCell>
                    <TableCell className="px-6 py-4 align-top">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="cursor-help flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700 py-1 px-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              {opportunity.businessImpactScore}
                              <Info className="w-3.5 h-3.5 text-gray-400 ml-1" />
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white rounded-md shadow-lg">
                            <p className="max-w-xs text-sm">{opportunity.businessImpactTooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {opportunity.governanceFactors.map((factor) => (
                          <Badge key={factor} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 align-top">
                      {opportunity.complianceStandards && opportunity.complianceStandards.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                  <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700 cursor-default flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    {opportunity.complianceStandards[0]}
                                    {opportunity.complianceStandards.length > 1 && ` +${opportunity.complianceStandards.length - 1}`}
                                  </Badge>
                                </TooltipTrigger>
                               <TooltipContent className="bg-slate-800 text-white rounded-md shadow-lg">
                                 <ul className="list-disc list-inside text-sm">
                                  {opportunity.complianceStandards.map(std => <li key={std}>{std}</li>)}
                                 </ul>
                               </TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 align-top">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-sm text-gray-600 cursor-default">
                              <Clock className="w-4 h-4 mr-1.5 text-sky-600" />
                              <span className="font-medium text-sky-700">{opportunity.timeToGovern}</span>
                              <Info className="w-3.5 h-3.5 text-gray-400 ml-1" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white rounded-md shadow-lg">
                            <p className="max-w-xs text-sm">{opportunity.timeToGovernTooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right px-6 py-4 align-top">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md shadow hover:shadow-md transition-all flex items-center gap-1.5"
                        onClick={() => handleSeizeOpportunity(opportunity)}
                      >
                        Seize <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}