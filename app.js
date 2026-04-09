const express = require('express');
const cors = require('cors');
const app = express();

// ✅ PERFECT CORS - allows Chrome extensions
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ GET endpoint for extension (title/location as query params)
app.get('/jobs', (req, res) => {
  const { title = 'software', location = 'Toronto' } = req.query;
  
  const jobs = [
    {
      title: `✅ ${title} Job - ${location}`,
      company: 'TechCorp Canada',
      location: location,
      salary: '$90k - $120k',
      description: 'Full-time position. Backend ↔ Extension perfect!',
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}`
    },
    {
      title: `✅ Senior ${title}`,
      company: 'Render Works',
      location: location,
      salary: '$110k - $150k',
      description: 'Production ready. Click to apply on Indeed.',
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}`
    },
    {
      title: `${title} (Remote OK)`,
      company: 'Startup Inc',
      location: `${location} (Remote)`,
      salary: '$85k+',
      description: 'Fast-growing company hiring immediately.',
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}`
    }
  ];
  
  console.log(`✅ GET /jobs?title=${title}&location=${location}`);
  res.json(jobs);
});

// ✅ POST backup (if needed later)
app.post('/jobs', (req, res) => {
  const { title = 'software', location = 'Toronto' } = req.body;
  res.json([
    {title: `✅ POST ${title}`, company: 'Backend', location, salary: '$100k', description: 'POST works too!', url: 'https://indeed.ca'}
  ]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Backend LIVE on port ${PORT}`);
});
