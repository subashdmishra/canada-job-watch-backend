const express = require('express');
const cors = require('cors');
const app = express();

// ✅ FIX CORS for ALL origins (Chrome extension)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Catch BOTH endpoints extension might call
app.options('*', cors()); // Preflight

app.post('/jobs', (req, res) => res.json(testJobs()));
app.post('/jobs/search', (req, res) => res.json(testJobs())); 
app.get('/jobs', (req, res) => res.json(testJobs()));
app.get('/jobs/search', (req, res) => res.json(testJobs()));

function testJobs() {
  return [
    {title: "✅ FIXED! Backend Perfect", company: "Render Live", location: "Toronto", salary: "$90k", description: "CORS solved!", url: "https://indeed.ca"},
    {title: "✅ Test Job 2", company: "Connection Works", location: "Toronto", salary: "$100k", description: "Real endpoint!", url: "https://indeed.ca"}
  ];
}

app.listen(process.env.PORT || 10000, () => {
  console.log('🚀 Backend LIVE - all endpoints');
});
