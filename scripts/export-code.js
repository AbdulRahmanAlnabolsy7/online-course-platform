const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const excluded = new Set(['.git', 'node_modules', '.env', 'coverage', 'dist', 'test-results', 'playwright-report', 'COMPLETE_CODE.md', 'package-lock.json']);
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (excluded.has(entry.name)) return [];
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? files(target) : [target];
  });
}
const all = files(root).sort();
const tree = all.map(file => path.relative(root, file).replace(/\\/g, '/')).join('\n');
const content = '# Complete project source\n\nGenerated from the actual project files. Local secrets and installed dependencies are excluded. The dependency lockfile is delivered separately.\n\n```text\n' + tree + '\n```\n\n' + all.map(file => {
  const name = path.relative(root, file).replace(/\\/g, '/');
  const language = { '.js': 'js', '.jsx': 'jsx', '.css': 'css', '.html': 'html', '.json': 'json', '.yml': 'yaml', '.md': 'markdown' }[path.extname(file)] || 'text';
  const fence = language === 'markdown' ? '````' : '```';
  return `FILE: ${name}\n\n${fence}${language}\n${fs.readFileSync(file, 'utf8')}\n${fence}\n`;
}).join('\n');
fs.writeFileSync(path.join(root, 'COMPLETE_CODE.md'), content);
