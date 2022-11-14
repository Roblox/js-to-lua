const fs = require('fs');

const file = process.argv[2];

if (!file) {
  console.error('No file specified');
  process.exit(1);
}

fs.chmod(file, 0o775, (err) => {
  if (err) throw err;
  console.log(`Made "${file}" executable`);
});
