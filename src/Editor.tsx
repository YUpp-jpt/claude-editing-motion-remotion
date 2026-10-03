import React, {useId} from 'react';
import {Mascot, SceneArt} from './Artwork';
import {clamp, ease, progress, sceneKind, track, tween} from './timing';
import {Box, Caption, Controls, Dust, LongArm, Speech, Star} from './components/Drawing';
import {ink, paper, mint, yellow, red} from './palette';
export {Box, Caption, Star} from './components/Drawing';
export {ink, paper, mint, yellow} from './palette';

type Kind = 'night' | 'ramen' | 'shiba' | 'dance';
const names: Record<Kind, string> = {night: '夜景.mp4', ramen: '拉面.mp4', shiba: '柴犬.mov', dance: '小克蹦迪.mp4'};

const Thumbnail: React.FC<{x:number;y:number;w:number;h:number;kind:Kind;frame:number;label?:boolean;time?:string;selected?:boolean}> = ({x,y,w,h,kind,frame,label=true,time,selected=false}) => {
  const id=useId().replaceAll(':','');
  return <g>
    {selected&&<Box x={x-5} y={y-5} w={w+10} h={h+10} fill="#fff2c9" stroke={yellow} width={3}/>}
    <defs><clipPath id={id}><rect x={x+1} y={y+1} width={w-2} height={h-2} rx="7"/></clipPath></defs>
    <g clipPath={`url(#${id})`}><g transform={`translate(${x} ${y})`}><SceneArt kind={kind} frame={frame} width={w} height={h} thumbnail/></g></g>
    <Box x={x} y={y} w={w} h={h} fill="none" radius={7} width={2.1}/>
    {time&&<g><rect x={x+w-31} y={y+h-17} width="30" height="15" rx="3" fill={ink} opacity=".68"/><text x={x+w-16} y={y+h-5} fontSize="12" fill="white" textAnchor="middle">{time}s</text></g>}
    {label&&<text x={x+w/2} y={y+h+15} textAnchor="middle" fontSize="14">{names[kind]}</text>}
  </g>;
};

const TransitionIcon: React.FC<{type:number;x:number;y:number;size?:number}> = ({type,x,y,size=30}) => <g transform={`translate(${x} ${y}) scale(${size/30})`} stroke={ink} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
  {type===0?<path d="M 14 -13 C -8 -12 -13 15 5 15 C 19 15 23 -5 9 -7 C -1 -9 -8 6 3 9 C 11 12 15 0 7 -1 C 1 -2 -1 5 5 5 M 14 -13 L 4 -11 L 12 -5" fill={mint}/>:type===1?<g><path d="M -10 -14 L 11 -12 L 12 12 L -10 14 Z" fill="#fffdf4"/><path d="M -5 -8 H 6 M -5 -3 H 5 M -5 3 H 4 M 12 4 L 3 14 L 3 4 Z"/></g>:type===2?<g><rect x="-10" y="-10" width="20" height="20" rx="4" fill="#b4a5d5"/><path d="M -16 -5 H -13 M 13 -5 H 16 M -5 -16 V -13 M 5 13 V 16"/><path d="M -4 -3 H -2 M 4 -3 H 6 M -4 4 H 4"/></g>:type===3?<g><circle r="10" fill="#bce1ef"/><path d="M -4 0 H 4 M 0 -4 V 4 M 7 8 L 17 19" strokeWidth="3"/></g>:type===4?<g><rect x="-11" y="-8" width="17" height="18" rx="3" fill={mint}/><path d="M -17 0 H -1 M -5 -4 L 0 0 L -5 4"/><path d="M 9 -9 H 13 V 11"/></g>:<g><rect x="-12" y="-11" width="12" height="12" fill="#a794d0"/><rect x="1" y="0" width="12" height="12" fill={mint}/></g>}
</g>;

