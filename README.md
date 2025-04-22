# Dinoverse

Dinoverse is a social media platform designed to streamline university communications at the University of Calgary. It provides a centralized, moderated space for verified students to post, follow, and stay informed.

## Project Structure

```
root/
├── frontend/   # Next.js + Tailwind CSS frontend
├── backend/    # Node.js + Express backend
├── docker-compose.yml
└── ...
```

- `frontend/`: Contains the Next.js frontend styled with Tailwind CSS.
- `backend/`: Contains the Node.js backend using Express. Communicates with MongoDB and Firebase as needed.

## Getting Started

### Prerequisites

- Docker must be installed on your system.
- Ensure the Docker daemon is running.

### Run the App

1. **Clone the repository**

   ```bash
   git clone https://github.com/faricamago/seng513-202501-group-14.git
   cd dinoverse
   ```

2. **Start the app with Docker Compose**

   ```bash
   docker compose up
   ```

This will build and launch both the frontend and backend services.
