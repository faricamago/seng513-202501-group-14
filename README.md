# Dinoverse

Dinoverse is a social media platform designed to streamline university communications at the University of Calgary. It provides a centralized, moderated space for verified students to post, follow, and stay informed.

## Group Members

- Aarushi Roy Choudhury - UCID: 30113987
- Farica Mago - UCID: 30111924
- Cole Briggs - UCID: 30149709
- Samin Rashid Khondaker - UCID: 30143490

## Project Structure

```
root/
├── frontend/   # Next.js + Tailwind CSS frontend
├── backend/    # Node.js + Express backend
├── docker-compose.yml
└── ...
```

- `frontend/`: Contains the Next.js frontend built with Tailwind CSS.
- `backend/`: Contains the Node.js backend using Express. Communicates with MongoDB and Firebase as needed.

## Getting Started

### Prerequisites

- Docker must be installed on your system.
- Ensure the Docker daemon is running.

#### Firebase Configuration

Several Firebase-related files are required but not included in the repository:

- `dinoverse-file-uploads-firebase-adminsdk-fbsvc-3163feb581.json`
- `firebase-admin-config.js`
- `firebaseStorageHelper.js`
- `firebase-config.js`

To request access to these files, please contact:
- cole.briggs@ucalgary.ca

### Run the App

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/dinoverse.git
   cd dinoverse
   ```

2. **Start the app with Docker Compose**

   ```bash
   docker compose up
   ```

This will build and launch both the frontend and backend services.
