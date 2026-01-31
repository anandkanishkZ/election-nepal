const fs = require('fs');

const maleHex = 'e0a4aae0a581e0a4b0e0a581e0a4b7';
const femaleHex = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be';

let content = fs.readFileSync('analyticsModel.js', 'utf8');

// Replace v.gender patterns
content = content.replace(/v\.gender = '[\u0900-\u097F]+'/g, (match) => {
  if (match.includes('रुष') || match.includes('\u0941\u0937')) {
    return `encode(v.gender::bytea, 'hex') = '${maleHex}'`;
  } else {
    return `encode(v.gender::bytea, 'hex') = '${femaleHex}'`;
  }
});

// Replace gender patterns (without v.)
content = content.replace(/([^v.])gender = '[\u0900-\u097F]+'/g, (match, prefix) => {
  if (match.includes('रुष') || match.includes('\u0941\u0937')) {
    return `${prefix}encode(gender::bytea, 'hex') = '${maleHex}'`;
  } else {
    return `${prefix}encode(gender::bytea, 'hex') = '${femaleHex}'`;
  }
});

fs.writeFileSync('analyticsModel.js', content, 'utf8');
console.log('✓ Fixed all gender comparisons');
