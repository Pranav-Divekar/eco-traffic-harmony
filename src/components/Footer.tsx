
import React from 'react';
import GitHubIntegration from './GitHubIntegration';
import DeploymentModal from './DeploymentModal';

const Footer = () => {
  return (
    <footer className="border-t mt-8">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="rounded-full bg-eco p-1">
            <div className="h-4 w-4 rounded-full bg-white flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-eco"></div>
            </div>
          </div>
          <span className="text-sm font-medium">Pune Traffic Management System</span>
        </div>
        
        <div className="text-sm text-muted-foreground text-center md:text-left mb-4 md:mb-0">
          Built for reducing urban congestion and air pollution in Pune
        </div>
        
        <div className="flex items-center gap-4">
          <GitHubIntegration />
          <DeploymentModal />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
