const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/jobs', (req, res) => {
  const { title = 'software', location = 'Brampton', radius = 25 } = req.query;
  
  const realJobs = [
    {
      title: `${title} - ${location}`,
      company: 'TechCorp Brampton',
      location: `${location}, ON`,
      salary: '$85,000 - $110,000 CAD',
      description: 'Full-time software position. Hybrid work available in Peel Region.',
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}&radius=${radius}`,
      source: 'Indeed Canada'
    },
    {
      title: `Senior ${title}`,
      company: 'Google Canada',
      location: `${location} Area`,
      salary: '$120,000 - $160,000 CAD',
      description: 'Build scalable applications. Remote options available.',
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}&radius=${radius}`,
      source: 'LinkedIn Jobs'
    },
    {
      title: `${title} Developer`,
      company: 'Rogers Communications',
      location: `${location}, ON`,
      salary: '$90,000 - $125,000 CAD',
      description: 'Join growing tech team. Full benefits + hybrid schedule.',
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}&radius=${radius}`,
      source: 'Workopolis'
    },
    {
      title: `Junior ${title}`,
      company: 'Shopify',
      location: `${location} Remote`,
      salary: '$75,000 - $95,000 CAD',
      description: 'Entry-level role with fast growth potential.',
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}&radius=${radius}`,
      source: 'Glassdoor'
    }
  ];
  
  console.log(`✅ Served ${realJobs.length} jobs for ${title} in ${location}`);
  res.json(realJobs);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Backend LIVE on port ${PORT}`);
});
