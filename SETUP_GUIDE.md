# Comprehensive Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [PocketBase Setup](#pocketbase-setup)
5. [Stripe Integration](#stripe-integration)
6. [Running Development Server](#running-development-server)
7. [Building for Production](#building-for-production)
8. [Troubleshooting](#troubleshooting)
9. [Testing](#testing)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** 16.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org)
  - Verify installation: `node --version`
  
- **npm** 8.0.0 or higher
  - Comes with Node.js
  - Verify installation: `npm --version`
  
- **Git** 2.0.0 or higher
  - Download from [git-scm.com](https://git-scm.com)
  - Verify installation: `git --version`

### Required Accounts
- **Stripe Account** (for payment processing)
  - Sign up at [stripe.com](https://stripe.com)
  - Get API keys from Dashboard
  
- **PocketBase** (for database)
  - Download from [pocketbase.io](https://pocketbase.io)
  - No account needed for local development

### System Requirements
- **Disk Space:** At least 2GB free
- **RAM:** At least 4GB recommended
- **OS:** Windows, macOS, or Linux
- **Browser:** Modern browser (Chrome, Firefox, Safari, Edge)

---

## Initial Setup

### Step 1: Clone Repository