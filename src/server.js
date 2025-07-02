import express from "express";
import prisma from "./prismaClient.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());


app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
