# GENCENTS – Source Document

**Course:** CS 4352 – Human Computer Interaction  
**Team:** Team 3  
**Project:** Financial Preparedness Tracker

---

## GitHub Repository

**Repository URL:**  
https://github.com/Look-Its-Sky/hci_dp3

This repository contains the complete source code for the GENCENTS financial tracking prototype, including all UI components, logic, and configuration files.

---

## External Dependencies

### Core Framework

#### React
- **SDK URL:** https://react.dev
- **NPM Package:** https://www.npmjs.com/package/react
- **Version Used:** ^19.2.1
- **Function in Project:**  
  React is the core library used to build the single-page application (SPA). It manages the UI structure through reusable components, handles dynamic updates such as goal progress tracking, dashboard visualizations, and scenario results rendering without requiring full page reloads. React's virtual DOM ensures efficient re-rendering of components when application state changes.

#### React DOM
- **SDK URL:** https://react.dev
- **NPM Package:** https://www.npmjs.com/package/react-dom
- **Version Used:** ^19.2.1
- **Function in Project:**  
  React DOM serves as the entry point to the DOM for React. It provides DOM-specific methods for rendering React components to the browser and is essential for mounting the application to the HTML document.

#### React Router DOM
- **SDK URL:** https://reactrouter.com
- **NPM Package:** https://www.npmjs.com/package/react-router-dom
- **Version Used:** ^7.9.6
- **Function in Project:**  
  React Router DOM enables client-side routing in the application. It powers navigation between pages including the Home dashboard, My Goals page, Scenarios page, and Login page without full page refreshes, providing a seamless single-page application experience.

---

### Type Safety

#### TypeScript
- **SDK URL:** https://www.typescriptlang.org
- **NPM Package:** https://www.npmjs.com/package/typescript
- **Version Used:** ^4.4.2
- **Function in Project:**  
  TypeScript adds static typing to the React codebase, improving reliability and reducing runtime errors by enforcing type safety for components, props, state management, and API responses. Custom types are defined for user profiles, financial data, goals, and scenario configurations.

---

### AI & Machine Learning Integration

#### LangChain
- **SDK URL:** https://js.langchain.com
- **NPM Package:** https://www.npmjs.com/package/langchain
- **Version Used:** ^1.1.5
- **Function in Project:**  
  LangChain is a framework for developing applications powered by language models. In this project, it orchestrates the AI-powered financial recommendation system, managing prompts, model interactions, and response parsing for personalized financial advice.

#### @langchain/openai
- **SDK URL:** https://js.langchain.com/docs/integrations/platforms/openai
- **NPM Package:** https://www.npmjs.com/package/@langchain/openai
- **Version Used:** ^1.1.3
- **Function in Project:**  
  This package provides the OpenAI-compatible chat model integration used to connect to the Ollama AI server. It enables the application to send financial profile data to the DP3_Advisor model and receive personalized recommendations.

#### @langchain/core
- **SDK URL:** https://js.langchain.com
- **NPM Package:** https://www.npmjs.com/package/@langchain/core
- **Version Used:** ^1.1.4
- **Function in Project:**  
  The core LangChain package provides essential abstractions including message types (SystemMessage, HumanMessage) used to structure conversations with the AI model for generating financial recommendations.

#### @langchain/community
- **SDK URL:** https://js.langchain.com/docs/integrations
- **NPM Package:** https://www.npmjs.com/package/@langchain/community
- **Version Used:** ^1.0.7
- **Function in Project:**  
  Provides community-maintained integrations and utilities that extend LangChain's capabilities for various AI model providers and tools.

---

### Data Visualization

#### Recharts
- **SDK URL:** https://recharts.org
- **NPM Package:** https://www.npmjs.com/package/recharts
- **Version Used:** ^3.5.1
- **Function in Project:**  
  Recharts is a composable charting library built on React components. It powers the financial projection graphs in the Scenario Results page, displaying 1-year and 5-year wealth projections with interactive area charts that compare before/after scenarios and the impact of applied recommendations.

---

### Build Tools & Development

#### Create React App (react-scripts)
- **SDK URL:** https://create-react-app.dev
- **NPM Package:** https://www.npmjs.com/package/react-scripts
- **Version Used:** ^5.0.0
- **Function in Project:**  
  Create React App provides the build system, development server, and production build configuration. It handles Webpack bundling, Babel transpilation, and development hot-reloading with zero manual configuration required.

