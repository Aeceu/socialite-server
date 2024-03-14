import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import auth from "./routers/auth";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from "./routers/userRoute";
import postRoute from "./routers/postRoute";
import likesRoute from "./routers/likesRoute";
import friendRoute from "./routers/friendRoute";
import commentRoute from "./routers/commentRoute";
import sharedPostRoute from "./routers/sharedPostRoute";

dotenv.config();
const app = express();
const localUrl = "http://localhost:5173";

app.use(bodyParser.json({ limit: "100mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: localUrl,
    credentials: true,
  })
);

app.use("/api/v1", auth);
app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", sharedPostRoute);
app.use("/api/v1", likesRoute);
app.use("/api/v1", commentRoute);
app.use("/api/v1", friendRoute);

const PORT = process.env.PORT as string;
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});


export default app;
