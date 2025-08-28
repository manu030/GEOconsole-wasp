# 🚀 GEO Console - AI Visibility Analysis Platform

> **Analyze your content's visibility in AI search results like ChatGPT, Claude, and Perplexity**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Wasp](https://img.shields.io/badge/Wasp-000000?logo=wasp&logoColor=white)](https://wasp-lang.dev/)

## 🎯 What is GEO Console?

**GEO (Generative Engine Optimization)** Console is a cutting-edge platform that helps businesses understand and optimize their visibility in AI-powered search engines. As traditional SEO evolves into AEO (Answer Engine Optimization), our tool provides actionable insights into how AI models like ChatGPT, Claude, and Perplexity mention and rank your content.

### ⚡ Key Features

- 🔍 **AI Keyword Extraction** - Automatically extract relevant keywords from your domain
- 🤖 **AI Query Generation** - Generate natural search queries using Claude-3-haiku
- 📊 **Visibility Analysis** - Test how your content appears in AI responses
- 🏆 **Competitor Intelligence** - See which competitors are mentioned alongside you
- 📈 **Visibility Scoring** - Get quantified visibility scores for each query
- 🔄 **Real-time Monitoring** - Track changes in your AI visibility over time

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Prisma ORM + SQLite
- **Framework**: [Wasp](https://wasp-lang.dev/) - Full-stack React/Node.js framework
- **APIs**: 
  - [DataForSEO](https://dataforseo.com/) - Keyword extraction & visibility testing
  - [OpenRouter](https://openrouter.ai/) - AI query generation with Claude-3-haiku
- **Testing**: Vitest + Testing Library (80+ comprehensive tests)
- **Logging**: Structured logging with correlation IDs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- DataForSEO API credentials
- OpenRouter API key

### Installation

```bash
# Clone the repository
git clone https://github.com/manu030/GEOconsole-wasp.git
cd GEOconsole-wasp

# Install dependencies
npm install

# Set up environment variables
cp .env.server.example .env.server
# Edit .env.server with your API credentials

# Run database migrations
wasp db migrate-dev

# Start the development server
wasp start
```

### Environment Variables

```bash
# DataForSEO API (Required)
DATAFORSEO_USERNAME=your_username
DATAFORSEO_PASSWORD=your_password
DATAFORSEO_SANDBOX=true  # Use sandbox for development

# OpenRouter API (Required)
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=anthropic/claude-3-haiku

# Wasp Configuration
WASP_WEB_CLIENT_URL=http://localhost:3000
```

## 📋 How It Works

### 1. **Keyword Extraction**
Input your domain and let our AI extract the most relevant keywords that define your business and content.

### 2. **Query Generation** 
Using Claude-3-haiku, we generate natural search queries that potential customers would use when looking for services like yours.

### 3. **Visibility Testing**
We test each query against AI search engines to see:
- If your domain appears in responses
- Your ranking position
- Which competitors are mentioned
- Your overall visibility score

### 4. **Results Analysis**
Get detailed insights including:
- Visibility percentage for each query
- Competitor analysis
- Improvement recommendations
- Historical tracking

## 🧪 Testing

The project includes comprehensive testing with 80+ unit tests covering all critical functionality:

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test:run -- src/services/analysisService.test.ts
```

## 📊 Project Status

**🎉 91% Complete (49/54 tasks)**

### ✅ Completed Features
- Core AI analysis workflow
- DataForSEO & OpenRouter integrations  
- Full UI with progress indicators
- Comprehensive testing infrastructure
- Production-ready error handling
- Structured logging system
- Security improvements

### 🚧 In Progress
- Credit system implementation
- Performance monitoring
- Deployment preparation

## 📚 Documentation

- **[📋 ROADMAP.md](./ROADMAP.md)** - Detailed project roadmap and milestones
- **[🤖 CLAUDE.md](./CLAUDE.md)** - AI development context and technical details
- **[🧪 Testing Guide](./src/test/)** - Testing infrastructure and strategies

## 🔧 Development

### Key Commands

```bash
wasp start                    # Start development server
wasp db migrate-dev          # Run database migrations  
wasp db studio              # Open database admin
wasp db seed                 # Seed development data
npm run test:run             # Run all tests
```

### Project Structure

```
├── src/
│   ├── services/           # External API integrations
│   ├── projects/          # Project management logic
│   ├── components/        # React components
│   ├── test/             # Testing infrastructure
│   └── types/            # TypeScript definitions
├── migrations/           # Database migrations
├── docs/                # Project documentation
└── schema.prisma        # Database schema
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Wasp](https://wasp-lang.dev/) - For the excellent full-stack framework
- [DataForSEO](https://dataforseo.com/) - For comprehensive SEO data APIs
- [OpenRouter](https://openrouter.ai/) - For AI model access and routing
- [GrowthX](https://growthx.ai/) - For GEO methodology and insights

---

**Built with ❤️ for the future of AI-optimized content discovery**

> Ready to dominate the AI search landscape? [Get started now!](#-quick-start)