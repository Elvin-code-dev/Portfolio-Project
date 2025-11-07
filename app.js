// Express + EJS with in-memory submissions (multiple entries)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// static + body parsing
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// in-memory 
const submissions = []; 

// routes
app.get("/", (req, res) => {
  res.render("index");
});

// admin must pass contacts to EJS
app.get("/admin", (req, res) => {
  res.render("admin", { contacts: submissions });
});

// form submit -> save + confirm 
app.post("/contact", (req, res) => {
  const b = req.body || {};
  const entry = {
    firstName: b.firstName?.trim() || "",
    lastName:  b.lastName?.trim()  || "",
    jobTitle:  b.jobTitle?.trim()  || "",
    company:   b.company?.trim()   || "",
    email:     b.email?.trim()     || "",
    mailingList: !!(b.mailingList === "yes" || b.mailingList === "on" || b.mailingList === true),
    format:    (b.format === "text" ? "text" : "html"),
    linkedin:  b.linkedin?.trim()  || "",
    meet:      b.meet?.trim()      || "",
    other:     b.other?.trim()     || "",
    message:   b.message?.trim()   || "",
    createdAt: Date.now()
  };
  submissions.push(entry);
  res.render("confirm", { contact: entry });
});

// JSON
app.get("/api/submissions", (_req, res) => {
  res.json(submissions);
});

// start
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
