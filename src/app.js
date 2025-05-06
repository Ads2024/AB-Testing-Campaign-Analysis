import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { controlGroupData, testGroupData } from './data';

ChartJS.register(...registerables);

const App = () => {
  const [controlData, setControlData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [controlMetrics, setControlMetrics] = useState({});
  const [testMetrics, setTestMetrics] = useState({});
  const [controlRates, setControlRates] = useState({});
  const [testRates, setTestRates] = useState({});

  useEffect(() => {
    // Process the data
    const processData = (data) => {
      const rows = data.split('\n').slice(1); // Skip header
      return rows.map(row => {
        const [_, date, spend, impressions, reach, clicks, searches, viewContent, addToCart, purchase] = row.split(';');
        return {
          date,
          spend: parseFloat(spend) || 0,
          impressions: parseInt(impressions) || 0,
          reach: parseInt(reach) || 0,
          clicks: parseInt(clicks) || 0,
          searches: parseInt(searches) || 0,
          viewContent: parseInt(viewContent) || 0,
          addToCart: parseInt(addToCart) || 0,
          purchase: parseInt(purchase) || 0
        };
      });
    };

    const processedControlData = processData(controlGroupData);
    const processedTestData = processData(testGroupData);
    setControlData(processedControlData);
    setTestData(processedTestData);

    // Calculate metrics
    const calculateMetrics = (data) => ({
      totalSpend: data.reduce((sum, day) => sum + day.spend, 0),
      totalImpressions: data.reduce((sum, day) => sum + day.impressions, 0),
      totalReach: data.reduce((sum, day) => sum + day.reach, 0),
      totalClicks: data.reduce((sum, day) => sum + day.clicks, 0),
      totalSearches: data.reduce((sum, day) => sum + day.searches, 0),
      totalViewContent: data.reduce((sum, day) => sum + day.viewContent, 0),
      totalAddToCart: data.reduce((sum, day) => sum + day.addToCart, 0),
      totalPurchase: data.reduce((sum, day) => sum + day.purchase, 0),
    });

    const controlMetrics = calculateMetrics(processedControlData);
    const testMetrics = calculateMetrics(processedTestData);
    setControlMetrics(controlMetrics);
    setTestMetrics(testMetrics);

    // Calculate conversion rates
    const calculateConversionRates = (metrics) => ({
      ctr: (metrics.totalClicks / metrics.totalImpressions * 100).toFixed(2),
      searchRate: (metrics.totalSearches / metrics.totalClicks * 100).toFixed(2),
      viewContentRate: (metrics.totalViewContent / metrics.totalSearches * 100).toFixed(2),
      addToCartRate: (metrics.totalAddToCart / metrics.totalViewContent * 100).toFixed(2),
      purchaseRate: (metrics.totalPurchase / metrics.totalAddToCart * 100).toFixed(2),
      overallConversion: (metrics.totalPurchase / metrics.totalClicks * 100).toFixed(2)
    });

    setControlRates(calculateConversionRates(controlMetrics));
    setTestRates(calculateConversionRates(testMetrics));
  }, []);

  const spendChartData = {
    labels: controlData.map(d => d.date),
    datasets: [
      {
        label: 'Control Campaign',
        data: controlData.map(d => d.spend),
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      },
      {
        label: 'Test Campaign',
        data: testData.map(d => d.spend),
        borderColor: 'rgb(16, 185, 129)',
        tension: 0.1
      }
    ]
  };

  const conversionChartData = {
    labels: ['CTR', 'Search Rate', 'View Content', 'Add to Cart', 'Purchase'],
    datasets: [
      {
        label: 'Control Campaign',
        data: [
          controlRates.ctr,
          controlRates.searchRate,
          controlRates.viewContentRate,
          controlRates.addToCartRate,
          controlRates.purchaseRate
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)'
      },
      {
        label: 'Test Campaign',
        data: [
          testRates.ctr,
          testRates.searchRate,
          testRates.viewContentRate,
          testRates.addToCartRate,
          testRates.purchaseRate
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.5)'
      }
    ]
  };

  const metrics = [
    { label: 'Click-Through Rate', control: `${controlRates.ctr}%`, test: `${testRates.ctr}%` },
    { label: 'Search Rate', control: `${controlRates.searchRate}%`, test: `${testRates.searchRate}%` },
    { label: 'View Content Rate', control: `${controlRates.viewContentRate}%`, test: `${testRates.viewContentRate}%` },
    { label: 'Add to Cart Rate', control: `${controlRates.addToCartRate}%`, test: `${testRates.addToCartRate}%` },
    { label: 'Purchase Rate', control: `${controlRates.purchaseRate}%`, test: `${testRates.purchaseRate}%` }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Campaign A/B Testing Analysis</h1>
          <p className="text-gray-600">Comparing Control vs Test Campaign Performance</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Metrics Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
            <div className="space-y-4">
              {[
                { label: 'Total Spend', control: controlMetrics.totalSpend?.toFixed(2), test: testMetrics.totalSpend?.toFixed(2) },
                { label: 'Total Impressions', control: controlMetrics.totalImpressions, test: testMetrics.totalImpressions },
                { label: 'Total Purchases', control: controlMetrics.totalPurchase, test: testMetrics.totalPurchase },
                { label: 'Overall Conversion Rate', control: `${controlRates.overallConversion}%`, test: `${testRates.overallConversion}%` }
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{metric.label}</span>
                  <div className="flex gap-4">
                    <span className="text-blue-600">{metric.control}</span>
                    <span className="text-green-600">{metric.test}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistical Analysis Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Statistical Analysis</h2>
            <div className="space-y-4">
              {metrics.map((metric, index) => {
                const controlValue = parseFloat(metric.control);
                const testValue = parseFloat(metric.test);
                const difference = ((testValue - controlValue) / controlValue * 100).toFixed(2);
                const differenceClass = difference > 0 ? 'text-green-600' : 'text-red-600';

                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{metric.label}</span>
                    <div className="flex gap-4">
                      <span className="text-blue-600">{metric.control}</span>
                      <span className="text-green-600">{metric.test}</span>
                      <span className={differenceClass}>{difference}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Charts */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Campaign Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Line data={spendChartData} options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Daily Spend Comparison'
                    }
                  }
                }} />
              </div>
              <div>
                <Bar data={conversionChartData} options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Conversion Rates Comparison'
                    }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detailed Metrics</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.map((metric, index) => {
                    const controlValue = parseFloat(metric.control);
                    const testValue = parseFloat(metric.test);
                    const difference = ((testValue - controlValue) / controlValue * 100).toFixed(2);
                    const differenceClass = difference > 0 ? 'text-green-600' : 'text-red-600';

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.label}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metric.control}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metric.test}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${differenceClass}`}>{difference}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
