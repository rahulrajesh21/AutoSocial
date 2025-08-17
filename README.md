# 📲 FlowMate – Instagram Automation Platform

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Components Overview](#components-overview)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Code Style](#code-style)
- [License](#license)
- [Contact](#contact)

## 🎯 About

FlowMate is a **modern Instagram automation platform** built with React and Vite that empowers users to create **visual automation workflows** through an intuitive drag-and-drop interface. Featuring **AI-powered nodes**, **real-time Instagram integration**, and **smart scheduling**, FlowMate makes social media automation accessible to everyone.

### 🌟 Why FlowMate?

- **Visual Workflow Builder**: Create complex automations using drag-and-drop nodes
- **Instagram Integration**: Direct connection with Instagram API for seamless automation
- **AI-Powered**: Gemini AI integration for intelligent content generation
- **Modern UI**: Built with React 18, Vite, and Tailwind CSS for optimal performance
- **Real-Time**: Instant feedback and live workflow execution

## ✨ Features

### 🎛 Core Features
- **Visual Workflow Designer** - Drag-and-drop canvas for building automation flows
- **Instagram Integration** - Direct API connection with OAuth authentication
- **AI-Powered Nodes** - Gemini AI integration for smart content generation
- **Real-Time Preview** - Live Instagram post preview functionality
- **Smart Scheduling** - Advanced date/time picker for content scheduling

### 🚀 Automation Features
- **Multiple Node Types**:
  - **Trigger Nodes** - Start workflows based on conditions
  - **Instagram Nodes** - Post, comment, like, and follow actions  
  - **Text Nodes** - Content creation and text processing
  - **Help Desk Nodes** - Customer support automation
  - **Gemini AI Nodes** - AI-powered content generation

### 📱 User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI Components** - Custom shadcn/ui component library
- **Dark/Light Themes** - Seamless theme switching
- **Context Management** - React Context for state management
- **File Upload** - Media upload functionality for posts

## 🛠 Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and functional components
- **Vite** - Ultra-fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Custom Components** - Reusable UI components

### State Management
- **React Context** - Global state management
- **React Hooks** - useState, useEffect, useContext for local state

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Consistent code formatting
- **PostCSS** - CSS processing and optimization

### Deployment & Hosting
- **Vercel** - Serverless deployment platform
- **GitHub Actions** - CI/CD automation workflows

### External Integrations
- **Instagram API** - Social media platform integration
- **Gemini AI** - Google's AI for intelligent content generation

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16.0 or higher)
- **npm** or **yarn** package manager
- **Instagram Developer Account** (for API access)
- **Gemini AI API Key** (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rahulr2101/flowmate.git
cd flowmate
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**

Create a `.env` file in the root directory:
```env
# Instagram API
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
VITE_INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
VITE_INSTAGRAM_REDIRECT_URI=your_redirect_uri

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Application
VITE_APP_URL=http://localhost:5173
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📂 Project Structure

```
FlowMate/
├── public/                     # Static assets
│   ├── icons/                 # Platform icons (Instagram, Facebook)
│   ├── 404.html              # 404 error page
│   ├── _redirects            # Netlify/Vercel redirects
│   └── vite.svg              # Vite logo
│
├── src/
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── avatar.jsx    # User avatar component
│   │   │   ├── button.jsx    # Custom button component
│   │   │   ├── calendar.jsx  # Date picker component
│   │   │   ├── card.jsx      # Card layout component
│   │   │   └── ...          # Other UI components
│   │   ├── cards/            # Feature cards
│   │   ├── popCards/         # Modal/popup components
│   │   ├── SideBar/          # Sidebar components
│   │   ├── topBar/           # Top navigation
│   │   ├── FlowCanvas.jsx    # Main workflow canvas
│   │   ├── InstagramPreview.jsx # Post preview
│   │   ├── MediaUpload.jsx   # File upload component
│   │   └── ...              # Other components
│   │
│   ├── custom_nodes/          # Workflow node types
│   │   ├── TriggerNode.jsx   # Workflow trigger node
│   │   ├── InstgramNode.jsx  # Instagram action node
│   │   ├── TextNode.jsx      # Text processing node
│   │   ├── geminiNode.jsx    # AI-powered node
│   │   └── HelpDeskNode.jsx  # Support automation node
│   │
│   ├── pages/                 # Page components
│   │   ├── Home.jsx          # Landing page
│   │   ├── Automations.jsx   # Automation management
│   │   ├── AutomationsDesigner.jsx # Workflow builder
│   │   ├── Settings.jsx      # User settings
│   │   ├── Contacts.jsx      # Contact management
│   │   ├── Help.jsx          # Help center
│   │   └── help/             # Help sub-pages
│   │
│   ├── context/               # React Context providers
│   │   └── WorkflowContext.jsx # Global workflow state
│   │
│   ├── api/                   # API integration
│   │   └── instagram.js      # Instagram API calls
│   │
│   ├── utils/                 # Utility functions
│   │   ├── api.js            # General API utilities
│   │   └── instagram.js      # Instagram-specific utils
│   │
│   ├── lib/                   # Library utilities
│   │   └── utils.js          # Helper functions
│   │
│   ├── assets/                # Static assets
│   ├── App.jsx               # Main App component
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Global styles
│   └── App.css               # Component styles
│
├── .gitignore                 # Git ignore rules
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.js            # Vite build configuration
├── vercel.json               # Vercel deployment config
└── README.md                 # Project documentation
```

## 🎮 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors automatically
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted correctly
```

## 🧩 Components Overview

### Core Components
- **`FlowCanvas.jsx`** - Main drag-and-drop workflow builder
- **`InstagramPreview.jsx`** - Live preview of Instagram posts
- **`MediaUpload.jsx`** - File upload with drag-and-drop support
- **`ScheduleDatePicker.jsx`** - Advanced scheduling interface

### Custom Workflow Nodes
- **`TriggerNode.jsx`** - Workflow initiation triggers
- **`InstgramNode.jsx`** - Instagram API actions
- **`TextNode.jsx`** - Text processing and manipulation
- **`geminiNode.jsx`** - AI-powered content generation
- **`HelpDeskNode.jsx`** - Customer support automation

### UI Components (shadcn/ui)
- Modern, accessible component library
- Consistent design system
- Fully customizable with Tailwind CSS

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel
```

2. **Environment Variables**
Add your environment variables in the Vercel dashboard:
- `VITE_INSTAGRAM_CLIENT_ID`
- `VITE_INSTAGRAM_CLIENT_SECRET` 
- `VITE_GEMINI_API_KEY`

3. **Deploy**
```bash
vercel --prod
```

### Manual Build & Deploy

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

The `vercel.json` file is already configured for optimal deployment.

## 🎨 Code Style

This project maintains high code quality standards:

### Automated Code Style
- **ESLint** - Code quality and consistency
- **Prettier** - Automatic code formatting  
- **GitHub Actions** - Automated linting and formatting

### Development Workflow
1. **PR Review Workflow** - Checks code style in pull requests
2. **Auto-fix Workflow** - Automatically fixes style issues
3. **Scheduled Maintenance** - Weekly automated cleanup

### Best Practices
- Consistent component naming (PascalCase)
- Modular component structure
- Reusable utility functions
- Clean prop interfaces

## 🤝 Contributing

Contributions make the open-source community thrive! Here's how you can help:

### Development Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following the code style guidelines
4. **Test** your changes thoroughly
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Update documentation for new features
- Test your changes across different screen sizes
- Ensure all GitHub Actions pass

## 🔑 Key Features & Architecture

### 🎯 **Technical Highlights**
- ✅ **Modern React Architecture** - Hooks, Context, and functional components
- ✅ **Vite Build System** - Lightning-fast development and production builds
- ✅ **Component-Driven Design** - Modular, reusable UI components
- ✅ **AI Integration** - Seamless Gemini AI integration for smart automation
- ✅ **Instagram API** - Direct platform integration with OAuth flow
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Real-Time Updates** - Live workflow execution and preview

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Rahul Rajesh Kumar**

- 📧 Email: [rahulrajesh2101@gmail.com](mailto:rahulrajesh2101@gmail.com)
- 🔗 LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
- 💻 GitHub: [@rahulr2101](https://github.com/rahulr2101)
- 🌐 Portfolio: [Your Portfolio Website](https://your-portfolio.com)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Built with ❤️ using React + Vite | Made by [Rahul Rajesh Kumar](https://github.com/rahulr2101)

</div>
