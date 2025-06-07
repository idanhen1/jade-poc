import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Info, Sparkles, Lightbulb, Clock, Zap, ShieldCheck } from "lucide-react";
import { OPPORTUNITIES_DATA } from '@/components/utils/opportunitiesData';

const TOP_OPPORTUNITIES_COUNT = 4;

export default function GovernanceOpportunitiesWidget() {
  const navigate = useNavigate();
  const topOpportunities = OPPORTUNITIES_DATA.slice(0, TOP_OPPORTUNITIES_COUNT);

  const handleSeizeOpportunity = (opportunity) => {
    const newPolicy = {
      ...opportunity.policyTemplate,
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
    <Card className="h-full flex flex-col bg-slate-50"> {/* Main card with a light bg */}
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-5">
        <CardTitle className="text-xl font-bold flex items-center text-slate-800">
          <Lightbulb className="w-7 h-7 mr-2.5 text-yellow-500" />
          Top Governance Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between p-5 space-y-3">
        <div className="space-y-3.5"> {/* Container for opportunity items */}
          {topOpportunities.map((opportunity) => (
            <div 
              key={opportunity.id} 
              className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              {/* Row 1: Title and Impact */}
              <div className="flex justify-between items-start mb-2.5">
                <h4 className="text-md font-semibold text-slate-800 leading-snug flex-grow pr-3">{opportunity.title}</h4>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-help flex items-center gap-1.5 shrink-0 text-sm py-1 px-2.5 border-blue-300 bg-blue-50 text-blue-700">
                        <Sparkles className="w-4 h-4" />
                        {opportunity.businessImpactScore}
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white rounded-md shadow-lg max-w-xs">
                      <p className="text-xs font-medium mb-1">Business Impact:</p>
                      <p className="text-xs">{opportunity.businessImpactTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Row 2: Governance Factors & Compliance */}
              <div className="mb-3.5">
                <div className="text-xs text-slate-500 mb-1.5 font-medium">Key Factors & Compliance:</div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {opportunity.governanceFactors.map((factor) => (
                    <Badge key={factor} variant="secondary" className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5">
                      {factor}
                    </Badge>
                  ))}
                  {opportunity.complianceStandards && opportunity.complianceStandards.length > 0 && (
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs bg-green-50 border-green-200/80 text-green-700 cursor-default flex items-center gap-1 px-2 py-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {opportunity.complianceStandards[0]}
                            {opportunity.complianceStandards.length > 1 && (
                               <span className="ml-0.5 opacity-80">+{opportunity.complianceStandards.length - 1}</span>
                            )}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-white rounded-md shadow-lg max-w-xs">
                           <p className="text-xs font-medium mb-1">Relevant Compliance Standards:</p>
                           <ul className="list-disc list-inside text-xs space-y-0.5">
                            {opportunity.complianceStandards.map(std => <li key={std}>{std}</li>)}
                           </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              {/* Row 3: Time to Govern and Seize Button */}
              <div className="flex justify-between items-center pt-1.5">
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-slate-600 cursor-default">
                        <Clock className="w-4 h-4 mr-1.5 text-sky-600" />
                        <span className="font-medium text-sky-700">{opportunity.timeToGovern}</span>
                        <Info className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white rounded-md shadow-lg max-w-xs">
                      <p className="text-xs font-medium mb-1">Estimated Time to Govern:</p>
                      <p className="text-xs">{opportunity.timeToGovernTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md shadow hover:shadow-md transition-all flex items-center gap-1.5"
                  onClick={() => handleSeizeOpportunity(opportunity)}
                >
                  <Zap className="w-4 h-4" />
                  Seize
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-700 self-center text-sm font-medium mt-1"
          onClick={() => navigate(createPageUrl("Opportunities"))}
        >
          View All Opportunities <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}