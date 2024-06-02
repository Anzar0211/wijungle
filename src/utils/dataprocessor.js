import moment from 'moment';

export const processData = (data) => {
  const alertCountsOverTime = {
    labels: [],
    datasets: [
      {
        label: 'Alert Counts',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const severityDistribution = {
    labels: [],
    datasets: [
      {
        label: 'Severity Distribution',
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const topSourceIPs = {
    labels: [],
    datasets: [
      {
        label: 'Top Source IPs',
        data: [],
        backgroundColor: 'rgba(153,102,255,0.2)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };

  const topDestinationPorts = {
    labels: [],
    datasets: [
      {
        label: 'Top Destination Ports',
        data: [],
        backgroundColor: 'rgba(255,159,64,0.2)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1,
      },
    ],
  };

  const alertCounts = {};
  const severityCounts = {};
  const sourceIPCounts = {};
  const destinationPortCounts = {};

  if (!Array.isArray(data)) {
    return { alertCountsOverTime, severityDistribution, topSourceIPs, topDestinationPorts };
  }

  data.forEach((entry) => {
    const date = moment(entry.timestamp).format('YYYY-MM-DD');
    alertCounts[date] = (alertCounts[date] || 0) + 1;

    if (entry.alert && entry.alert.severity !== undefined) {
      const severity = entry.alert.severity;
      severityCounts[severity] = (severityCounts[severity] || 0) + 1;
    }

    if (entry.src_ip) {
      const srcIP = entry.src_ip;
      sourceIPCounts[srcIP] = (sourceIPCounts[srcIP] || 0) + 1;
    }

    if (entry.dest_port) {
      const destPort = entry.dest_port;
      destinationPortCounts[destPort] = (destinationPortCounts[destPort] || 0) + 1;
    }
  });

  alertCountsOverTime.labels = Object.keys(alertCounts);
  alertCountsOverTime.datasets[0].data = Object.values(alertCounts);

  severityDistribution.labels = Object.keys(severityCounts);
  severityDistribution.datasets[0].data = Object.values(severityCounts);

  topSourceIPs.labels = Object.keys(sourceIPCounts).slice(0, 10);
  topSourceIPs.datasets[0].data = Object.values(sourceIPCounts).slice(0, 10);

  topDestinationPorts.labels = Object.keys(destinationPortCounts).slice(0, 10);
  topDestinationPorts.datasets[0].data = Object.values(destinationPortCounts).slice(0, 10);

  return { alertCountsOverTime, severityDistribution, topSourceIPs, topDestinationPorts };
};
