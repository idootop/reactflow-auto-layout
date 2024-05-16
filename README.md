# ReactFlow Auto Layout Demo

A demo showcasing the auto layout and Figma-like edge editing capabilities of [ReactFlow](https://reactflow.dev).

👉 View Demo: [https://reactflow-auto-layout.vercel.app](https://reactflow-auto-layout.vercel.app/)

# ✨ Highlights

### 1. Node Auto Layout

- Supports various auto layout algorithms like [Dagre](https://github.com/dagrejs/dagre), [ELK](https://github.com/kieler/elkjs), [D3-hierarchy](https://github.com/d3/d3-hierarchy), [D3-dag](https://github.com/erikbrinkman/d3-dag) and more.
- Enables automatic layout of nodes with dynamic sizing.
- Supports automatic layout for multiple subflows.
- Allows dynamic adjustment of layout direction, node spacing, port sorting, and other layout parameters.

https://github.com/idootop/reactflow-auto-layout/assets/35302658/952f5021-1cd0-49bf-8dd8-b12521e2a7ce

### 2. Edge Auto Routing

- Utilizes the [A\* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) combined with [Manhattan Distance](https://simple.wikipedia.org/wiki/Manhattan_distance) to find the optimal path for edges.
- Ensures minimal overlap and intersections between edges and nodes at both ends.

https://github.com/idootop/reactflow-auto-layout/assets/35302658/ea9a3657-b1d2-47c8-9a13-3727dfc31d48

### 3. Edge Polyline Drag Editing

- Edges are drawn as right-angled polylines with rounded corners.
- Edges consist of control points, and the line segments between control points can be moved by dragging the control handles.
- During dragging, nearby control points and line segments are automatically merged, and new control points can be automatically split out.

https://github.com/idootop/reactflow-auto-layout/assets/35302658/01f1c5c5-f224-4d12-9a31-bca45a0d5a56

# 🌲 Introduction

This demo is divided into several modules based on functionality, most of which can be directly copied and used. Let's break it down:

### Basic Types:

- [src/data/types.ts](./src/data/types.ts): Contains type definitions for node and edge data. Reviewing this will help you understand the rest of the code.

### Node Auto Layout:

- [src/layout/node/algorithms](./src/layout/node/algorithms): Contains implementations of various node layout algorithms.
- [src/layout/useAutoLayout.ts](./src/layout/useAutoLayout.ts): Handles the auto layout process, including logic for dynamically adapting to node sizes.

### Edge Editing Functionality:

- [src/layout/edge/index.ts](./src/layout/edge/index.ts): Start here to explore the control point generation algorithms and logic for drawing rounded corner edge paths.
- [src/layout/edge/algorithms/index.ts](./src/layout/edge/algorithms/index.ts): Core of the edge auto-routing algorithm. Refer to the [LogicFlow 边的绘制与交互](https://juejin.cn/post/6942727734518874142) article for more details.
- [src/components/Edges/EdgeController/index.tsx](./src/components/Edges/EdgeController/index.tsx): Follow this to understand how edge segment drag events are handled.
- [src/components/Edges/EdgeController/smart-edge.ts](./src/components/Edges/EdgeController/smart-edge.ts): Manages logic for edge auto-merging/splitting, similar to Figma.

These are the key modules of the project. While it might seem complex at first, the overall logic is straightforward. If you have any questions, feel free to raise an [issue](https://github.com/idootop/reactflow-auto-layout/issues).

# ❤️ Acknowledgement

1. [ReactFlow](https://reactflow.dev/): The core diagrams engine empowering this project.
2. The [D3-hierarchy](https://github.com/d3/d3-hierarchy) auto layout approach primarily referenced from: [flanksource-ui](https://github.com/flanksource/flanksource-ui/blob/75b35591d3bbc7d446fa326d0ca7536790f38d88/src/ui/Graphs/Layouts/algorithms/d3-hierarchy.ts)
3. The Edge auto-routing approach mainly referred to: [LogicFlow 边的绘制与交互](https://juejin.cn/post/6942727734518874142)
4. Special thanks to [a3ng7n ](https://github.com/a3ng7n) for the invaluable [English comment translations](https://github.com/idootop/reactflow-auto-layout/pull/1).