const Library: React.FC<{t:number;frame:number}> = ({t,frame}) => {
  const tab=t<8.55?0:t<11.75?1:2;
  return <g>
    <Box x={24} y={65} w={258} h={315}/>
    {['素材','转场','文字'].map((text,i)=><g key={text}><Box x={36+i*81} y={75} w={74} h={27} fill={tab===i?yellow:paper} radius={7} width={1.9}/><text x={73+i*81} y="95" textAnchor="middle" fontSize="20">{text}</text></g>)}
    {tab===0?<g>
      <Thumbnail x={40} y={111} w={109} h={65} kind="night" frame={frame} time="2.4" selected={t>2&&t<2.8}/>
      <Thumbnail x={158} y={111} w={109} h={65} kind="ramen" frame={frame} time="4.6" selected={t>=2.8&&t<3.25}/>
      <Thumbnail x={40} y={201} w={109} h={65} kind="shiba" frame={frame} time="2.4" selected={t>=3.25&&t<3.65}/>
      <Thumbnail x={158} y={201} w={109} h={65} kind="dance" frame={frame} time="2.8" selected={t>=3.65&&t<4.1}/>
      {[40,158].map(x=><g key={x}><rect x={x} y="292" width="105" height="61" rx="7" fill="none" stroke="#aaa79c" strokeWidth="1.4" strokeDasharray="4 5"/><text x={x+52} y="333" textAnchor="middle" fontSize="40" fill="#aaa79c">+</text><text x={x+52} y="369" textAnchor="middle" fontSize="14" fill="#b3afa5">导入素材</text></g>)}
    </g>:tab===1?<g>{['旋转','翻页','故障','缩放','滑动','溶解'].map((label,i)=>{const x=42+(i%2)*118,y=113+Math.floor(i/2)*83;return <g key={label}><Box x={x} y={y} w={106} h={64} fill={['#ded5ed','#daeee1','#f4dce6','#d5e8f0','#f6e9bb','#e9e1f3'][i]} radius={6} width={2}/><TransitionIcon type={i} x={x+53} y={y+32}/><text x={x+53} y={y+79} textAnchor="middle" fontSize="15">{label}</text></g>;})}</g>:<g>
      <Box x={40} y={112} w={226} h={80} fill="#fff4d4" radius={8}/><text x="53" y="129" fontSize="13" fill="#afa99b">爆款</text><Caption x={153} y={165} angle={0} size={32}>前方高能</Caption>
      <Box x={40} y={206} w={226} h={78} fill="#f9e5eb" radius={8}/><text x="53" y="223" fontSize="13" fill="#afa99b">可爱</text><rect x="98" y="226" width="112" height="42" rx="19" fill="white" stroke="#d089a3" strokeWidth="1.5"/><text x="154" y="255" textAnchor="middle" fontSize="25" fontWeight="bold" fill="#ce82a3">好耶～</text>
      <Box x={40} y={298} w={226} h={68} fill="#302739" radius={8}/><text x="53" y="315" fontSize="13" fill="#d7cadd">霓虹</text><text x="154" y="345" textAnchor="middle" fontSize="27" fill="#e8ccff" stroke="#9971b6" strokeWidth="2" paintOrder="stroke">霓虹 NEON</text>
    </g>}
  </g>;
};

export const adjustment = (t:number) => ({
  flash: tween(t,15.65,16.75,0,.7),
  saturation: t<17.2?1:t<18.5?tween(t,17.2,17.8,1,2.3):tween(t,18.5,19.0,2.3,1.1),
  beat: tween(t,18.8,19.55,0,.6),
});

const Inspector: React.FC<{t:number}> = ({t}) => {
  const a=adjustment(t);
  const values=[a.flash,a.saturation>1.8?1:a.saturation*.33,a.beat,.5];
  const labels=[`${Math.round(a.flash*100)}%`,a.saturation>1.8?'爆表!!':`${Math.round(a.saturation*100)}%`,`${Math.round(a.beat*100)}%`,'1.0x'];
  return <g><Box x={1001} y={65} w={254} h={315}/><text x="1019" y="101" fontSize="24">调整</text><Star x={1080} y={93} size={7}/><path d="M 1018 115 L 1237 114" stroke="#b9b5a9" strokeWidth="1.4"/>
    {['闪光','饱和度','缩放冲击','速度'].map((label,i)=>{const y=154+i*60;return <g key={label}><text x="1017" y={y-17} fontSize="20">{label}</text><text x="1237" y={y-17} textAnchor="end" fontSize="17" fill={i===1&&a.saturation>1.8?'#cd2e50':'#7e7b73'}>{labels[i]}</text><Box x={1020} y={y-4} w={214} h={8} fill="#e9e6dd" radius={4} width={1.5}/><rect x="1021" y={y-3} width={Math.max(0,212*values[i])} height="6" rx="3" fill={i===1&&a.saturation>1.8?'#f12545':mint}/><circle cx={1020+214*values[i]} cy={y} r="10" fill="#fffdf7" stroke={ink} strokeWidth="2"/><circle cx={1020+214*values[i]} cy={y} r="1.4" fill="#77736b"/></g>;})}
  </g>;
};

