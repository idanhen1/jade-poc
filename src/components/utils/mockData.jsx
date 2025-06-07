import { ALL_ACTIONS } from './actionsList';

// Add the RISK_LEVELS definition
const RISK_LEVELS = {
  "critical": ["Delete", "Remove", "Terminate", "Grant admin", "Assign owner", "Assign admin", "Create IAM", "Delete user", "Reset password"],
  "high": ["Modify", "Update", "Configure", "Create user", "Assign role", "Enable", "Disable", "Stop", "Start", "Isolate"],
  "medium": ["Create", "Upload", "Download", "Add", "Launch", "Run", "Trigger", "Approve"],
  "low": ["Read", "List", "Get", "View", "Fetch", "Collect"]
};

// Function to determine risk level based on action name
const determineRiskLevel = (actionName) => {
  for (const [level, keywords] of Object.entries(RISK_LEVELS)) {
    for (const keyword of keywords) {
      if (actionName.toLowerCase().includes(keyword.toLowerCase())) {
        return level;
      }
    }
  }
  return "medium";
};

// Local storage keys
const ACTION_STORAGE_KEY = 'jade_security_actions';
const LAST_GENERATION_DATE_KEY = 'jade_security_last_generation';

// Function to check if we need to regenerate the data
const shouldRegenerateData = () => {
  const lastGeneration = localStorage.getItem(LAST_GENERATION_DATE_KEY);
  if (!lastGeneration) return true;
  
  // Regenerate if it's been more than 24 hours
  const dayInMs = 24 * 60 * 60 * 1000;
  return Date.now() - new Date(lastGeneration).getTime() > dayInMs;
};

