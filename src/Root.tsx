import React from 'react';
import {Composition} from 'remotion';
import {ClaudeEditingMotion} from './Composition';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ClaudeEditingMotion"
    component={ClaudeEditingMotion}
    durationInFrames={900}
    fps={30}
    width={1280}
    height={720}
  />
);
