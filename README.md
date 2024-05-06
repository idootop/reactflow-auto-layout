# ReactFlow Auto Layout and Edge Editing Demo

A demo showcasing the auto layout and edge editing capabilities of ReactFlow.

## ✨ Highlights

### Node Auto Layout

- Supports various auto layout algorithms like [Dagre](https://github.com/dagrejs/dagre), [ELK](https://github.com/kieler/elkjs), [D3-hierarchy](https://github.com/d3/d3-hierarchy), [D3-dag](https://github.com/erikbrinkman/d3-dag) and more.
- Enables automatic layout of nodes with dynamic sizing.
- Supports automatic layout for multiple subflows.
- Allows dynamic adjustment of layout direction, node spacing, port sorting, and other layout parameters.

https://github.com/idootop/reactflow-auto-layout/assets/35302658/952f5021-1cd0-49bf-8dd8-b12521e2a7ce

### Edge Auto Routing

- Utilizes the [A\* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) combined with [Manhattan Distance](https://simple.wikipedia.org/wiki/Manhattan_distance) to find the optimal path for edges.
- Ensures minimal overlap and intersections between edges and nodes at both ends.

https://github.com/idootop/reactflow-auto-layout/assets/35302658/ea9a3657-b1d2-47c8-9a13-3727dfc31d48

###  Edge Polyline Drag Editing

- Edges are drawn as right-angled polylines with rounded corners.
- Edges consist of control points, and the line segments between control points can be moved by dragging the control handles.
- During dragging, nearby control points and line segments are automatically merged, and new control points can be automatically split out.

https://github.com/idootop/reactflow-auto-layout/assets/35302658/01f1c5c5-f224-4d12-9a31-bca45a0d5a56


## ❤️ Acknowledgement

The Edge auto-routing approach mainly refers to: [LogicFlow 边的绘制与交互](https://juejin.cn/post/6942727734518874142)