const Header: React.FC<{t:number}> = ({t}) => {
  const frame=Math.floor(t*30)+7;
  const time=`00:00:${Math.floor(frame/30).toString().padStart(2,'0')}:${(frame%30).toString().padStart(2,'0')}`;
  const exporting=t>=24&&t<26,done=t>=26;
  const percentage=Math.round(track(t,[24,24.15,24.3,24.45,24.6,25.7,25.9],[0,20,51,89,99,99,100]));
  return <g><Box x={26} y={14} w={1228} h={43} fill="#fffdf6" radius={9} width={2.7}/>{['#df6c69','#edc766','#86bf87'].map((color,i)=><circle key={color} cx={44+i*16} cy="34" r="4.2" fill={color} stroke={ink} strokeWidth="1.2"/>)}
    <g transform="translate(95 24)"><path d="M 0 5 L 18 5 L 18 20 L 0 19 Z" fill="#c37664" stroke={ink} strokeWidth="1.5"/><path d="M 0 3 L 17 -2 M 4 -2 L 5 -6 M 10 -3 L 11 -7 M 16 -4 L 17 -8" stroke={ink} strokeWidth="2.2"/></g>
    <text x="127" y="40" fontSize="21">小克剪辑_最终版_打死不改(3).mp4</text>
    <Box x={565} y={18} w={148} h={34} fill={ink} radius={7} width={1.5}/><text x="639" y="42" textAnchor="middle" fontSize="20" fill="#fffdf3">{time}</text><text x="743" y="40" fontSize="15" fill="#8e8c80">· 已自动保存</text>
    <Box x={991} y={21} w={60} h={27} fill="#fffdf4" radius={6} width={1.8}/><text x="1021" y="40" textAnchor="middle" fontSize="17">1080p</text>
    <Box x={1064} y={18} w={175} h={33} fill={done?'#a5d198':exporting?yellow:'#76bfb5'} radius={7} width={2.2}/>
    {exporting&&<rect x="1066" y="20" width={171*percentage/100} height="28" fill="#e6b854" opacity=".45" rx="5"/>}
    <text x="1152" y="42" textAnchor="middle" fontSize={exporting?18:22} fill={exporting?ink:'white'} fontWeight="bold">{done?'完成 ✓':exporting?`渲染中 ${percentage}%`:'↥ 导出'}</text>
  </g>;
};

