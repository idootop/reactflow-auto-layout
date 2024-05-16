import { graphStratify, sugiyama } from "d3-dag";
import { getIncomers, type Node } from "reactflow";

import { ReactflowNodeWithData } from "@/data/types";
import { LayoutAlgorithm, LayoutAlgorithmProps } from "..";
import { getEdgeLayouted, getNodeLayouted, getNodeSize } from "../../metadata";

type NodeWithPosition = ReactflowNodeWithData & { x: number; y: number };

// d3-dag 布局算法不支持同时存在多个根节点
// 对于有多个独立 subWorkflow 的布局，我们可以将 subWorkflow 手动挂载到全局的 rootNode
// d3-dag layout algorithm does not support multiple root nodes at the same time
// For the layout of multiple independent Subworkflow, we can manually mount Subworkflow to the global rootNode
const rootNode: NodeWithPosition = {
  id: "#root",
  x: 0,
  y: 0,
  position: { x: 0, y: 0 },
  data: {} as any,
};

const algorithms = {
  "d3-dag": "d3-dag",
  "ds-dag(s)": "ds-dag(s)",
};

export type D3DAGLayoutAlgorithms = "d3-dag" | "ds-dag(s)";

export const layoutD3DAG = async (
  props: LayoutAlgorithmProps & { algorithm?: D3DAGLayoutAlgorithms }
) => {
  const {
    nodes,
    edges,
    direction,
    visibility,
    spacing,
    algorithm = "D3DAG",
  } = props;
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

  // d3-dag 不支持横向布局，我们可以根据布局方向映射 Node 的实际宽高
  // d3-dag does not support the horizontal layout, we can mappate the actual width height of Node according to the layout direction
  const nodeSize: any = isHorizontal
    ? [maxNodeHeight + spacing.y, maxNodeWidth + spacing.x]
    : [maxNodeWidth + spacing.x, maxNodeHeight + spacing.y];

  const getParentIds = (node: Node) => {
    if (node.id === rootNode.id) {
      return undefined;
    }
    // 没有输入的 Node 即为 subWorkflow 的根节点，将其挂载到 rootNode 上
    // Node without input is the root node of subworkflow, and mount it to the rootNode
    const incomers = getIncomers(node, nodes, edges);
    if (incomers.length < 1) {
      return [rootNode.id];
    }
    return algorithm === "d3-dag"
      ? [incomers[0]?.id]
      : incomers.map((e) => e.id);
  };

  const stratify = graphStratify();
  const dag = stratify(
    [rootNode, ...initialNodes].map((node) => {
      return {
        id: node.id,
        parentIds: getParentIds(node),
      };
    })
  );

  const layout = sugiyama().nodeSize(nodeSize);
  layout(dag);

  const layoutNodes = new Map<string, any>();
  for (const node of dag.nodes()) {
    layoutNodes.set(node.data.id, node);
  }

  return {
    nodes: nodes.map((node) => {
      const { x, y } = layoutNodes.get(node.id);
      // d3-dag 不支持横向布局，我们可以根据布局方向来映射横纵坐标
      // d3-dag does not support the horizontal layout. We can map horizontal and vertical coordinates according to the direction of the layout
      const position = isHorizontal ? { x: y, y: x } : { x, y };
      return getNodeLayouted({
        node,
        position,
        direction,
        visibility,
        fixPosition: ({ x, y, width, height }) => {
          // 此算法使用 Node 的中心坐标为基准点，需要调整到 ReactFlow 使用的 topLeft 坐标
          // This algorithm uses the central coordinate point of Node as the benchmark point. You need to adjust to the topleft coordinate used by ReactFlow
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

export const kD3DAGAlgorithms: Record<string, LayoutAlgorithm> = Object.keys(
  algorithms
).reduce((pre, algorithm) => {
  pre[algorithm] = (props: any) => {
    return layoutD3DAG({ ...props, algorithm });
  };
  return pre;
}, {} as any);
