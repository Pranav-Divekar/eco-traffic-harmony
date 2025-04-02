
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

type Vehicle = {
  id: number;
  lane: number;
  color: string;
  speed: number;
  position: number;
  width: number;
};

const TrafficSimulation = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const laneCount = 4;
  
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
  const speeds = [3, 4, 5, 6, 7];
  const widths = [12, 14, 16, 18, 20];
  
  const toggleSimulation = () => {
    setIsRunning(prev => !prev);
  };
  
  const resetSimulation = () => {
    setVehicles([]);
    setTimeout(() => {
      setIsRunning(true);
    }, 100);
  };
  
  // Initialize and manage vehicles
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setVehicles(prevVehicles => {
        // Remove vehicles that have completed their journey
        const updatedVehicles = prevVehicles
          .filter(v => v.position < 100)
          .map(v => ({
            ...v,
            position: v.position + v.speed * 0.25
          }));
        
        // Randomly add new vehicles
        if (Math.random() < 0.3) {
          const lane = Math.floor(Math.random() * laneCount);
          const color = colors[Math.floor(Math.random() * colors.length)];
          const speed = speeds[Math.floor(Math.random() * speeds.length)];
          const width = widths[Math.floor(Math.random() * widths.length)];
          
          // Check if there's space at the beginning of the lane
          const hasVehicleAtStart = updatedVehicles.some(
            v => v.lane === lane && v.position < 10
          );
          
          if (!hasVehicleAtStart) {
            updatedVehicles.push({
              id: Date.now() + Math.random(),
              lane,
              color,
              speed,
              position: -5,
              width
            });
          }
        }
        
        return updatedVehicles;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRunning, laneCount]);
  
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Traffic Simulation</CardTitle>
          <CardDescription>Live view of current traffic flow with AI optimized signals</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-eco/10 text-eco">AI Optimized</Badge>
          <Button variant="outline" size="icon" onClick={toggleSimulation}>
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={resetSimulation}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] rounded-md bg-gray-100 border overflow-hidden">
          {/* Road markings */}
          <div className="absolute inset-0 traffic-grid"></div>
          
          {/* Traffic light */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2 p-1 bg-gray-800 rounded w-6">
            <div className={`rounded-full h-4 w-4 ${isRunning ? 'bg-traffic-green animate-pulse-slow' : 'bg-gray-400'}`}></div>
            <div className="rounded-full h-4 w-4 bg-gray-400"></div>
            <div className="rounded-full h-4 w-4 bg-gray-400"></div>
          </div>
          
          {/* Lanes */}
          <div className="absolute inset-0 flex flex-col">
            {Array.from({ length: laneCount }).map((_, index) => (
              <div key={index} className="traffic-lane flex-1">
                {vehicles
                  .filter(v => v.lane === index)
                  .map(vehicle => (
                    <div
                      key={vehicle.id}
                      className={`traffic-vehicle ${vehicle.color}`}
                      style={{
                        left: `${vehicle.position}%`,
                        top: '4px',
                        width: `${vehicle.width}px`,
                        animationDuration: `${8 / vehicle.speed}s`,
                        animationPlayState: isRunning ? 'running' : 'paused'
                      }}
                    ></div>
                  ))}
              </div>
            ))}
          </div>
          
          {/* Road markings */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500"></div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>Vehicles: {vehicles.length}</div>
          <div>Status: {isRunning ? 'Active' : 'Paused'}</div>
          <div>Mode: Adaptive Control</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficSimulation;
