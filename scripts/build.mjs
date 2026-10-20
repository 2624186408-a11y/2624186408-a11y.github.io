import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, '_site');
const entryFiles = ['index.html', 'styles.css', 'script.js', 'honors-data.js'];
const publicAssetExtensions = new Set([
  '.avif', '.gif', '.jpeg', '.jpg', '.mp4', '.pdf', '.png', '.svg', '.webm', '.webp', '.woff', '.woff2'
]);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

async function collectLocalReferences() {
  const references = new Set();

  for (const file of entryFiles) {
    const source = await readFile(path.join(root, file), 'utf8');

    for (const match of source.matchAll(/(?:src|href|poster|data-[a-z-]*src)\s*=\s*["']([^"']+)["']/gi)) {
      references.add(match[1]);
    }

    for (const match of source.matchAll(/assets\/[A-Za-z0-9._/-]+/g)) {
      references.add(match[0]);
    }
  }

  return [...references].filter((reference) => {
    return !reference.startsWith('#')
      && !reference.startsWith('data:')
      && !reference.startsWith('http://')
      && !reference.startsWith('https://')
      && !reference.startsWith('mailto:')
      && !reference.startsWith('tel:');
  });
}

async function assertRegularFile(filePath, reference) {
  try {
    if (!(await stat(filePath)).isFile()) throw new Error('not a file');
  } catch {
    throw new Error(`Missing local resource: ${reference}`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const references = await collectLocalReferences();
const absoluteReferences = references.filter((reference) => reference.startsWith('/'));
if (absoluteReferences.length) {
  throw new Error(`Root-absolute paths are not portable: ${absoluteReferences.join(', ')}`);
}

for (const file of entryFiles) {
  await assertRegularFile(path.join(root, file), file);
  await cp(path.join(root, file), path.join(output, file));
}

for (const reference of references) {
  const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  const sourcePath = path.resolve(root, ...cleanReference.split('/'));
  const outputPath = path.resolve(output, ...cleanReference.split('/'));

  if (!sourcePath.startsWith(`${root}${path.sep}`) || !outputPath.startsWith(`${output}${path.sep}`)) {
    throw new Error(`Resource path escapes the site root: ${reference}`);
  }

  await assertRegularFile(sourcePath, reference);

  if (cleanReference.startsWith('assets/')) {
    const extension = path.extname(cleanReference).toLowerCase();
    if (!publicAssetExtensions.has(extension)) {
      throw new Error(`Unsupported public asset type: ${reference}`);
    }
    await mkdir(path.dirname(outputPath), { recursive: true });
    await cp(sourcePath, outputPath);
  }

  await assertRegularFile(outputPath, reference);
}

await writeFile(path.join(output, '.nojekyll'), '', 'utf8');

console.log(`Built ${toPosix(path.relative(root, output))}/ with ${references.length} validated local references.`);
