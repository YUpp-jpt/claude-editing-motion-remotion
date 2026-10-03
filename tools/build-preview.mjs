// Offline build pattern adapted from Wise Wong's MIT source.
import {build} from 'esbuild';
import {mkdir, writeFile, copyFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const result=await build({
  absWorkingDir:root,
  entryPoints:['src/Preview.tsx'],
  bundle:true,
  minify:true,
  format:'iife',
  target:'es2022',
  outfile:'preview.js',
  loader:{'.woff2':'dataurl'},
  write:false,
  define:{'process.env.NODE_ENV':'"production"'},
  legalComments:'inline',
});
const js=result.outputFiles.find(file=>file.path.endsWith('.js')).text.replaceAll('</script','<\\/script');
const css=result.outputFiles.find(file=>file.path.endsWith('.css')).text;
const destination=path.join(root,'dist');
await mkdir(path.join(destination,'assets'),{recursive:true});
await writeFile(path.join(destination,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>小克剪视频 · 手绘动画</title><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`);
await copyFile(path.join(root,'public/audio/recreated.wav'),path.join(destination,'assets/recreated.wav'));
await copyFile(path.join(root,'THIRD_PARTY_NOTICES.md'),path.join(destination,'THIRD_PARTY_NOTICES.md'));
await copyFile(path.join(root,'public/fonts/OFL.txt'),path.join(destination,'assets/OFL.txt'));
console.log('已生成 dist/index.html，直接双击即可播放。分享时请保留完整 dist 文件夹。');