export const Phone: React.FC<{x:number;y:number;w:number;h:number;frame:number;t:number;social?:boolean;kind?:Kind}> = ({x,y,w,h,frame,t,social=false,kind=sceneKind(t)}) => {
  const id=useId().replaceAll(':','');
  const a=adjustment(t); const beat=1+(t>=19.7&&kind==='dance'?Math.max(0,Math.sin(t*Math.PI*4))*a.beat*.025:0);
  return <g>
    <rect x={x+3} y={y+4} width={w} height={h} rx={w*.13} fill="#000" opacity=".13"/>
    <Box x={x} y={y} w={w} h={h} fill="#252324" radius={w*.13} width={3.4}/>
    <rect x={x+6} y={y+6} width={w-12} height={h-12} rx={w*.11} fill="#1f1c1c" stroke="#57504d" strokeWidth="1.7"/>
    <defs><clipPath id={id}><rect x={x+11} y={y+13} width={w-22} height={h-25} rx={w*.1}/></clipPath><filter id={`${id}blur`}><feGaussianBlur stdDeviation="5"/></filter></defs>
    <g clipPath={`url(#${id})`}>
      {t>=2.48||social?<g style={{filter:t>5.65&&t<7.2?'grayscale(1)':undefined}} filter={t>5.65&&t<7.2?`url(#${id}blur)`:undefined} transform={`translate(${x+11+(w-22)*(1-beat)/2} ${y+13+(h-25)*(1-beat)/2}) scale(${beat})`}><SceneArt kind={kind} frame={frame} width={w-22} height={h-25} flash={a.flash} saturation={a.saturation}/></g>:null}
      {t>5.65&&t<7.2&&<g stroke="#fffdf3" strokeWidth="2" fill="none"><path d={`M ${x+25} ${y+45} h 15 m -15 0 v 16 M ${x+w-25} ${y+45} h -15 m 15 0 v 16 M ${x+25} ${y+h-60} h 15 m -15 0 v -16 M ${x+w-25} ${y+h-60} h -15 m 15 0 v -16`}/><circle cx={x+w/2} cy={y+h*.42} r="15"/><path d={`M ${x+w/2-7} ${y+h*.43} Q ${x+w/2} ${y+h*.37} ${x+w/2+7} ${y+h*.43}`}/><text x={x+w/2} y={y+h*.52} textAnchor="middle" fill="white" stroke={ink} strokeWidth="3" paintOrder="stroke" fontSize="16">对焦中...</text></g>}
      {t>=9.6&&t<9.97&&<g transform={`translate(${x+w/2} ${y+h/2}) rotate(${720*progress(t,9.6,9.97)}) scale(${1-progress(t,9.6,9.97)}) translate(${-(w-22)/2} ${-(h-25)/2})`}><SceneArt kind="night" frame={frame} width={w-22} height={h-25}/></g>}
      {t>=10.95&&t<11.17&&<g><svg x={x+11} y={y+13} width={(w-22)*(1-progress(t,10.95,11.17))} height={h-25} viewBox={`0 0 ${(w-22)*(1-progress(t,10.95,11.17))} ${h-25}`}><SceneArt kind="ramen" frame={frame} width={w-22} height={h-25}/></svg><path d={`M ${x+11+(w-22)*(1-progress(t,10.95,11.17))} ${y+13} l -32 38 l 32 10 Z`} fill="#fff9e5" stroke={ink} strokeWidth="1.3"/></g>}
      {t>=11.62&&t<11.77&&[0,1,2].map(i=><rect key={i} x={x+11} y={y+60+i*57+(frame%3)*8} width={w-22} height={9+i*4} fill={['#61f4ef','#f86e9e','#ebe286'][i]} opacity=".6"/>)}
      {kind==='shiba'&&t>=12.55&&<text x={x+w/2} y={y+h*.65} textAnchor="middle" fontSize={w*.105} fontWeight="bold" fill={yellow} stroke={ink} strokeWidth={w*.025} paintOrder="stroke" strokeLinejoin="round">{'前方高能预警'.slice(0,t<13.35?Math.max(1,Math.floor(progress(t,12.55,13.35)*6)):6)}</text>}
      {social&&<g>
        {t>=28.6&&<text transform={`translate(${x+w/2-18} ${y+h*.4}) rotate(-6)`} textAnchor="middle" fontSize={w*.175} fill={yellow} fontWeight="bold" stroke={ink} strokeWidth="10" paintOrder="stroke" strokeLinejoin="round">拿捏了!</text>}
        <g transform={`translate(${x+w-44} ${y+91})`}>
          <circle r="20" fill="#d67b63" stroke="white" strokeWidth="2.7"/><ellipse cx="-6" cy="-1" rx="2" ry="4" fill={ink}/><ellipse cx="6" cy="-1" rx="2" ry="4" fill={ink}/><circle cy="18" r="7" fill="#ea6483"/><text y="22" textAnchor="middle" fill="white" fontSize="14">+</text>
          <path transform="translate(0 57)" d="M 0 8 C -24 -4 -16 -26 0 -13 C 16 -26 24 -4 0 8 Z" fill="#e58bac" stroke={ink} strokeWidth="2"/><text y="86" textAnchor="middle" fill="white" stroke={ink} strokeWidth="3" paintOrder="stroke" fontSize="17">{kind==='dance'?'10.2w':kind==='night'?'3.8w':'4.9w'}</text>
          <rect x="-13" y="107" width="27" height="19" rx="6" fill="white" stroke={ink} strokeWidth="2"/><path d="M -3 126 L -9 132 V 126" fill="white" stroke={ink} strokeWidth="2"/><text y="122" textAnchor="middle" fontSize="15">···</text><text y="150" textAnchor="middle" fill="white" stroke={ink} strokeWidth="3" paintOrder="stroke" fontSize="16">{kind==='dance'?'2333':'1080'}</text>
          <path d="M -14 191 Q -10 171 5 170 L 5 162 L 19 175 L 5 187 L 5 180 Q -7 180 -14 191 Z" fill="white" stroke={ink} strokeWidth="2"/><text y="211" textAnchor="middle" fill="white" stroke={ink} strokeWidth="3" paintOrder="stroke" fontSize="17">分享</text>
        </g>
        <text x={x+30} y={y+h-59} fill="white" fontSize="18" stroke={ink} strokeWidth="2.5" paintOrder="stroke">@小克 · Opus 5.5</text><text x={x+30} y={y+h-32} fill="white" fontSize="16" stroke={ink} strokeWidth="2" paintOrder="stroke">#AI剪辑 #卡点 #code2video</text>
      </g>}
    </g>
    <rect x={x+w*.415} y={y+18} width={w*.17} height={h*.032} rx="7" fill="#171717"/>
    <path d={`M ${x-2} ${y+h*.24} V ${y+h*.29} M ${x-2} ${y+h*.32} V ${y+h*.38} M ${x+w+2} ${y+h*.3} V ${y+h*.42}`} stroke={ink} strokeWidth="3.5" strokeLinecap="round"/>
    {!social&&<Controls x={x+w/2} y={y+h+15} playing={t>11&&t<23}/>}
  </g>;
};

