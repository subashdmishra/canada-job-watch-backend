const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Real job scrapers
async function scrapeIndeed(query, location) {
  try {
    const url = `https://ca.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const jobs = [];
    $('.job_seen_beacon').slice(0, 5).each((i, el) => {
      const title = $(el).find('h2 a span').text().trim();
      const company = $(el).find('.companyName').text().trim();
      const locationEl = $(el).find('.companyLocation').text().trim();
      
      if (title && company) {
        jobs.push({
          title,
          company,
          location: locationEl || location,
          salary: 'N/A',
          description: $(el).find('.summary').text().trim().slice(0, 200) + '...',
          url: `https://ca.indeed.com${$(el).find('h2 a').attr('href')}`
        });
      }
    });
    return jobs;
  } catch (e) {
    console.log('Indeed error:', e.message);
    return [];
  }
}

async function scrapeWorkopolis(query, location) {
  try {
    const url = `https://www.workopolis.com/search?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const jobs = [];
    $('.job-tile').slice(0, 3).each((i, el) => {
      const title = $(el).find('.job-tile-title a').text().trim();
      const company = $(el).find('.job-tile-company').text().trim();
      
      if (title && company) {
        jobs.push({
          title,
          company,
          location,
          salary: 'N/A',
          description: 'Full-time position at Workopolis listing.',
          url: $(el).find('.job-tile-title a').attr('href')
        });
      }
    });
    return jobs;
  } catch (e) {
    return [];
  }
}

// Your endpoint
app.post('/jobs', async (req, res) => {
  const { title, location, radius, boards } = req.body;
  
  console.log(`Scraping: ${title} in ${location}`);
  
  const allJobs = [];
  
  // Indeed (always works)
  if (boards.includes('indeed') || boards.length === 0) {
    const indeedJobs = await scrapeIndeed(title, location);
    allJobs.push(...indeedJobs);
  }
  
  // Workopolis
  if (boards.includes('workopolis')) {
    const wpJobs = await scrapeWorkopolis(title, location);
    allJobs.push(...wpJobs);
  }
  
  // Return unique jobs (dedupe by title+company)
  const uniqueJobs = allJobs.filter((job, index, self) => 
    index === self.findIndex(j => 
      j.title.toLowerCase().includes(job.title.toLowerCase()) && 
      j.company.toLowerCase().includes(job.company.toLowerCase())
    )
  );
  
  console.log(`Found ${uniqueJobs.length} real jobs`);
  res.json(uniqueJobs.slice(0, 10));
});

app.listen(process.env.PORT || 10000, () => {
  console.log('🚀 Backend live at port', process.env.PORT || 10000);
});
