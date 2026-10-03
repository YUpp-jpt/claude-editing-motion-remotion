import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import ffmpeg from 'ffmpeg-static';

const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input=path.resolve(root,process.argv[2]??'renders/claude-editing-motion.mp4');
const cli=path.join(path.dirname(require.resolve('@remotion/cli/package.json')),'remotion-cli.js');
const run=(binary,args)=>{
  const result=spawnSync(binary,args,{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(result.stderr||result.stdout||'Media check failed.');
  return result;
};
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const media=JSON.parse(run(process.execPath,[cli,'ffprobe','-v','error','-show_streams','-show_format','-of','json',input]).stdout);
const video=media.streams.find(stream=>stream.codec_type==='video');
const audio=media.streams.find(stream=>stream.codec_type==='audio');
assert(video,'No video stream.');assert(audio,'No audio stream.');
assert(video.width===1280&&video.height===720,'Unexpected video dimensions.');
assert(video.avg_frame_rate==='30/1','Expected 30 fps.');
// Some ffprobe builds call full-range 4:2:0 "yuvj420p". Both formats are valid H.264 4:2:0.
assert(video.codec_name==='h264'&&['yuv420p','yuvj420p'].includes(video.pix_fmt),'Expected H.264 with 4:2:0 pixels.');
assert(Math.abs(Number(video.duration)-30)<.02,'Expected a 30 second video.');
assert(Number(video.nb_frames)===900,'Expected 900 video frames.');
assert(Number(audio.sample_rate)===48000&&audio.channels===2,'Expected 48 kHz stereo.');
assert(Math.abs(Number(audio.duration)-30)<.12,'Audio duration differs from the animation.');
run(ffmpeg,['-v','error','-i',input,'-f','null','-']);
const loudness=run(ffmpeg,['-hide_banner','-i',input,'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-']).stderr;
const match=loudness.match(/\{\s*"input_i"[\s\S]*?\}/);
assert(match,'Could not measure audio.');
const levels=JSON.parse(match[0]);
assert(Number(levels.input_tp)<0,'Audio clips at or above 0 dBTP.');
const report={file:path.basename(input),video:{codec:video.codec_name,pixelFormat:video.pix_fmt,width:video.width,height:video.height,fps:30,frames:Number(video.nb_frames),seconds:Number(video.duration)},audio:{codec:audio.codec_name,sampleRate:Number(audio.sample_rate),channels:audio.channels,seconds:Number(audio.duration),integratedLUFS:Number(levels.input_i),truePeakDBTP:Number(levels.input_tp)},completeDecode:true,visualReview:'Inspect the animation and key transitions in Remotion Studio or the rendered MP4. Numerical checks do not replace viewing or listening.'};
fs.writeFileSync(path.join(path.dirname(input),'verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
