
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer } from 'lucide-react';

const TrafficHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const gridSize = 10;
  
  // Generate Pune-inspired traffic heatmap data
  const generateHeatmapData = () => {
    const newData: number[][] = [];
    
    // Create a pattern that resembles Pune's traffic congestion
    for (let i = 0; i < gridSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < gridSize; j++) {
        // Higher congestion in city center and key junctions (represented in center and specific points)
        const distanceFromCenter = Math.sqrt(
          Math.pow((i - gridSize / 2), 2) + Math.pow((j - gridSize / 2), 2)
        );
        
        // Base congestion pattern
        let value = 100 - (distanceFromCenter * 15);
        
        // Simulate Pune's key congestion points (major intersections)
        // Shivaji Nagar/FC Road area
        if ((i === 3 && j === 3) || (i === 3 && j === 4)) {
          value += 30;
        }
        // Hinjewadi IT Park area
        if ((i === 1 && j === 8) || (i === 2 && j === 8)) {
          value += 40;
        }
        // Hadapsar/Magarpatta area
        if ((i === 7 && j === 7) || (i === 8 && j === 7)) {
          value += 35;
        }
        // Swargate area
        if ((i === 5 && j === 2) || (i === 6 && j === 2)) {
          value += 25;
        }
        
        // Main roads (central horizontal and vertical lines)
        if (i === Math.floor(gridSize / 2) || j === Math.floor(gridSize / 2)) {
          value += 15;
        }
        
        // Clamp values
        value = Math.max(0, Math.min(100, value));
        row.push(value);
      }
      newData.push(row);
    }
    
    return newData;
  };
  
  // Get color based on congestion value
  const getHeatmapColor = (value: number) => {
    if (value < 25) return 'bg-green-500/30';
    if (value < 50) return 'bg-green-500/60';
    if (value < 75) return 'bg-yellow-500/70';
    if (value < 90) return 'bg-orange-500/80';
    return 'bg-red-500/90';
  };
  
  // Update heatmap data periodically
  useEffect(() => {
    setHeatmapData(generateHeatmapData());
    
    const interval = setInterval(() => {
      setHeatmapData(prev => {
        const newData = [...prev];
        
        // Modify a few random cells to simulate changing traffic conditions
        for (let i = 0; i < 5; i++) {
          const row = Math.floor(Math.random() * gridSize);
          const col = Math.floor(Math.random() * gridSize);
          const change = Math.random() < 0.5 ? -10 : 10;
          
          if (newData[row] && newData[row][col] !== undefined) {
            newData[row][col] = Math.max(0, Math.min(100, newData[row][col] + change));
          }
        }
        
        return newData;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Pune Traffic Heatmap</CardTitle>
          <CardDescription>Real-time congestion visualization based on traffic data</CardDescription>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Timer className="h-3 w-3" /> Live
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-1 aspect-square overflow-hidden rounded-md border p-2 bg-gray-50">
          {heatmapData.map((row, rowIndex) => 
            row.map((value, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square rounded-sm heatmap-cell ${getHeatmapColor(value)}`}
                title={`Congestion: ${Math.round(value)}%`}
              />
            ))
          )}
        </div>
        
        <div className="mt-4 flex justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 block bg-green-500/60 rounded-sm"></span>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 block bg-yellow-500/70 rounded-sm"></span>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 block bg-orange-500/80 rounded-sm"></span>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 block bg-red-500/90 rounded-sm"></span>
            <span className="text-xs">Severe</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>*Visualizing high congestion areas in key Pune locations including Shivaji Nagar, Hinjewadi IT Park, Hadapsar, and Swargate</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficHeatmap;
