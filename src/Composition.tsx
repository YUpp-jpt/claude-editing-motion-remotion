import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {Mascot} from './Artwork';
import {Box, Confetti, Editor, ink, paper, Phone} from './Editor';
import {camera, clamp, progress, tween} from './timing';

const CodeIntro: React.FC<{t:number}> = ({t}) => {
  const scale=tween(t,.2,.65,1,.64);const x=tween(t,.2,.65,313,190),y=tween(t,.2,.65,248,42);
  const line2=t>.23,line3=t>.42;
  return <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${tween(t,.3,.65,0,-3)})`} opacity={1-progress(t,.65,.85)}>
    <rect x="3" y="4" width="654" height="202" fill="#000" opacity=".08" rx="10"/>
    <Box x={0} y={0} w={654} h={202} fill="#fffdf9" radius={12} width={2.7}/><path d="M 2 37 L 652 37" stroke="#b2aa9a" strokeWidth="1.6"/>
    <path d="M 12 3 H 641 Q 650 3 650 15 V 34 H 4 V 15 Q 4 3 12 3" fill="#efebdf"/>
    {['#d97474','#e7bf5b','#86b482'].map((color,i)=><circle key={color} cx={23+i*16} cy="19" r="5" fill={color} stroke={ink} strokeWidth="1.3"/>)}<text x="327" y="26" textAnchor="middle" fontSize="18" fill="#8f8575">小克.js — 终端</text>
    {[0,1,2].map(i=><text key={i} x="25" y={83+i*47} fontSize="24" fill="#aaa497">{i+1}</text>)}
    <text x="61" y="84" fontSize="31"><tspan fill="#9481be" fontStyle="italic" fontWeight="bold">const </tspan><tspan fill="#529c8d">剪辑软件</tspan><tspan> = </tspan><tspan fill="#cb7c6b">小克</tspan><tspan>.写代码()</tspan></text>
    {line2&&<text x="61" y="131" fontSize="30"><tspan fill="#529c8d">剪辑软件</tspan><tspan>.画出(</tspan><tspan fill="#cbb052">时间轴, 预览, 面板</tspan><tspan>)</tspan></text>}
    {line3&&<text x="61" y="178" fontSize="30"><tspan fill="#cb7c6b">小克</tspan><tspan>.钻进去()</tspan></text>}
    <rect x={line3?239:line2?551:536} y={line3?153:line2?105:60} width="11" height="30" fill="#c87765" opacity={Math.sin(t*24)>-.6?1:0}/>
    {t>.48&&[0,1,2].map(i=><path key={i} d={`M ${375+i*14} 214 L ${430+i*12} ${264+i*10}`} stroke={ink} strokeWidth="3" strokeLinecap="round"/>)}
  </g>;
};

const Ending: React.FC<{t:number;frame:number}> = ({t,frame}) => {
  const p=progress(t,26.5,27.0);
  const x=tween(t,26.5,27.0,544,448),y=tween(t,26.5,27.0,65,130),w=tween(t,26.5,27.0,195,303),h=tween(t,26.5,27.0,298,462);
  const noteText=t<27.75?'30 秒剪完,':t<28.5?'30 秒剪完,':'30 秒剪完,';
  return <g opacity={p}>
    <rect width="1280" height="720" fill={paper} opacity=".67"/>
    <g transform={`translate(${tween(t,26.65,27.05,-410,42)} 171) rotate(-1.4)`}>
      <Box x={0} y={0} w={362} h={320} fill="#fffdfa" radius={9} width={2.6}/>
      {[52,102,152,202,252,300].map(y=><path key={y} d={`M 14 ${y} L 347 ${y-2}`} stroke="#e9e5dd" strokeWidth="1"/>)}
      <path d="M 132 -10 L 227 -11 L 227 8 L 133 10 Z" fill="#edcb67" opacity=".82"/><path d="M 135 -6 H 224" stroke="#f5dc8a" strokeWidth="2" opacity=".7"/>
      <g opacity={progress(t,27.0,27.7)}><text x="29" y="82" fontSize="35">{noteText.slice(0,Math.min(noteText.length,Math.floor((t-27)*15)))}</text></g>
      <defs><clipPath id="note-writing"><rect x="23" y="98" width={340*progress(t,27.75,28.6)} height="116"/></clipPath></defs>
      <text x="24" y="198" fontSize="72" fontWeight="700" fontStyle="italic" clipPath="url(#note-writing)">Opus 5.5</text>
      <path d={`M 24 215 Q 159 194 ${24+308*progress(t,28.6,29.15)} 214`} stroke="#ce7c6c" strokeWidth="6" fill="none" strokeLinecap="round" opacity={t>=28.6?1:0}/>
      <text x="223" y="280" textAnchor="middle" fontSize="31" opacity={progress(t,28.75,29.3)}>— 小克</text>
    </g>
    <Phone x={x} y={y} w={w} h={h} t={t} frame={frame} social/>
    <g transform={`translate(924 ${tween(t,26.6,27.2,603,420)}) rotate(${Math.sin(t*8)*2})`}><Mascot frame={frame} pose={t>28.9?'wink':'happy'} sunglasses={t<28.4} width={226} height={182}/></g>
    <Confetti t={t}/>
  </g>;
};

export const ClaudeEditingMotion: React.FC = () => {
  const frame=useCurrentFrame();const t=frame/30;
  const [fontHandle]=useState(()=>delayRender('Load bundled handwriting font'));
  useEffect(()=>{
    const font=new FontFace('WenKai',`url(${staticFile('fonts/LXGWWenKaiLite-Regular.ttf')})`);
    font.load().then(async f=>{document.fonts.add(f);await document.fonts.ready;await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));continueRender(fontHandle);}).catch(cancelRender);
  },[fontHandle]);
  const cam=camera(t);const intro=1-progress(t,.5,.86);
  return <AbsoluteFill style={{backgroundColor:paper}}>
    <svg width="1280" height="720" viewBox="0 0 1280 720" style={{fontFamily:'WenKai, serif',color:ink}}>
      <style>{'text { font-family: WenKai, serif; }'}</style>
      <defs><filter id="paper-grain"><feTurbulence baseFrequency=".72" numOctaves="3" seed="28" type="fractalNoise"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer></filter></defs>
      <rect width="1280" height="720" fill={paper}/>
      <g opacity={1-intro} transform={`translate(${cam.x} ${cam.y}) scale(${cam.scale})`}><Editor t={t} frame={frame}/></g>
      {t<.86&&<CodeIntro t={t}/>}
      {t>=26.5&&<Ending t={t} frame={frame}/>}
      <rect width="1280" height="720" filter="url(#paper-grain)" opacity=".22" pointerEvents="none"/>
    </svg>
    <Audio src={staticFile('audio/recreated.wav')} volume={0.85}/>
  </AbsoluteFill>;
};
