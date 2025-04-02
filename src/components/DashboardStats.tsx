
import React from 'react';
import { Car, Clock, Wind, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">32.5 km/h</div>
          <p className="text-xs text-muted-foreground">+5.2% from last hour</p>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-eco" style={{ width: '65%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wait Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.8 min</div>
          <p className="text-xs text-muted-foreground">-12% from last hour</p>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-eco" style={{ width: '40%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Moderate</div>
          <p className="text-xs text-muted-foreground">AQI: 78 (PM2.5)</p>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-yellow-400" style={{ width: '55%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Congestion Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3 Active</div>
          <p className="text-xs text-muted-foreground">2 resolved in last hour</p>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-traffic-red" style={{ width: '30%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
