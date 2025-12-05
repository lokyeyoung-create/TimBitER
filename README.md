# TimBitER

A full-stack web application built with React, Express.js, TypeScript, and MongoDB.

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite for development and building
- Modern React patterns (hooks, functional components)

### Backend
- Express.js with TypeScript
- RESTful API design
- ES modules
- CORS enabled

### Database
- MongoDB with Mongoose ODM
- TypeScript schemas and models

## Project Structure

```
TimBitER/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   └── index.ts        # Server entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lokyeyoung-create/TimBitER.git
cd TimBitER
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Configure environment variables:
```bash
cd ../server
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

Build the server:
```bash
cd server
npm run build
npm start
```

Build the client:
```bash
cd client
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/items | Get all items |
| GET | /api/items/:id | Get item by ID |
| POST | /api/items | Create new item |
| PUT | /api/items/:id | Update item |
| DELETE | /api/items/:id | Delete item |
| GET | /api/health | Health check |

## License

ISC