
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PredictionGraph = () => {
  const [timeframe, setTimeframe] = useState('1h');
  const [graphData, setGraphData] = useState<{ time: string; value: number; prediction?: boolean }[]>([]);
  
  // Generate time labels based on timeframe
  const generateTimeLabels = (count: number, timeframe: string) => {
    const now = new Date();
    const labels: string[] = [];
    
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now);
      switch (timeframe) {
        case '1h':
          time.setMinutes(now.getMinutes() - i * 5);
          labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          break;
        case '24h':
          time.setHours(now.getHours() - i);
          labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          break;
        case '7d':
          time.setDate(now.getDate() - i);
          labels.push(time.toLocaleDateString([], { month: 'short', day: 'numeric' }));
          break;
      }
    }
    
    return labels;
  };
  
  // Generate Pune-specific traffic data with predictions
  const generateGraphData = () => {
    const dataPointCount = timeframe === '1h' ? 12 : timeframe === '24h' ? 24 : 7;
    const times = generateTimeLabels(dataPointCount, timeframe);
    
    // Historical data (already happened)
    const actualData = times.map((time, index) => {
      // Create a Pune traffic pattern with morning and evening peaks
      let baseValue = 30;
      
      // Morning peak (around 9-10 AM)
      if (time.includes("09:") || time.includes("10:")) {
        baseValue += 25;
      }
      // Evening peak (around 6-7 PM)
      else if (time.includes("18:") || time.includes("19:")) {
        baseValue += 30;
      }
      // Midday moderate traffic
      else if (time.includes("13:") || time.includes("14:")) {
        baseValue += 15;
      }
      
      const randomVariation = Math.random() * 10 - 5;
      return {
        time,
        value: Math.round(baseValue + randomVariation),
        prediction: false
      };
    });
    
    // Generate prediction data (future)
    const lastValue = actualData[actualData.length - 1].value;
    const predictionCount = 4; // Number of prediction points
    const predictionTimes = generateTimeLabels(predictionCount, timeframe).slice(-predictionCount);
    
    const predictionData = predictionTimes.map((time, index) => {
      // Prediction should follow the trend but with greater uncertainty
      let trendFactor = 1;
      
      // Evening peak predictions should show increasing trend
      if (time.includes("17:") || time.includes("18:") || time.includes("19:")) {
        trendFactor = 2;
      }
      
      const trend = (index + 1) * trendFactor * (Math.random() > 0.3 ? 1 : -1);
      return {
        time,
        value: Math.round(lastValue + trend),
        prediction: true
      };
    });
    
    return [...actualData, ...predictionData];
  };
  
  // Update graph data when timeframe changes
  useEffect(() => {
    setGraphData(generateGraphData());
  }, [timeframe]);
  
  // Helper to find max value for graph scaling
  const maxValue = Math.max(...graphData.map(d => d.value)) + 5;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Traffic Prediction</CardTitle>
          <CardDescription>Based on Pune historical patterns</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-city-dark/10 text-city-dark">Smart Predictions</Badge>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <g className="graph-grid">
              {[0, 25, 50, 75, 100].map(y => (
                <line key={`horizontal-${y}`} x1="0" y1={100 - y} x2="100" y2={100 - y} />
              ))}
              {graphData.map((_, i) => (
                <line 
                  key={`vertical-${i}`} 
                  x1={i * (100 / (graphData.length - 1))} 
                  y1="0" 
                  x2={i * (100 / (graphData.length - 1))} 
                  y2="100" 
                />
              ))}
            </g>
            
            {/* Historical data line */}
            <polyline
              className="graph-line"
              points={graphData
                .filter(d => !d.prediction)
                .map((d, i) => `${i * (100 / (graphData.length - 1))},${100 - (d.value / maxValue) * 100}`)
                .join(' ')}
            />
            
            {/* Prediction line */}
            <polyline
              className="prediction-line"
              points={graphData
                .map((d, i) => `${i * (100 / (graphData.length - 1))},${100 - (d.value / maxValue) * 100}`)
                .join(' ')}
            />
            
            {/* Data points */}
            {graphData.map((d, i) => (
              <circle
                key={`point-${i}`}
                cx={i * (100 / (graphData.length - 1))}
                cy={100 - (d.value / maxValue) * 100}
                r="1"
                className={d.prediction ? 'fill-city-dark' : 'fill-eco'}
              />
            ))}
            
            {/* Divide historical and prediction with vertical line */}
            {graphData.filter(d => !d.prediction).length < graphData.length && (
              <line
                x1={graphData.filter(d => !d.prediction).length * (100 / (graphData.length - 1))}
                y1="0"
                x2={graphData.filter(d => !d.prediction).length * (100 / (graphData.length - 1))}
                y2="100"
                className="stroke-gray-400 stroke-dashed"
              />
            )}
          </svg>
        </div>
        
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {graphData.filter((_, i) => i % 2 === 0).map((d, i) => (
            <div key={`label-${i}`}>
              {d.time}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-4 bg-eco rounded"></span>
            <span className="text-xs">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-4 bg-city-dark rounded"></span>
            <span className="text-xs">Predicted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionGraph;
