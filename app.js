// app.js - Portfolio project with MySQL contact storage

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// static + body parsing
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MySQL pool (DigitalOcean)
const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,  
    port: process.env.DB_PORT || 3306,
  })
  .promise();

// quick test route
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json(rows);
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).send("Database error: " + err.message);
  }
});

// routes
app.get("/", (req, res) => {
  res.render("index");
});

// admin page: load contacts from DB
app.get("/admin", async (req, res) => {
  try {
    const [contacts] = await pool.query(
      `SELECT 
         id,
         firstName,
         lastName,
         jobTitle,
         company,
         email,
         mailingList,
         format,
         linkedin,
         meet,
         other,
         message,
         createdAt
       FROM contacts
       ORDER BY createdAt DESC`
    );

    res.render("admin", { contacts });
  } catch (err) {
    console.error("Admin DB error:", err);
    res.status(500).send("Database error loading contacts.");
  }
});

// contact form submit
app.post("/contact", async (req, res) => {
  const b = req.body || {};

  const entry = {
    firstName: b.firstName?.trim() || "",
    lastName: b.lastName?.trim() || "",
    jobTitle: b.jobTitle?.trim() || "",
    company: b.company?.trim() || "",
    email: b.email?.trim() || "",
    mailingList:
      b.mailingList === "yes" || b.mailingList === "on" || b.mailingList === true,
    format: b.format === "text" ? "text" : "html",
    linkedin: b.linkedin?.trim() || "",
    meet: b.meet?.trim() || "",
    other: b.other?.trim() || "",
    message: b.message?.trim() || "",
    createdAt: new Date(),
  };

  try {
    const sql = `
      INSERT INTO contacts 
      (firstName, lastName, jobTitle, company, email,
       mailingList, format, linkedin, meet, other, message, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      entry.firstName,
      entry.lastName,
      entry.jobTitle,
      entry.company,
      entry.email,
      entry.mailingList ? 1 : 0,
      entry.format,
      entry.linkedin,
      entry.meet,
      entry.other,
      entry.message,
      entry.createdAt,
    ];

    const [result] = await pool.execute(sql, params);
    entry.id = result.insertId;

    res.render("confirm", { contact: entry });
  } catch (err) {
    console.error("Error inserting contact:", err);
    res
      .status(500)
      .send("Sorry, there was an error saving your message. Please try again.");
  }
});

// JSON API: all submissions from DB
app.get("/api/submissions", async (_req, res) => {
  try {
    const [contacts] = await pool.query(
      "SELECT * FROM contacts ORDER BY createdAt DESC"
    );
    res.json(contacts);
  } catch (err) {
    console.error("API DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// start server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
