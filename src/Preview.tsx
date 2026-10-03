// Playback structure adapted from Wise Wong's MIT-licensed preview.
// See THIRD_PARTY_NOTICES.md for the exact source and license.
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player, type CallbackListener, type PlayerRef} from '@remotion/player';
import {ClaudeEditingMotion} from './Composition';
import {VIDEO} from './video-config';
import fontSrc from '../public/fonts/MotionHand-Regular.woff2';
import './preview.css';

const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
const rates = [.5, 1, 1.5, 2, 3];

const Preview: React.FC = () => {
  const player = useRef<PlayerRef>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [autoplay] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [playing, setPlaying] = useState(autoplay);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const [rate, setRate] = useState(1);
  const [sound, setSound] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [near, setNear] = useState(true);
  const draggingRef = useRef(false);
  const dragWasPlaying = useRef(false);
  const hiddenWasPlaying = useRef(false);
  const inputProps = useMemo(() => ({fontSrc, audioSrc: new URL('./assets/recreated.wav', location.href).href}), []);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const onFrame: CallbackListener<'frameupdate'> = event => setFrame(event.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    p.addEventListener('frameupdate', onFrame);
    p.addEventListener('play', onPlay);
    p.addEventListener('pause', onPause);
    p.addEventListener('ended', onPause);
    const onVisibility = () => {
      if (document.hidden) {
        hiddenWasPlaying.current = playingRef.current;
        p.pause();
        p.mute();
      } else if (hiddenWasPlaying.current) {
        hiddenWasPlaying.current = false;
        p.play();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) return;
      if (event.target instanceof HTMLElement && event.target.closest('button,input,select,textarea,[contenteditable]')) return;
      event.preventDefault();
      if (playingRef.current) p.pause();
      else {
        if (p.getCurrentFrame() === VIDEO.frames - 1) p.seekTo(0);
        p.play();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('keydown', onKey);
    return () => {
      p.removeEventListener('frameupdate', onFrame);
      p.removeEventListener('play', onPlay);
      p.removeEventListener('pause', onPause);
      p.removeEventListener('ended', onPause);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (sound && playing && !dragging && !document.hidden) player.current?.unmute();
    else player.current?.mute();
  }, [sound, playing, dragging]);

  useEffect(() => {
    const reveal = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {setNear(true); return;}
      const bounds = controls.current?.getBoundingClientRect();
      if (bounds) setNear(event.clientY >= bounds.top - 70);
    };
    window.addEventListener('pointermove', reveal);
    return () => window.removeEventListener('pointermove', reveal);
  }, []);

  const finishDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (dragWasPlaying.current) player.current?.play();
  };
  const elapsed = frame === VIDEO.frames - 1 ? VIDEO.seconds : frame / VIDEO.fps;

  return <>
    <main aria-label="小克剪视频，三十秒手绘动画">
      <Player
        ref={player}
        component={ClaudeEditingMotion}
        inputProps={inputProps}
        compositionWidth={VIDEO.width}
        compositionHeight={VIDEO.height}
        durationInFrames={VIDEO.frames}
        fps={VIDEO.fps}
        style={{width:'100%'}}
        controls={false}
        autoPlay={autoplay}
        initiallyMuted
        loop={false}
        playbackRate={rate}
        numberOfSharedAudioTags={0}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        moveToBeginningWhenEnded={false}
        errorFallback={() => <div role="alert" className="preview-error">暂时无法播放，请重新打开预览文件。</div>}
      />
    </main>
    <div ref={controls} className={`playback${!near && !dragging ? ' is-hidden' : ''}`} role="group" aria-label="播放控制">
      <button id="play-toggle" aria-label={playing ? '暂停动画' : '播放动画'} onClick={event => {
        if (playing) player.current?.pause();
        else {
          if (frame === VIDEO.frames - 1) player.current?.seekTo(0);
          player.current?.play(event);
        }
      }}>{playing ? '暂停' : '播放'}</button>
      <input id="play-progress" type="range" aria-label="播放进度" aria-valuetext={`${clock(elapsed)}，共 ${clock(VIDEO.seconds)}`} min="0" max={VIDEO.frames - 1} step="1" value={frame}
        style={{'--progress':`${frame / (VIDEO.frames - 1) * 100}%`} as React.CSSProperties}
        onPointerDown={event => {
          dragWasPlaying.current = playingRef.current;
          draggingRef.current = true;
          setDragging(true);
          player.current?.pause();
          player.current?.mute();
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onChange={event => {
          const next = Number(event.target.value);
          setFrame(next);
          player.current?.seekTo(next);
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
      />
      <button id="play-restart" onClick={event => {player.current?.seekTo(0); player.current?.play(event);}}>重播</button>
      <button id="play-speed" aria-label={`播放速度 ${rate} 倍，点击切换`} onClick={() => setRate(rates[(rates.indexOf(rate) + 1) % rates.length])}>{rate}×</button>
      <button id="play-sound" aria-pressed={sound} onClick={() => setSound(!sound)}>{sound ? '声音开' : '声音关'}</button>
      <output id="play-time" aria-live="off">{clock(elapsed)} / {clock(VIDEO.seconds)}</output>
    </div>
  </>;
};

createRoot(document.getElementById('root')!).render(<Preview/>);
