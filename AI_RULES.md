# AI Development Rules for Streamer Application

This document outlines the core technologies and best practices to follow when developing for the Streamer application. The goal is to maintain a consistent, scalable, and maintainable codebase.

## Tech Stack Overview

*   **Framework**: Next.js (React framework for server-side rendering and routing)
*   **Language**: TypeScript (for type safety and improved developer experience)
*   **Styling**: Tailwind CSS (utility-first CSS framework for rapid UI development)
*   **UI Library**: shadcn/ui (re-usable UI components built on Radix UI primitives)
*   **GraphQL Client**: Apollo Client (for managing GraphQL data and interactions with the backend)
*   **Authentication**: Auth0 (for user authentication and authorization)
*   **Icons**: Lucide React (a collection of beautiful and customizable SVG icons)
*   **Form Management**: React Hook Form (for efficient form handling)
*   **Schema Validation**: Zod (for robust runtime schema validation, typically with React Hook Form)
*   **Theme Management**: `next-themes` (for handling light/dark mode functionality)

## Library Usage Rules

*   **UI Components**:
    *   Always prioritize using components from `shadcn/ui`.
    *   If a specific UI component is not available in `shadcn/ui`, create a new, small, and focused custom component within the `src/components/ui/` directory.
    *   **Do not modify** existing `shadcn/ui` component files directly.
*   **Styling**:
    *   All styling must be implemented using **Tailwind CSS classes**.
    *   Avoid using inline styles or creating separate CSS modules/files for individual components.
*   **Icons**:
    *   Use icons exclusively from the `lucide-react` library.
*   **Data Fetching**:
    *   All interactions with the GraphQL API (queries, mutations) must be performed using **Apollo Client**.
*   **Authentication**:
    *   Auth0 is the designated authentication provider. Utilize its hooks and methods for all authentication flows.
*   **Forms and Validation**:
    *   Implement all forms using `react-hook-form`.
    *   For form input validation, use `zod` schemas in conjunction with `react-hook-form`'s resolver.
*   **File Uploads**:
    *   For file upload functionality, use the existing `FileUploadButton` component, which is designed to handle GraphQL multipart requests.
*   **Theme**:
    *   Manage application themes (e.g., light/dark mode) using the `next-themes` library.
*   **Routing**:
    *   Leverage Next.js's file-system based routing for defining application routes. Keep main routes in `src/App.tsx` if applicable, otherwise follow Next.js page conventions.