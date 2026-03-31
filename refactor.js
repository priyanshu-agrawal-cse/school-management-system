const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'backend', 'controllers');

const files = fs.readdirSync(controllersDir);

files.forEach(file => {
    if (file === 'auth.js') return; // already done

    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace: res.render("view", { a, b }) => res.status(200).json({ a, b })
    // Regex: res\.render\s*\(\s*["'][^"']+["']\s*,\s*(\{.*?\})\s*\);?
    content = content.replace(/res\.render\s*\(\s*["'][^"']+["']\s*,\s*(\{.*?\})\s*\);?/gs, (match, group1) => {
        return `res.status(200).json(${group1});`;
    });

    // Replace: res.render("view") => res.status(200).json({ message: "view" })
    content = content.replace(/res\.render\s*\(\s*(["'][^"']+["'])\s*\);?/g, (match, group1) => {
        return `res.status(200).json({ view: ${group1} });`;
    });

    // Replace: res.redirect("url") => res.status(200).json({ redirectUrl: "url" })
    content = content.replace(/res\.redirect\s*\(\s*([^)]+)\s*\);?/g, (match, group1) => {
        return `res.status(200).json({ redirectUrl: ${group1} });`;
    });

    // Replace: req.flash("...", "...") => removed or ignored
    content = content.replace(/req\.flash\s*\([^)]+\);?/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Controllers refactored");
