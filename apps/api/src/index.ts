import "dotenv/config"
import express from "express";
import cors from "cors";
import { authStub } from "./middleware/auth.stub";
import { connectDB } from "./config/db";

const app = express();
app.use(cors());
app.use(express.json());

app.use(authStub);

app.get("/health", (req, res) => res.json({status : "ok", userId: req.userId}));

const PORT = process.env.PORT || 4000;

async function bootstrap(){
    try{
        await connectDB();
        app.listen(PORT, () => console.log(`API on ${PORT}`));
    }catch(err){
        console.error("[api] startup failed: ", err);
        process.exit(1);
    }
}

bootstrap();