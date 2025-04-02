
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Database, Server, Cpu } from 'lucide-react';

const SystemArchitecture = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
        <CardDescription>Technical overview of the smart traffic management system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lstm">LSTM Model</TabsTrigger>
            <TabsTrigger value="rl">Reinforcement Learning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="relative h-[300px] border rounded-md p-4 bg-gray-50">
              {/* Architecture diagram */}
              <div className="flex justify-between items-start h-full">
                {/* Data Collection */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  <div className="rounded-md bg-white p-3 border shadow-sm flex flex-col items-center">
                    <Database className="h-8 w-8 text-eco mb-2" />
                    <h4 className="font-medium text-sm">Data Collection</h4>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      IoT Sensors, Cameras, GPS
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* Processing */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  <div className="rounded-md bg-white p-3 border shadow-sm flex flex-col items-center">
                    <Server className="h-8 w-8 text-eco mb-2" />
                    <h4 className="font-medium text-sm">Data Processing</h4>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Filtering, Normalization
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* AI Model */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  <div className="rounded-md bg-white p-3 border shadow-sm flex flex-col items-center">
                    <Cpu className="h-8 w-8 text-eco mb-2" />
                    <h4 className="font-medium text-sm">AI Models</h4>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      LSTM, Reinforcement Learning
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                {/* Control Systems */}
                <div className="flex flex-col items-center gap-2 w-1/4">
                  <div className="rounded-md bg-white p-3 border shadow-sm flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center mb-2 h-8">
                      <div className="w-3 h-8 bg-gray-300 rounded relative">
                        <div className="absolute top-1 left-0 w-3 h-3 rounded-full bg-traffic-red"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-traffic-yellow"></div>
                        <div className="absolute bottom-1 left-0 w-3 h-3 rounded-full bg-traffic-green"></div>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm">Traffic Control</h4>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Adaptive Signal Timing
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Bottom section with feedback loop */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="relative w-3/4 h-12">
                  <div className="w-full h-0.5 bg-muted-foreground absolute top-6"></div>
                  <div className="absolute -right-3 top-4 transform rotate-180">
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-muted-foreground"></div>
                  </div>
                  <div className="absolute top-1 w-full text-center">
                    <span className="text-xs text-muted-foreground bg-gray-50 px-2">
                      Feedback Loop for Continuous Learning
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                The Smart Traffic Management System integrates data from various sources through IoT sensors, 
                processes this information to extract meaningful patterns, applies AI models for prediction and 
                optimization, and finally controls traffic signals adaptively. The system continuously learns 
                from outcomes to improve its performance over time.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="lstm" className="space-y-4 pt-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium mb-2">LSTM Neural Network Architecture</h3>
              <div className="bg-white p-3 rounded-md border mb-4">
                <pre className="text-xs overflow-auto">
                  {`class TrafficLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):
        super(TrafficLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True
        )
        
        self.fc = nn.Linear(hidden_size, output_size)
        
    def forward(self, x):
        # Initialize hidden state with zeros
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        
        # Forward propagate LSTM
        out, _ = self.lstm(x, (h0, c0))
        
        # Decode the hidden state of the last time step
        out = self.fc(out[:, -1, :])
        return out`}
                </pre>
              </div>
              
              <h3 className="font-medium mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Time series forecasting of traffic congestion levels</li>
                <li>Multiple input features (speed, volume, weather data)</li>
                <li>Sequence prediction with memory of past traffic states</li>
                <li>Training on Delhi Open Transit Data (GTFS)</li>
                <li>Able to predict congestion 15-30 minutes in advance</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="rl" className="space-y-4 pt-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Reinforcement Learning Model</h3>
              <div className="bg-white p-3 rounded-md border mb-4">
                <pre className="text-xs overflow-auto">
                  {`class DQNAgent:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = deque(maxlen=2000)
        self.gamma = 0.95    # discount rate
        self.epsilon = 1.0   # exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.model = self._build_model()
    
    def _build_model(self):
        # Neural Net for Deep-Q learning
        model = Sequential()
        model.add(Dense(24, input_dim=self.state_size, activation='relu'))
        model.add(Dense(24, activation='relu'))
        model.add(Dense(self.action_size, activation='linear'))
        model.compile(loss='mse', optimizer=Adam(lr=0.001))
        return model
        
    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)
        act_values = self.model.predict(state)
        return np.argmax(act_values[0])`}
                </pre>
              </div>
              
              <h3 className="font-medium mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Deep Q-Network (DQN) architecture for traffic signal control</li>
                <li>States: Queue lengths, waiting times, vehicle counts</li>
                <li>Actions: Signal timing patterns and phase transitions</li>
                <li>Rewards: Reduced wait time, improved throughput</li>
                <li>Experience replay for stable learning</li>
                <li>Coordination of multiple intersections for network-wide optimization</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemArchitecture;
