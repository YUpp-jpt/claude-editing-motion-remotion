import React, {useId} from 'react';

/** All illustration, texture, and motion is original vector artwork. */
export type SceneKind = 'night' | 'ramen' | 'shiba' | 'dance';

export type SceneArtProps = {
  kind: SceneKind;
  frame: number;
  width?: number;
  height?: number;
  /** Compose a small horizontal asset tile without losing scene landmarks. */
  thumbnail?: boolean;
  /** White sparkle overlay, from 0 to 1. */
  flash?: number;
  /** Saturation multiplier: 1 is the original palette. */
  saturation?: number;
};

export type MascotProps = {
  frame: number;
  pose?: 'idle' | 'happy' | 'surprised' | 'wink' | 'excited';
  sunglasses?: boolean;
  width?: number;
  height?: number;
};

const INK = '#312d2b';
const CORAL = '#cc705b';
const outline = {stroke: INK, strokeWidth: 2.25, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

const Spark = ({x, y, size = 5, color = '#fffce9', opacity = 1}: {x: number; y: number; size?: number; color?: string; opacity?: number}) => (
  <path d={`M ${x} ${y - size} Q ${x + size * 0.25} ${y - size * 0.18} ${x + size} ${y} Q ${x + size * 0.25} ${y + size * 0.18} ${x} ${y + size} Q ${x - size * 0.25} ${y + size * 0.18} ${x - size} ${y} Q ${x - size * 0.25} ${y - size * 0.18} ${x} ${y - size} Z`} fill={color} stroke={INK} strokeWidth={size > 5 ? 1.2 : 0.55} opacity={opacity} />
);

const Heart = ({x, y, size = 10, rotation = 0}: {x: number; y: number; size?: number; rotation?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${size / 12})`}>
    <path d="M 0 10 C -3 7 -13 -1 -12 -8 C -11 -16 -3 -15 0 -9 C 4 -15 12 -15 13 -7 C 14 0 5 7 0 10 Z" fill="#ef9eb9" {...outline} />
    <path d="M -8 -8 Q -7 -12 -4 -10" fill="none" stroke="#fff0ed" strokeWidth="2" strokeLinecap="round" />
  </g>
);

const StarEye = ({x, y}: {x: number; y: number}) => {
  const points = Array.from({length: 10}, (_, i) => {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const radius = i % 2 === 0 ? 9 : 4.2;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(' ');
  return <polygon points={points} fill="#f6d36c" stroke={INK} strokeWidth="1.7" strokeLinejoin="round" />;
};

export const Mascot: React.FC<MascotProps> = ({frame, pose = 'idle', sunglasses = false, width = 180, height = 160}) => {
  const t = frame / 30;
  const bob = pose === 'idle' ? Math.sin(t * 2.6) * 0.5 : Math.sin(t * 7.2) * 2.1;
  const tilt = pose === 'happy' ? Math.sin(t * 5.4) * 5 : pose === 'wink' ? -3 : 0;
  const blink = frame % 126 >= 122;
  const celebrating = pose === 'happy' || pose === 'excited';
  const leftHand = celebrating ? [21, 29 + Math.sin(t * 5.4) * 4] : pose === 'surprised' ? [17, 54] : [26, 91];
  const rightHand = celebrating || pose === 'wink' ? [166, 32 - Math.sin(t * 5.4) * 4] : pose === 'surprised' ? [162, 54] : [158, 91];
  const arms = [
    `M 41 89 Q 25 82 ${leftHand[0]} ${leftHand[1]}`,
    `M 143 89 Q 159 78 ${rightHand[0]} ${rightHand[1]}`,
  ];
  return (
    <svg width={width} height={height} viewBox="0 0 180 160" preserveAspectRatio="xMidYMid meet" aria-label="小克，珊瑚色方块角色">
      <g transform={`translate(0 ${bob}) rotate(${tilt} 92 121)`}>
        <path d="M 51 119 L 51 148 Q 55 150 61 148 L 62 120 Z" fill={CORAL} {...outline} strokeWidth="2.8" />
        <path d="M 68 120 L 68 149 Q 73 151 78 149 L 79 121 Z" fill={CORAL} {...outline} strokeWidth="2.8" />
        <path d="M 112 120 L 114 149 Q 119 151 123 149 L 122 119 Z" fill={CORAL} {...outline} strokeWidth="2.8" />
        <path d="M 129 120 L 132 148 Q 136 150 141 147 L 138 119 Z" fill={CORAL} {...outline} strokeWidth="2.8" />
        <path d="M 57 124 L 56 146 M 74 124 L 74 147 M 118 124 L 120 147 M 135 124 L 138 146" stroke="#ec9b80" strokeWidth="1.1" opacity=".8" />
        {arms.map((d, index) => <g key={index}><path d={d} fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" /><path d={d} fill="none" stroke={CORAL} strokeWidth="8.5" strokeLinecap="round" /></g>)}
        <circle cx={leftHand[0]} cy={leftHand[1]} r="7.8" fill={CORAL} {...outline} />
        <circle cx={rightHand[0]} cy={rightHand[1]} r="7.8" fill={CORAL} {...outline} />
        <path d="M 41 49 Q 91 47 143 49 Q 146 80 144 123 Q 94 125 40 122 Q 39 82 41 49 Z" fill={CORAL} {...outline} strokeWidth="3.2" />
        <path d="M 46 54 Q 80 52 110 53" fill="none" stroke="#f4b295" strokeWidth="2.4" strokeLinecap="round" opacity=".65" />
        <path d="M 44 116 Q 87 120 140 120" fill="none" stroke="#b45b4c" strokeWidth="1.3" opacity=".6" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <path key={i} d={`M ${46 + i * 5} ${114 - i * 0.6} l 11 -12`} stroke="#b85f51" strokeWidth=".7" opacity=".45" />)}
        {pose === 'excited' ? (
          <><StarEye x={78} y={82} /><StarEye x={110} y={82} /></>
        ) : pose === 'happy' || blink ? (
          <><path d="M 74 84 Q 78 72 83 84" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" /><path d="M 105 84 Q 110 72 114 84" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" /></>
        ) : (
          <><path d="M 77 77 Q 73 77 74 87 Q 74 91 78 90 Q 81 89 81 81 Q 81 77 77 77 Z" fill="#282c27" /><circle cx="77" cy="80" r="1.4" fill="#fff7d6" />{pose === 'wink' ? <path d="M 106 84 Q 111 74 116 84" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" /> : <><path d="M 110 77 Q 106 77 107 87 Q 107 91 111 90 Q 114 89 114 81 Q 114 77 110 77 Z" fill="#282c27" /><circle cx="110" cy="80" r="1.4" fill="#fff7d6" /></>}</>
        )}
        {pose === 'surprised' && <ellipse cx="94" cy="100" rx="4" ry="5" fill={INK} />}
        {(celebrating || pose === 'wink') && <><ellipse cx="60" cy="96" rx="7" ry="3.5" fill="#e48c90" opacity=".75" /><ellipse cx="128" cy="96" rx="7" ry="3.5" fill="#e48c90" opacity=".75" /></>}
        {sunglasses && <g transform="rotate(-4 94 49)"><path d="M 61 43 L 121 42 L 116 55 Q 104 59 98 51 L 90 51 Q 82 60 67 55 Z" fill="#292726" stroke={INK} strokeWidth="1.7" /><path d="M 70 46 l -4 5 M 78 45 l -5 6 M 108 45 l -5 6" fill="none" stroke="#f8f0dc" strokeWidth="2" strokeLinecap="round" /></g>}
      </g>
    </svg>
  );
};

const Night = ({frame, id}: {frame: number; id: string}) => {
  const t = frame / 30;
  const buildings = [
    [0, 208, 28, 163, '#3d406d'], [24, 174, 30, 187, '#444571'], [51, 197, 32, 165, '#393b64'],
    [79, 208, 27, 152, '#373d64'], [104, 183, 33, 178, '#464774'], [133, 170, 27, 190, '#3d406a'],
    [157, 180, 35, 181, '#454974'], [189, 178, 30, 183, '#3e4169'], [217, 205, 30, 156, '#34395f'],
    [-5, 246, 40, 116, '#37395f'], [31, 236, 33, 124, '#32375d'], [66, 256, 34, 106, '#383a65'],
    [94, 237, 32, 125, '#30375e'], [124, 223, 31, 140, '#343b63'], [152, 251, 31, 111, '#333860'],
    [178, 240, 34, 122, '#30385e'], [209, 256, 39, 106, '#32375c'],
  ] as const;
  const stars = [
    [22, 16], [65, 27], [206, 31], [41, 63], [100, 60], [218, 91], [24, 105], [67, 112],
    [82, 89], [137, 109], [46, 139], [15, 162], [104, 149], [195, 137], [210, 173], [156, 163],
    [71, 167], [177, 27], [143, 35], [34, 89], [219, 62], [118, 130], [157, 128], [91, 15],
  ];
  return <>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2=".1" y2="1"><stop stopColor="#353a66" /><stop offset=".64" stopColor="#515385" /><stop offset="1" stopColor="#6a6491" /></linearGradient>
      <radialGradient id={`${id}-moon-glow`}><stop stopColor="#f6da89" stopOpacity=".35" /><stop offset="1" stopColor="#f6da89" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="240" height="360" fill={`url(#${id}-sky)`} />
    <ellipse cx="173" cy="86" rx="64" ry="66" fill={`url(#${id}-moon-glow)`} />
    {stars.map(([x, y], i) => <g key={i} opacity={.48 + .4 * (Math.sin(t * 1.9 + i * 2.73) * .5 + .5)}><circle cx={x} cy={y} r={i % 6 === 0 ? 1.2 : .8} fill="#f6f3e9" />{i % 7 === 2 && <path d={`M ${x - 2} ${y} h 4 M ${x} ${y - 2} v 4`} stroke="#f6f3e9" strokeWidth=".65" />}</g>)}
    <path d="M 175 55 C 162 62 150 76 154 92 C 157 110 180 119 198 104 C 177 108 164 90 175 55 Z" fill="#f3d873" {...outline} strokeWidth="2.7" />
    <path d="M 173 61 Q 160 77 160 87" fill="none" stroke="#fff0ac" strokeWidth="1.9" opacity=".65" />
    <circle cx="166" cy="94" r="1.1" fill="#c4a659" /><circle cx="179" cy="103" r="1.9" fill="#d2b462" opacity=".6" />
    <Spark x={55} y={135} size={4} opacity={.8} /><Spark x={189} y={166} size={6} opacity={.75 + .2 * Math.sin(t * 2)} />
    {buildings.map(([x, y, w, h, fill], i) => <g key={i}>
      {i < 8 && i % 2 === 1 && <path d={`M ${x + w * .39} ${y} v -9 h ${w * .24} v 9`} fill={fill} stroke="#292e50" strokeWidth="1.7" />}
      <path d={`M ${x} ${y + 1} L ${x + w} ${y} L ${x + w - .8} ${y + h} L ${x + .6} ${y + h} Z`} fill={fill} stroke="#292d50" strokeWidth="1.8" />
      {Array.from({length: Math.floor(h / 16) - 1}, (_, row) => Array.from({length: Math.max(1, Math.floor(w / 9) - 1)}, (_, col) => {
        const lit = (i * 17 + row * 5 + col * 3) % 9 < 5;
        return <rect key={`${row}-${col}`} x={x + 5 + col * 9} y={y + 10 + row * 16} width="4.7" height="7" rx=".3" fill={lit ? ((row + col + i) % 4 === 0 ? '#f7dc79' : '#d8c665') : '#696589'} opacity={lit ? .76 + .16 * Math.sin(t * .4 + i + row) : .38} />;
      }))}
      <path d={`M ${x + 2.8} ${y + 2} L ${x + 2.6} ${y + h}`} stroke="#8380a0" strokeWidth=".6" opacity=".33" />
    </g>)}
    <rect y="355" width="240" height="5" fill="#252d53" />
  </>;
};

const Ramen = ({frame, id}: {frame: number; id: string}) => {
  const t = frame / 30;
  const noodleLift = Math.sin(t * 2.2) * 4;
  return <>
    <defs><linearGradient id={`${id}-ramen-bg`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f2dd9b" /><stop offset=".55" stopColor="#f6e4ac" /><stop offset="1" stopColor="#ead08d" /></linearGradient></defs>
    <rect width="240" height="360" fill={`url(#${id}-ramen-bg)`} />
    {[12, 46, 85, 128, 178, 218].map((x, i) => <circle key={i} cx={x} cy={101 + (i * 43) % 126} r="1.5" fill="#ffefbd" opacity=".68" />)}
    <path d="M 0 2 L 60 2 L 60 62 L 0 62 Z M 61 2 L 118 2 L 118 63 L 61 62 Z M 120 2 L 177 2 L 178 62 L 120 63 Z M 179 2 L 240 2 L 240 62 L 179 62 Z" fill="#596391" stroke={INK} strokeWidth="2.3" />
    <path d="M 59 3 Q 54 21 58 62 M 120 3 Q 116 28 119 62 M 178 3 Q 177 30 181 62" fill="none" stroke="#2f344b" strokeWidth="1.2" />
    <circle cx="30" cy="39" r="8" fill="#faf8ec" /><circle cx="207" cy="39" r="8" fill="#faf8ec" />
    <text x="89" y="50" textAnchor="middle" fill="#fffaf0" fontFamily="WenKai, serif" fontSize="31" fontWeight="700">拉</text>
    <text x="149" y="50" textAnchor="middle" fill="#fffaf0" fontFamily="WenKai, serif" fontSize="31" fontWeight="700">面</text>
    <path d="M 0 255 Q 121 253 240 256 L 240 360 L 0 360 Z" fill="#e9b97e" stroke={INK} strokeWidth="2.3" />
    {[271, 292, 315, 343].map((y, i) => <path key={i} d={`M ${i % 2 ? 6 : 0} ${y} Q 75 ${y - 2} 164 ${y} T 240 ${y + 1}`} fill="none" stroke="#c89865" strokeWidth="1" opacity=".56" />)}
    <ellipse cx="121" cy="292" rx="73" ry="9" fill="#b78f63" opacity=".22" />
    <g transform={`translate(0 ${Math.sin(t * 1.8) * .65})`}>
      <path d="M 31 210 Q 38 269 69 283 Q 91 296 152 291 Q 192 285 209 212 Z" fill="#fffaf0" {...outline} strokeWidth="3.2" />
      <path d="M 85 289 L 85 297 Q 121 300 155 297 L 155 288" fill="#fffaf0" {...outline} strokeWidth="2.4" />
      <path d="M 35 222 Q 122 252 205 223 L 198 243 Q 122 273 43 242 Z" fill="#d96d78" stroke="#97464b" strokeWidth="1.5" />
      <path d="M 40 228 Q 121 257 201 229 M 44 244 Q 120 270 197 245" fill="none" stroke="#fff5eb" strokeWidth="2.6" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
        const x = 45 + i * 16.5;
        const y = 236 + Math.sin((i / 8) * Math.PI) * 13;
        return <path key={i} d={`M ${x} ${y + 6} v -8 h 11 v 8 h -7 v -4 h 3`} fill="none" stroke="#fff8ed" strokeWidth="2" />;
      })}
      <ellipse cx="120" cy="209" rx="93" ry="27" fill="#fff8e8" {...outline} strokeWidth="3.1" />
      <ellipse cx="120" cy="210" rx="85" ry="21" fill="#897847" stroke={INK} strokeWidth="1.7" />
      <path d="M 46 203 Q 77 187 113 200 T 190 207 M 44 214 Q 76 204 111 216 T 190 213 M 62 221 Q 85 208 119 224 T 169 222" fill="none" stroke="#e6ca86" strokeWidth="3.3" strokeLinecap="round" />
      <path d="M 137 177 L 168 181 L 164 211 L 132 208 Z" fill="#2f4b39" stroke={INK} strokeWidth="2" />
      <path d="M 143 178 l -5 29 M 152 179 l -5 29 M 161 181 l -5 28 M 139 188 l 27 3 M 137 198 l 26 3" stroke="#5d7252" strokeWidth="1.3" />
      <ellipse cx="83" cy="205" rx="21" ry="12" transform="rotate(-16 83 205)" fill="#efacb4" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="84" cy="205" rx="15" ry="8" transform="rotate(-16 84 205)" fill="#ba666d" stroke="#ffe0d9" strokeWidth="2" />
      <path d="M 56 217 Q 53 207 61 204 Q 73 200 83 211 Q 90 220 76 225 Q 62 229 56 217 Z" fill="#fff8d8" stroke={INK} strokeWidth="1.7" />
      <ellipse cx="70" cy="215" rx="9" ry="6.8" fill="#efbd54" stroke="#bc9540" strokeWidth="1.1" />
      <path d="M 157 222 Q 149 215 154 208 Q 164 202 174 207 Q 188 212 179 222 Q 168 230 157 222 Z" fill="#fff9ee" stroke={INK} strokeWidth="1.7" />
      <path d="M 162 219 C 151 211 170 207 173 215 C 174 222 161 222 162 215 Q 163 212 169 215" fill="none" stroke="#dc91a1" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 89 218 l 14 -4 l 9 8 l -15 4 Z M 112 218 l 14 -6 l 6 9 l -12 4 Z M 178 204 l 9 -7 l 8 6 l -9 6 Z M 49 202 l 14 -6 l 7 5 l -14 5 Z" fill="#819560" stroke="#4e6342" strokeWidth="1.1" />
      <g transform={`translate(0 ${noodleLift})`}>
        <path d="M 123 147 C 121 172 113 193 110 209 M 128 148 C 127 171 122 188 120 214 M 132 148 C 131 173 132 195 139 211 M 127 160 C 124 185 125 204 130 214 M 122 160 C 120 181 113 193 115 213 M 131 161 C 131 183 138 198 144 211" fill="none" stroke="#765f35" strokeWidth="3.7" strokeLinecap="round" />
        <path d="M 123 147 C 121 172 113 193 110 209 M 128 148 C 127 171 122 188 120 214 M 132 148 C 131 173 132 195 139 211 M 127 160 C 124 185 125 204 130 214 M 122 160 C 120 181 113 193 115 213 M 131 161 C 131 183 138 198 144 211" fill="none" stroke="#f9e8b8" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M 128 150 L 246 69 L 248 73 L 133 153 Z M 131 155 L 247 82 L 249 86 L 135 158 Z" fill="#c39353" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </g>
    {[0, 1, 2].map(i => <path key={i} d={`M ${91 + i * 24 + Math.sin(t * 1.6 + i) * 3} ${153 - i * 7} q -11 -8 0 -17 q 10 -9 2 -17`} fill="none" stroke="#fff5d8" strokeWidth="3.5" strokeLinecap="round" opacity={.38 + .22 * Math.sin(t * 2 + i)} />)}
  </>;
};

