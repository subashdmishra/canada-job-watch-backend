const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

async function scrapeIndeed(title, location, radius) {
  try {
    const radiusKm = radius * 1.6; // miles to km
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
      const desc = $(el).find('.summary').text().trim().slice(0, 150);
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

async function scrapeLinkedIn(title, location, radius) {
  try {
    const url = `https://ca.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}&distance=${radius}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const jobs = [];
    $('.jobs-search__results-list li').slice(0, 5).each((i, el) => {
      const jobTitle = $(el).find('.job-link').text().trim();
      const company = $(el).find('.sub-title').text().trim();
      if (jobTitle && company) {
        jobs.push({ 
          title: jobTitle, 
          company, 
          location, 
          salary: 'Competitive', 
          description: 'LinkedIn premium listing', 
          url: `https://linkedin.com/jobs/${$(el).attr('data-occludable-job-id')}`,
          source: 'LinkedIn'
        });
      }
    });
    return jobs;
  } catch (e) {
    return [];
  }
}

async function scrapeGoogleJobs(title, location, radius) {
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(title)}+jobs+near+${encodeURIComponent(location)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const jobs = [];
    '.job_seen_beacon, [data-occludable-job-id]').slice(0, 3).each((i, el) => {
      const title = $(el).find('h3').text().trim();
      const company = $(el).find('.company').text().trim();
      if (title && company) {
        jobs.push({ title, company, location, salary: 'TBD', description: 'Google Jobs', url: $(el).find('a').attr('href'), source: 'Google' });
      }
    });
    return jobs;
  } catch (e) {
    return [];
  }
}

app.get('/jobs', async (req, res) => {
  const { title = 'software', location = 'Toronto', radius = 25 } = req.query;
  
  console.log(`🔍 Scraping: ${title} in ${location} (${radius}mi)`);
  
  const allJobs = [];
  
  // Run scrapers in parallel
  const [indeedJobs, linkedinJobs] = await Promise.all([
    scrapeIndeed(title, location, radius),
    scrapeLinkedIn(title, location, radius)
  ]);
  
  allJobs.push(...indeedJobs, ...linkedinJobs);
  
  // Deduplicate by title+company
  const uniqueJobs = allJobs.filter((job, i, arr) => 
    arr.findIndex(t => t.title === job.title && t.company === job.company) === i
  );
  
  console.log(`✅ Found ${uniqueJobs.length} real jobs`);
  res.json(uniqueJobs.slice(0, 15));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Real jobs scraper on ${PORT}`));
