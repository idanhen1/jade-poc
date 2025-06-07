import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function MetricCard({ title, value, trend, description, onClick, icon: Icon, className }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      <Card className="relative overflow-hidden h-full">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold mt-2">{value}</p>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
              {trend && (
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {trend}
                </p>
              )}
            </div>
            {Icon && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}