const Shiba = ({frame, id}: {frame: number; id: string}) => {
  const t = frame / 30;
  const wag = Math.sin(t * 6.3) * 6;
  const bob = Math.sin(t * 3.3) * 1.5;
  const blink = frame % 115 > 110;
  return <>
    <defs><linearGradient id={`${id}-mint`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bde5d8" /><stop offset="1" stopColor="#a3d7ca" /></linearGradient><pattern id={`${id}-mint-dots`} width="34" height="30" patternUnits="userSpaceOnUse"><circle cx="11" cy="13" r="2.7" fill="#e3f3df" opacity=".48" /><circle cx="29" cy="28" r="1.5" fill="#d9efdc" opacity=".3" /></pattern></defs>
    <rect width="240" height="360" fill={`url(#${id}-mint)`} /><rect width="240" height="360" fill={`url(#${id}-mint-dots)`} />
    <Heart x={48 + Math.sin(t * 1.8) * 2} y={96 + Math.sin(t * 2.2) * 3} size={13} rotation={-10} />
    <Heart x={190 + Math.sin(t * 1.5) * 2} y={148 + Math.sin(t * 2 + 1) * 3} size={12} rotation={13} />
    <g transform={`translate(0 ${bob})`}>
      <path d="M 193 267 Q 232 278 218 305 Q 207 321 185 301 Q 204 305 208 295 Q 210 285 191 284 Z" fill="#db9859" {...outline} strokeWidth="2.6" transform={`rotate(${wag} 188 285)`} />
      <path d="M 48 360 L 50 284 Q 50 254 77 247 Q 113 237 156 247 Q 195 256 195 289 L 196 360 Z" fill="#dc9555" {...outline} strokeWidth="3.1" />
      <path d="M 88 260 Q 100 244 120 250 Q 144 243 156 263 Q 164 279 161 311 Q 157 343 126 349 Q 96 349 85 323 Q 77 295 88 260 Z" fill="#fffaf4" />
      <path d="M 49 276 Q 72 267 72 298 L 72 360 M 174 278 Q 162 297 170 359" fill="none" stroke="#b77b46" strokeWidth="1.4" />
      <path d="M 51 150 L 66 105 Q 86 117 100 132 L 84 164 Z M 149 133 Q 168 113 190 108 L 185 155 L 168 164 Z" fill="#d98f50" {...outline} strokeWidth="2.8" />
      <path d="M 60 143 L 69 116 L 91 135 Z M 160 136 L 181 118 L 178 146 Z" fill="#e9baa0" stroke="#b57f60" strokeWidth="1.2" />
      <path d="M 42 196 C 42 164 65 141 97 137 C 143 130 177 143 191 173 C 205 204 195 235 173 249 C 148 264 82 264 60 246 C 47 235 40 216 42 196 Z" fill="#de9859" {...outline} strokeWidth="3" />
      <path d="M 45 215 Q 59 201 77 213 Q 93 218 105 212 Q 122 202 138 211 Q 151 221 167 214 Q 184 207 196 219 C 192 249 169 261 121 260 C 75 261 50 247 45 215 Z" fill="#fff9f2" />
      <ellipse cx="89" cy="176" rx="8" ry="5.8" fill="#fff8ed" transform="rotate(-13 89 176)" /><ellipse cx="149" cy="176" rx="8" ry="5.8" fill="#fff8ed" transform="rotate(11 149 176)" />
      {blink ? <><path d="M 84 202 Q 89 195 95 202 M 143 202 Q 149 195 154 202" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" /></> : <><ellipse cx="90" cy="201" rx="5.2" ry="7" fill={INK} /><ellipse cx="149" cy="201" rx="5.2" ry="7" fill={INK} /><circle cx="88.7" cy="198.5" r="1.65" fill="#fffdf1" /><circle cx="147.7" cy="198.5" r="1.65" fill="#fffdf1" /></>}
      <ellipse cx="70" cy="230" rx="9" ry="5.4" fill="#edaab5" /><ellipse cx="171" cy="230" rx="9" ry="5.4" fill="#edaab5" />
      <path d="M 111 222 Q 120 217 128 223 Q 127 230 121 231 Q 114 230 111 222 Z" fill={INK} /><ellipse cx="118" cy="222" rx="3.6" ry="1.2" fill="#fff9ed" />
      <path d="M 121 230 v 7 Q 114 245 109 236 M 121 237 Q 128 245 134 236" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 181 274 C 192 265 204 252 214 250 Q 235 260 220 274 Q 207 287 191 287 Z" fill="#dc9555" {...outline} strokeWidth="2.5" transform={`rotate(${-wag * .4} 184 277)`} />
      <ellipse cx="217" cy="265" rx="6" ry="5" fill="#fff8e9" transform={`rotate(${-wag * .4} 184 277)`} />
      <path d="M 57 177 Q 66 156 89 150 M 145 143 Q 166 148 176 159" stroke="#efb577" strokeWidth="1.6" opacity=".6" fill="none" />
    </g>
  </>;
};

const Dance = ({frame, id, flash}: {frame: number; id: string; flash: number}) => {
  const t = frame / 30;
  const swing = Math.sin(t * 1.8) * 2.7;
  const rows = [228, 238, 253, 274, 301, 333, 365];
  const horizon = 220;
  const colors = ['#343c72', '#57609b', '#434b86', '#8178b0', '#61a7a7', '#c9bb72', '#ad80a8'];
  const pointX = (col: number, y: number) => 120 + (-348 + col * 52) * ((y - horizon) / (365 - horizon));
  return <>
    <defs>
      <linearGradient id={`${id}-dance-wall`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6566a9" /><stop offset=".56" stopColor="#a77caf" /><stop offset="1" stopColor="#c188b3" /></linearGradient>
      <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff8d9" stopOpacity=".23" /><stop offset="1" stopColor="#fbe8f7" stopOpacity=".02" /></linearGradient>
      <radialGradient id={`${id}-dance-glow`}><stop stopColor="#e5deff" stopOpacity=".7" /><stop offset="1" stopColor="#e5deff" stopOpacity="0" /></radialGradient>
      <clipPath id={`${id}-disco`}><circle cx="120" cy="61" r="24" /></clipPath>
      <clipPath id={`${id}-floor`}><rect x="0" y="224" width="240" height="136" /></clipPath>
    </defs>
    <rect width="240" height="360" fill={`url(#${id}-dance-wall)`} />
    <path d={`M ${120 + swing} 70 L ${16 + Math.sin(t * 2) * 12} 225 L 111 225 Z M ${120 + swing} 70 L 143 226 L ${229 + Math.sin(t * 2 + 1) * 12} 226 Z`} fill={`url(#${id}-beam)`} />
    {[0, 1, 2, 3, 4, 5].map(i => <ellipse key={i} cx={24 + (i * 47) % 221 + Math.sin(t * 1.2 + i) * 14} cy={67 + (i * 47) % 146} rx={19 + (i % 2) * 6} ry={18 + (i % 3) * 3} fill={`url(#${id}-dance-glow)`} opacity={.19 + .12 * Math.sin(t * 2.2 + i)} />)}
    <path d="M 0 224 L 240 224 L 240 360 L 0 360 Z" fill="#343764" stroke="#38314e" strokeWidth="2.3" />
    <g clipPath={`url(#${id}-floor)`}>
      {rows.slice(0, -1).map((y, row) => Array.from({length: 14}, (_, col) => {
        const nextY = rows[row + 1];
        const index = (col + row + Math.floor(frame / 8)) % 15;
        const fill = index === 3 ? colors[4] : index === 7 ? colors[5] : index === 12 ? colors[6] : colors[(row + col) % 4];
        return <path key={`${row}-${col}`} d={`M ${pointX(col, y)} ${y} L ${pointX(col + 1, y)} ${y} L ${pointX(col + 1, nextY)} ${nextY} L ${pointX(col, nextY)} ${nextY} Z`} fill={fill} stroke="#2e3862" strokeWidth=".5" opacity=".92" />;
      }))}
      {[0, 1, 2, 3, 4].map(i => <ellipse key={i} cx={12 + (i * 53) % 229 + Math.sin(t * 2 + i) * 15} cy={275 + (i % 3) * 27} rx="27" ry="15" fill={`url(#${id}-dance-glow)`} opacity=".37" />)}
    </g>
    <g transform={`translate(${swing} 0)`}>
      <path d="M 120 0 L 120 36" fill="none" stroke={INK} strokeWidth="2" />
      <g clipPath={`url(#${id}-disco)`}>
        <circle cx="120" cy="61" r="24" fill="#efeef0" />
        {Array.from({length: 5}, (_, row) => Array.from({length: 6}, (_, col) => {
          const discoColors = ['#d5d1e8', '#f9f7eb', '#d7bc73', '#aeb6dd', '#f4f3ee'];
          return <rect key={`${row}-${col}`} x={94 + col * 9 + ((row % 2) * 4)} y={37 + row * 10} width="9" height="10" fill={discoColors[(col * 2 + row + Math.floor(frame / 15)) % discoColors.length]} stroke="#9e9bb8" strokeWidth=".5" />;
        }))}
        <path d="M 104 36 Q 88 61 106 86 M 133 36 Q 151 61 133 86 M 119 36 Q 113 62 121 86 M 97 50 Q 119 56 143 50 M 97 70 Q 120 75 143 70" fill="none" stroke="#8b86a3" strokeWidth=".8" opacity=".65" />
      </g>
      <circle cx="120" cy="61" r="24" fill="none" {...outline} strokeWidth="2.6" />
      <path d="M 104 43 Q 113 35 126 38" fill="none" stroke="#fffefa" strokeWidth="2.4" strokeLinecap="round" />
      <Spark x={106} y={53} size={7} color="#fffdf5" />
    </g>
    <ellipse cx="124" cy="280" rx="47" ry="7" fill="#272b51" opacity=".4" />
    <g transform={`translate(${41 + Math.sin(t * 4.5) * 4} ${137 + Math.cos(t * 6) * 1.2}) scale(.9)`}>
      <Mascot frame={frame} pose="happy" width={180} height={160} />
    </g>
    <Spark x={75} y={110} size={5} opacity={.65 + .3 * Math.sin(t * 4)} /><Spark x={162} y={115} size={5} opacity={.65 + .3 * Math.sin(t * 4 + 1.4)} />
    {flash > 0 && <g opacity={Math.min(1, Math.max(0, flash))}><Spark x={174} y={156} size={6} color="#f7df78" /><Spark x={70} y={258} size={5} color="#f7df78" /><Spark x={205} y={325} size={8} /><Spark x={34} y={293} size={5} /><Spark x={88} y={89} size={7} color="#f7df78" /></g>}
  </>;
};

const thumbnailViewBox: Record<SceneKind, string> = {
  night: '0 0 240 360',
  ramen: '0 112 240 208',
  shiba: '0 88 240 222',
  dance: '0 0 240 330',
};

export const SceneArt: React.FC<SceneArtProps> = ({kind, frame, width = 240, height = 360, flash = 0, saturation = 1, thumbnail = false}) => {
  const id = `art-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const sat = Math.max(0, Math.min(2, saturation));
  return (
    <svg width={width} height={height} viewBox={thumbnail ? thumbnailViewBox[kind] : '0 0 240 360'} preserveAspectRatio={thumbnail ? 'none' : 'xMidYMid slice'} style={{overflow: 'hidden', filter: `saturate(${sat})`}} aria-label={`${kind} 手绘动画`}>
      {kind === 'night' && <Night frame={frame} id={id} />}
      {kind === 'ramen' && <Ramen frame={frame} id={id} />}
      {kind === 'shiba' && <Shiba frame={frame} id={id} />}
      {kind === 'dance' && <Dance frame={frame} id={id} flash={flash} />}
      <defs><pattern id={`${id}-paper`} width="31" height="29" patternUnits="userSpaceOnUse"><path d="M 2 3 l 1 .3 M 18 7 l 1 -.2 M 8 22 l .7 .3 M 28 25 l .7 -.2" stroke="#fff9e8" strokeWidth=".65" opacity=".2" /><path d="M 15 18 l .8 .3 M 27 5 l .8 -.1" stroke="#382d2c" strokeWidth=".45" opacity=".14" /></pattern></defs>
      <rect width="240" height="360" fill={`url(#${id}-paper)`} pointerEvents="none" />
    </svg>
  );
};
