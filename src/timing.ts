import {Easing, interpolate} from 'remotion';

// All times are seconds; everything is evaluated from the current frame.
export const clamp = (v: number, low = 0, high = 1) => Math.min(high, Math.max(low, v));
export const progress = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const ease = (v: number) => Easing.inOut(Easing.cubic)(clamp(v));
export const tween = (t: number, a: number, b: number, from: number, to: number) =>
  from + (to - from) * ease(progress(t, a, b));
export const track = (t: number, times: number[], values: number[]) =>
  interpolate(t, times, values, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

export const sceneKind = (t: number): 'night' | 'ramen' | 'shiba' | 'dance' => {
  if (t < 5.1) return 'night';
  if (t < 8.5) return 'ramen';
  if (t < 9.6) return 'night';
  if (t < 10.95) return 'ramen';
  if (t < 11.62) return 'shiba';
  if (t < 12.15) return 'dance';
  if (t < 15.5) return 'shiba';
  if (t < 21.35) return 'dance';
  if (t < 21.8) return 'night';
  if (t < 22.6) return 'shiba';
  if (t < 26.9) return 'dance';
  if (t < 27.5) return 'night';
  if (t < 28.0) return 'ramen';
  if (t < 28.4) return 'shiba';
  return 'dance';
};

export const camera = (t: number) => ({
  scale: track(t,[0,1.8,2.2,4.4,5.2,7.5,8.25,10.9,11.95,13.5,14.0,15.0,15.8,18.9,20,22.5,23.3,26.5,27],[1,1,1.1,1.1,1.3,1.3,1.28,1.28,1.28,1.28,1.35,1.35,1.4,1.4,1,1,1.3,1.3,1]),
  x: track(t,[0,1.8,2.2,4.4,5.2,7.5,8.25,10.9,11.95,13.5,14.0,15.0,15.8,18.9,20,22.5,23.3,26.5,27],[0,0,-6,-6,-20,-20,0,0,0,0,-174,-174,-505,-505,0,0,-387,-387,0]),
  y: track(t,[0,1.8,2.2,4.4,5.2,7.5,8.25,10.9,11.95,13.5,14.0,15.0,15.8,18.9,20,22.5,23.3,26.5,27],[0,0,-70,-70,-177,-177,-91,-91,-96,-96,-84,-84,0,0,0,0,0,0,0]),
});
