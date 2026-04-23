const fs = require('fs');
const path = require('path');

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract lucide-react imports
  const lucideMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
  let lucideImports = [];
  if (lucideMatch) {
    lucideImports = lucideMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }

  // Common lucide-react icons that might be used
  const commonIcons = ['Activity', 'ArrowRight', 'Bot', 'BookOpen', 'ShieldCheck', 'Zap', 'Star', 'Users', 'Heart', 'MessageSquare', 'Globe', 'PlayCircle', 'CheckCircle2', 'Target', 'Trophy', 'Crown', 'TrendingUp', 'Calculator', 'BellRing', 'Search', 'Share2', 'Bookmark', 'Calendar'];

  commonIcons.forEach(icon => {
      // If used as <Icon or icon: Icon
      const isUsed = content.includes(`<${icon}`) || content.match(new RegExp(`icon:\\s*${icon}\\b`));
      if (isUsed && !lucideImports.includes(icon)) {
          // Verify it's not imported from somewhere else or locally defined
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
