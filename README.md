# ReactFlow Auto Layout Demo

A demonstration of auto-layout capabilities and Figma-like edge editing features built with [ReactFlow](https://reactflow.dev).

👉 **Live Demo:** [https://reactflow-auto-layout.vercel.app](https://reactflow-auto-layout.vercel.app/)

## ✨ Features

### 1. Node Auto Layout

- Support for multiple auto-layout algorithms including [Dagre](https://github.com/dagrejs/dagre), [ELK](https://github.com/kieler/elkjs), [D3-hierarchy](https://github.com/d3/d3-hierarchy), [D3-dag](https://github.com/erikbrinkman/d3-dag), and more
- Automatic layout with dynamic node sizing
- Multi-subflow layout support
- Dynamic adjustment of layout direction, node spacing, port sorting, and other layout parameters

https://github.com/idootop/reactflow-auto-layout/assets/35302658/952f5021-1cd0-49bf-8dd8-b12521e2a7ce

### 2. Smart Edge Routing

- Implements the [A\* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) combined with [Manhattan Distance](https://simple.wikipedia.org/wiki/Manhattan_distance) to compute optimal edge paths
- Minimizes overlap and intersections between edges and nodes

https://github.com/idootop/reactflow-auto-layout/assets/35302658/ea9a3657-b1d2-47c8-9a13-3727dfc31d48

### 3. Interactive Edge Editing

- Edges are rendered as right-angled polylines with rounded corners
- Drag control handles to adjust line segments between control points
- Automatic merging of nearby control points and segments, with intelligent splitting of new control points during manipulation

https://github.com/idootop/reactflow-auto-layout/assets/35302658/01f1c5c5-f224-4d12-9a31-bca45a0d5a56

## 🌲 Project Structure

The project is organized into functional modules that can be easily adapted for your own use. Here's an overview of the key components:

### Type Definitions

- [src/data/types.ts](./src/data/types.ts): Core type definitions for nodes and edges. Start here to understand the data structures used throughout the codebase.

### Node Auto Layout

- [src/layout/node/algorithms](./src/layout/node/algorithms): Implementations of various node layout algorithms
- [src/layout/useAutoLayout.ts](./src/layout/useAutoLayout.ts): Auto-layout orchestration, including dynamic node sizing logic

### Edge Editing

- [src/layout/edge/index.ts](./src/layout/edge/index.ts): Control point generation algorithms and rounded corner path rendering
- [src/layout/edge/algorithms/index.ts](./src/layout/edge/algorithms/index.ts): Core edge auto-routing algorithm. See the [LogicFlow article on edge rendering](https://juejin.cn/post/6942727734518874142) for additional context
- [src/components/Edges/EdgeController/index.tsx](./src/components/Edges/EdgeController/index.tsx): Edge segment drag event handling
- [src/components/Edges/EdgeController/smart-edge.ts](./src/components/Edges/EdgeController/smart-edge.ts): Figma-like edge auto-merging and splitting logic

While the codebase may appear complex at first glance, the underlying logic is relatively straightforward. Feel free to open an [issue](https://github.com/idootop/reactflow-auto-layout/issues) if you have any questions.

## ❤️ Acknowledgements

This project builds upon the work of many others:

1. [ReactFlow](https://reactflow.dev/) — The powerful diagram engine that powers this project
2. [flanksource-ui](https://github.com/flanksource/flanksource-ui/blob/75b35591d3bbc7d446fa326d0ca7536790f38d88/src/ui/Graphs/Layouts/algorithms/d3-hierarchy.ts) — Reference implementation for the [D3-hierarchy](https://github.com/d3/d3-hierarchy) auto-layout approach
3. [LogicFlow 边的绘制与交互](https://juejin.cn/post/6942727734518874142) — Inspiration for the edge auto-routing implementation
4. [a3ng7n](https://github.com/a3ng7n) — For the excellent [English comment translations](https://github.com/idootop/reactflow-auto-layout/pull/1)