const Waveform: React.FC<{t:number}> = ({t}) => <g>
  <Box x={100} y={563} w={1044} h={42} fill="#eee7f7" radius={7} width={1.8}/><text x="111" y="578" fontSize="13">♪ bgm_小克.wav</text>
  {Array.from({length:267},(_,i)=>{const h=6+Math.abs(Math.sin(i*1.73)*Math.cos(i*.33))*23+Math.abs(Math.sin(i*.07))*6;return <path key={i} d={`M ${106+i*3.87} ${589-h/2} V ${589+h/2}`} stroke="#a792cf" strokeWidth="1.5"/>;})}
  {t>20.75&&<g>{Array.from({length:41},(_,i)=><path key={i} d={`M ${100+i*28} 618 l 7 14 l 7 -14 Z`} fill={yellow} stroke={ink} strokeWidth="1.25" opacity={clamp((t-20.75)*8-i*.055)}/>)}<Box x={1155} y={563} w={83} h={42} fill={yellow} radius={7}/><text x="1196" y="591" fontSize="23" textAnchor="middle">▼ 卡点</text></g>}
</g>;

const Clips: React.FC<{t:number;frame:number}> = ({t,frame}) => {
  const trimmed=progress(t,7.2,7.65); const ramenWidth=326-166*ease(trimmed);
  const clips=[{kind:'night' as Kind,x:100,w:170,enter:2.32},{kind:'ramen' as Kind,x:272,w:ramenWidth,enter:2.95},{kind:'shiba' as Kind,x:274+ramenWidth,w:170,enter:3.5},{kind:'dance' as Kind,x:446+ramenWidth,w:196,enter:3.9}];
  return <g>{clips.map(({kind,x,w,enter})=><g key={kind} opacity={progress(t,enter,enter+.16)}>
    <svg x={x} y={483} width={w} height="68" viewBox={`0 0 ${w} 68`}><defs><clipPath id={`track-${kind}`}><rect width={w} height="68" rx="6"/></clipPath></defs><g clipPath={`url(#track-${kind})`}>{Array.from({length:Math.ceil(w/62)},(_,i)=><g key={i} transform={`translate(${i*62} 0)`}><SceneArt kind={kind} frame={frame+i*12} width={63} height={68} thumbnail/></g>)}</g></svg>
    <Box x={x} y={483} w={w} h={68} fill="none" radius={6} width={2.4}/><rect x={x+5} y="486" width={kind==='dance'?87:63} height="17" rx="5" fill="#fffdf6" stroke={ink} strokeWidth=".8"/><text x={x+9} y="499" fontSize="12.5">{names[kind]}</text>
    {kind==='ramen'&&t>3.05&&t<7.65&&<g opacity={1-trimmed}><rect x={x+128} y="484" width={130*(1-trimmed)} height="65" fill="#8e8a7d" opacity=".92"/><rect x={x+128} y="484" width={130*(1-trimmed)} height="65" fill="url(#hatching)" stroke="#e19c66" strokeWidth="1.5"/><text x={x+165} y="531" fontSize="44" fill="#c1beb5">≈</text></g>}
    {kind==='ramen'&&t>7.65&&<path d={`M ${x+ramenWidth*.65} 483 V 551`} stroke={ink} strokeWidth="2"/>}
  </g>)}
    {t>8.9&&[270,274+ramenWidth,446+ramenWidth].map((x,i)=><g key={i} opacity={progress(t,8.9+i*.7,9.2+i*.7)}><circle cx={x} cy="516" r="13" fill="#fffdf7" stroke={ink} strokeWidth="2"/><TransitionIcon type={i} x={x} y={516} size={20}/></g>)}
  </g>;
};

const playhead = (t:number) => track(t,[0,4.3,4.9,5.8,6.8,7.6,8.1,10.5,11.0,12.6,13.3,15.5,16.9,18.7,19.6,20.8,21.5,22.4,23,30],[0,0,1.6,4.1,4.1,4.1,3.9,3.9,8.2,8.2,6.7,6.7,9,9,9,9,4.85,7.05,10.5,10.5]);

