# SportStream: Real-Time Multi-Sport Scoreboard with AI-Powered Insights

## Overview
SportStream is an advanced, AI-powered web platform that redefines how fans interact with live sports. It combines real-time data aggregation, intelligent insights, and immersive user experiences to deliver dynamic sports coverage. From live scores and player stats to AI-driven chat sessions and live commentary, SportStream is a complete sports companion.

## Key Features
1. **Multi-Sport Real-Time Scoreboard**
   - Live scores for Cricket and Football (FIFA).
   - Real-time updates without page reloads.
   - User-friendly interface for match stats and active players.

2. **AI-Powered Chatbot**
   - Intelligent chatbot powered by Mistral 13B for real-time insights.
   - Handles user queries with live match data integration.

3. **Chat History Management**
   - Create, manage, and retrieve chat threads.
   - Personalized chat history stored securely.

4. **Live AI Commentary**
   - AI-generated live commentary with humor and sport-specific terminology.
   - Converted to audio using Whisper - OpenAI for accessibility.

5. **Secure User Authentication**
   - Auth0 integration for secure login and session management.
   - Personalized dashboards and private chat histories.

6. **Real-Time Data Integration**
   - Custom web scraping scripts powered by Pathway for live sports data.
   - Data feeds both the frontend and AI assistant for accurate insights.

## Pathway Integration: Powering Real-Time Data and Future-Ready RAG

SportStream leverages the powerful capabilities of [Pathway](https://pathway.com/) to deliver robust, real-time data processing and lays the groundwork for advanced Retrieval-Augmented Generation (RAG) pipelines.

### Why Pathway?

Pathway stands out as a leading Python data processing framework, purpose-built for analytics and AI pipelines over live data streams. It enables us to transform traditional web scraping into a real-time, always-on data ingestion engine. With Pathway, our web scrapers don’t just fetch static snapshots—they continuously gather fresh updates, ensuring that SportStream’s scoreboard and insights are always current and accurate.

Key benefits include:
- **Live Web Scraping:** Pathway connectors turn our scraping scripts into real-time data pipelines, streaming the latest sports scores and stats directly into our platform.
- **Efficient Data Handling:** Its in-memory processing and incremental computation (powered by a Rust engine) allow for high throughput and low latency, even as data changes rapidly.
- **Seamless Integration:** Pathway’s easy-to-use Python API and broad connector ecosystem make it simple to integrate with our existing infrastructure and scale as our needs grow.

### Document Store & Vector Database

Beyond live data ingestion, Pathway offers a built-in Document Store that functions as an excellent vector database. This feature opens up exciting opportunities for the future of SportStream:

- **Future-Ready RAG Pipelines:** While we currently fetch historical stats and previous match data via scraping or API calls, Pathway’s vector store will enable us to index and store vast amounts of structured and unstructured sports data.
- **Robust Retrieval-Augmented Generation:** By storing scraped resources in the vector store, we can implement a powerful RAG pipeline. This will allow our AI assistant to retrieve contextually relevant information from a rich, continuously updated knowledge base, ensuring more accurate and insightful responses for users.

### What’s Next?

As we continue to enhance SportStream, our roadmap includes:
- Expanding the use of Pathway’s document indexing for comprehensive sports data archiving.
- Building a robust RAG pipeline that leverages the vector store for smarter, context-aware AI insights.
- Further automating and optimizing our real-time data workflows with Pathway’s advanced features.

**In summary:** Pathway’s real-time scraping, document indexing, and vector database capabilities are central to SportStream’s mission of delivering dynamic, AI-powered sports coverage. Its flexibility and performance ensure we’re ready not just for today’s demands, but for the innovations of tomorrow.

## Technology Stack
| Component         | Technology Used          |
|-------------------|--------------------------|
| **Frontend**      | React.ts                |
| **Backend**       | Bun, Express            |
| **AI Model**      | Mistral 13B             |
| **Real-Time Data**| Live web scraping       |
| **Authentication**| Auth0                   |
| **Database**      | MongoDB                 |
| **Hosting**       | Vercel, Netlify, Render |

## Directory Structure

gc_tech_project/
├── server/
├── frontend/
├── auth_server/
├── README.md

## Setup Instructions

Follow these steps to set up and run each part of the project:

### 1. Clone the Repository:
   ```bash
   git clone https://github.com/DeenankSharma/gc_tech_project.git
   cd gc_tech_project
   ```

### 2. Recommended: Run with Docker Compose

The easiest and most reliable way to start all services (frontend, backend, and authentication server) is using Docker Compose.  
From the root directory, simply run:

    ```bash
    docker-compose up --build
    ```

This will automatically build and start all the required services in isolated containers.  
To run in the background, add the `-d` flag:  

    ```bash
    docker-compose up --build -d
    ```

To stop all services:  

    ```bash
    docker-compose down
    ```

### 3. Manual Setup

If you prefer to run each service manually, follow the steps below for each component.

### Frontend

1. Navigate to the `frontend` directory:
    ```
    cd frontend
    ```
2. Install dependencies using [Bun](https://bun.sh/):
    ```
    bun install
    ```
3. Start the development server:
    ```
    bun run dev
    ```
   **Alternatively, you can use npm:**
    ```
    npm install
    npm run dev
    ```

### Authentication Server

1. Navigate to the `auth_server` directory:
    ```
    cd auth_server
    ```
2. Install dependencies:
    ```
    bun install
    ```
3. Start the authentication server:
    ```
    bun index.ts
    ```

### Backend Server

1. Navigate to the `server` directory:
    ```
    cd server
    ```
2. Run the main Python script:
    ```
    python main.py
    ```

