# flight33

flight33 is a high-performance web-based flight search engine. It leverages modern frontend architecture to deliver rapid query execution, real-time filtering, and a responsive interface. The application is built using the Next.js App Router and React 19, ensuring server-side optimization and efficient client-side state management.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Technical Overview

The application is architected to handle complex search parameters and display large datasets with minimal latency.


- **Frontend Architecture**: Built on Next.js 16 (App Router) for hybrid rendering (SSR/CSR).
- **State Management**: Utilizes Zustand with persistent storage middleware for global state handling (filters, user preferences).
- **Data Layer**: Implements TanStack Query for asynchronous data fetching, caching, and state synchronization.
- **Styling Engine**: Uses Tailwind CSS 4 for utility-first styling, enabling zero-runtime CSS generation.
- **Component System**: Modular UI architecture based on shadcn/ui and Radix primitives for accessibility and composability.

## Functionality

1.  **Search & Execution**:
    *   Accepts origin/destination (IATA codes), date ranges, and passenger configurations.
    *   Provides IATA code auto-completion and validation.
2.  **Filtering & Sorting**:
    *   Client-side filtering for price thresholds, stops, airlines, and cabin class.
    *   Real-time DOM updates without re-fetching, optimized via memoization.
3.  **Visualization**:
    *   Rendering of flight data using declarative component patterns.
    *   Integration of `react-three-fiber` for specific graphical interface elements.

## Technology Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Next.js 16 (App Router)
- **Core Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **State**: Zustand
- **Network**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **3D Context**: React Three Fiber / Drei
- **UI Kit**: shadcn/ui
- **Date Utilities**: Byte Datepicker

## Setup & Deployment

### Prerequisites

- **Node.js**: v20 or higher.
- **Package Manager**: pnpm, npm, or yarn.

### Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rahmannugar/flight33.git
    cd flight33
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory:
    ```bash
    cp .env.example .env.local
    ```
    Ensure `NEXT_PUBLIC_API_URL` points to the correct backend endpoint.

4.  **Execute Development Server**
    ```bash
    npm run dev
    ```
    Access the application at [http://localhost:3000](http://localhost:3000).

## Directory Structure

*   **/app**: Next.js App Router page definitions and layouts.
*   **/components**: Reusable UI components, categorized by domain (flights, layout, ui).
*   **/lib**: Shared utilities, hooks, and helper functions.
*   **/store**: Global state definitions (Zustand).
*   **/types**: Shared TypeScript interfaces and type definitions.

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/implementation-name`).
3.  Commit changes (`git commit -m 'feat: description of change'`).
4.  Push to branch (`git push origin feature/implementation-name`).
5.  Open a Pull Request.

## License

MIT License. See [LICENSE](LICENSE) for details.