const Timeline: React.FC<{t:number;frame:number}> = ({t,frame}) => {
  const x=100+playhead(t)*70.5;
  const textOffset=t>=14.5?432:350;
  return <g opacity={progress(t,1.05,1.35)}>
    <Box x={25} y={392} w={1229} h={309} fill="#fbf8f1"/>
    {[444,483,563].map((y,i)=><rect key={y} x="100" y={y} width="1140" height={[30,68,42][i]} fill="#f1ede7"/>)}
    <path d="M 87 433 L 1242 434" stroke={ink} strokeWidth="1.5"/>
    {Array.from({length:65},(_,i)=>{const x=100+i*17.65;return <g key={i}><path d={`M ${x} 433 V ${i%4===0?420:427}`} stroke="#a49e92" strokeWidth={i%4===0?1.5:.8}/>{i%8===0&&<text x={x} y="415" textAnchor="middle" fontSize="14" fill="#8b8379">0:{Math.floor(i/4).toString().padStart(2,'0')}</text>}</g>;})}
    <Box x={37} y={444} w={39} h={29} fill="#faebbd" radius={5} width={2}/><text x="57" y="465" textAnchor="middle" fontSize="20" fontWeight="bold">T</text>
    <Box x={37} y={483} w={39} h={68} fill="#d5eade" radius={5} width={2}/><path d="M 49 509 L 65 518 L 49 529 Z" fill={ink}/>
    <Box x={37} y={563} w={39} h={42} fill="#e6e0f0" radius={5} width={2}/><path d="M 59 573 V 594 Q 45 602 46 592 Q 48 585 57 589 M 59 573 Q 60 580 67 582" fill={ink} stroke={ink} strokeWidth="1.5"/>
    <Clips t={t} frame={frame}/>
    {t>=4.1&&<g opacity={progress(t,4.1,4.4)}><Waveform t={t}/></g>}
    {t>=12.9&&<g opacity={progress(t,12.9,13.1)}><Box x={textOffset} y={447} w={165} h={25} fill={yellow} radius={4} width={1.5}/><text x={textOffset+7} y="465" fontSize="15">T 前方高能预警</text></g>}
    <path d={`M ${x} 417 L ${x} 629`} stroke={red} strokeWidth="2.1"/><path d={`M ${x-8} 401 L ${x+8} 401 L ${x+8} 411 L ${x} 420 L ${x-8} 411 Z`} fill={red} stroke={ink} strokeWidth="1.4"/>
    <path d="M 89 629 H 1238" stroke="#c3bfb5" strokeDasharray="1 7" strokeWidth="1.1"/>
    <path d="M 68 679 H 159" stroke="#aaa69b" strokeWidth="1.4"/><circle cx="107" cy="679" r="4" fill="white" stroke="#aaa69b" strokeWidth="1.5"/><text x="51" y="684" fontSize="18" fill="#aaa69b">−</text><text x="166" y="684" fontSize="18" fill="#aaa69b">+</text><text x="1241" y="680" textAnchor="end" fontSize="12" fill="#b7b0a2">片段 {t<2.4?0:t<3?1:t<3.5?2:t<4?3:4} · 总时长 {t<7.65?'0:12.2':'0:10.5'}</text>
  </g>;
};

const Actor: React.FC<{t:number;frame:number}> = ({t,frame}) => {
  if(t<1.32)return null;
  const x=track(t,[1.32,2,7.6,8,13.1,13.85,14.2,15.4,18.6,20,21,22.2,23.3,25.9,26.4],[147,147,147,151,151,315,315,480,480,445,445,600,870,870,885]);
  const y=track(t,[1.32,1.88,21,21.7,22.3,22.8,23,26,26.3],[192,365,365,493,472,365,365,365,368]);
  const bright=t>=17.55&&t<18.6;
  const happy=(t>7.2&&t<8.5)||(t>25.5)||t>21&&t<23;
  const startled=t<1.88||t>6&&t<7;
  let target:{x:number;y:number}|null=null;
  if(t>=1.95&&t<2.65)target={x:80,y:145};
  if(t>=2.72&&t<3.18)target={x:210,y:145};
  if(t>=3.18&&t<3.62)target={x:85,y:235};
  if(t>=3.62&&t<4)target={x:210,y:235};
  if(t>=4&&t<4.4)target={x:245,y:305};
  if(t>=5.2&&t<7.0)target={x:track(t,[5.2,5.65,6.5,6.7,6.93],[345,345,315,385,350]),y:track(t,[5.2,5.65,6.5,6.7,6.93],[390,405,390,410,390])};
  if(t>=8.55&&t<11.0)target={x:t<9.35?95:t<10?210:95,y:t<10?145:229};
  if(t>=11.88&&t<12.9)target={x:track(t,[11.88,12.15,12.9],[156,415,600]),y:track(t,[11.88,12.15,12.9],[150,365,456])};
  if(t>=15.55&&t<17.05)target={x:1020+214*adjustment(t).flash,y:154};
  if(t>=17.1&&t<19)target={x:1020+214*(adjustment(t).saturation>1.8?1:adjustment(t).saturation*.33),y:214};
  if(t>=18.8&&t<19.55)target={x:1020+214*adjustment(t).beat,y:274};
  if(t>=20.35&&t<21.25)target={x:1230,y:580};
  if(t>=23.3&&t<24.65)target={x:1145,y:35};
  return <g>
    {t<1.88&&[12,38,67].map((dx,i)=><path key={i} d={`M ${x+dx} ${y-148} V ${y-15}`} stroke={ink} strokeWidth="1.4" opacity=".5"/>)}
    {target&&<LongArm x={x+109} y={y+65} tx={target.x} ty={target.y} bright={bright}/>}
    <g transform={`translate(${x} ${y+Math.sin(t*8)*1.3})`} style={{filter:bright?'saturate(5) hue-rotate(-15deg)':undefined}}><Mascot frame={frame} width={142} height={126} pose={t>=24&&t<25.65?'excited':startled?'surprised':happy?'happy':'idle'} sunglasses={bright||t>20.8}/></g>
    {t>1.98&&t<2.65&&<Speech x={x+17} y={y-29} text="开工!" w={78}/>}
    {t>5.3&&t<6.7&&<Speech x={x+210} y={y+12} text="这段在发呆 zzz" w={150}/>}
    {t>=5.2&&t<7.0&&target&&<g transform={`translate(${target.x} ${target.y}) rotate(22)`}><path d="M -5 2 L -5 -27 L 5 -27 L 5 2 Z" fill={yellow} stroke={ink} strokeWidth="1.6"/><path d="M -5 -27 L -6 -38 L 0 -48 L 6 -38 L 5 -27 Z" fill="#fff9e9" stroke={ink} strokeWidth="1.6"/><path d="M 0 -47 V -34" stroke={ink} strokeWidth="1.4"/></g>}
    {t>7.2&&t<8.25&&<Speech x={x+5} y={y-22} text="清爽!" w={78}/>}
    {t>14.0&&t<14.6&&<Caption x={x-20} y={y-27} size={33} color={mint}>撤销!</Caption>}
    {t>17.55&&t<18.65&&<Speech x={x+5} y={y-32} text="……太亮了" w={112}/>}
    {t>21.7&&t<22.5&&<Caption x={x-50} y={y-30} size={32} color={mint}>卡点!</Caption>}
    {t>24.65&&t<25.65&&<Speech x={x+3} y={y-27} text="……" w={70}/>}
    {t>25.7&&t<26.45&&<Caption x={x+25} y={y-35} size={38}>BONK!</Caption>}
    {(t>7.02&&t<7.6||t>21.5&&t<22||t>26.1&&t<26.55)&&<Dust x={x+50} y={y+99} t={progress(t,t<8?7.02:t<23?21.5:26.1,t<8?7.6:t<23?22:26.55)}/>}
  </g>;
};

