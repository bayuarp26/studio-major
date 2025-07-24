// Generate NEXTAUTH_SECRET
const crypto = require('crypto');

// Generate secure random string
const secret = crypto.randomBytes(32).toString('base64');

console.log('Generated NEXTAUTH_SECRET:');
console.log(secret);
console.log('\nCopy this to your .env.local:');
console.log(`NEXTAUTH_SECRET=${secret}`);
