#!/usr/bin/env node

// Scaffolds a new thoughts post: prompts for the front matter, then writes
// src/thoughts/<slug>.md ready to write in.
//
// Usage: npm run new-thought

const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const ROOT = path.join(__dirname, '..');
const THOUGHTS_DIR = path.join(ROOT, 'src/thoughts');
const OG_IMAGES_DIR = path.join(ROOT, 'src/assets/images/thoughts');
const OG_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

// Matches the accent colors defined in src/assets/css/layers/base.css
// (--category-*). Any other value still works, it just falls back to the
// muted text color instead of getting its own accent.
const CATEGORIES = ['Layout', 'Typography', 'Color', 'Motion', 'Interaction', 'Philosophy', 'Language'];

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

  console.log('New thoughts post\n');

  const title = await ask('Title');
  if (!title) {
    console.error('\nA title is required.');
    rl.close();
    process.exit(1);
  }

  console.log('\nCategory:');
  CATEGORIES.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  const categoryAnswer = await ask('Pick a number (blank to skip)');
  const categoryIndex = parseInt(categoryAnswer, 10);
  const category = categoryIndex >= 1 && categoryIndex <= CATEGORIES.length ? CATEGORIES[categoryIndex - 1] : '';

  const description = await ask('Description (one-line summary shown under the title)');
  const tagsAnswer = await ask('Tags (comma-separated)');
  const tags = tagsAnswer
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const date = await ask('Date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10));
  const slug = slugify(await ask('URL slug', slugify(title)));

  const existingOgImage = fs.existsSync(OG_IMAGES_DIR)
    ? OG_EXTENSIONS.map((ext) => `${slug}${ext}`).find((file) => fs.existsSync(path.join(OG_IMAGES_DIR, file)))
    : null;
  const ogImage = existingOgImage
    ? await ask('OG image found — use it?', `/assets/images/thoughts/${existingOgImage}`)
    : await ask('OG image path (leave blank to skip, e.g. /assets/images/thoughts/<slug>.png)');

  rl.close();

  if (!slug) {
    console.error('\nCould not derive a URL slug from that title — try again with a slug that has letters or numbers.');
    process.exit(1);
  }

  const thoughtPath = path.join(THOUGHTS_DIR, `${slug}.md`);
  if (fs.existsSync(thoughtPath)) {
    console.error(`\nsrc/thoughts/${slug}.md already exists — pick a different slug.`);
    process.exit(1);
  }

  const lines = ['---'];
  lines.push(`title: ${yamlString(title)}`);
  if (category) lines.push(`category: ${category}`);
  if (description) lines.push(`description: ${yamlString(description)}`);
  lines.push(`date: ${date}`);
  if (tags.length) {
    lines.push('tags:');
    tags.forEach((tag) => lines.push(`  - ${tag}`));
  }
  if (ogImage) lines.push(`ogImage: ${ogImage}`);
  lines.push('---');
  lines.push('');
  lines.push('Write here.');
  lines.push('');

  fs.mkdirSync(THOUGHTS_DIR, { recursive: true });
  fs.writeFileSync(thoughtPath, lines.join('\n'));

  console.log(`\nCreated src/thoughts/${slug}.md.`);
  console.log(`Preview at /thoughts/${slug}/ once the dev server picks it up.`);
}

main();