#### Cross-env
- **SDK URL:** https://github.com/kentcdodds/cross-env
- **NPM Package:** https://www.npmjs.com/package/cross-env
- **Version Used:** ^10.1.0
- **Function in Project:**  
  Cross-env allows setting environment variables across different operating systems (Windows, macOS, Linux) in npm scripts, ensuring consistent development server behavior across all platforms.

#### Serve
- **SDK URL:** https://github.com/vercel/serve
- **NPM Package:** https://www.npmjs.com/package/serve
- **Version Used:** ^14.2.5
- **Function in Project:**  
  Serve is a static file server used for serving the production build of the application locally for testing before deployment.

---

### CSS Processing

#### Tailwind CSS
- **SDK URL:** https://tailwindcss.com
- **NPM Package:** https://www.npmjs.com/package/tailwindcss
- **Version Used:** ^4.1.15
- **Function in Project:**  
  Tailwind CSS is a utility-first CSS framework. While the project primarily uses custom CSS, Tailwind's design system influences the color palette and spacing variables used throughout the application styling.

#### PostCSS
- **SDK URL:** https://postcss.org
- **NPM Package:** https://www.npmjs.com/package/postcss
- **Version Used:** ^8.5.6
- **Function in Project:**  
  PostCSS is a tool for transforming CSS with JavaScript plugins. It processes the application's stylesheets and enables modern CSS features and optimizations.

#### Autoprefixer
- **SDK URL:** https://github.com/postcss/autoprefixer
- **NPM Package:** https://www.npmjs.com/package/autoprefixer
- **Version Used:** ^10.4.21
- **Function in Project:**  
  Autoprefixer is a PostCSS plugin that automatically adds vendor prefixes to CSS rules, ensuring cross-browser compatibility for styles across Chrome, Firefox, Safari, and Edge.

---

### Mobile Deployment (Cross-Platform)

#### Capacitor Core
- **SDK URL:** https://capacitorjs.com
- **NPM Package:** https://www.npmjs.com/package/@capacitor/core
- **Version Used:** ^7.4.3
- **Function in Project:**  
  Capacitor Core is the runtime that enables the React web application to access native device features. It provides the bridge between web code and native platform APIs.

#### Capacitor iOS
- **SDK URL:** https://capacitorjs.com/docs/ios
- **NPM Package:** https://www.npmjs.com/package/@capacitor/ios
- **Version Used:** ^7.4.3
- **Function in Project:**  
  The iOS platform package enables deploying the GENCENTS application as a native iOS app on iPhone and iPad devices through Apple's App Store.

#### Capacitor Android
- **SDK URL:** https://capacitorjs.com/docs/android
- **NPM Package:** https://www.npmjs.com/package/@capacitor/android
- **Version Used:** ^7.4.3
- **Function in Project:**  
  The Android platform package enables deploying the GENCENTS application as a native Android app on phones and tablets through the Google Play Store.

#### Capacitor CLI
- **SDK URL:** https://capacitorjs.com/docs/cli
- **NPM Package:** https://www.npmjs.com/package/@capacitor/cli
- **Version Used:** ^7.4.3
- **Function in Project:**  
  The Capacitor CLI provides command-line tools for initializing, building, and syncing the web application with native iOS and Android projects.

---

### Testing

#### Jest
- **SDK URL:** https://jestjs.io
- **NPM Package:** https://www.npmjs.com/package/jest
- **Version Used:** (bundled with react-scripts)
- **Function in Project:**  
  Jest is the JavaScript testing framework used for running unit tests. It provides test runners, assertion libraries, and mocking capabilities for testing React components.

#### @testing-library/react
- **SDK URL:** https://testing-library.com/docs/react-testing-library/intro
- **NPM Package:** https://www.npmjs.com/package/@testing-library/react
- **Version Used:** ^16.1.0
- **Function in Project:**  
  React Testing Library provides utilities for testing React components in a way that resembles how users interact with the application, focusing on behavior rather than implementation details.

#### @testing-library/jest-dom
- **SDK URL:** https://testing-library.com/docs/ecosystem-jest-dom
- **NPM Package:** https://www.npmjs.com/package/@testing-library/jest-dom
- **Version Used:** ^6.6.3
- **Function in Project:**  
  Provides custom Jest matchers for asserting on DOM elements, making test assertions more declarative and readable.

