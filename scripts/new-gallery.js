#!/usr/bin/env node

// Scaffolds a new photo gallery from a folder of images already dropped into
// src/assets/images/<folder>/. Auto-generates the photos: array (the tedious
// part of hand-writing a gallery file) and prompts for the rest of the front
// matter, then writes src/photo-galleries/<slug>.md.
//
// Usage: npm run new-gallery [-- <folder-name>]

const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'src/assets/images');
const GALLERIES_DIR = path.join(ROOT, 'src/photo-galleries');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function yamlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const ask = async (question, fallback) => {
    const suffix = fallback ? ` (${fallback})` : '';
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    return answer || fallback || '';
  };

  console.log('New photo gallery\n');

  const folder = process.argv[2] || (await ask('Image folder name in src/assets/images/'));
  const folderPath = path.join(IMAGES_DIR, folder);

  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    console.error(`\nNo folder found at src/assets/images/${folder}`);
    console.error('Drop your photos there first, then run this script again.');
    rl.close();
    process.exit(1);
  }

  const photoFiles = fs
    .readdirSync(folderPath)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (photoFiles.length === 0) {
    console.error(`\nNo images found in src/assets/images/${folder}`);
    rl.close();
    process.exit(1);
  }

  console.log(`\nFound ${photoFiles.length} photo${photoFiles.length === 1 ? '' : 's'} in ${folder}/\n`);

  const title = await ask('Title', folder);
  const description = await ask('Description');
  const location = await ask('Location');
  const date = await ask('Date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10));
  const lat = await ask('Latitude (leave blank to skip the map)');
  const lng = lat ? await ask('Longitude') : '';
  const slug = slugify(await ask('URL slug', slugify(title)));

  console.log('\nCover photo:');
  photoFiles.forEach((file, i) => console.log(`  ${i + 1}. ${file}`));
  const coverAnswer = await ask('Pick a number', '1');
  const coverIndex = Math.min(Math.max(parseInt(coverAnswer, 10) || 1, 1), photoFiles.length) - 1;
  const coverFile = photoFiles[coverIndex];

  rl.close();

  if (!slug) {
    console.error('\nCould not derive a URL slug from that title — try again with a slug that has letters or numbers.');
    process.exit(1);
  }

  const galleryPath = path.join(GALLERIES_DIR, `${slug}.md`);
  if (fs.existsSync(galleryPath)) {
    console.error(`\nsrc/photo-galleries/${slug}.md already exists — pick a different slug.`);
    process.exit(1);
  }

  const imgPath = (file) => `/assets/images/${folder}/${file}`;

  const lines = ['---'];
  lines.push(`title: ${yamlString(title)}`);
  if (description) lines.push(`description: ${yamlString(description)}`);
  lines.push(`cover: ${imgPath(coverFile)}`);
  lines.push(`cover_alt: ${yamlString(title)}`);
  if (location) lines.push(`location: ${yamlString(location)}`);
  if (lat) lines.push(`lat: ${lat}`);
  if (lng) lines.push(`lng: ${lng}`);
  lines.push(`date: ${date}`);
  lines.push('photos:');
  photoFiles.forEach((file, i) => {
    lines.push(`  - src: ${imgPath(file)}`);
    lines.push(`    alt: ${yamlString(`${title}, photo ${i + 1}`)}`);
  });
  lines.push('---');
  lines.push('');

  fs.mkdirSync(GALLERIES_DIR, { recursive: true });
  fs.writeFileSync(galleryPath, lines.join('\n'));

  console.log(`\nCreated src/photo-galleries/${slug}.md with ${photoFiles.length} photos.`);
  console.log(`Preview at /photos/${slug}/ once the dev server picks it up.`);
  console.log('Alt text was auto-generated from the title — worth a pass to make it more descriptive per photo.');
}

main();
