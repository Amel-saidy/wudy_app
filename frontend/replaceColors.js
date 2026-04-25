const fs = require('fs');
const path = require('path');

const replaceInDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        let p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            replaceInDir(p);
        } else if(file.endsWith('.jsx')) {
            let c = fs.readFileSync(p, 'utf8');
            c = c.replace(/background: '#fff'/g, "background: 'var(--bg-card)'");
            c = c.replace(/background: '#f9f9f9'/g, "background: 'var(--bg-main)'");
            c = c.replace(/background: '#f5f5f5'/g, "background: 'var(--light-gray)'");
            c = c.replace(/color: '#333'/g, "color: 'var(--text-main)'");
            c = c.replace(/color: '#666'/g, "color: 'var(--dark-gray)'");
            fs.writeFileSync(p, c);
        }
    });
};

replaceInDir('C:\\Users\\DELL\\Downloads\\Shop\\frontend\\src');
console.log('Done replacing colors.');
