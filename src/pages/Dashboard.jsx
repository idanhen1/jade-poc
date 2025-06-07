
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { Shield, Users, AlertTriangle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TimeRangeFilter from '../components/dashboard/TimeRangeFilter';
import MetricCard from '../components/dashboard/MetricCard';
import RiskDonutChart from '../components/dashboard/RiskDonutChart';
import CoverageChart from '../components/dashboard/CoverageChart';
import RiskInsightCard from '../components/dashboard/RiskInsightCard';
import ControlOptimizationCard from '../components/dashboard/ControlOptimizationCard';
import GovernanceOpportunitiesWidget from '../components/dashboard/GovernanceOpportunitiesWidget';

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');

  const donutData = [
    { name: 'Controlled', value: 72 },
    { name: 'Uncontrolled', value: 28 }
  ];

  // Removed coverageData as it's no longer used

  const riskUsers = [
    { 
      name: 'John Smith', 
      role: 'DevOps Engineer', 
      type: 'human',
      risk_score: 85, 
      risk_level: 'critical' 
    },
    { 
      name: 'Jenkins Pipeline', 
      role: 'CI/CD Service', 
      type: 'non_human',
      risk_score: 78, 
      risk_level: 'high' 
    },
    { 
      name: 'AI Assistant', 
      role: 'Code Review Bot', 
      type: 'ai_agent',
      risk_score: 72, 
      risk_level: 'high' 
    },
    { 
      name: 'Alice Johnson', 
      role: 'System Admin', 
      type: 'human',
      risk_score: 68, 
      risk_level: 'high' 
    },
    { 
      name: 'Data Sync Service', 
      role: 'ETL Process', 
      type: 'non_human',
      risk_score: 65, 
      risk_level: 'high' 
    }
  ];

  const exposedDomains = [
    {
      name: 'SaaS Applications',
      percentage: 58,
      color: 'bg-blue-500',
      details: 'GDrive and GitHub account for most uncontrolled actions'
    },
    {
      name: 'Cloud Infrastructure',
      percentage: 32,
      color: 'bg-purple-500',
      details: 'AWS EC2 and S3 operations need attention'
    },
    {
      name: 'Identity Systems',
      percentage: 10,
      color: 'bg-orange-500',
      details: 'Okta admin operations require review'
    }
  ];

  const riskyLocations = [
    { name: 'US East Region', actions: 145, risk_level: 'High Risk' },
    { name: 'EU West Region', actions: 89, risk_level: 'Medium Risk' },
    { name: 'Asia Pacific', actions: 67, risk_level: 'Medium Risk' }
  ];

  const nonOptimizedControls = [
    {
      name: "Create admin user in AWS",
      description: "Multi-party approval process takes too long",
      avg_time: 18,
      suggestions: [
        { 
          type: "add_approvers", 
          text: "Add approvers", 
          onClick: () => navigate(createPageUrl("Policies"))
        },
        { 
          type: "adjust_quorum", 
          text: "Reduce quorum", 
          onClick: () => navigate(createPageUrl("Policies"))
        },
        { 
          type: "use_ai", 
          text: "Use AI approver", 
          onClick: () => navigate(createPageUrl("Policies"))
        }
      ]
    },
    {
      name: "Delete production database",
      description: "Review process exceeds target SLA",
      avg_time: 12,
      suggestions: [
        { 
          type: "add_approvers", 
          text: "Add approvers", 
          onClick: () => navigate(createPageUrl("Policies"))
        }
      ]
    }
  ];

  const unusedControls = [
    {
      name: "Modify IAM role permissions",
      description: "Policy hasn't triggered in 45 days",
      last_trigger: 45,
      suggestions: [
        { 
          type: "disable", 
          text: "Disable policy", 
          onClick: () => navigate(createPageUrl("Policies"))
        },
        { 
          type: "rescope", 
          text: "Re-scope policy", 
          onClick: () => navigate(createPageUrl("Policies"))
        }
      ]
    },
    {
      name: "Delete GitHub repository",
      description: "Policy hasn't triggered in 60 days",
      last_trigger: 60,
      suggestions: [
        { 
          type: "disable", 
          text: "Disable policy", 
          onClick: () => navigate(createPageUrl("Policies"))
        }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Jade Security</h1>
          <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
        </div>

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => navigate(createPageUrl("Actions"))}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Action Risk Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">72%</div>
                      <div className="text-sm text-gray-500">Controlled</div>
                    </div>
                  </div>
                  <RiskDonutChart data={donutData} />
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Controlled (72)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Uncontrolled (28)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <MetricCard
              title="High-Risk Action Coverage"
              value="72%"
              trend="+5% from last month"
              description="of high-risk actions are controlled"
              icon={Shield}
              onClick={() => navigate(createPageUrl("Actions?filter=high-risk-controlled"))}
            />
            <MetricCard
              title="Exposure Gap"
              value="14 Actions"
              trend="-2 from last month"
              description="high-risk actions need controls"
              icon={AlertTriangle}
              onClick={() => navigate(createPageUrl("Actions?filter=high-risk-uncontrolled"))}
            />
            <MetricCard
              title="Operational Efficiency"
              value="96%"
              trend="+1% this week"
              description="of controls completed without delays"
              icon={Zap}
              className="h-full min-h-[144px]"
              onClick={() => navigate(createPageUrl("Policies?filter=efficiency"))}
            />
            <MetricCard
              title="Identity Risk Coverage"
              value="84%"
              trend="+2% this week"
              description="of high-risk identities are governed"
              icon={Users}
              className="min-h-[144px]"
              onClick={() => navigate(createPageUrl("Identities?filter=high-risk"))}
            />
          </div>
        </div>

        {/* Second Row - Replaced Action Coverage Over Time with Governance Opportunities */}
        <GovernanceOpportunitiesWidget />

        {/* Third Row - Risk Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RiskInsightCard 
            type="users" 
            title="High-Risk Identities"
            data={riskUsers}
            onClick={() => navigate(createPageUrl("Identities?filter=high-risk"))}
          />
          <RiskInsightCard 
            type="domains" 
            title="Most Exposed Domains"
            data={exposedDomains}
            onClick={() => navigate(createPageUrl("Actions?filter=by-domain"))}
          />
          <RiskInsightCard 
            type="locations" 
            title="High-Risk Locations"
            data={riskyLocations}
            onClick={() => navigate(createPageUrl("Actions?filter=by-location"))}
          />
        </div>

        {/* Fourth Row - Control Optimization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlOptimizationCard 
            type="non_optimized" 
            data={nonOptimizedControls}
            onClick={() => navigate(createPageUrl("Policies?filter=optimization"))}
          />
          <ControlOptimizationCard 
            type="unused" 
            data={unusedControls}
            onClick={() => navigate(createPageUrl("Policies?filter=unused"))}
          />
        </div>
      </div>
    </div>
  );
}
