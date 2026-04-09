const express = require('express');
const app = express();
app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post('/jobs/search', (req, res) => {
  console.log('Received request:', req.body);
  const { title = 'Developer', location = 'Toronto', radius = 25, sources = {} } = req.body;
  
  const sampleJobs = [
    {title: `Sample ${title} Job - Indeed`, company: 'Tech Corp', location, url: `https://ca.indeed.com/${title.toLowerCase().replace(/ /g, '-')}`, source: 'Indeed', postedAt: Date.now()},
    {title: `Sample ${title} Job - LinkedIn`, company: 'Startup Inc', location, url: `https://www.linkedin.com/jobs/view/${title.toLowerCase().replace(/ /g, '-')}`, source: 'LinkedIn', postedAt: Date.now()},
    {title: `Sample ${title} Job - Job Bank`, company: 'Government of Canada', location, url: `https://www.jobbank.gc.ca/jobsearch/jobposting/${Date.now()}`, source: 'Job Bank', postedAt: Date.now()},
    {title: `Sample ${title} Job - Workopolis`, company: 'Workopolis Employer', location, url: `https://www.workopolis.com/jobsearch/job-detail/${Date.now()}`, source: 'Workopolis', postedAt: Date.now()},
    {title: `Sample ${title} Job - Glassdoor`, company: 'Glassdoor Ltd', location, url: `https://www.glassdoor.ca/Job/${title.toLowerCase().replace(/ /g, '-')}-jobs-SRCH_KO0`, source: 'Glassdoor', postedAt: Date.now()}
  ];

  console.log(`Sending ${sampleJobs.length} sample jobs`);
  res.json({ok: true, jobs: sampleJobs});
});

app.get('/jobs', (req, res) => {
  res.json({ok: true, jobs: []});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log('Test: http://localhost:' + PORT + '/jobs');
});