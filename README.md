# GENCENTS - Team 3

Team Members:
- Jude Joubert
- Charitha Sarraju
- Kavyadharshini Seenuvasan
- Marc Manoj

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
# Financial Tracker Application - Financial DNA

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
  
**What Changed in the UI (DP6 Updates)**:

- Based on usability feedback and heuristic evaluation, we made UI improvements to increase clarity, reduce clutter, and improve recognition of key actions.
- Key UI Updates
- Improved dashboard readability: clearer visual hierarchy, reduced whitespace, and more consistent spacing so key information is easier to scan.
- Clearer progress visibility: added more explicit progress indicators (numbers/labels where applicable) to reduce ambiguity in goal/impact visuals.
- More consistent design system: unified colors, layout styles, and spacing across pages for a more cohesive experience.
- Improved explanatory text: added brief descriptions to clarify what sections like Impact Summary and Scenarios represent.
- Better action recognition: refined the “Run Scenario” vs “Create Scenario” interaction so users can more easily distinguish actions.

**Core Features & Functionality (DP 6)**
A. Home (Dashboard)
The dashboard is the default landing view and provides a quick snapshot of financial status.

Key elements:
   *   Balance Display: Shows a top-level “balance” number to anchor the user’s current financial state (prototype/demo value).
   *   Impact Summary Visualization: Displays a visual breakdown of financial items (e.g., debts, expenses, goals) to help users understand what categories have the largest impact.
   *   Goal/Item Overview: Provides quick access to the user’s tracked items and progress at a glance.
What users can do on Home:
   *   Quickly check overall financial status
   *   Interpret high-level “impact” distribution
   *   an progress on goals and key categories

B. My Goals (Goal Tracking)
This page supports the core “financial preparedness” workflow: setting goals and tracking progress over time.

Key features:
   *   Goal List: Displays saved goals (e.g., “Car Downpayment,” “Student Loan”) with progress indicators.
   *   Progress Visualization: Each goal includes a progress bar showing movement toward completion.
   *   Add Goal Flow: A “+ Add Goal” action opens a form/modal where a user can enter goal details.
   *   Completion Indicators: Users can mark goals complete and see clear visual signals for completed items.

Typical user flow:
   *   Open My Goals
   *   Click Add Goal
   *   Enter goal details (name + amount fields used in the prototype)
   *   Submit to create the goal
   *   Track progress visually through the goal list

C. Scenarios (Worst-Case Planning)
The scenario system allows users to test hypothetical future situations and receive guidance on adapting their plan.

Key features:
   *   Preset Scenarios: Users can choose pre-loaded events (example: “Market Crash”).
   *   Custom Scenario Creation: Users can create their own scenario by entering parameters such as:
   *   scenario title
   *   impact duration/frequency fields
   *   cost fields (depending on form)
   *   Run Scenario: Executes the scenario and generates a results view.
   *   Scenario Results Output: Displays an outcome visualization and a list of suggested adjustments. Allows you to click on those suggestions and gives you updated results, also outputs agraph for users to visualize their scenarios in numbers
   *   Recommendations: The system provides actionable suggestions for how the user could adapt to stay afloat.

Typical user flow:
   *   Go to Scenarios
   *   Choose a preset scenario OR create a custom scenario
   *   Click Run Scenario
   *   Review results + recommendations to adjust plan

4. Requirements & Compatibility
Recommended Browsers
- Google Chrome (recommended)
- Microsoft Edge
- Mozilla Firefox

Supported Devices
- Desktop / laptop browsers (recommended for demo)
- Mobile browsers supported (responsive design), but best viewed on a larger screen for scenario forms/results.

## How to Run the UI
(Recommended): Run the Live Prototype
**Open**: https://hci-dp3.vercel.app/
**Browser Settings**: No special browser settings are needed. The application is responsive and should work on modern web browsers like Chrome, Firefox, and Edge.
Login Info:
*   UserID: admin
*   Password: admin 

## Requirements & Setup (the github)

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

### Operating Instructions (for mobile)


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
*   **Static or demo-based calculations**: Scenario and impact logic is for demonstration and does not reflect real financial forecasting.
*   **Single File Architecture**: For simplicity in this prototype, most of the application's logic, components, and styles are contained within a single file: [`src/App.tsx`](src/App.tsx). In a production-scale application, these would be split into separate files and folders for better organization and maintainability.
