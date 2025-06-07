
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUpRight, MapPin } from "lucide-react";

export default function RiskInsightCard({ type, title, data, onClick }) {
  const renderContent = () => {
    switch (type) {
      case 'users':
        return (
          <div className="space-y-4">
            {data.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {user.type === 'human' ? (
                      <AvatarImage src={`https://avatars.dicebear.com/api/initials/${user.name}.svg`} />
                    ) : (
                      <AvatarFallback className={user.type === 'ai_agent' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}>
                        {user.type === 'ai_agent' ? 'AI' : 'SVC'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">{user.role}</p>
                      <Badge variant="outline" className={
                        user.type === 'ai_agent'
                          ? 'bg-purple-50 text-purple-700'
                          : user.type === 'non_human'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-50 text-gray-700'
                      }>
                        {user.type === 'ai_agent' ? 'AI' : user.type === 'non_human' ? 'Service' : 'Human'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge variant={user.risk_level === 'critical' ? 'destructive' : 'warning'}>
                  {user.risk_score} Risk Score
                </Badge>
              </div>
            ))}
          </div>
        );

      case 'domains':
        return (
          <div className="space-y-4">
            {data.map((domain, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${domain.color}`} />
                    <span className="font-medium">{domain.name}</span>
                  </div>
                  <span className="text-sm font-medium">{domain.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${domain.color} h-2 rounded-full`}
                    style={{ width: `${domain.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{domain.details}</p>
              </div>
            ))}
          </div>
        );

      case 'locations':
        return (
          <div className="space-y-4">
            {data.map((location, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.actions} risky actions</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600 bg-orange-50">
                  {location.risk_level}
                </Badge>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>{title}</span>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
