import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const App = () => {
  const [ticker, setTicker] = useState('');
  const [days, setDays] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        ticker,
        days: parseInt(days),
      });

      const predictions = response.data.predictions.map((item) => ({
        date: item.date,
        price: item.price,
      }));

      setData({
        labels: predictions.map((item) => item.date),
        datasets: [
          {
            label: `Predicted Prices for ${ticker}`,
            data: predictions.map((item) => item.price),
            borderColor: '#3e95cd',
            fill: false,
            tension: 0.1,
          },
        ],
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch prediction. Please check the input or try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Stock Market Prediction</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Ticker (e.g., ^NSEI)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="number"
          placeholder="Enter Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handlePredict} style={{ padding: '5px 10px' }}>
          Predict
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div style={{ marginTop: '20px' }}>
          <Line data={data} />
        </div>
      )}
    </div>
  );
};

export default App;
