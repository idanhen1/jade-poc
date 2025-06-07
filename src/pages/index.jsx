import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Policies from "./Policies";

import Actions from "./Actions";

import Identities from "./Identities";

import Connectors from "./Connectors";

import AuditLog from "./AuditLog";

import Settings from "./Settings";

import Opportunities from "./Opportunities";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Policies: Policies,
    
    Actions: Actions,
    
    Identities: Identities,
    
    Connectors: Connectors,
    
    AuditLog: AuditLog,
    
    Settings: Settings,
    
    Opportunities: Opportunities,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Policies" element={<Policies />} />
                
                <Route path="/Actions" element={<Actions />} />
                
                <Route path="/Identities" element={<Identities />} />
                
                <Route path="/Connectors" element={<Connectors />} />
                
                <Route path="/AuditLog" element={<AuditLog />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Opportunities" element={<Opportunities />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}