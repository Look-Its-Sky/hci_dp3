# Financial Tracker Application

This project is a financial tracking and scenario planning application built with React and TypeScript. It allows users to manage their financial goals, view an impact summary of their finances, and run "what-if" scenarios to see potential effects on their financial health.

The application is designed to be a single-page application (SPA) and can be deployed as a web app or as a native mobile app for iOS and Android using Capacitor.

## UI Functionality

The UI is organized into three main pages, accessible via the bottom navigation bar:

1.  **MY GOALS**:
    *   Displays a list of the user's financial goals (e.g., "Car Downpayment", "Student Loan").
    *   Shows the current progress toward each goal with a progress bar.
    *   Allows users to add new financial goals via a modal dialog that opens when the "+" button is clicked.
    *   Users can mark goals as complete and view contribution history for each goal.

2.  **HOME**:
    *   The main dashboard page, which is the default view when the app starts.
    *   Displays the user's total balance.
    *   Features an "Impact Summary" card that visualizes the relative impact of different financial items (e.g., "House Loan", "Utilities") using a bar chart.

3.  **SCENARIOS**:
    *   Allows users to simulate financial events to see their potential impact.
    *   Users can select from pre-defined scenarios (e.g., "Market Crash") or saved custom scenarios from a dropdown menu.
    *   Provides an option to create a new, custom scenario with details like title, cost, and impact period.
    *   After running a scenario, the UI displays a "Scenario Results" chart and a list of actionable "Recommendations" to help the user adjust their financial plan.

## Requirements & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [Yarn](https://yarnpkg.com/) package manager

### Installation
1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```
    *(Note: Replace `your-username/your-repository-name` with the actual URL of your repository)*

2.  Install the project dependencies:
    ```sh
    yarn install
    ```

### Operating Instructions

#### Running the UI (Web Browser)
To run the application in a local development environment:
```sh
yarn start
```
This will open the application in your default web browser, typically at `http://localhost:3000`. The page will automatically reload if you make any code changes.

*   **Test Credentials**: No user ID or password is required.
*   **Browser Settings**: No special browser settings are needed. The application is responsive and should work on modern web browsers like Chrome, Firefox, and Edge.

#### Running the UI (Mobile)
To run the application on a mobile device or simulator, you will need to configure your environment for native iOS or Android development.

1.  **Build the web assets:**
    ```sh
    yarn build
    ```
2.  **Sync the web assets with the native projects:**
    ```sh
    npx cap sync
    ```
3.  **Run on Android:** (Requires Android Studio)
    ```sh
    npx cap run android
    ```
4.  **Run on iOS:** (Requires Xcode and a macOS machine)
    ```sh
    npx cap run ios
    ```

## Implementation Limitations
*   **No Backend/Database**: This application is a front-end prototype and does not connect to a real backend or database. All data (goals, scenarios, balances, etc.) is mocked within the [`src/App.tsx`](src/App.tsx) file and will reset on every page refresh.
*   **Static Calculations**: The financial "scenario running" and "impact summary" are for demonstration purposes only. The results are based on pre-defined mock data and do not perform real-time financial calculations.
*   **No User Authentication**: There is no login or user account system. The experience is the same for all users and is not persistent.
*   **Single File Architecture**: For simplicity in this prototype, most of the application's logic, components, and styles are contained within a single file: [`src/App.tsx`](src/App.tsx). In a production-scale application, these would be split into separate files and folders for better organization and maintainability.