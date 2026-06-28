const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];

const replacements = [
  { search: /blue-600/g, replace: 'purple-700' },
  { search: /blue-700/g, replace: 'purple-800' },
  { search: /blue-900/g, replace: 'purple-900' },
  { search: /blue-50/g, replace: 'purple-50' },
  { search: /blue-100/g, replace: 'purple-100' },
  { search: /blue-200/g, replace: 'purple-200' },
  { search: /blue-400/g, replace: 'purple-400' },
  { search: /blue-800/g, replace: 'purple-800' },
  { search: /indigo-600/g, replace: 'violet-600' },
  { search: /indigo-700/g, replace: 'violet-700' },
  { search: /indigo-50/g, replace: 'violet-50' },
  { search: /indigo-100/g, replace: 'violet-100' },
  { search: /Quiz Master/g, replace: 'VisionX Quiz Portal' },
  { search: /Teacher Dashboard/g, replace: 'VisionX Dashboard' },
  { search: /Quiz Management App/g, replace: 'VisionX Skills Assessment' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.search, rule.replace);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(path.join(__dirname, '..', dir));
}

console.log("Done replacing colors and text!");
