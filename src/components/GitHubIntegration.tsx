
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Github, Check, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const GitHubIntegration = () => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText('https://github.com/username/smart-traffic-management');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Repository URL copied to clipboard');
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Github className="h-4 w-4" />
          <span>GitHub Integration</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>GitHub Repository</DialogTitle>
          <DialogDescription>
            Access and manage the source code for the Smart Traffic Management System
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <div className="flex items-center justify-between rounded-md border p-2">
              <span className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
                https://github.com/username/smart-traffic-management
              </span>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 text-sm font-medium">Repository Structure</h4>
            <pre className="text-xs text-muted-foreground overflow-auto">
              {`├── README.md
├── LICENSE
├── requirements.txt
├── src/
│   ├── data/
│   │   ├── preprocess.py
│   │   └── loader.py
│   ├── models/
│   │   ├── lstm_model.py
│   │   └── rl_agent.py
│   ├── visualization/
│   │   ├── dashboard.py
│   │   └── heatmap.py
│   └── main.py
├── notebooks/
│   ├── data_exploration.ipynb
│   └── model_training.ipynb
└── tests/
    ├── test_data.py
    └── test_models.py`}
            </pre>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <Button className="bg-eco hover:bg-eco-dark flex-1">Clone Repository</Button>
            <Button variant="outline" className="flex items-center justify-center gap-2 flex-1">
              <ExternalLink className="h-4 w-4" />
              <span>Open on GitHub</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubIntegration;
