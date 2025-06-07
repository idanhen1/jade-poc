
export const OPPORTUNITIES_DATA = [
  {
    id: 'opp_ai_perm_notify',
    title: "Notify on permission elevation by AI agents",
    businessImpactScore: 85,
    businessImpactTooltip: "High impact: Prevents unauthorized AI escalation, crucial for maintaining control over automated systems and detecting potential misuse early.",
    governanceFactors: ["Agent Control", "Access Governance"],
    timeToGovern: "5-10 minutes",
    timeToGovernTooltip: "Estimated time to configure and enable this notification policy once seized. Considered a quick win.",
    complianceStandards: ["NIST CSF PR.AC-4", "ISO 27001 A.9.4.4"],
    policyTemplate: {
      name: "Notify: AI Agent Permission Elevation",
      description: "Notifies designated personnel when an AI agent or automated process attempts to elevate its permissions or gain new roles.",
      control_type: "notification",
      actions_covered: ["AI Permission Elevation", "Grant AI Admin Role"],
      identities_covered: ["Subtype: AI Agent", "Group: Automated Services"],
      domain: "identity",
      status: "disabled",
      governedSystems: ["AWS", "Azure", "GCP", "Custom AI Platforms"]
    }
  },
  {
    id: 'opp_mpa_billing_override',
    title: "Require MPA before overriding billing amounts or discounts",
    businessImpactScore: 90,
    businessImpactTooltip: "Critical impact: Prevents unauthorized changes to billing and discounts, protecting revenue and financial integrity.",
    governanceFactors: ["Custom Applications", "Financial Control", "Audit"],
    timeToGovern: "5-10 minutes", // Updated
    timeToGovernTooltip: "Estimated time to implement MPA, may require integration with billing system hooks or custom application logic.",
    complianceStandards: ["SOX Section 302/404", "Internal Control Best Practices"],
    policyTemplate: {
      name: "MPA: Billing/Discount Override",
      description: "Requires multi-party approval before overriding standard billing amounts or applying non-standard discounts in custom applications.",
      control_type: "mpa",
      actions_covered: ["Override Billing Amount", "Apply Custom Discount"],
      identities_covered: ["Role: Sales Manager", "Role: Finance Admin", "Group: Billing Team"],
      domain: "saas",
      status: "disabled",
      governedSystems: ["billing.acmecorp.com", "CRM Financial Module", "subscriptions.acmecorp.com"] // Added custom app URLs
    }
  },
  {
    id: 'opp_mpa_secret_creation', // Brought back to widget (3rd position)
    title: "Enforce MPA on creation of secrets with high privileges",
    businessImpactScore: 92,
    businessImpactTooltip: "Critical impact: Secures highly sensitive credentials by requiring multiple approvals, preventing unauthorized creation and potential widespread breaches.",
    governanceFactors: ["Privileged Access", "Compliance", "Data Security"],
    timeToGovern: "5-10 minutes",
    timeToGovernTooltip: "Estimated time for setup, including defining approvers and testing the multi-party approval flow.",
    complianceStandards: ["SOC 2 CC6.1", "ISO 27001 A.9.2.3", "PCI DSS Req 8.5"],
    policyTemplate: {
      name: "MPA: High-Privilege Secret Creation",
      description: "Requires multi-party approval for the creation of new secrets, API keys, or credentials that grant high levels of privilege.",
      control_type: "mpa",
      actions_covered: ["Create High-Privilege Secret", "Generate Admin API Key"],
      identities_covered: ["Role: Administrator", "Group: DevOps Engineers"],
      domain: "identity",
      status: "disabled",
      governedSystems: ["AWS Secrets Manager", "Azure Key Vault", "HashiCorp Vault", "GitHub Secrets"]
    }
  },
  {
    id: 'opp_mfa_waf_changes', // This will now be the 4th item in the widget
    title: "Enforce MFA on changes to WAF configurations",
    businessImpactScore: 88,
    businessImpactTooltip: "High impact: Protects web applications from unauthorized WAF configuration changes, mitigating critical attack vectors and ensuring perimeter security.",
    governanceFactors: ["Change Control", "Threat Prevention", "Infrastructure Security"],
    timeToGovern: "5-10 minutes",
    timeToGovernTooltip: "Estimated time to enforce MFA, assuming MFA infrastructure is already in place.",
    complianceStandards: ["NIST CSF PR.AC-7", "ISO 27001 A.12.1.2", "PCI DSS Req 8.3"],
    policyTemplate: {
      name: "MFA: WAF Configuration Changes",
      description: "Requires multi-factor authentication for any modifications to Web Application Firewall (WAF) policies, rules, or general configurations.",
      control_type: "mfa",
      actions_covered: ["Modify WAF Configuration", "Update WAF Rule"],
      identities_covered: ["Role: Network Admin", "Group: Security Operations"],
      domain: "infra",
      status: "disabled",
      governedSystems: ["AWS WAF", "Azure WAF", "Cloudflare WAF"]
    }
  },
  {
    id: 'opp_justify_disable_logging',
    title: "Require justification before disabling security logging",
    businessImpactScore: 80,
    businessImpactTooltip: "High impact: Ensures critical security logs are not disabled without oversight, maintaining audit trails and detection capabilities.",
    governanceFactors: ["Compliance", "Insider Risk", "Audit"],
    timeToGovern: "30-60 minutes",
    timeToGovernTooltip: "Estimated time to implement an approval workflow for disabling logging.",
    complianceStandards: ["SOC 2 CC3.3", "ISO 27001 A.12.4.1", "NIST CSF DE.CM-3"],
    policyTemplate: {
      name: "Justify: Disable Security Logging",
      description: "Requires a documented justification and approval before any security logging or monitoring service can be disabled or significantly altered.",
      control_type: "mpa",
      actions_covered: ["Disable Security Logging", "Modify Audit Configuration"],
      identities_covered: ["All Users"],
      domain: "security",
      status: "disabled",
      governedSystems: ["CloudTrail", "Azure Monitor", "Syslog configurations"]
    }
  },
  {
    id: 'opp_block_mass_download_non_human',
    title: "Block or alert on mass download of sensitive data by non-human identities",
    businessImpactScore: 90,
    businessImpactTooltip: "Critical impact: Prevents large-scale data exfiltration by compromised or misconfigured service accounts or AI agents.",
    governanceFactors: ["Data Security", "Agent Control", "Threat Prevention"],
    timeToGovern: "1-2 hours",
    timeToGovernTooltip: "Estimated time for configuration, testing, and fine-tuning thresholds.",
    complianceStandards: ["ISO 27001 A.8.2.3", "NIST CSF PR.DS-5", "GDPR Article 32"],
    policyTemplate: {
      name: "Alert: Mass Data Download (Non-Human)",
      description: "Alerts or blocks non-human identities (service accounts, AI agents) attempting to download an unusually large volume of sensitive data.",
      control_type: "alert",
      actions_covered: ["Mass Data Download", "Bulk Export Sensitive Data"],
      identities_covered: ["Subtype: Service", "Subtype: AI Agent"],
      domain: "data",
      status: "disabled",
      governedSystems: ["S3 Buckets", "Azure Blob Storage", "Databases"]
    }
  },
  {
    id: 'opp_mpa_saas_admin_groups',
    title: "Trigger MPA before assigning users to critical SaaS admin groups",
    businessImpactScore: 95,
    businessImpactTooltip: "Critical impact: Safeguards powerful SaaS administrative roles by requiring multi-party approval, preventing unauthorized super-admin access.",
    governanceFactors: ["Access Governance", "Privileged Access", "SaaS Security", "Compliance"],
    timeToGovern: "1-2 hours",
    timeToGovernTooltip: "Estimated time for setting up MPA, defining approver groups for critical SaaS admin roles.",
    complianceStandards: ["SOC 2 CC6.1", "NIST CSF PR.AC-6"],
    policyTemplate: {
      name: "MPA: Critical SaaS Admin Assignment",
      description: "Requires multi-party approval before any user can be assigned to highly privileged administrative groups in critical SaaS applications (e.g., Okta Super Admin, Salesforce Administrator).",
      control_type: "mpa",
      actions_covered: ["Assign SaaS Super Admin", "Add to Global Admin Group (SaaS)"],
      identities_covered: ["Role: Administrator"],
      domain: "saas",
      status: "disabled",
      governedSystems: ["Okta", "Azure AD", "Salesforce", "Google Workspace"]
    }
  },
  {
    id: 'opp_review_remove_mfa_idp',
    title: "Enforce review before removing MFA requirements from identity provider policies",
    businessImpactScore: 86,
    businessImpactTooltip: "High impact: Prevents weakening of authentication security by ensuring that removals of MFA requirements are reviewed and approved.",
    governanceFactors: ["Identity Security", "Change Control", "Compliance", "Access Governance"],
    timeToGovern: "1-2 hours",
    timeToGovernTooltip: "Estimated time to establish and enforce a review process for IDP MFA policy changes.",
    complianceStandards: ["NIST CSF PR.AC-7", "PCI DSS Req 8.3"],
    policyTemplate: {
      name: "Review: IDP MFA Policy Weakening",
      description: "Enforces a review and approval process before any changes that remove or weaken MFA requirements within identity provider policies.",
      control_type: "mpa",
      actions_covered: ["Remove MFA Requirement (IDP)", "Modify Authentication Policy (IDP)"],
      identities_covered: ["Role: Identity Admin"],
      domain: "identity",
      status: "disabled",
      governedSystems: ["Okta", "Azure AD", "Auth0"]
    }
  },
  {
    id: 'opp_alert_ai_delete_critical_resources',
    title: "Alert when AI agents initiate deletion of critical cloud resources",
    businessImpactScore: 89,
    businessImpactTooltip: "High impact: Provides early warning for potentially catastrophic deletions of critical infrastructure by AI agents, allowing for rapid intervention.",
    governanceFactors: ["Agent Control", "Cloud Security", "Threat Prevention"],
    timeToGovern: "30-60 minutes",
    timeToGovernTooltip: "Estimated time to configure alerts for AI-initiated deletions of critical resources.",
    complianceStandards: ["ISO 27001 A.12.4.3", "NIST CSF DE.AE-2"],
    policyTemplate: {
      name: "Alert: AI Deletion of Critical Cloud Resources",
      description: "Sends an immediate alert when an AI agent or automated process initiates the deletion of critical cloud resources such as S3 buckets, VMs, or databases.",
      control_type: "alert",
      actions_covered: ["Delete S3 Bucket (AI)", "Terminate EC2 Instance (AI)", "Delete Database (AI)"],
      identities_covered: ["Subtype: AI Agent"],
      domain: "cloud",
      status: "disabled",
      governedSystems: ["AWS", "Azure", "GCP"]
    }
  },
  {
    id: 'opp_approve_promote_service_account_owner',
    title: "Require approval before promoting service accounts to project owner roles",
    businessImpactScore: 91,
    businessImpactTooltip: "Critical impact: Prevents service accounts from gaining excessive, potentially abusable project-wide ownership permissions without explicit approval.",
    governanceFactors: ["Privileged Access", "Cloud Security", "Access Governance", "Agent Control"],
    timeToGovern: "1-3 hours",
    timeToGovernTooltip: "Estimated time to implement an approval workflow for service account promotions to owner roles.",
    complianceStandards: ["NIST CSF PR.AC-6", "SOC 2 CC6.1"],
    policyTemplate: {
      name: "Approve: Service Account to Project Owner",
      description: "Requires explicit approval before a service account can be promoted to a project owner role or equivalent high-privilege status.",
      control_type: "mpa",
      actions_covered: ["Promote Service Account to Owner", "Grant Project Admin (Service Account)"],
      identities_covered: ["Role: Cloud Admin", "Role: Project Admin"],
      domain: "cloud",
      status: "disabled",
      governedSystems: ["AWS IAM", "Azure RBAC", "GCP IAM"]
    }
  },
  {
    id: 'opp_notify_fin_hr_off_hours_access',
    title: "Notify on access to finance or HR systems outside business hours",
    businessImpactScore: 78,
    businessImpactTooltip: "Medium-High impact: Helps detect suspicious off-hours access to sensitive financial or HR systems, potentially indicating insider threats or compromised accounts.",
    governanceFactors: ["Insider Risk", "SaaS Security", "Compliance", "Monitoring"],
    timeToGovern: "30-60 minutes",
    timeToGovernTooltip: "Estimated time to configure notifications for off-hours access to specified systems.",
    complianceStandards: ["ISO 27001 A.12.4.1", "HIPAA §164.308(a)(1)(ii)(D)"],
    policyTemplate: {
      name: "Notify: Off-Hours Finance/HR System Access",
      description: "Sends a notification when users access designated finance or HR SaaS applications outside of standard business hours.",
      control_type: "notification",
      actions_covered: ["Access Finance System (Off-Hours)", "Access HR System (Off-Hours)"],
      identities_covered: ["All Users"],
      domain: "saas",
      status: "disabled",
      governedSystems: ["Workday", "SAP SuccessFactors", "NetSuite", "QuickBooks Online"]
    }
  },
  {
    id: 'opp_notify_app_priv_escalation',
    title: "Notify on privilege escalations within the app (e.g., setting someone as admin)",
    businessImpactScore: 80,
    businessImpactTooltip: "High impact: Provides visibility into critical permission changes within custom applications, helping to detect potential misuse or errors.",
    governanceFactors: ["Custom Applications", "Access Governance", "Audit"],
    timeToGovern: "5-10 minutes", // Updated
    timeToGovernTooltip: "Estimated time to configure notifications based on application logs or API events.",
    complianceStandards: ["ISO 27001 A.9.2.3", "NIST CSF PR.AC-6"],
    policyTemplate: {
      name: "Notify: In-App Privilege Escalation",
      description: "Notifies security team or application owners when a user's privileges are escalated within a custom application (e.g., user promoted to admin).",
      control_type: "notification",
      actions_covered: ["Grant Application Admin Role", "Assign Superuser (App)"],
      identities_covered: ["Role: Application Admin", "All Users"],
      domain: "saas",
      status: "disabled",
      governedSystems: ["admin.acmecorp.com", "portal.acmecorp.com", "legacy.acmecorp.com"] // Added custom app URLs
    }
  },
  {
    id: 'opp_alert_pii_access',
    title: "Alert on access to personally identifiable information (PII)",
    businessImpactScore: 88,
    businessImpactTooltip: "High impact: Helps detect unauthorized or suspicious access to sensitive PII, crucial for data privacy and compliance.",
    governanceFactors: ["Custom Applications", "Data Security", "Compliance", "Privacy"],
    timeToGovern: "5-10 minutes", // Updated
    timeToGovernTooltip: "Estimated time to configure alerts, may involve data classification and log analysis setup within the application or supporting systems.",
    complianceStandards: ["GDPR Article 32", "CCPA Section 1798.150", "HIPAA Security Rule"],
    policyTemplate: {
      name: "Alert: Sensitive PII Access",
      description: "Generates an alert when sensitive Personally Identifiable Information (PII) is accessed, especially if by unusual patterns or identities, within custom applications.",
      control_type: "alert",
      actions_covered: ["Access PII Data Records", "Export PII Reports"],
      identities_covered: ["All Users", "Subtype: Service Account"],
      domain: "saas",
      status: "disabled",
      governedSystems: ["customers.acmecorp.com", "profiles.acmecorp.com", "analytics.acmecorp.com"] // Added custom app URLs
    }
  }
];
