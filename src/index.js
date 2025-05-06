import { Chart, registerables } from 'chart.js';
import { controlGroupData, testGroupData } from './data.js';
import './index.css';

Chart.register(...registerables);

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

const controlData = processData(controlGroupData);
const testData = processData(testGroupData);

// Calculate metrics
const calculateMetrics = (data) => {
    return {
        totalSpend: data.reduce((sum, day) => sum + day.spend, 0),
        totalImpressions: data.reduce((sum, day) => sum + day.impressions, 0),
        totalReach: data.reduce((sum, day) => sum + day.reach, 0),
        totalClicks: data.reduce((sum, day) => sum + day.clicks, 0),
        totalSearches: data.reduce((sum, day) => sum + day.searches, 0),
        totalViewContent: data.reduce((sum, day) => sum + day.viewContent, 0),
        totalAddToCart: data.reduce((sum, day) => sum + day.addToCart, 0),
        totalPurchase: data.reduce((sum, day) => sum + day.purchase, 0),
    };
};

const controlMetrics = calculateMetrics(controlData);
const testMetrics = calculateMetrics(testData);

// Calculate conversion rates
const calculateConversionRates = (metrics) => ({
    ctr: (metrics.totalClicks / metrics.totalImpressions * 100).toFixed(2),
    searchRate: (metrics.totalSearches / metrics.totalClicks * 100).toFixed(2),
    viewContentRate: (metrics.totalViewContent / metrics.totalSearches * 100).toFixed(2),
    addToCartRate: (metrics.totalAddToCart / metrics.totalViewContent * 100).toFixed(2),
    purchaseRate: (metrics.totalPurchase / metrics.totalAddToCart * 100).toFixed(2),
    overallConversion: (metrics.totalPurchase / metrics.totalClicks * 100).toFixed(2)
});

const controlRates = calculateConversionRates(controlMetrics);
const testRates = calculateConversionRates(testMetrics);

// Update key metrics section
const updateKeyMetrics = () => {
    const keyMetricsDiv = document.getElementById('keyMetrics');
    const metrics = [
        { label: 'Total Spend', control: controlMetrics.totalSpend.toFixed(2), test: testMetrics.totalSpend.toFixed(2) },
        { label: 'Total Impressions', control: controlMetrics.totalImpressions, test: testMetrics.totalImpressions },
        { label: 'Total Purchases', control: controlMetrics.totalPurchase, test: testMetrics.totalPurchase },
        { label: 'Overall Conversion Rate', control: `${controlRates.overallConversion}%`, test: `${testRates.overallConversion}%` }
    ];

    keyMetricsDiv.innerHTML = metrics.map(metric => `
        <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span class="font-medium">${metric.label}</span>
            <div class="flex gap-4">
                <span class="text-blue-600">${metric.control}</span>
                <span class="text-green-600">${metric.test}</span>
            </div>
        </div>
    `).join('');
};

// Create spend chart
const createSpendChart = () => {
    const ctx = document.getElementById('spendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
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
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Spend Comparison'
                }
            }
        }
    });
};

// Create conversion chart
const createConversionChart = () => {
    const ctx = document.getElementById('conversionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
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
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Conversion Rates Comparison'
                }
            }
        }
    });
};

// Update detailed metrics table
const updateMetricsTable = () => {
    const tableBody = document.getElementById('metricsTable');
    const metrics = [
        { label: 'Click-Through Rate', control: `${controlRates.ctr}%`, test: `${testRates.ctr}%` },
        { label: 'Search Rate', control: `${controlRates.searchRate}%`, test: `${testRates.searchRate}%` },
        { label: 'View Content Rate', control: `${controlRates.viewContentRate}%`, test: `${testRates.viewContentRate}%` },
        { label: 'Add to Cart Rate', control: `${controlRates.addToCartRate}%`, test: `${testRates.addToCartRate}%` },
        { label: 'Purchase Rate', control: `${controlRates.purchaseRate}%`, test: `${testRates.purchaseRate}%` }
    ];

    tableBody.innerHTML = metrics.map(metric => {
        const controlValue = parseFloat(metric.control);
        const testValue = parseFloat(metric.test);
        const difference = ((testValue - controlValue) / controlValue * 100).toFixed(2);
        const differenceClass = difference > 0 ? 'text-green-600' : 'text-red-600';

        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${metric.label}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${metric.control}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${metric.test}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${differenceClass}">${difference}%</td>
            </tr>
        `;
    }).join('');
};

// Initialize the dashboard
const initDashboard = () => {
    updateKeyMetrics();
    createSpendChart();
    createConversionChart();
    updateMetricsTable();
};

// Run the dashboard
initDashboard();
