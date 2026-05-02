# GENCENTS - Financial Preparedness Tracker

**Course:** CS 4352 – Human Computer Interaction  
**Team:** Team 3

## Team Members
- Jude Joubert
- Charitha Sarraju
- Kavyadharshini Seenuvasan
- Marc Manoj

## GitHub Repository
https://github.com/Look-Its-Sky/hci_dp3

---

## Table of Contents
1. [Application Overview](#application-overview)
2. [UI Features & Functionality](#ui-features--functionality)
3. [Installation Requirements](#installation-requirements)
4. [Operating Instructions](#operating-instructions)
5. [Test User Credentials](#test-user-credentials)
6. [Browser & Device Compatibility](#browser--device-compatibility)
7. [Known Limitations](#known-limitations)
8. [Troubleshooting](#troubleshooting)

---

## Application Overview

GENCENTS is a comprehensive financial preparedness tracking application designed to help users manage their financial goals, visualize their financial health, and run "what-if" scenarios to understand the potential impact of life events on their finances.

### Key Features
- **Multi-user Authentication** - Separate accounts with personalized financial data
- **Financial Dashboard** - Overview of total equity, accounts, and spending breakdown
- **Goal Tracking** - Create, monitor, and manage financial goals with progress visualization
- **Scenario Planning** - Simulate financial events and view projected impacts
- **AI-Powered Recommendations** - Personalized financial advice using LangChain and Ollama
- **Interactive Projection Charts** - 1-year and 5-year wealth projections with Recharts
- **Cross-Platform Support** - Web, iOS, and Android via Capacitor

---

## UI Features & Functionality

The application features a clean, modern interface with a dark gray color scheme. Navigation is handled through a bottom navigation bar with three main sections:

### 1. HOME (Dashboard)

The home page serves as the main financial overview dashboard:

- **Welcome Banner** - Personalized greeting with user's name and last updated timestamp
- **Total Equity Card** - Displays combined value of all accounts (checking, savings, investments, retirement) with a dark gray gradient background
- **Quick Stats** - Monthly savings amount and savings rate percentage
- **Spending Breakdown** - Visual breakdown of monthly expenses by category using colored indicators:
  - Housing (blue)
  - Transportation (purple)
  - Groceries (green)
  - Utilities (orange)
  - Dining (pink)
  - Entertainment (teal)
  - Insurance (red)
  - Subscriptions (indigo)
  - Other (gray)
- **Accounts Summary** - Detailed view of all linked accounts with balances and performance metrics

### 2. MY GOALS

The goals page allows users to track progress toward financial objectives:

- **Total Goals Balance** - Summary card showing combined progress across all goals
- **Add Goal Button** - Opens a modal to create new financial goals
- **Goal List** - Each goal displays:
  - Goal name and completion status
  - Progress bar with percentage
  - Current amount vs target amount
  - Checkmark icon for completed goals
- **Goal Categories** - Support for various goal types (savings, debt payoff, investments, etc.)

### 3. SCENARIOS

The scenarios page enables financial planning through simulation:

- **Financial Snapshot** - Dark gray banner showing current savings, monthly income, and risk tolerance
- **Category Filters** - Quick filters for scenario types (All, Market, Career, Life Events, Custom)
- **Quick Scenario Selection** - Pre-built scenario cards:
  - 📉 Market Crash (-20% portfolio)
  - 💼 Job Loss (6 months expenses)
  - 🏠 Home Purchase ($50,000 down)
  - 🚗 Major Car Repair ($5,000)
  - 🏥 Medical Emergency ($10,000)
  - 🎓 Education Fund ($25,000)
- **Custom Scenarios** - Create personalized scenarios with custom title, cost, and impact period
- **Recent Scenarios** - History of previously run scenarios with dates

#### Scenario Results

After running a scenario, the results page displays:

- **Financial Comparison** - Before/After metrics showing:
  - Net Worth change
  - Monthly Cash Flow impact
  - Emergency Fund months remaining
  - 1-Year and 5-Year projections (clickable to view graphs)
- **Projection Graphs** (Modal Popup):
  - Interactive area charts showing wealth over time
  - Three comparison lines: Before, After Scenario, With Recommendations
  - 1-Year view: Monthly breakdown
  - 5-Year view: Yearly breakdown
- **AI-Powered Recommendations** - Personalized financial advice based on:
  - User's financial profile
  - Selected scenario
  - Risk tolerance
  - Current goals and account balances
- **Apply Recommendations** - Select and apply recommendations to see updated projections
- **Save to History** - Store scenario results for future reference

### 4. LOGIN PAGE

- Clean, centered login form with dark gray themed button
- Username and password fields with focus states
- Error handling for invalid credentials
- Logout functionality available via header button on all pages

---

## Installation Requirements

### Prerequisites

The application can be run with minimal setup. You will need:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| **Node.js** | 18.x LTS or higher | https://nodejs.org |
| **npm** | Included with Node.js | https://www.npmjs.com |

**Alternative:** You can use Yarn as your package manager instead of npm.
- Yarn: https://yarnpkg.com

### System Requirements

- **Operating System:** Windows 10/11, macOS 10.15+, or Linux
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** ~500MB for dependencies

---

## Operating Instructions

### Quick Start (Web Browser)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Look-Its-Sky/hci_dp3.git
   cd hci_dp3
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   Or with Yarn:
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Or with Yarn:
   ```bash
   yarn start
   ```

4. **Open in browser:**
   - The application will automatically open at `http://localhost:3000`
   - If port 3000 is in use, it will prompt to use another port (e.g., 3001)

5. **Login with test credentials** (see below)

### Running Production Build

To create and serve an optimized production build:

```bash
npm run build
npx serve -s build
```

### Mobile Deployment (Optional)

For native mobile app deployment using Capacitor:

1. **Build web assets:**
   ```bash
   npm run build
   ```

2. **Sync with native projects:**
   ```bash
   npx cap sync
   ```

3. **Run on Android** (requires Android Studio):
   ```bash
   npx cap run android
   ```

4. **Run on iOS** (requires Xcode on macOS):
   ```bash
   npx cap run ios
   ```

---

## Test User Credentials

The application includes two pre-configured test accounts with different financial profiles:

### Account 1: Admin User
| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin` |
| **Profile Name** | Alex Johnson |
| **Monthly Income** | $7,500 |
| **Total Equity** | ~$146,000 |
| **Risk Tolerance** | Moderate |
| **Credit Score** | 742 |

**Alex's Profile Features:**
- Higher income professional
- Diversified accounts (checking, high-yield savings, brokerage, 401k)
- Goals include house loan, student loan repayment, emergency fund
- Moderate risk tolerance suitable for balanced recommendations

### Account 2: Demo User
| Field | Value |
|-------|-------|
| **Username** | `demo` |
| **Password** | `demo` |
| **Profile Name** | Jamie Smith |
| **Monthly Income** | $4,800 |
| **Total Equity** | ~$46,500 |
| **Risk Tolerance** | Aggressive |
| **Credit Score** | 698 |

**Jamie's Profile Features:**
- Entry-level income
- Includes Roth IRA and Robinhood investment account
- Goals include emergency fund building, student loans, side business funding
- Aggressive risk tolerance for growth-focused recommendations

---

## Browser & Device Compatibility

### Supported Browsers

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Google Chrome | 90+ | ✅ Fully Supported |
| Mozilla Firefox | 88+ | ✅ Fully Supported |
| Microsoft Edge | 90+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

### Responsive Design

The application is fully responsive and tested on:
- **Desktop:** 1920x1080, 1366x768, 1280x720
- **Tablet:** iPad (768x1024), iPad Pro (1024x1366)
- **Mobile:** iPhone (375x812), Android (360x640)

### Required Browser Settings

- **JavaScript:** Must be enabled
- **Cookies:** Not required (no persistent storage)
- **Pop-ups:** Not required

---

## Known Limitations

### Data Persistence
- **No Backend Database:** All data is stored in-memory and will reset on page refresh
- **Session-Only:** Login state is maintained only during the current browser session
- **No Data Export:** Financial data cannot be exported or saved externally

### AI Recommendations
- **External Dependency:** AI recommendations require connection to the Ollama server at `http://64.181.210.250:11434`
- **Fallback System:** If AI server is unavailable, the application falls back to rule-based recommendations
- **Response Time:** AI recommendations may take 5-15 seconds to generate depending on server load

### Calculations
- **Simplified Models:** Financial projections use simplified compound interest calculations
- **No Real Market Data:** Investment returns are simulated, not based on actual market performance
- **Static Expense Ratios:** Monthly expense categories are fixed percentages

### Mobile Limitations
- **Native Features:** Some native device features (notifications, biometrics) are not implemented
- **Offline Mode:** Application requires internet connection for AI features

### Security
- **Demo Credentials:** Test accounts use simple passwords for demonstration purposes
- **No Encryption:** Data is not encrypted (prototype only)
- **No Session Timeout:** Sessions do not automatically expire

---

## Troubleshooting

### Common Issues

#### "Port 3000 is already in use"
**Solution:** Either:
- Accept the prompt to run on a different port, OR
- Kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :3000
  kill -9 <PID>
  ```

#### "npm install" fails
**Solution:**
1. Delete `node_modules` folder and `package-lock.json`
2. Clear npm cache: `npm cache clean --force`
3. Run `npm install` again

#### AI Recommendations show "Loading..." indefinitely
**Solution:**
- The Ollama AI server may be unavailable
- Wait 60 seconds for timeout, then fallback recommendations will appear
- Check browser console (F12) for connection errors

#### Styles not loading correctly
**Solution:**
1. Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart the development server

#### Login not working
**Solution:**
- Ensure you're using exact credentials: `admin/admin` or `demo/demo`
- Credentials are case-sensitive
- Check that JavaScript is enabled in your browser

---

## Project Structure

```
hci_dp3/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # React components
│   │   ├── AddGoalModal.tsx
│   │   ├── CreateScenarioModal.tsx
│   │   ├── GoalItem.tsx
│   │   ├── Header.tsx
│   │   └── ScenarioResults.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── data/              # Mock data and user profiles
│   │   └── index.ts
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MyGoalsPage.tsx
│   │   └── ScenariosPage.tsx
│   ├── services/          # External services
│   │   └── aiAdvisor.ts   # LangChain/Ollama integration
│   ├── styles/            # CSS stylesheets
│   │   ├── global.css
│   │   └── variables.css
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── android/               # Capacitor Android project
├── ios/                   # Capacitor iOS project
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App (irreversible) |

---

## Additional Documentation

- **SOURCE_DOCUMENT.md** - Complete list of external dependencies with SDK URLs
- **Capacitor Documentation** - https://capacitorjs.com/docs
- **React Documentation** - https://react.dev

---

*Last Updated: December 2024*
