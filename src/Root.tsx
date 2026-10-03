import React from 'react';
import {Composition} from 'remotion';
import {ClaudeEditingMotion} from './Composition';
import {VIDEO} from './video-config';

export const RemotionRoot: React.FC = () => (
  <Composition
    id={VIDEO.id}
    component={ClaudeEditingMotion}
    durationInFrames={VIDEO.frames}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
    defaultProps={{}}
  />
);
