import AccountController from "./controllers/account";
import UserController from "./controllers/user";
import connectDB from "./db/connect_db";

import express from "express";
import authMiddleWare from "./middleware/auth";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To Bank Security Backend Service");
});
app.post("/register", UserController.addUser);
app.post("/login", UserController.loginUser);
app.get("/user", authMiddleWare, UserController.getUserDetails);
app.post("/deposit", authMiddleWare, AccountController.Deposit);
app.post("/set-panic-pin", authMiddleWare, UserController.setPanicPin)

async function startServer() {
  try {
    await connectDB();
    
    // Get the port number
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (err: any) {
    console.error("Error starting server", err);
  }
}
startServer();
