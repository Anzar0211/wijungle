import { processData } from '../src/utils/dataprocessor';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css'; 

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState({
    alertCountsOverTime: { labels: [], datasets: [] },
    severityDistribution: { labels: [], datasets: [] },
    topSourceIPs: { labels: [], datasets: [] },
    topDestinationPorts: { labels: [], datasets: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('../eve.json', { responseType: 'text' })
      .then((response) => {
        const lines = response.data.split('\n');
        const jsonData = lines.filter(line => line.trim() !== '').map(line => JSON.parse(line));
        console.log('Fetched data:', jsonData);
        if (Array.isArray(jsonData)) {
          setData(jsonData);
        } else {
          throw new Error('Data format is not an array');
        }
      })
      .catch((err) => {
        setError(err.message);
        console.error('Error fetching data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      console.log('Processing data:', data);
      setProcessedData(processData(data));
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Security Alerts Dashboard</h1>
      {processedData.alertCountsOverTime.labels.length > 0 && (
        <div className="chart-container">
          <h2>Alert Counts Over Time</h2>
          <Line data={processedData.alertCountsOverTime} />
        </div>
      )}
      {processedData.severityDistribution.labels.length > 0 && (
        <div className="chart-container">
          <h2>Alert Severity Distribution</h2>
          <Pie data={processedData.severityDistribution} />
        </div>
      )}
      {processedData.topSourceIPs.labels.length > 0 && (
        <div className="chart-container">
          <h2>Top Source IPs</h2>
          <Bar data={processedData.topSourceIPs} />
        </div>
      )}
      {processedData.topDestinationPorts.labels.length > 0 && (
        <div className="chart-container">
          <h2>Top Destination Ports</h2>
          <Bar data={processedData.topDestinationPorts} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
