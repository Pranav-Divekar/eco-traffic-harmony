
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const ControlPanel = () => {
  const [predictionWeight, setPredictionWeight] = useState([0.7]);
  const [optimizationWeight, setOptimizationWeight] = useState([0.001]);
  const [automaticMode, setAutomaticMode] = useState(true);
  
  const handleApplyChanges = () => {
    toast.success('Traffic control parameters updated successfully', {
      description: `Prediction weight: ${predictionWeight[0]}, Optimization weight: ${optimizationWeight[0]}`,
    });
  };
  
  const handleReset = () => {
    setPredictionWeight([0.7]);
    setOptimizationWeight([0.001]);
    setAutomaticMode(true);
    toast.info('Parameters reset to default values');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Control Panel</CardTitle>
        <CardDescription>Adjust traffic prediction parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="predictionWeight">Prediction Weight</Label>
            <span className="text-sm font-medium">{predictionWeight[0].toFixed(2)}</span>
          </div>
          <Slider
            id="predictionWeight"
            min={0}
            max={1}
            step={0.05}
            value={predictionWeight}
            onValueChange={setPredictionWeight}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="optimizationWeight">Optimization Weight</Label>
            <span className="text-sm font-medium">{optimizationWeight[0].toFixed(4)}</span>
          </div>
          <Slider
            id="optimizationWeight"
            min={0.0001}
            max={0.01}
            step={0.0001}
            value={optimizationWeight}
            onValueChange={setOptimizationWeight}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2 pt-2">
          <Label htmlFor="automatic-mode">Automatic Mode</Label>
          <Switch
            id="automatic-mode"
            checked={automaticMode}
            onCheckedChange={setAutomaticMode}
          />
        </div>
        
        <div className="pt-4 flex flex-col gap-2">
          <Button onClick={handleApplyChanges} className="w-full bg-eco hover:bg-eco-dark">Apply Changes</Button>
          <Button variant="outline" onClick={handleReset} className="w-full flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
