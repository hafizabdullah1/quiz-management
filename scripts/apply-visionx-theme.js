const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];

const replacements = [
  { search: /bg-gradient-to-r from-purple-700 to-violet-600/g, replace: 'bg-gradient-primary' },
  { search: /bg-gradient-to-br from-purple-500 to-violet-600/g, replace: 'bg-gradient-primary' },
  { search: /hover:from-purple-800 hover:to-violet-700/g, replace: 'hover:bg-gradient-primary-hover' },
  { search: /bg-gradient-to-br from-purple-50 to-violet-100/g, replace: 'bg-gradient-to-br from-primary/5 to-primary/10' },
  { search: /bg-purple-700/g, replace: 'bg-primary' },
  { search: /hover:bg-purple-800/g, replace: 'hover:bg-primary-hover' },
  { search: /text-purple-700/g, replace: 'text-primary' },
  { search: /text-purple-900/g, replace: 'text-primary' },
  { search: /text-purple-600/g, replace: 'text-primary' },
  { search: /text-violet-600/g, replace: 'text-primary/80' },
  { search: /border-purple-200/g, replace: 'border-primary/20' },
  { search: /border-purple-300/g, replace: 'border-primary/30' },
  { search: /border-purple-400/g, replace: 'border-primary/40' },
  { search: /bg-purple-50/g, replace: 'bg-primary/5' },
  { search: /bg-purple-100/g, replace: 'bg-primary/10' },
  { search: /bg-purple-200/g, replace: 'bg-primary/20' },
  { search: /text-purple-800/g, replace: 'text-primary' }
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

console.log("Done applying VisionX custom theme variables!");
