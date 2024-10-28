import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, Dense, Flatten, Dropout

class UPIFraudDetector:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        
    def preprocess_data(self, df):
        # Convert timestamp to hour of day and day of week
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Extract relevant features
        feature_columns = [
            'amount', 'hour', 'day_of_week', 
            'sender_account_age', 'recipient_account_age',
            'sender_transaction_count', 'recipient_transaction_count'
        ]
        
        X = df[feature_columns].values
        y = df['is_fraud'].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Reshape for CNN (samples, timesteps, features)
        X_reshaped = X_scaled.reshape(X_scaled.shape[0], X_scaled.shape[1], 1)
        
        return X_reshaped, y
    
    def build_model(self, input_shape):
        model = Sequential([
            Conv1D(32, 2, activation='relu', input_shape=input_shape),
            MaxPooling1D(2),
            Conv1D(64, 2, activation='relu'),
            MaxPooling1D(2),
            Conv1D(64, 2, activation='relu'),
            Flatten(),
            Dense(64, activation='relu'),
            Dropout(0.5),
            Dense(1, activation='sigmoid')
        ])
        
        model.compile(optimizer='adam',
                     loss='binary_crossentropy',
                     metrics=['accuracy', tf.keras.metrics.AUC()])
        
        self.model = model
        return model
    
    def train(self, X, y, epochs=10, batch_size=32, validation_split=0.2):
        history = self.model.fit(
            X, y,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=validation_split,
            verbose=1
        )
        return history
    
    def predict(self, X):
        # Reshape and scale input data
        X_scaled = self.scaler.transform(X)
        X_reshaped = X_scaled.reshape(X_scaled.shape[0], X_scaled.shape[1], 1)
        
        # Get prediction probabilities
        pred_probs = self.model.predict(X_reshaped)
        
        return pred_probs
    
    def save_model(self, path):
        self.model.save(path)
    
    def load_model(self, path):
        self.model = tf.keras.models.load_model(path)
