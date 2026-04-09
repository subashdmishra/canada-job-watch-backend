app.get('/jobs', (req, res) => {
  const { title = 'software', location = 'Toronto' } = req.query;
  res.json([
    {title: `✅ ${title} - ${location}`, company: "Render Live", location, salary: "$90k", description: "Backend perfect!", url: "https://indeed.ca"},
    {title: `✅ Senior ${title}`, company: "TechCorp", location, salary: "$110k", description: "Real connection!", url: "https://indeed.ca"}
  ]);
});
