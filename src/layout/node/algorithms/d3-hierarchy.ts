// Based on: https://github.com/flanksource/flanksource-ui/blob/75b35591d3bbc7d446fa326d0ca7536790f38d88/src/ui/Graphs/Layouts/algorithms/d3-hierarchy.ts

import { stratify, tree, type HierarchyPointNode } from "d3-hierarchy";
import { getIncomers, type Node } from "reactflow";

import { ReactflowNodeWithData } from "@/data/types";
import { LayoutAlgorithm } from "..";
import { getEdgeLayouted, getNodeLayouted, getNodeSize } from "../../metadata";

type NodeWithPosition = ReactflowNodeWithData & { x: number; y: number };

const layout = tree<NodeWithPosition>().separation(() => 1);

// d3-hierarchy 布局算法不支持同时存在多个根节点
// 对于有多个独立 subWorkflow 的布局，我们可以将 subWorkflow 手动挂载到全局的 rootNode
// d3-hierarchy layout algorithm does not support multiple root nodes at the same time
// For the layout of multiple independent Subworkflow, we can manually mount Subworkflow to the global rootNode
const rootNode: NodeWithPosition = {
  id: "#root",
  x: 0,
  y: 0,
  position: { x: 0, y: 0 },
  data: {} as any,
};

export const layoutD3Hierarchy: LayoutAlgorithm = async (props) => {
  const { nodes, edges, direction, visibility, spacing } = props;
  const isHorizontal = direction === "horizontal";

  const initialNodes = [] as NodeWithPosition[];
  let maxNodeWidth = 0;
  let maxNodeHeight = 0;
  for (const node of nodes) {
    const { widthWithDefault, heightWithDefault } = getNodeSize(node);
    initialNodes.push({
      ...node,
      ...node.position,
      width: widthWithDefault,
      height: heightWithDefault,
    });
    maxNodeWidth = Math.max(maxNodeWidth, widthWithDefault);
    maxNodeHeight = Math.max(maxNodeHeight, heightWithDefault);
  }

  // d3-hierarchy 不支持横向布局，我们可以根据布局方向映射 Node 的实际宽高
  // d3-hierarchy does not support the horizontal layout, we can map the actual width height of Node according to the direction of the layout
  const nodeSize: [number, number] = isHorizontal
    ? [maxNodeHeight + spacing.y, maxNodeWidth + spacing.x]
    : [maxNodeWidth + spacing.x, maxNodeHeight + spacing.y];

  layout.nodeSize(nodeSize);

  const getParentId = (node: Node) => {
    if (node.id === rootNode.id) {
      return undefined;
    }
    // 没有输入的 Node 即为 subWorkflow 的根节点，将其挂载到 rootNode 上
    // Node without input is the root node of subworkflow, and mount it to the rootNode
    const incomers = getIncomers(node, nodes, edges);
    return incomers[0]?.id || rootNode.id;
  };

  const hierarchy = stratify<NodeWithPosition>()
    .id((d) => d.id)
    .parentId(getParentId)([rootNode, ...initialNodes]);

  const root = layout(hierarchy);
  const layoutNodes = new Map<string, HierarchyPointNode<NodeWithPosition>>();
  for (const node of root) {
    layoutNodes.set(node.id!, node);
  }

  return {
    nodes: nodes.map((node) => {
      const { x, y } = layoutNodes.get(node.id)!;
      // d3-hierarchy 不支持横向布局，我们可以根据布局方向来映射横纵坐标
      // d3-hierarchy does not support the horizontal layout, we can reflect the horizontal and vertical coordinates according to the direction of the layout
      const position = isHorizontal ? { x: y, y: x } : { x, y };
      return getNodeLayouted({
        node,
        position,
        direction,
        visibility,
        fixPosition: ({ x, y, width, height }) => {
          // 此算法使用 Node 的中心坐标为基准点，需要调整到 ReactFlow 使用的 topLeft 坐标
          // This algorithm uses the central coordinate point of Node as the benchmark point. You need to adjust to the TOPLEFT coordinate used by ReactFlow
          return {
            x: x - width / 2,
            y: y - height / 2,
          };
        },
      });
    }),
    edges: edges.map((edge) => getEdgeLayouted({ edge, visibility })),
  };
};