#### @testing-library/dom
- **SDK URL:** https://testing-library.com/docs/dom-testing-library/intro
- **NPM Package:** https://www.npmjs.com/package/@testing-library/dom
- **Version Used:** ^10.4.0
- **Function in Project:**  
  The core DOM Testing Library that provides utilities for querying and interacting with DOM nodes in tests.

#### @testing-library/user-event
- **SDK URL:** https://testing-library.com/docs/user-event/intro
- **NPM Package:** https://www.npmjs.com/package/@testing-library/user-event
- **Version Used:** ^13.2.1
- **Function in Project:**  
  Simulates user interactions (clicks, typing, etc.) in tests more realistically than basic DOM events, improving test reliability.

#### Web Vitals
- **SDK URL:** https://web.dev/vitals
- **NPM Package:** https://www.npmjs.com/package/web-vitals
- **Version Used:** ^2.1.0
- **Function in Project:**  
  Measures Core Web Vitals metrics (LCP, FID, CLS) to monitor and report on the application's real-world performance and user experience.

---

### TypeScript Type Definitions

#### @types/react
- **NPM Package:** https://www.npmjs.com/package/@types/react
- **Version Used:** ^19.0.0
- **Function in Project:**  
  Provides TypeScript type definitions for React, enabling type checking and IDE autocompletion for React APIs.

#### @types/react-dom
- **NPM Package:** https://www.npmjs.com/package/@types/react-dom
- **Version Used:** ^19.0.0
- **Function in Project:**  
  Provides TypeScript type definitions for React DOM, enabling type safety for DOM-related React operations.

#### @types/node
- **NPM Package:** https://www.npmjs.com/package/@types/node
- **Version Used:** ^16.7.13
- **Function in Project:**  
  Provides TypeScript type definitions for Node.js APIs used in the build process and development scripts.

#### @types/jest
- **NPM Package:** https://www.npmjs.com/package/@types/jest
- **Version Used:** ^27.0.1
- **Function in Project:**  
  Provides TypeScript type definitions for Jest testing framework, enabling type-safe test writing.

---

## Development & Runtime Environment

### Node.js
- **SDK URL:** https://nodejs.org
- **Recommended Version:** 18.x LTS or higher
- **Purpose:**  
  Node.js is required to run the development server, install dependencies via npm/yarn, execute build scripts, and compile the application for production deployment.

### Package Managers

#### npm (Node Package Manager)
- **SDK URL:** https://www.npmjs.com
- **Purpose:**  
  npm is the default package manager included with Node.js, used to install and manage project dependencies defined in package.json.

#### Yarn (Alternative)
- **SDK URL:** https://yarnpkg.com
- **Purpose:**  
  Yarn is an alternative package manager that can be used to install, manage, and lock all project dependencies consistently across development environments with potentially faster installation times.

---

## External Services

### Ollama AI Server
- **SDK URL:** https://ollama.ai
- **Endpoint Used:** http://64.181.210.250:11434/v1
- **Model:** DP3_Advisor:latest
- **Function in Project:**  
  Ollama hosts the custom DP3_Advisor language model that powers the AI-driven financial recommendations. The application sends user financial profiles and scenario data to this endpoint and receives personalized advice for improving financial health.

---

## Summary

All external dependencies used in this project are open-source and publicly available under permissive licenses (MIT, Apache 2.0, etc.). Each dependency supports a specific aspect of the application:

| Category | Dependencies | Purpose |
|----------|-------------|---------|
| **Core UI** | React, React DOM, React Router DOM | Component-based UI rendering and navigation |
| **Type Safety** | TypeScript, @types/* packages | Static typing and IDE support |
| **AI Integration** | LangChain, @langchain/openai, @langchain/core | AI-powered recommendations |
| **Visualization** | Recharts | Financial projection charts |
| **Build Tools** | react-scripts, cross-env, serve | Development and production builds |
| **Styling** | Tailwind CSS, PostCSS, Autoprefixer | CSS processing and optimization |
| **Mobile** | Capacitor (core, iOS, Android, CLI) | Native mobile app deployment |
| **Testing** | Jest, Testing Library packages | Unit and integration testing |
| **Performance** | Web Vitals | Performance monitoring |

---

*Document Last Updated: December 2024*
