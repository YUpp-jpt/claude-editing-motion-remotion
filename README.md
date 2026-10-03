# Claude 剪视频过程 · Remotion 复刻

30 秒手绘风剪辑界面动画，1280 × 720，30 fps，共 900 帧。使用 React、Remotion 和原创 SVG 重建界面与角色，所有动作由帧号驱动。字体、插画与原创合成音轨均随工程提供，渲染无需访问参考视频。

参考片段：[MotionFace · e3ee409a-50f7-4b4a-af27-288226e47a57](https://motionface.cc/?recording=e3ee409a-50f7-4b4a-af27-288226e47a57)。标题 “claude_剪视频过程motion” 仅作为参考标识。

![复刻成片预览](docs/preview.jpg)

## 运行与渲染

使用 Node.js 22 或更高版本、pnpm 11.25.0：

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm run studio
```

在 Studio 中选择 `ClaudeEditingMotion`。

```sh
pnpm run check
pnpm run render
pnpm run verify
pnpm run still
```

成片保存到 `renders/claude-editing-motion.mp4`；封面为 `renders/poster.png`。`verify` 检查尺寸、帧率、900 帧、音频流、完整解码和音频峰值，并输出 `renders/verification.json`。第一次渲染时 Remotion 可能下载 Chrome Headless Shell；后续使用本地缓存。Remotion Studio 默认在终端显示本地地址。

可选的单帧预览：

```sh
pnpm exec remotion still src/index.tsx ClaudeEditingMotion renders/frame-12s.png --frame=360
```

重建配乐与音效：

```sh
pnpm run audio
```

## 可修改的内容

| 文件 | 内容 |
| --- | --- |
| `src/Root.tsx` | 画幅、时长、帧率和 Composition ID |
| `src/Composition.tsx` | 代码窗开场、全局镜头、成片手机、片尾便签 |
| `src/Editor.tsx` | 素材库、时间线、波形、拖拽、撤销、滑杆、导出 |
| `src/Artwork.tsx` | 城市、拉面、柴犬、舞厅和小克的原创 SVG |
| `src/timing.ts` | 秒级动作锚点、镜头路径、预览切片 |
| `tools/make-audio.mjs` | 原创旋律、节拍和操作音效，可调整事件时间 |

动画依次还原代码窗展开、四段素材入轨、清除灰色冗余片、旋转/翻页/glitch、文字模板、Ctrl+Z、调色滑杆、波形卡点、导出进度停留与完成、短视频手机和 `Opus 5.5` 便签。暖纸色、深色手绘轮廓、薄荷绿、芥末黄与紫蓝舞池保持参考的视觉方向。

这是可编辑的组件复刻；插画、字体细节和微动作并非逐像素一致。配乐为独立创作的确定性电子木琴/拨弦节拍与音效，与参考原曲不同。公开工程不含参考 MP4、参考截图、参考音轨、签名下载地址或网站绑定凭证。

## 字体与依赖

随工程附带的 [LXGW WenKai Lite](https://github.com/lxgw/LxgwWenKai) 使用 SIL Open Font License 1.1，许可全文在 `public/fonts/OFL.txt`，字体文件保留原名与版权信息。

Remotion 使用其上游许可，具体见 [Remotion 许可说明](https://www.remotion.dev/docs/license)。React 与其他依赖许可见对应软件包。

制作依据：[Remotion 按帧动画](https://www.remotion.dev/docs/animating-properties)、[渲染命令](https://www.remotion.dev/docs/cli/render)。
