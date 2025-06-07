
import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial data structure
const initialState = {
  connectors: {},
  totalConnectors: 0,
  manualIntegrations: []
};

// Create context
const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    // Try to load state from localStorage
    const savedState = localStorage.getItem('jadeSecurityState');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('jadeSecurityState', JSON.stringify(state));
  }, [state]);

  // Update connector states
  const updateConnectorState = (connector, updates) => {
    setState(prevState => {
      const newConnectorStates = {...prevState.connectors};
      
      // Find the category and connector to update
      let found = false;
      Object.entries(newConnectorStates).forEach(([category, connectors]) => {
        if (found) return;
        
        const connectorIndex = connectors.findIndex(c => c.id === connector.id);
        if (connectorIndex !== -1) {
          newConnectorStates[category][connectorIndex] = {
            ...newConnectorStates[category][connectorIndex],
            ...updates
          };
          found = true;
        }
      });
      
      return {
        ...prevState,
        connectors: newConnectorStates
      };
    });
  };

  // Initialize connectors
  const initializeConnectors = (categories) => {
    // Only initialize if not already initialized
    if (Object.keys(state.connectors).length > 0) {
      return;
    }

    const initialStates = {};
    let count = 0;
    
    Object.entries(categories).forEach(([category, { connectors }]) => {
      initialStates[category] = connectors.map(connector => {
        count++;
        // Randomly set some connectors as connected for demo purposes
        const isConnected = Math.random() > 0.6;
        const controlEnabled = isConnected && Math.random() > 0.5;
        return createConnectorState(connector, isConnected, controlEnabled);
      });
    });
    
    setState(prev => ({
      ...prev, 
      connectors: initialStates,
      totalConnectors: count
    }));
  };

  // Create a new connector state object
  const createConnectorState = (connector, connected = false, controlEnabled = false) => {
    return {
      id: Math.floor(Math.random() * 10000),
      name: connector.name,
      type: connector.type,
      provider: connector.provider,
      description: connector.description,
      logo_url: "",
      connection_status: connected ? "connected" : "not_connected",
      control_status: connected && controlEnabled ? "enabled" : "disabled",
      supported_controls: connector.supported_controls || [],
      domains_covered: [connector.type],
      last_sync: connected ? new Date().toISOString() : null,
      connected_since: connected ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      action_count: connected ? Math.floor(Math.random() * 200) : 0
    };
  };

  // Add a new manual integration
  const addManualIntegration = (integration) => {
    setState(prev => ({
      ...prev,
      manualIntegrations: [...prev.manualIntegrations, {
        id: Date.now(),
        created_date: new Date().toISOString(),
        api_key: generateApiKey(),
        webhook_url: `https://api.jadesecurity.io/webhooks/${generateWebhookId()}`,
        events: [],
        ...integration
      }]
    }));
  };

  // Delete a manual integration
  const deleteManualIntegration = (integrationId) => {
    setState(prev => ({
      ...prev,
      manualIntegrations: prev.manualIntegrations.filter(i => i.id !== integrationId)
    }));
  };

  // Update a manual integration
  const updateManualIntegration = (integration) => {
    setState(prev => ({
      ...prev,
      manualIntegrations: prev.manualIntegrations.map(i => 
        i.id === integration.id ? { ...i, ...integration } : i
      )
    }));
  };

  // Add event to manual integration
  const addManualIntegrationEvent = (integrationId, event) => {
    setState(prev => {
      const updatedIntegrations = prev.manualIntegrations.map(integration => {
        if (integration.id === integrationId) {
          const updatedEvents = [event, ...integration.events].slice(0, 20); // Keep only last 20
          return {
            ...integration,
            events: updatedEvents
          };
        }
        return integration;
      });
      
      return {
        ...prev,
        manualIntegrations: updatedIntegrations
      };
    });
  };

  // Helper function to generate API key
  const generateApiKey = () => {
    return 'js_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 32);
  };

  // Helper function to generate webhook ID
  const generateWebhookId = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  return (
    <StoreContext.Provider 
      value={{ 
        ...state, 
        updateConnectorState, 
        initializeConnectors, 
        addManualIntegration,
        deleteManualIntegration,
        updateManualIntegration,
        addManualIntegrationEvent
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
