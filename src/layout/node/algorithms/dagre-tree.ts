import dagre from "@dagrejs/dagre";
import { getIncomers } from "reactflow";

import { ReactflowNodeWithData } from "@/data/types";
import { LayoutAlgorithm } from "..";
import { getEdgeLayouted, getNodeLayouted, getNodeSize } from "../../metadata";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const layoutDagreTree: LayoutAlgorithm = async (props) => {
  const { nodes, edges, direction, visibility, spacing } = props;
  const isHorizontal = direction === "horizontal";

  dagreGraph.setGraph({
    nodesep: isHorizontal ? spacing.y : spacing.x,
    ranksep: isHorizontal ? spacing.x : spacing.y,
    ranker: "tight-tree",
    rankdir: isHorizontal ? "LR" : "TB",
  });

  const subWorkflowRootNodes: ReactflowNodeWithData[] = [];
  nodes.forEach((node) => {
    const incomers = getIncomers(node, nodes, edges);
    if (incomers.length < 1) {
      // 没有输入的 Node 即为 subWorkflow 的根节点
      // Node without input is the root node of subworkflow
      subWorkflowRootNodes.push(node);
    }
    const { widthWithDefault, heightWithDefault } = getNodeSize(node);
    dagreGraph.setNode(node.id, {
      width: widthWithDefault,
      height: heightWithDefault,
    });
  });

  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  // 将 subWorkflow 连接到根节点
  // Connect subworkflow to the root node
  dagreGraph.setNode("#root", { width: 1, height: 1 });
  for (const subWorkflowRootNode of subWorkflowRootNodes) {
    dagreGraph.setEdge("#root", subWorkflowRootNode.id);
  }

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const position = dagreGraph.node(node.id);
      return getNodeLayouted({
        node,
        position,
        direction,
        visibility,
        fixPosition: ({ x, y, width, height }) => ({
          // 此算法使用 Node 的中心坐标为基准点，需要调整到 ReactFlow 使用的 topLeft 坐标
          // This algorithm uses the central coordinate point of Node as the benchmark point. You need to adjust to the topleft coordinate used by ReactFlow
          x: x - width / 2,
          y: y - height / 2,
        }),
      });
    }),
    edges: edges.map((edge) => getEdgeLayouted({ edge, visibility })),
  };
};
