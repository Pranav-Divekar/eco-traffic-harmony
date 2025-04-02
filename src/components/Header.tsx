
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-eco p-1">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-eco"></div>
            </div>
          </div>
          <span className="font-semibold text-xl">
            Pune <span className="text-eco">Traffic</span> Management System
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