const DragAssets: React.FC<{t:number;frame:number}> = ({t,frame}) => {
  const events=[{a:2.08,b:2.43,kind:'night' as Kind,sx:45,sy:111,ex:135,ey:483},{a:2.72,b:3.08,kind:'ramen' as Kind,sx:160,sy:111,ex:300,ey:483},{a:3.16,b:3.54,kind:'shiba' as Kind,sx:45,sy:201,ex:600,ey:483},{a:3.63,b:3.98,kind:'dance' as Kind,sx:158,sy:201,ex:810,ey:483}];
  return <g>{events.filter(e=>t>=e.a&&t<=e.b).map(e=>{const p=ease(progress(t,e.a,e.b));return <g key={e.kind} transform={`translate(${e.sx+(e.ex-e.sx)*p} ${e.sy+(e.ey-e.sy)*p-65*Math.sin(p*Math.PI)}) rotate(${-15*Math.sin(p*Math.PI)})`}><Thumbnail x={0} y={0} w={109} h={65} kind={e.kind} frame={frame} label={false}/></g>;})}
    {t>=4&&t<4.36&&<g transform={`translate(${tween(t,4,4.36,236,500)} ${tween(t,4,4.36,270,560)}) rotate(${-t*20})`}><circle r="18" fill="#d6c6ec" stroke={ink} strokeWidth="2"/><path d="M 4 -12 C -18 -10 -18 15 0 13 C 11 12 16 -5 3 -7 C -6 -9 -11 4 -2 6 C 5 8 8 0 2 0" fill="none" stroke={ink} strokeWidth="1.5"/></g>}
    {t>8.7&&t<9.25&&<g transform={`translate(${tween(t,8.7,9.25,95,270)} ${tween(t,8.7,9.25,145,516)})`}><circle r="14" fill="white" stroke={ink} strokeWidth="2"/><TransitionIcon type={0} x={0} y={0} size={26}/></g>}
    {t>12&&t<13&&<g transform={`translate(${tween(t,12,13,195,515)} ${tween(t,12,13,245,430)}) rotate(3)`}><Box x={-83} y={-20} w={166} h={40} fill="#fff4d4" radius={4} width={1.7}/><text x="0" y="8" textAnchor="middle" fontSize="22" fill={yellow} stroke={ink} strokeWidth="5" paintOrder="stroke">前方高能</text></g>}
  </g>;
};