// Function to get actions from storage
const getSavedActions = () => {
  try {
    if (shouldRegenerateData()) return null;
    const saved = localStorage.getItem(ACTION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Function to save actions to storage
const saveActionsToStorage = (actions) => {
  try {
    localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(actions));
    localStorage.setItem(LAST_GENERATION_DATE_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Update the data generation to ensure all actions are included
const generateFullActionsList = () => {
  // Check if we already have saved actions
  const savedActions = getSavedActions();
  if (savedActions) {
    return savedActions;
  }

  const now = new Date();
  
  // Process ALL actions and add metadata
  const processedActions = ALL_ACTIONS.map((action, index) => {
    // Set all actions to have recent dates within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const lastSeen = new Date(now - (daysAgo * 24 * 60 * 60 * 1000));
    const firstSeen = new Date(lastSeen.getTime() - (Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000));

    return {
      ...action,
      id: index + 1,
      risk_level: determineRiskLevel(action.name),
      status: Math.random() > 0.6 ? "controlled" : "uncontrolled",
      frequency: parseFloat((Math.random() * 10).toFixed(1)),
      last_seen: lastSeen.toISOString(),
      first_seen: firstSeen.toISOString(),
      performed_by: `user${Math.floor(Math.random() * 5) + 1}@company.com`,
      risk_score: Math.floor(Math.random() * 100),
      tags: [],
      low_risk_count: Math.floor(Math.random() * 20),
      medium_risk_count: Math.floor(Math.random() * 15),
      high_risk_count: Math.floor(Math.random() * 5),
      location: ["US-East", "US-West", "EU-Central", "AP-Southeast"][Math.floor(Math.random() * 4)],
      top_performers: [
        {"name": "security_admin@company.com", "count": Math.floor(Math.random() * 10)},
        {"name": "devops@company.com", "count": Math.floor(Math.random() * 8)}
      ]
    };
  });

  // Save to localStorage
  saveActionsToStorage(processedActions);
  return processedActions;
};

// Export the constants
export const SAMPLE_ACTIONS = generateFullActionsList();

// Generate sample identities
const generateSampleIdentities = () => {
  return [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      type: "human",
      risk_level: "medium",
      control_status: "controlled",
      groups: ["DevOps"],
      roles: ["Admin"],
      last_activity: new Date().toISOString(),
      activity_frequency: 25,
      peak_hours: "9 AM - 5 PM",
      top_actions: ["Reset User Password"],
      location: "US-East",
      subtype: "human",
      domain: "cloud",
      risk_score: 65,
      risk_factors: ["Regular activity patterns"]
    }
  ];
};

export const SAMPLE_IDENTITIES = generateSampleIdentities();

// Generate sample policies
const generateSamplePolicies = () => {
  return [
    {
      id: 1,
      name: "Critical Cloud Operations",
      description: "Control access to high-risk cloud operations",
      control_type: "mpa",
      status: "active",
      actions_covered: ["Delete S3 Bucket", "Terminate EC2 Instance", "Delete IAM User"],
      identities_covered: ["DevOps Team", "Cloud Admins"],
      domain: "cloud",
      scope: "group",
      last_triggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      trigger_count: 12,
      avg_approval_time: 25,
      created_by: "admin@company.com",
      effectiveness: 95,
      updated_date: new Date().toISOString(),
      top_approvers: [
        {name: "security_admin@company.com", count: 8},
        {name: "cloud_admin@company.com", count: 4}
      ],
      top_requesters: [
        {name: "dev_team@company.com", count: 7},
        {name: "ops_team@company.com", count: 5}
      ]
    },
    {
      id: 2,
      name: "Identity Access Controls",
      description: "Additional security for identity operations",
      control_type: "mfa",
      status: "active",
      actions_covered: ["Reset User Password", "Grant Admin Access", "Assign Admin Role"],
      identities_covered: ["IT Support", "Help Desk"],
      domain: "identity",
      scope: "role",
      last_triggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      trigger_count: 18,
      avg_approval_time: 5,
      created_by: "admin@company.com",
      effectiveness: 98,
      updated_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      top_approvers: [],
      top_requesters: [
        {name: "helpdesk@company.com", count: 15},
        {name: "it_support@company.com", count: 3}
      ]
    },
    {
      id: 3,
      name: "Production Database Safety",
      description: "Controls for sensitive database operations",
      control_type: "ai_approver",
      status: "active",
      actions_covered: ["Delete Database", "Modify Schema", "Export Data"],
      identities_covered: ["Database Admins", "Data Engineers"],
      domain: "database",
      scope: "group",
      last_triggered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      trigger_count: 7,
      avg_approval_time: 12,
      created_by: "security_admin@company.com",
      effectiveness: 92,
      updated_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      top_approvers: [],
      top_requesters: [
        {name: "db_admin@company.com", count: 4},
        {name: "data_eng@company.com", count: 3}
      ]
    },
    {
      id: 4,
      name: "Code Repository Protection",
      description: "Safeguards for source code management",
      control_type: "notification",
      status: "active",
      actions_covered: ["Delete Repository", "Change Default Branch", "Force Push"],
      identities_covered: ["Developers", "Tech Leads"],
      domain: "code",
      scope: "role",
      last_triggered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      trigger_count: 5,
      avg_approval_time: null,
      created_by: "security_admin@company.com",
      effectiveness: 85,
      updated_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      top_approvers: [],
      top_requesters: [
        {name: "dev_team@company.com", count: 5}
      ]
    },
    {
      id: 5,
      name: "Network Security Controls",
      description: "Controls for network security changes",
      control_type: "mpa",
      status: "disabled",
      actions_covered: ["Modify Security Group", "Update Firewall Rules", "Open Public Access"],
      identities_covered: ["Network Admins"],
      domain: "infra",
      scope: "group",
      last_triggered: null,
      trigger_count: 0,
      avg_approval_time: null,
      created_by: "admin@company.com",
      effectiveness: 0,
      updated_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      top_approvers: [],
      top_requesters: []
    }
  ];
};

export const SAMPLE_POLICIES = generateSamplePolicies();