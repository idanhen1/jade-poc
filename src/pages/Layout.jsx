
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { StoreProvider } from "@/components/lib/store";
import {
  LayoutDashboard,
  Shield,
  PlayCircle,
  Users,
  Link as LinkIcon,
  ClipboardList,
  Settings,
  Menu,
  X,
  Lightbulb,
  Layers, // For Discover section title (optional)
  ShieldCheck, // For Govern section title (optional)
  Settings2 // For Admin section title
} from "lucide-react";
import { Button } from "@/components/ui/button";

// New structured menu items
const NAV_SECTIONS = [
  {
    title: "Govern",
    icon: ShieldCheck, // Optional icon for section
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "Dashboard" },
      { name: "Opportunities", icon: Lightbulb, path: "Opportunities" },
      { name: "Action Policies", icon: Shield, path: "Policies" },
    ]
  },
  {
    title: "Discover",
    icon: Layers, // Optional icon for section
    items: [
      { name: "Actions", icon: PlayCircle, path: "Actions" },
      { name: "Identities", icon: Users, path: "Identities" },
    ]
  },
  {
    title: "Administration",
    icon: Settings2, // Optional icon for section
    items: [
      { name: "Connectors", icon: LinkIcon, path: "Connectors" },
      { name: "Audit Log", icon: ClipboardList, path: "AuditLog" },
      { name: "Settings", icon: Settings, path: "Settings" },
    ]
  }
];


export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    document.title = `Jade Security | ${currentPageName || 'Dashboard'}`;
  }, [currentPageName]);

  const renderNavItems = (isMobile = false) => {
    return NAV_SECTIONS.map((section) => (
      <div key={section.title} className={!isMobile ? "py-3" : "py-2"}>
        {section.title && (
          <h3 className={`px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isMobile ? 'mt-2' : ''}`}>
            {section.title}
          </h3>
        )}
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPageName === item.path;
          return (
            <Link
              key={item.path}
              to={createPageUrl(item.path)}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-150
                ${isMobile ? 'text-base' : 'text-sm'}
                ${isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Icon className={`mr-3 flex-shrink-0 ${isMobile ? 'h-6 w-6' : 'h-5 w-5'} ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </div>
    ));
  };

  return (
    <StoreProvider>
      <div className="flex h-screen bg-gray-100"> {/* Changed bg-gray-50 to bg-gray-100 for subtle difference */}
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Jade Security</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-2 space-y-0"> {/* Reduced space-y for tighter groups */}
                {renderNavItems()}
              </nav>
            </div>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Jade Security</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:text-gray-100"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
                 <Shield className="h-8 w-8 text-blue-600" />
                 <span className="ml-2 text-xl font-semibold text-gray-900">Jade Security</span>
              </div>
              <div className="flex-1 h-0 pt-2 pb-4 overflow-y-auto">
                <nav className="px-2 space-y-0"> {/* Reduced space-y for tighter groups */}
                  {renderNavItems(true)}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 md:pl-64">
          <main className="flex-1 bg-gray-50"> {/* Page content area with slightly different bg */}
            <div className="py-6"> {/* Added default padding around page content */}
                {children}
            </div>
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
