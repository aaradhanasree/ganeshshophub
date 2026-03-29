import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  const isPositive = trend === 'up';

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;