
"""
Smart Traffic Management System - Reinforcement Learning Traffic Control

This module implements a Deep Q-Network (DQN) based reinforcement learning agent
for optimizing traffic signal control. The agent learns to adjust signal timings
based on traffic conditions to minimize delays and congestion.
"""

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.optimizers import Adam
import random
from collections import deque

class TrafficRLAgent:
    """DQN-based Reinforcement Learning agent for traffic signal control."""
    
    def __init__(self, state_size, action_size):
        """
        Initialize the RL agent for traffic signal control.
        
        Args:
            state_size (tuple): Dimensions of the state space
            action_size (int): Number of possible actions (signal timing patterns)
        """
        self.state_size = state_size
        self.action_size = action_size
        
        # Hyperparameters
        self.gamma = 0.95  # discount rate
        self.epsilon = 1.0  # exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001
        
        # Experience replay buffer
        self.memory = deque(maxlen=2000)
        
        # Build the primary and target networks
        self.primary_network = self._build_model()
        self.target_network = self._build_model()
        
        # Initialize target network weights to primary network weights
        self.update_target_network()
        
    def _build_model(self):
        """
        Build the neural network model for deep Q-learning.
        
        Returns:
            tf.keras.Model: Compiled neural network
        """
        model = Sequential()
        
        # Check if state is an image (traffic grid)
        if len(self.state_size) == 3:  # [height, width, channels]
            model.add(Conv2D(32, (3, 3), activation='relu', input_shape=self.state_size))
            model.add(MaxPooling2D((2, 2)))
            model.add(Conv2D(64, (3, 3), activation='relu'))
            model.add(Flatten())
        else:  # Vector input
            model.add(Dense(64, activation='relu', input_shape=(self.state_size,)))
            
        model.add(Dense(64, activation='relu'))
        model.add(Dense(self.action_size, activation='linear'))
        
        model.compile(loss='mse', optimizer=Adam(learning_rate=self.learning_rate))
        return model
        
    def update_target_network(self):
        """Update target network weights with primary network weights."""
        self.target_network.set_weights(self.primary_network.get_weights())
        
    def remember(self, state, action, reward, next_state, done):
        """
        Store experience in replay memory.
        
        Args:
            state: Current state
            action: Action taken
            reward: Reward received
            next_state: Next state
            done: Whether the episode is done
        """
        self.memory.append((state, action, reward, next_state, done))
        
    def act(self, state, training=True):
        """
        Select action based on epsilon-greedy policy.
        
        Args:
            state: Current state
            training (bool): Whether the agent is in training mode
            
        Returns:
            int: Selected action
        """
        if training and np.random.rand() <= self.epsilon:
            # Exploration: choose random action
            return random.randrange(self.action_size)
            
        # Exploitation: choose best action based on model prediction
        q_values = self.primary_network.predict(state)
        return np.argmax(q_values[0])
        
    def replay(self, batch_size):
        """
        Train the model using experience replay.
        
        Args:
            batch_size (int): Number of samples to use for training
            
        Returns:
            float: Loss value from training
        """
        if len(self.memory) < batch_size:
            return 0
            
        # Sample random batch from memory
        minibatch = random.sample(self.memory, batch_size)
        
        for state, action, reward, next_state, done in minibatch:
            target = reward
            
            if not done:
                # Double DQN: Select action from primary network but evaluate using target network
                next_action = np.argmax(self.primary_network.predict(next_state)[0])
                target_q_values = self.target_network.predict(next_state)[0]
                target += self.gamma * target_q_values[next_action]
                
            # Update primary network
            target_f = self.primary_network.predict(state)
            target_f[0][action] = target
            
            self.primary_network.fit(state, target_f, epochs=1, verbose=0)
            
        # Decay epsilon
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay
            
        return 0  # Return loss (not available without verbose=2)
        
    def save(self, filepath):
        """
        Save the model to file.
        
        Args:
            filepath (str): Path to save the model
        """
        self.primary_network.save(filepath)
        print(f"Model saved to {filepath}")
        
    def load(self, filepath):
        """
        Load the model from file.
        
        Args:
            filepath (str): Path to load the model from
        """
        try:
            self.primary_network = tf.keras.models.load_model(filepath)
            self.target_network = tf.keras.models.load_model(filepath)
            print(f"Model loaded from {filepath}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False


class TrafficEnvironment:
    """Simulated traffic environment for reinforcement learning."""
    
    def __init__(self, grid_size=(10, 10), num_intersections=4):
        """
        Initialize traffic simulation environment.
        
        Args:
            grid_size (tuple): Size of the traffic grid (rows, cols)
            num_intersections (int): Number of traffic intersections
        """
        self.grid_size = grid_size
        self.num_intersections = num_intersections
        self.intersections = self._initialize_intersections()
        self.current_time = 0
        self.max_steps = 1000
        self.current_step = 0
        
    def _initialize_intersections(self):
        """
        Initialize traffic intersections in the environment.
        
        Returns:
            dict: Dictionary of intersection objects
        """
        intersections = {}
        
        # Evenly distribute intersections in the grid
        rows, cols = self.grid_size
        row_positions = np.linspace(0, rows-1, int(np.sqrt(self.num_intersections)), dtype=int)
        col_positions = np.linspace(0, cols-1, int(np.sqrt(self.num_intersections)), dtype=int)
        
        intersection_id = 0
        for r in row_positions:
            for c in col_positions:
                intersections[intersection_id] = {
                    'position': (r, c),
                    'queue_ns': 0,  # North-South queue length
                    'queue_ew': 0,  # East-West queue length
                    'current_phase': 0,  # 0: NS Green, EW Red; 1: NS Red, EW Green
                    'time_in_phase': 0
                }
                intersection_id += 1
                
        return intersections
        
    def reset(self):
        """
        Reset the environment to initial state.
        
        Returns:
            dict: Initial state of the environment
        """
        self.current_time = 0
        self.current_step = 0
        
        # Reset intersections
        for i in self.intersections:
            self.intersections[i]['queue_ns'] = np.random.randint(0, 10)
            self.intersections[i]['queue_ew'] = np.random.randint(0, 10)
            self.intersections[i]['current_phase'] = 0
            self.intersections[i]['time_in_phase'] = 0
            
        return self._get_state()
        
    def _get_state(self):
        """
        Get the current state of the environment.
        
        Returns:
            dict: State representation for each intersection
        """
        state = {}
        
        for i, intersection in self.intersections.items():
            # State representation: [queue_ns, queue_ew, current_phase, time_in_phase,
            #                       time_of_day_sin, time_of_day_cos]
            time_sin = np.sin(2 * np.pi * self.current_time / 24.0)  # Cyclical time encoding
            time_cos = np.cos(2 * np.pi * self.current_time / 24.0)
            
            state[i] = np.array([
                intersection['queue_ns'],
                intersection['queue_ew'],
                intersection['current_phase'],
                intersection['time_in_phase'],
                time_sin,
                time_cos
            ])
            
        return state
        
    def step(self, actions):
        """
        Take a step in the environment given actions for each intersection.
        
        Args:
            actions (dict): Dictionary mapping intersection IDs to actions
                Action 0: Keep current phase
                Action 1: Switch phase
                Action 2: Extend green time for NS
                Action 3: Extend green time for EW
                
        Returns:
            tuple: (next_state, rewards, done, info)
        """
        self.current_step += 1
        self.current_time = (self.current_time + 5/60) % 24  # Advance time by 5 minutes
        
        rewards = {}
        info = {}
        
        # Update traffic based on time of day and random factors
        self._update_traffic_flow()
        
        # Process each intersection
        for i, action in actions.items():
            if i not in self.intersections:
                continue
                
            intersection = self.intersections[i]
            
            # Process action
            if action == 0:  # Keep current phase
                pass
            elif action == 1:  # Switch phase
                intersection['current_phase'] = 1 - intersection['current_phase']
                intersection['time_in_phase'] = 0
            elif action == 2:  # Extend NS green
                if intersection['current_phase'] == 0:
                    # Already NS green, extend it
                    pass
                else:
                    # Switch to NS green
                    intersection['current_phase'] = 0
                    intersection['time_in_phase'] = 0
            elif action == 3:  # Extend EW green
                if intersection['current_phase'] == 1:
                    # Already EW green, extend it
                    pass
                else:
                    # Switch to EW green
                    intersection['current_phase'] = 1
                    intersection['time_in_phase'] = 0
                    
            # Process traffic flow
            if intersection['current_phase'] == 0:  # NS Green
                # Process NS direction (green light)
                flow_rate = min(3 + np.random.randint(0, 3), intersection['queue_ns'])
                intersection['queue_ns'] = max(0, intersection['queue_ns'] - flow_rate)
                
                # EW direction accumulates (red light)
                intersection['queue_ew'] = min(30, intersection['queue_ew'] + np.random.randint(0, 3))
            else:  # EW Green
                # Process EW direction (green light)
                flow_rate = min(3 + np.random.randint(0, 3), intersection['queue_ew'])
                intersection['queue_ew'] = max(0, intersection['queue_ew'] - flow_rate)
                
                # NS direction accumulates (red light)
                intersection['queue_ns'] = min(30, intersection['queue_ns'] + np.random.randint(0, 3))
                
            # Increment time in current phase
            intersection['time_in_phase'] += 1
            
            # Calculate reward: negative of total queue length + penalty for frequent switches
            total_queue = intersection['queue_ns'] + intersection['queue_ew']
            switching_penalty = 3 if intersection['time_in_phase'] == 0 else 0
            rewards[i] = -(total_queue + switching_penalty)
            
            # Store additional info
            info[i] = {
                'queue_ns': intersection['queue_ns'],
                'queue_ew': intersection['queue_ew'],
                'phase': intersection['current_phase'],
                'time_in_phase': intersection['time_in_phase']
            }
            
        # Check if episode is done
        done = self.current_step >= self.max_steps
        
        return self._get_state(), rewards, done, info
        
    def _update_traffic_flow(self):
        """Update traffic flow based on time of day and random factors."""
        # Time-based traffic factors (busier during rush hours)
        hour = self.current_time
        if 7 <= hour < 9 or 16 <= hour < 19:  # Rush hours
            traffic_factor = 1.5
        elif 22 <= hour or hour < 5:  # Night time
            traffic_factor = 0.3
        else:  # Regular hours
            traffic_factor = 1.0
            
        # Update incoming traffic to each intersection
        for i in self.intersections:
            # Random traffic factor
            random_factor = 0.5 + np.random.random()
            
            # Add new vehicles to queues with probability based on time and random factors
            if np.random.random() < (0.4 * traffic_factor * random_factor):
                self.intersections[i]['queue_ns'] = min(
                    30, self.intersections[i]['queue_ns'] + np.random.randint(1, 4)
                )
                
            if np.random.random() < (0.4 * traffic_factor * random_factor):
                self.intersections[i]['queue_ew'] = min(
                    30, self.intersections[i]['queue_ew'] + np.random.randint(1, 4)
                )
                
    def render(self):
        """Render the environment state (text-based)."""
        print(f"\nTime: {self.current_time:.2f} hours")
        print(f"Step: {self.current_step}/{self.max_steps}")
        
        for i, intersection in self.intersections.items():
            phase_str = "NS Green, EW Red" if intersection['current_phase'] == 0 else "NS Red, EW Green"
            print(f"Intersection {i}: Position {intersection['position']}")
            print(f"  Phase: {phase_str} (for {intersection['time_in_phase']} steps)")
            print(f"  NS Queue: {intersection['queue_ns']}")
            print(f"  EW Queue: {intersection['queue_ew']}")
            print()


def train_agent(episodes=500, batch_size=32):
    """
    Train the RL agent in the traffic environment.
    
    Args:
        episodes (int): Number of training episodes
        batch_size (int): Batch size for experience replay
        
    Returns:
        TrafficRLAgent: Trained agent
    """
    # Initialize environment and agent
    env = TrafficEnvironment(grid_size=(10, 10), num_intersections=4)
    
    # State size for each intersection (defined in _get_state method)
    state_size = 6
    
    # Action size (defined in step method)
    action_size = 4
    
    # Create agents for each intersection
    agents = {
        i: TrafficRLAgent(state_size, action_size)
        for i in range(len(env.intersections))
    }
    
    # Training loop
    for episode in range(episodes):
        # Reset environment
        states = env.reset()
        
        # Reshape states for neural network input
        shaped_states = {
            i: np.reshape(state, [1, state_size])
            for i, state in states.items()
        }
        
        total_rewards = {i: 0 for i in agents}
        done = False
        
        while not done:
            # Agents select actions
            actions = {
                i: agent.act(shaped_states[i])
                for i, agent in agents.items()
            }
            
            # Environment step
            next_states, rewards, done, _ = env.step(actions)
            
            # Reshape next_states
            shaped_next_states = {
                i: np.reshape(state, [1, state_size])
                for i, state in next_states.items()
            }
            
            # Agents remember experiences
            for i, agent in agents.items():
                agent.remember(
                    shaped_states[i],
                    actions[i],
                    rewards[i],
                    shaped_next_states[i],
                    done
                )
                
                # Train from experience replay
                agent.replay(batch_size)
                
                # Update total rewards
                total_rewards[i] += rewards[i]
                
            # Update states
            shaped_states = shaped_next_states
            
            # Update target networks every 10 episodes
            if episode % 10 == 0 and env.current_step == 1:
                for i, agent in agents.items():
                    agent.update_target_network()
                    
        # Print training progress
        if episode % 10 == 0:
            avg_reward = sum(total_rewards.values()) / len(total_rewards)
            print(f"Episode: {episode}, Average reward: {avg_reward:.2f}, Epsilon: {agents[0].epsilon:.2f}")
            
    # Save trained agents
    for i, agent in agents.items():
        agent.save(f"agent_{i}_model.h5")
        
    return agents


if __name__ == "__main__":
    print("Smart Traffic Management System - Reinforcement Learning Module")
    print("\nThis module implements a Deep Q-Network (DQN) based reinforcement learning")
    print("agent for traffic signal control optimization. When executed, it will train")
    print("agents to control multiple intersections in a simulated environment.")
    print("\nTo train agents, call train_agent() with desired parameters.")
    
    # Uncomment to run training
    # agents = train_agent(episodes=500, batch_size=32)
