const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

async function scrapeIndeed(title, location, radius) {
  try {
    const radiusKm = radius * 1.6;
    const url = `https://ca.indeed.com/jobs?q=${encodeURIComponent(title)}&l=${encodeURIComponent(location)}&radius=${radiusKm}&fromage=7`;
    const { data } = await axios.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const $ = cheerio.load(data);
    
    const jobs = [];
    $('.job_seen_beacon').slice(0, 8).each((i, el) => {
      const jobTitle = $(el).find('.jcs-JobTitle').text().trim() || $(el).find('h2 a span').text().trim();
      const company = $(el).find('.companyName').text().trim();
      const loc = $(el).find('.companyLocation').text().trim();
      const salary = $(el).find('.salary-snippet').text().trim() || 'Salary not listed';
      const desc = $(el).find('.summary').text().trim().substring(0, 150);
      const link = `https://ca.indeed.com${$(el).find('h2 a').attr('href') || ''}`;
      
      if (jobTitle && company) {
        jobs.push({ title: jobTitle, company, location: loc, salary, description: desc, url: link, source: 'Indeed' });
      }
    });
    return jobs;
  } catch (e) {
    console.log('Indeed failed:', e.message);
    return [];
  }
}

async function scrapeWorkopolis(title, location, radius) {
  try {
    const url = `https://www.workopolis.com/search?q=${encodeURIComponent(title)}&l=${encodeURIComponent(location)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const jobs = [];
    $('.job-tile').slice(0, 5).each((i, el) => {
      const titleJob = $(el).find('.job-tile-title a').text().trim();
      const company = $(el).find('.job-tile-company').text().trim();
      if (titleJob && company) {
        jobs.push({
          title: titleJob,
          company,
          location,
          salary: 'Competitive',
          description: 'Workopolis listing',
          url: $(el).find('.job-tile-title a').attr('href'),
          source: 'Workopolis'
        });
      }
    });
    return jobs;
  } catch (e) {
    return [];
  }
}

app.get('/jobs', async (req, res) => {
  const { title = 'software', location = 'Toronto', radius = 25 } = req.query;
  
  console.log(`🔍 Scraping: ${title} in ${location} (${radius} miles)`);
  
  const [indeedJobs, workopolisJobs] = await Promise.all([
    scrapeIndeed(title, location, radius),
    scrapeWorkopolis(title, location, radius)
  ]);
  
  const allJobs = [...indeedJobs, ...workopolisJobs];
  
  const uniqueJobs = allJobs.filter((job, index, self) =>
    index === self.findIndex(j => j.title === job.title && j.company === job.company)
  );
  
  console.log(`✅ Found ${uniqueJobs.length} real jobs`);
  res.json(uniqueJobs.slice(0, 15));
});
