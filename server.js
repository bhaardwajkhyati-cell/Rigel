import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(_dirname , "public")));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(_dirname, "public", "sign_up.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(_dirname, "public", "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(_dirname, "public", "dashboard.html"));
});


pool.connect().then(()=>console.log("Connected to the database"))
.catch((err)=>console.error("Database connection error:", err));

app.post("/sign_up" , async (req,res)=>{
 const { email ,password } = req.body;
 try {
  const userCheck  = await pool.query("SELECT * FROM users WHERE email = $1" , [email]);
  if(userCheck.rows.length > 0){
    return res.send("User already exists <a href = '/sign_up'>Go back</a>");
  }
  await pool.query("INSERT INTO users (email , password) VALUES ($1 , $2)" , [email , password]);
  res.send("User registered successfully <a href = '/login'>Login</a>");
 }catch (err){
  console.error("Error occurred while signing up:", err);
  res.status(500).send("Error occurred while signing up");
 }
});


 app.post("/login", async (req, res) => {
  // 1. Normalize the inputs immediately
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  try {
    // 2. Query only by email first (Security Best Practice)
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.send("User not found. <a href='/login'>Try again</a>");
    }

    const user = result.rows[0];

    // 3. Compare passwords
    if (user.password === password) {
       // FIX: Use _dirname (single underscore) as defined at top of your file
       return res.sendFile(path.join(_dirname, "public", "dashboard.html"));
    } else {
      return res.send("Invalid password. <a href='/login'>Try again</a>");
    }
  } catch (err) {
    console.error("Error occurred while logging in:", err);
    return res.status(500).send("Server error.");
  }
});




app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(_dirname, "public", "dashboard.html"));
});
app.listen(PORT , ()=>{
  console.log(`Server is running on port ${PORT}`);
})