// scripts/build-extension.mjs
import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const projectRoot = process.cwd();
const dist = path.join(projectRoot, 'dist');

console.log('Building extension into', dist);

// limpa dist
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// Lista de arquivos/pastas essenciais (ajuste se precisar)
const essentials = [
  'manifest.json',
  'src',
  'icons'
];

// copia
for (const item of essentials) {
  const src = path.join(projectRoot, item);
  const dest = path.join(dist, item);
  if (!fs.existsSync(src)) {
    console.warn('Aviso: item não existe e será ignorado:', item);
    continue;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    // copy recursive
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// opcional: copie docs se quiser mostrar a landing no dist
if (fs.existsSync(path.join(projectRoot, 'docs'))) {
  fs.cpSync(path.join(projectRoot, 'docs'), path.join(dist, 'docs'), { recursive: true });
}

// gera ZIP com todo o conteúdo do dist (zip contendo os arquivos da extensão raiz)
const zipPath = path.join(dist, 'extension.zip');
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`ZIP gerado: ${zipPath} (${archive.pointer()} bytes)`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') console.warn(err);
  else throw err;
});
archive.on('error', (err) => { throw err; });

// queremos que o zip contenha *os arquivos da extensão* na raiz do zip.
// portanto, adicionamos o conteúdo do dist (exceto extension.zip) diretamente.
archive.directory(dist, false);
archive.pipe(output);
await archive.finalize();
