# ReactFlow Auto Layout and Edge Editing Demo

A demo showcasing the auto layout and edge editing capabilities of ReactFlow.

## ✨ Highlights

**1. Node Auto Layout**

- Supports various auto layout algorithms like [Dagre](https://github.com/dagrejs/dagre), [ELK](https://github.com/kieler/elkjs), [D3-hierarchy](https://github.com/d3/d3-hierarchy), [D3-dag](https://github.com/erikbrinkman/d3-dag) and more.
- Enables automatic layout of nodes with dynamic sizing.
- Supports automatic layout for multiple subflows.
- Allows dynamic adjustment of layout direction, node spacing, port sorting, and other layout parameters.

https://github.com/idootop/reactflow-auto-layout/raw/main/assets/algorithms.mp4

**2. Edge Auto Routing**

- Utilizes the A\* search algorithm combined with Manhattan Distance to find the optimal path for edges.
- Ensures minimal overlap and intersections between edges and nodes at both ends.

https://github.com/idootop/reactflow-auto-layout/raw/main/assets/dragging.mp4

**3. Edge Polyline Drag Editing**

- Edges are drawn as right-angled polylines with rounded corners.
- Edges consist of control points, and the line segments between control points can be moved by dragging the control handles.
- During dragging, nearby control points and line segments are automatically merged, and new control points can be automatically split out.

https://github.com/idootop/reactflow-auto-layout/raw/main/assets/merge.mp4
