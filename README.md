# A/B Testing Campaign Analysis

A React-based dashboard for analyzing and visualizing A/B testing results from marketing campaigns. This analysis compares the performance of two marketing campaigns using A/B testing methodology. The control campaign represents the established approach, while the test campaign implements alternative strategies. Based on comprehensive analysis of key metrics, the **control campaign demonstrated better overall performance with an 11.34x ROAS compared to the test campaign's 10.17x ROAS**. However, the test campaign showed significant strengths in specific areas that could inform future optimization.

## Data Overview

| Metric | Control Campaign | Test Campaign | % Difference |
|--------|-----------------|---------------|--------------|
| Total Spend | $66,818 | $76,892 | +15.08% |
| Total Impressions | 3,177,233 | 2,237,544 | -29.58% |
| Total Clicks | 154,303 | 180,970 | +17.28% |
| Total Purchases | 15,161 | 15,637 | +3.14% |
| Total Revenue (est.) | $758,050 | $781,850 | +3.14% |

## Key Metrics Tracked

- Total Spend
- Total Impressions
- Total Purchases
- Click-Through Rate (CTR)
- Search Rate
- View Content Rate
- Add to Cart Rate
- Purchase Rate
- Overall Conversion Rate

## Key Takeaways

1. **The control campaign delivers better overall ROI**, with higher ROAS and lower cost per purchase.

2. **The test campaign excels at initial engagement**, generating significantly higher click-through rates from fewer impressions.

3. **Each campaign has distinct strengths at different funnel stages**:
   - Test campaign: Superior at attracting clicks and converting add-to-cart to purchase
   - Control campaign: Better at driving product views to add-to-cart actions

4. **Spending efficiency differs significantly**:
   - Control campaign spent 15.08% less while generating nearly the same number of purchases
   - Test campaign was less efficient overall but drove higher total revenue

## Technologies Used

- React.js
- Chart.js with react-chartjs-2
- Tailwind CSS
- GitHub Pages for deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ads2024/AB-Testing-Campaign-Analysis.git
cd AB-Testing-Campaign-Analysis
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

### Deployment

The project is configured for GitHub Pages deployment. To deploy:

```bash
npm run deploy
```

## Project Structure

```
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── index.js        # Application entry point
│   ├── index.css       # Global styles
│   └── data.js         # Campaign data
├── package.json
├── tailwind.config.js
└── postcss.config.js
```




