import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number;
};

const connection : ConnectionObject = {};

async function connectDb() : Promise<void> {
    if(connection.isConnected) { 
        console.log("Already connected to database");
        return;
    }
 
    try {
       const db = await mongoose.connect(process.env.MONGODB_URL || '',)
       connection.isConnected = db.connections[0].readyState

       console.log("DB Connected Successfully")
    } catch (error) {
        console.log("Database connection failed",error);
        process.exit(1);
    }
}


export default connectDb;