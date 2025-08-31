import fs from 'fs';

const f = 'db/db.json';
const j = JSON.parse(fs.readFileSync(f));

if (typeof j.generatedAt === 'string') {
  j._meta = { ...(j._meta || {}), generatedAt: j.generatedAt };
  delete j.generatedAt;
}
if (!Array.isArray(j.users)) {
  j.users = [];
}

fs.writeFileSync(f, JSON.stringify(j, null, 2));
console.log('✅ fixed', f);