const DeleteClip: React.FC<{t:number}> = ({t}) => {
  if(t<6.95||t>8.25)return null;
  const p=progress(t,6.95,7.4),out=1-progress(t,7.9,8.25);
  return <g opacity={out}>
    <g transform={`translate(402 ${tween(t,7.0,7.32,722,608)}) rotate(${t>7.4?Math.sin((t-7.4)*27)*6*Math.max(0,1-(t-7.4)*2):0})`}><path d="M -29 0 L 29 0 L 25 63 L -25 62 Z" fill="#d9d6cc" stroke={ink} strokeWidth="2.3"/><path d="M -17 9 L -15 48 M 0 9 V 50 M 17 9 L 15 48" stroke="#a29e93" strokeWidth="2.5"/><path d="M -35 1 L 35 -1 L 35 -8 L -35 -7 Z M -11 -7 V -17 H 11 V -7" fill="#dbd8cf" stroke={ink} strokeWidth="2"/></g>
    {t<7.4&&<g transform={`translate(${400+25*p} ${487+115*p-95*Math.sin(p*Math.PI)}) rotate(${p*36}) scale(${1-p*.55})`}><rect width="117" height="63" fill="#8e8a7d" stroke={ink} strokeWidth="2"/><rect width="117" height="63" fill="url(#hatching)"/><text x="48" y="44" fontSize="39" fill="#c1beb5">≈</text></g>}
    {t>=7.4&&t<7.95&&<><Dust x={403} y={649} t={progress(t,7.4,7.95)}/><Caption x={470} y={646} size={29}>哐当!</Caption></>}
  </g>;
};

export const Confetti: React.FC<{t:number}> = ({t}) => <g>{Array.from({length:32},(_,i)=>{const p=progress(t,25.65+i*.006,28.8);const x=1150+Math.sin(i*7.43)*175*p;const y=25+(i%5)*8+430*p*p;return <g key={i} transform={`translate(${x} ${y}) rotate(${i*49+p*520})`} opacity={t<25.65?0:clamp(1-(t-28.8))}>{i%6===0?<Star x={0} y={0} size={5} fill={['#87bea3','#eacc77','#cd93a8'][i%3]}/>:<rect x="-2" y="-4" width="4" height="8" fill={['#d292a5','#85bbb3','#e9c86e','#b0a1c8'][i%4]} stroke={ink} strokeWidth=".8"/>}</g>;})}</g>;

export const Editor: React.FC<{t:number;frame:number}> = ({t,frame}) => <g>
  <defs><pattern id="hatching" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M 0 0 V 9" stroke="#4f4b42" strokeWidth="1"/></pattern></defs>
  <Box x={13} y={5} w={1254} h={707} fill={paper} radius={14} width={2.8}/>
  <Header t={t}/>
  <g opacity={progress(t,.8,1.07)}><Library t={t} frame={frame}/><g opacity={1-progress(t,26.5,26.85)}><Phone x={544} y={65} w={195} h={298} frame={frame} t={t}/></g></g>
  <g opacity={progress(t,1.02,1.4)}><Inspector t={t}/></g>
  <Timeline t={t} frame={frame}/>
  <DeleteClip t={t}/>
  <g opacity={1-progress(t,26.5,26.85)}><Actor t={t} frame={frame}/></g>
  <DragAssets t={t} frame={frame}/>
  {t>=8.5&&t<8.85&&<Caption x={342} y={657} size={28}>咔当!</Caption>}
  {t>9.65&&t<10.65&&<Caption x={403} y={318} color={mint} size={30}>空心入网!</Caption>}
  {t>14&&t<14.65&&<g transform="translate(276 505) rotate(-2)"><Box x={0} y={0} w={163} h={96} fill="#ded9cd" width={2.7}/><Box x={10} y={7} w={145} h={78} fill="#fffdf7" radius={13} width={2.5}/><text x="84" y="59" textAnchor="middle" fontFamily="WenKai" fontSize="40" fontWeight="bold">Ctrl+Z</text></g>}
  {t>=14.65&&t<15.4&&<g transform="translate(757 202) rotate(-12)" opacity={progress(t,14.65,14.8)}><rect x="-6" y="-52" width="155" height="71" rx="7" fill="none" stroke="#72a474" strokeWidth="3.5"/><rect x="0" y="-46" width="143" height="59" rx="4" fill="none" stroke="#72a474" strokeWidth="1.5" strokeDasharray="22 6"/><text x="73" y="0" textAnchor="middle" fontSize="39" fill="#72a474" fontWeight="bold">已修正</text></g>}
  {t>16.95&&t<18.55&&<Caption x={793} y={104} size={43} color="#dc57a5">饱和度:拉满</Caption>}
  {t>25.65&&t<26.35&&<Caption x={931} y={145} size={36} color="#95c681">叮!</Caption>}
  <Confetti t={t}/>
</g>;
