
"""
Smart Traffic Management System - LSTM Traffic Prediction Model

This module implements a Long Short-Term Memory (LSTM) neural network for
predicting traffic congestion based on historical traffic data. The model
is designed to forecast congestion levels to support proactive traffic
management decisions.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

class TrafficLSTMModel:
    """LSTM model for traffic congestion prediction."""
    
    def __init__(self, look_back=12, prediction_horizon=4):
        """
        Initialize the LSTM model for traffic prediction.
        
        Args:
            look_back (int): Number of past time steps to use as input features
            prediction_horizon (int): Number of future time steps to predict
        """
        self.look_back = look_back
        self.prediction_horizon = prediction_horizon
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        
    def load_data(self, filepath):
        """
        Load traffic data from CSV file.
        
        Args:
            filepath (str): Path to the CSV file containing traffic data
                Expected columns: timestamp, vehicle_count, speed, congestion_index
                
        Returns:
            pd.DataFrame: Loaded and preprocessed traffic data
        """
        # Load data
        try:
            data = pd.read_csv(filepath)
            # Convert timestamp to datetime
            data['timestamp'] = pd.to_datetime(data['timestamp'])
            data.set_index('timestamp', inplace=True)
            
            # Check for missing values
            if data.isnull().sum().sum() > 0:
                print(f"Warning: Found {data.isnull().sum().sum()} missing values. Applying interpolation.")
                data.interpolate(method='time', inplace=True)
                
            return data
            
        except Exception as e:
            print(f"Error loading data: {e}")
            return None
    
    def preprocess_data(self, data, target_column='congestion_index'):
        """
        Preprocess data for LSTM model.
        
        Args:
            data (pd.DataFrame): Traffic data
            target_column (str): Column name to predict
            
        Returns:
            tuple: X_train, y_train, X_test, y_test
        """
        # Extract target column and normalize
        dataset = data[target_column].values.reshape(-1, 1)
        dataset = self.scaler.fit_transform(dataset)
        
        # Split data into training and testing sets (80% train, 20% test)
        train_size = int(len(dataset) * 0.8)
        train_data = dataset[:train_size]
        test_data = dataset[train_size:]
        
        # Create sequences for LSTM
        X_train, y_train = self._create_sequences(train_data)
        X_test, y_test = self._create_sequences(test_data)
        
        # Reshape input for LSTM [samples, time steps, features]
        X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
        X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
        
        return X_train, y_train, X_test, y_test
    
    def _create_sequences(self, data):
        """
        Create input sequences and target values for LSTM.
        
        Args:
            data (np.array): Normalized input data
            
        Returns:
            tuple: X (input sequences), y (target values)
        """
        X, y = [], []
        for i in range(len(data) - self.look_back - self.prediction_horizon + 1):
            X.append(data[i:(i + self.look_back), 0])
            y.append(data[(i + self.look_back):(i + self.look_back + self.prediction_horizon), 0])
        
        return np.array(X), np.array(y)
    
    def build_model(self, input_shape):
        """
        Build the LSTM model architecture.
        
        Args:
            input_shape (tuple): Shape of input data [time steps, features]
        """
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(self.prediction_horizon)
        ])
        
        model.compile(optimizer='adam', loss='mse')
        self.model = model
        
        print(model.summary())
        return model
    
    def train(self, X_train, y_train, epochs=100, batch_size=32, validation_split=0.2, early_stopping=True):
        """
        Train the LSTM model.
        
        Args:
            X_train (np.array): Training input sequences
            y_train (np.array): Training target values
            epochs (int): Number of training epochs
            batch_size (int): Batch size for training
            validation_split (float): Fraction of training data to use for validation
            early_stopping (bool): Whether to use early stopping
            
        Returns:
            tf.keras.callbacks.History: Training history
        """
        callbacks = []
        
        if early_stopping:
            early_stop = tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            )
            callbacks.append(early_stop)
            
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=validation_split,
            callbacks=callbacks,
            verbose=1
        )
        
        return history
    
    def evaluate(self, X_test, y_test):
        """
        Evaluate the model on test data.
        
        Args:
            X_test (np.array): Test input sequences
            y_test (np.array): Test target values
            
        Returns:
            dict: Dictionary containing evaluation metrics
        """
        y_pred = self.model.predict(X_test)
        
        # Inverse transform predictions and actual values
        y_test_inv = self.scaler.inverse_transform(y_test)
        y_pred_inv = self.scaler.inverse_transform(y_pred)
        
        # Calculate metrics
        mse = mean_squared_error(y_test_inv, y_pred_inv)
        mae = mean_absolute_error(y_test_inv, y_pred_inv)
        rmse = np.sqrt(mse)
        
        metrics = {
            'mse': mse,
            'mae': mae,
            'rmse': rmse
        }
        
        print(f"Model Evaluation:")
        print(f"MSE: {mse:.4f}")
        print(f"MAE: {mae:.4f}")
        print(f"RMSE: {rmse:.4f}")
        
        return metrics
    
    def predict(self, input_sequence):
        """
        Make predictions using the trained model.
        
        Args:
            input_sequence (np.array): Input sequence of shape [look_back, features]
            
        Returns:
            np.array: Predicted congestion levels for next prediction_horizon time steps
        """
        # Ensure input has correct shape
        input_sequence = np.array(input_sequence).reshape(1, self.look_back, 1)
        
        # Make prediction
        prediction = self.model.predict(input_sequence)
        
        # Inverse transform
        prediction_inv = self.scaler.inverse_transform(prediction)
        
        return prediction_inv[0]  # Return as 1D array
    
    def save_model(self, filepath):
        """
        Save the trained model.
        
        Args:
            filepath (str): Path where to save the model
        """
        if self.model is not None:
            self.model.save(filepath)
            print(f"Model saved to {filepath}")
        else:
            print("Error: No model to save.")
    
    def load_saved_model(self, filepath):
        """
        Load a previously trained model.
        
        Args:
            filepath (str): Path to the saved model
        """
        try:
            self.model = tf.keras.models.load_model(filepath)
            print(f"Model loaded from {filepath}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def plot_predictions(self, y_true, y_pred, title="Traffic Congestion Prediction"):
        """
        Plot actual vs predicted values.
        
        Args:
            y_true (np.array): Actual congestion values
            y_pred (np.array): Predicted congestion values
            title (str): Plot title
        """
        plt.figure(figsize=(12, 6))
        
        # Plot actual values
        plt.plot(y_true, label='Actual', color='blue', marker='o', linestyle='-', markersize=3)
        
        # Plot predicted values
        plt.plot(y_pred, label='Predicted', color='red', marker='x', linestyle='--', markersize=3)
        
        plt.title(title)
        plt.xlabel('Time')
        plt.ylabel('Congestion Index')
        plt.legend()
        plt.grid(True)
        
        plt.tight_layout()
        plt.savefig('prediction_results.png')
        plt.show()


if __name__ == "__main__":
    # Example usage
    model = TrafficLSTMModel(look_back=12, prediction_horizon=4)
    
    # This would be replaced with actual data loading
    print("Note: This is a demonstration script. Replace with actual data paths.")
    print("To use this model, provide traffic data in CSV format with columns:")
    print("- timestamp: Date and time of observation")
    print("- vehicle_count: Number of vehicles detected")
    print("- speed: Average speed of vehicles")
    print("- congestion_index: Target variable to predict")
    
    # Model configuration info
    print("\nModel Configuration:")
    print(f"Look-back period: {model.look_back} time steps")
    print(f"Prediction horizon: {model.prediction_horizon} time steps")
