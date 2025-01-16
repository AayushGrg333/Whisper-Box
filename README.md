# Whisper-Box
Whisper-Box is a full-stack anonymous messaging application that lets users send and receive messages without revealing their identities. Inspired by popular anonymous Q&A features on social media, Whisper-Box fosters honest feedback, engaging conversations, and fun interactions.
## Features
- **Anonymous Messaging**: Users can send and receive messages without revealing their identities.
- **Real-time Messaging**: Messages are instantly delivered and updated, providing an interactive user experience.
- **Feedback and Conversations**: Users can receive candid feedback and engage in anonymous conversations.
- **Modern and Responsive UI**: Designed with Next.js and optimized for performance across devices.
## Tech Stack
- **Frontend and Backend**: Next.js (Full-stack framework)
- **Database**: MongoDB (NoSQL database)
- **Styling**: TailwindCSS (for responsive and modern UI)
## Getting Started
### Prerequisites
Ensure you have the following installed:
- Node.js (Version 14 or higher)
- npm (or Yarn / pnpm)
### Steps
#### Clone the repository
```bash
git clone https://github.com/your-username/whisper-box.git
cd whisper-box
```
#### Install dependencies
Install the required dependencies using your preferred package manager:
```bash
npm install
# or
yarn install
# or
pnpm install
```
#### Set up the environment
Create a `.env.local` file at the root of the project and add your MongoDB connection string:
```plaintext
MONGODB_URI=your_mongodb_connection_string
```
Make sure to replace `your_mongodb_connection_string` with your actual MongoDB URI, which can be obtained from MongoDB Atlas or your local MongoDB instance.
#### Run the development server
Start the application in development mode:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
After running the above command, open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
## How It Works
- **Frontend:** The frontend is built using Next.js, allowing for both server-side and static rendering. The UI is powered by TailwindCSS for a clean, responsive design.
- **Backend:** The backend is handled by Next.js API routes. These routes manage data interaction with MongoDB, including sending and receiving anonymous messages.
- **Database:** MongoDB stores messages and user data (if applicable). Messages are retrieved and displayed dynamically on the frontend.
## Learn More
Explore these resources to dive deeper into Whisper-Box and the technologies used:
- [Next.js Documentation](https://nextjs.org/docs): Official documentation for Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn): An interactive tutorial to help you master Next.js.
- [MongoDB Documentation](https://docs.mongodb.com): For integrating MongoDB with Next.js and using MongoDB features.
- [Next.js GitHub Repository](https://github.com/vercel/next.js): Explore the source code of Next.js and contribute!
## Deploy on Vercel
Deploying Whisper-Box to Vercel is straightforward. Follow these steps:
1. Go to Vercel and link your GitHub repository.
2. Deploy the app by following the instructions provided by Vercel.
3. Your app will be live on a Vercel URL within moments.
For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).
## Contributing
Contributions are welcome! Feel free to submit issues or pull requests for improvements, bug fixes, or new features.
