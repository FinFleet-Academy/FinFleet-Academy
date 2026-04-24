const fs = require('fs');
const path = require('path');

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lucideMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
  let lucideImports = [];
  if (lucideMatch) {
    lucideImports = lucideMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }

  const commonIcons = ['Award'];

  commonIcons.forEach(icon => {
      const isUsed = content.includes(`<${icon}`) || content.match(new RegExp(`icon:\\s*${icon}\\b`));
      if (isUsed && !lucideImports.includes(icon)) {
          if (!content.includes(`import ${icon}`) && !content.includes(`const ${icon}`) && !content.includes(`function ${icon}`)) {
              console.log(`[Missing] ${icon} used in ${file} but not imported from lucide-react`);
          }
      }
  });
}

function traverse(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            checkFile(fullPath);
        }
    });
}

traverse('src');
