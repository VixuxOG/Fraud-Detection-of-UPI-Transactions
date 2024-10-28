from flask import Flask, render_template, request, jsonify
import pandas as pd
import json
from datetime import datetime
import os
from fraud_detector import UPIFraudDetector

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MODEL_PATH'] = 'model/upi_fraud_model.h5'

# Initialize fraud detector
detector = UPIFraudDetector()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.csv'):
        # Save file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'transactions.csv')
        file.save(filepath)
        
        # Process file
        try:
            df = pd.read_csv(filepath)
            # Train model if not already trained
            if not os.path.exists(app.config['MODEL_PATH']):
                X, y = detector.preprocess_data(df)
                detector.build_model((X.shape[1], 1))
                detector.train(X, y)
                detector.save_model(app.config['MODEL_PATH'])
            else:
                detector.load_model(app.config['MODEL_PATH'])
            
            return jsonify({'success': True, 'message': 'File processed successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/transactions')
def get_transactions():
    try:
        df = pd.read_csv(os.path.join(app.config['UPLOAD_FOLDER'], 'transactions.csv'))
        # Get predictions for all transactions
        X = df[['amount', 'hour', 'day_of_week', 
                'sender_account_age', 'recipient_account_age',
                'sender_transaction_count', 'recipient_transaction_count']].values
        fraud_probabilities = detector.predict(X)
        
        # Add predictions to dataframe
        df['fraud_probability'] = fraud_probabilities
        
        # Convert to dictionary for JSON response
        transactions = df.to_dict('records')
        return jsonify(transactions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True)
