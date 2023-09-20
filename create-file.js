const fs = require('fs');

// Content for the new file
const content = 'This is the content of the new file.';

// Get the current date and time
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

// Format the current date and time as a string
const currentTime = `${year}${month}${day}_${hours}${minutes}${seconds}`;

// Specify the file path with the current time
const filePath = `newfile_${currentTime}.txt`;

// Write the content to the new file
fs.writeFileSync(filePath, content);

console.log(`Created ${filePath} with content: "${content}"`);
