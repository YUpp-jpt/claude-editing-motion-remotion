import React from 'react';
import {ink, paper, yellow} from '../palette';

export const Box: React.FC<{x: number; y: number; w: number; h: number; fill?: string; stroke?: string; width?: number; radius?: number; opacity?: number}> = ({x,y,w,h,fill=paper,stroke=ink,width=2.5,radius=11,opacity=1}) => {
  const r=Math.min(radius,w/3,h/3);
  return <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
    <path d={`M ${x+r} ${y+1} Q ${x+1} ${y-1} ${x} ${y+r} L ${x+1} ${y+h-r} Q ${x-1} ${y+h+1} ${x+r} ${y+h} L ${x+w-r} ${y+h-1} Q ${x+w+1} ${y+h+1} ${x+w} ${y+h-r} L ${x+w-1} ${y+r} Q ${x+w+1} ${y-1} ${x+w-r} ${y} Z`} fill={fill} stroke={stroke} strokeWidth={width}/>
    <path d={`M ${x+5} ${y+12} Q ${x+4} ${y+5} ${x+14} ${y+5} L ${x+w-16} ${y+4} M ${x+w-4} ${y+16} L ${x+w-3} ${y+h-16} M ${x+15} ${y+h-4} L ${x+w-15} ${y+h-3}`} fill="none" stroke={stroke} strokeWidth=".8" opacity=".28"/>
  </g>;
};

export const Star: React.FC<{x: number;y: number;size?: number;fill?: string;opacity?: number}> = ({x,y,size=9,fill=yellow,opacity=1}) => <path d={`M ${x} ${y-size} Q ${x+size*.2} ${y-size*.2} ${x+size} ${y} Q ${x+size*.2} ${y+size*.2} ${x} ${y+size} Q ${x-size*.2} ${y+size*.2} ${x-size} ${y} Q ${x-size*.2} ${y-size*.2} ${x} ${y-size} Z`} fill={fill} stroke={ink} strokeWidth="1.5" opacity={opacity}/>;

export const Caption: React.FC<{x:number;y:number;children:React.ReactNode;color?:string;size?:number;angle?:number}> = ({x,y,children,color=yellow,size=38,angle=-5}) => <g transform={`translate(${x} ${y}) rotate(${angle})`}><text textAnchor="middle" fontSize={size} fontWeight="700" stroke={ink} strokeWidth="8" paintOrder="stroke" strokeLinejoin="round" fill={color}>{children}</text><text y="1" textAnchor="middle" fontSize={size} fontWeight="700" fill={color}>{children}</text></g>;

export const Speech: React.FC<{x:number;y:number;w?:number;text:string}> = ({x,y,w=94,text}) => <g transform={`translate(${x} ${y}) rotate(-3)`}><path d={`M 10 0 Q 0 0 0 10 L 0 33 Q 0 41 10 41 L 39 41 L 49 51 L 53 41 L ${w-10} 41 Q ${w} 41 ${w} 31 L ${w} 9 Q ${w} 0 ${w-10} 0 Z`} fill="#fffdf7" stroke={ink} strokeWidth="2.2"/><text x={w/2} y="28" textAnchor="middle" fontSize="23">{text}</text></g>;

export const Controls: React.FC<{x:number;y:number;playing?:boolean}> = ({x,y,playing=false}) => <g transform={`translate(${x} ${y})`} stroke={ink} strokeWidth="1.5" opacity=".7"><path d="M -33 -5 L -33 5 M -25 -5 L -32 0 L -25 5 Z" fill={ink}/><circle r="10" fill="none"/>{playing?<path d="M -3 -5 V 5 M 3 -5 V 5" strokeWidth="3"/>:<path d="M -3 -5 L 5 0 L -3 5 Z" fill={ink}/>}<path d="M 33 -5 L 33 5 M 25 -5 L 32 0 L 25 5 Z" fill={ink}/></g>;

export const LongArm: React.FC<{x:number;y:number;tx:number;ty:number;bright?:boolean;left?:boolean}> = ({x,y,tx,ty,bright=false,left=false}) => <g fill="none" strokeLinecap="round"><path d={`M ${x} ${y} Q ${(x+tx)/2} ${(y+ty)/2+35} ${tx} ${ty}`} stroke={ink} strokeWidth="12"/><path d={`M ${x} ${y} Q ${(x+tx)/2} ${(y+ty)/2+35} ${tx} ${ty}`} stroke={bright?'#fa263a':'#c87967'} strokeWidth="8"/><path d={`M ${x} ${y} Q ${(x+tx)/2} ${(y+ty)/2+34} ${tx} ${ty}`} stroke="#e29781" strokeWidth="1.1"/><circle cx={tx} cy={ty} r="7" fill={bright?'#f53545':'#c87967'} stroke={ink} strokeWidth="2"/>{left&&<circle cx={tx-1} cy={ty-1} r="2" fill="#e8ad98"/>}</g>;

export const Dust: React.FC<{x:number;y:number;t:number}> = ({x,y,t}) => <g transform={`translate(${x} ${y})`} opacity={Math.max(0,1-t)}>{[[-22,3,14],[-8,0,17],[13,4,13],[32,1,10]].map(([dx,dy,r],i)=><path key={i} d={`M ${dx-r} ${dy+6} C ${dx-r-3} ${dy-r} ${dx} ${dy-r-7} ${dx+4} ${dy-r/2} C ${dx+r+13} ${dy-r/2} ${dx+r+10} ${dy+13} ${dx+r} ${dy+12} Z`} fill="#fffdf3" stroke={ink} strokeWidth="1.4" transform={`translate(${(i-1.5)*t*18} ${-t*8})`}/>)}</g>;
