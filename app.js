// Import the express module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

// Allow the app to parse form data (req.body)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Store submissions in memory
const entries = [];

// Define the port number where our server will listen
const PORT = 3010;

// Home page
app.get('/', (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/index.html`);
});

// Confirmation page
app.get('/confirm', (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/confirm.html`);
});

// Admin page (HTML table)
app.get('/admin', (req, res) => {
  res.sendFile(`${import.meta.dirname}/views/admin.html`);
});


// NOTE: This route is just a simple way to display all the saved form entries
// It sends back our in memory array (entries) as JSON so it can be shown on the admin page i wanted to try a diffrent way of doing it 
// this is not a full API just a simple data dump
// Admin JSON API
app.get('/api/submissions', (req, res) => {
  res.json(entries);
});

// Contact form submit full contact form
app.post('/contact', (req, res) => {
  const entry = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    jobTitle: req.body.jobTitle,
    company: req.body.company,
    email: req.body.email,
    mailingList: req.body.mailingList === 'yes',
    format: req.body.format || 'html',
    linkedin: req.body.linkedin,
    meet: req.body.meet,
    other: req.body.other,
    message: req.body.message,
    createdAt: new Date().toISOString(),
    source: 'contact'
  };
  entries.push(entry);
  res.redirect('/confirm');
});

// Simple guestbook submit (optional 3-field form)
app.post('/sign-guestbook', (req, res) => {
  const entry = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    createdAt: new Date().toISOString(),
    source: 'sign-guestbook'
  };
  entries.push(entry);
  res.redirect('/confirm');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
