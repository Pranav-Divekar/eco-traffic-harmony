
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Server, Terminal, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

type DeploymentEnvironment = 'development' | 'staging' | 'production';
type DeploymentStatus = 'idle' | 'deploying' | 'success' | 'failed';

const DeploymentModal = () => {
  const [selectedEnv, setSelectedEnv] = useState<DeploymentEnvironment>('development');
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>('idle');
  const [progress, setProgress] = useState(0);
  
  const handleDeploy = () => {
    setDeploymentStatus('deploying');
    setProgress(0);
    
    // Simulate deployment process
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setDeploymentStatus('success');
          toast.success(`Deployment to ${selectedEnv} completed successfully`);
          return 100;
        }
        return next;
      });
    }, 500);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          <span>Deployment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deploy System</DialogTitle>
          <DialogDescription>
            Deploy the Smart Traffic Management System to cloud or on-premise environments
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="deploy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="environments">Environments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deploy" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <h4 className="text-sm font-medium">Select Environment</h4>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="environment" 
                      className="form-radio text-eco" 
                      checked={selectedEnv === 'development'} 
                      onChange={() => setSelectedEnv('development')}
                    />
                    <span className="text-sm">Development</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="environment" 
                      className="form-radio text-eco" 
                      checked={selectedEnv === 'staging'} 
                      onChange={() => setSelectedEnv('staging')}
                    />
                    <span className="text-sm">Staging</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="environment" 
                      className="form-radio text-eco" 
                      checked={selectedEnv === 'production'} 
                      onChange={() => setSelectedEnv('production')}
                    />
                    <span className="text-sm">Production</span>
                  </label>
                </div>
              </div>
              
              {deploymentStatus === 'deploying' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deployment in progress...</span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {deploymentStatus === 'success' && (
                <div className="rounded-md bg-green-50 p-3 flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Deployment Successful</h3>
                    <div className="mt-1 text-sm text-green-700">
                      <p>Your system has been deployed to {selectedEnv} environment.</p>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        View Deployment
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {deploymentStatus === 'failed' && (
                <div className="rounded-md bg-red-50 p-3 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Deployment Failed</h3>
                    <div className="mt-1 text-sm text-red-700">
                      <p>There was an error during deployment. Please check logs for details.</p>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        View Error Logs
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleDeploy}
                disabled={deploymentStatus === 'deploying'}
                className="w-full bg-eco hover:bg-eco-dark"
              >
                {deploymentStatus === 'deploying' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deploying...
                  </>
                ) : 'Deploy System'}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="environments" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-eco" />
                    <span className="font-medium">Development</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  URL: <code className="bg-gray-100 px-1 rounded">dev-traffic.example.com</code>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last deployed: 2 hours ago
                </div>
              </div>
              
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Staging</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">Updating</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  URL: <code className="bg-gray-100 px-1 rounded">staging-traffic.example.com</code>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last deployed: 1 day ago
                </div>
              </div>
              
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Production</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Stable</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  URL: <code className="bg-gray-100 px-1 rounded">traffic.example.com</code>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last deployed: 1 week ago
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  <span>View Logs</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentModal;
