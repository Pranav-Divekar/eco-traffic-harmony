
import React from 'react';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import TrafficSimulation from '@/components/TrafficSimulation';
import TrafficHeatmap from '@/components/TrafficHeatmap';
import PredictionGraph from '@/components/PredictionGraph';
import SystemArchitecture from '@/components/SystemArchitecture';
import AIControlPanel from '@/components/AIControlPanel';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container my-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Smart Traffic Management System</h1>
          <p className="text-muted-foreground">
            Using AI to reduce urban congestion and air pollution through intelligent traffic control
          </p>
        </div>
        
        <div className="mb-6">
          <DashboardStats />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TrafficSimulation />
          <div className="space-y-6">
            <TrafficHeatmap />
            <AIControlPanel />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <SystemArchitecture />
          <PredictionGraph />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
