import dotenv from "dotenv";
import connectDB from "./db/dbConnect.js";
import app from "./app.js"; 

dotenv.config({
    path: "./.env" 
});

const port = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR !!", error);
        throw error;
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
})
.catch((err) => {
    console.error("MongoDB connection failed !!!", err)
});