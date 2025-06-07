import React, { createContext, useContext, useState } from 'react';
import { cn } from "@/lib/utils";

// Create context for tabs
const TabsContext = createContext(null);

const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue || "");
  
  const changeTab = (value) => {
    setSelectedTab(value);
    if (onValueChange) onValueChange(value);
  };
  
  return (
    <TabsContext.Provider value={{ selectedTab, changeTab }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
        className
      )}
      {...props}
    />
  );
});

const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { selectedTab, changeTab } = useContext(TabsContext);
  const isActive = selectedTab === value;
  
  return (
    <button
      ref={ref}
      onClick={() => changeTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-white text-slate-950 shadow-sm" 
          : "hover:bg-slate-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { selectedTab } = useContext(TabsContext);
  
  if (selectedTab !== value) return null;
  
  return (
    <div
      ref={ref}
      className={cn("mt-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };