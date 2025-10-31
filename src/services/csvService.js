const csv = require('csv-parser');
const { Readable } = require('stream');

function parseCsvBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const leads = [];
    const stream = Readable.from(buffer.toString('utf8'));
    stream
      .pipe(csv({ skipLines: 0, trim: true }))
      .on('data', (row) => {
        const lead = {
          name: (row.name || row.Name || '').trim(),
          role: (row.role || row.Role || '').trim(),
          company: (row.company || row.Company || '').trim(),
          industry: (row.industry || row.Industry || '').trim(),
          location: (row.location || row.Location || '').trim(),
          linkedin_bio: (row.linkedin_bio || row.linkedin || row.LinkedIn || '').trim()
        };
        leads.push(lead);
      })
      .on('end', () => resolve(leads))
      .on('error', (err) => reject(err));
  });
}

module.exports = { parseCsvBuffer };
