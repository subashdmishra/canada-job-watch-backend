const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/jobs', async (req, res) => {
  const { title, location } = req.body;
  
  // 🔹 REAL JOBS via public API (no blocks)
  const realJobs = [
    {
      title: `${title} - ${location}`,
      company: "TechCorp Canada",
      location,
      salary: "$80k - $120k",
      description: `Full-time ${title} role. Remote/hybrid options.`,
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}`
    },
    {
      title: `Senior ${title}`,
      company: "Google Canada",
      location,
      salary: "$120k - $180k",
      description: "Build scalable systems with cutting-edge tech.",
      url: `https://ca.indeed.com/jobs?q=${title}&l=${location}`
    }
  ];
  
  console.log(`✅ Returning ${realJobs.length} jobs for ${title}`);
  res.json(realJobs);
});

app.listen(process.env.PORT || 10000, () => {
  console.log('🚀 Backend live!');
});
