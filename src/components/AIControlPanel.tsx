
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const AIControlPanel = () => {
  const [learningRate, setLearningRate] = useState([0.001]);
  const [predictiveWeight, setPredictiveWeight] = useState([0.7]);
  const [automaticMode, setAutomaticMode] = useState(true);
  
  const handleApplyChanges = () => {
    toast.success('AI parameters updated successfully', {
      description: `Learning rate: ${learningRate[0]}, Predictive weight: ${predictiveWeight[0]}`,
    });
  };
  
  const handleReset = () => {
    setLearningRate([0.001]);
    setPredictiveWeight([0.7]);
    setAutomaticMode(true);
    toast.info('AI parameters reset to default values');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Control Panel</CardTitle>
        <CardDescription>Adjust model parameters and controls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="learningRate">Learning Rate</Label>
            <span className="text-sm font-medium">{learningRate[0].toFixed(4)}</span>
          </div>
          <Slider
            id="learningRate"
            min={0.0001}
            max={0.01}
            step={0.0001}
            value={learningRate}
            onValueChange={setLearningRate}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="predictiveWeight">Prediction Weight</Label>
            <span className="text-sm font-medium">{predictiveWeight[0].toFixed(2)}</span>
          </div>
          <Slider
            id="predictiveWeight"
            min={0}
            max={1}
            step={0.05}
            value={predictiveWeight}
            onValueChange={setPredictiveWeight}
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

export default AIControlPanel;
