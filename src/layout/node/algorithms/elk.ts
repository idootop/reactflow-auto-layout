import ELK from "elkjs/lib/elk.bundled.js";
import { getIncomers } from "reactflow";

import { ReactflowNodeWithData } from "@/data/types";
import { LayoutAlgorithm, LayoutAlgorithmProps } from "..";
import { getEdgeLayouted, getNodeLayouted, getNodeSize } from "../../metadata";

const algorithms = {
  "elk-layered": "layered",
  "elk-mr-tree": "mrtree",
};

const elk = new ELK({ algorithms: Object.values(algorithms) });

export type ELKLayoutAlgorithms = "elk-layered" | "elk-mr-tree";

export const layoutELK = async (
  props: LayoutAlgorithmProps & { algorithm?: ELKLayoutAlgorithms }
) => {
  const {
    nodes,
    edges,
    direction,
    visibility,
    spacing,
    algorithm = "elk-mr-tree",
  } = props;
  const isHorizontal = direction === "horizontal";

  const subWorkflowRootNodes: ReactflowNodeWithData[] = [];
  const layoutNodes = nodes.map((node) => {
    const incomers = getIncomers(node, nodes, edges);
    if (incomers.length < 1) {
      // Node without input is the root node of sub-workflow
      subWorkflowRootNodes.push(node);
    }
    const { widthWithDefault, heightWithDefault } = getNodeSize(node);
    const sourcePorts = node.data.sourceHandles.map((id) => ({
      id,
      properties: {
        side: isHorizontal ? "EAST" : "SOUTH",
      },
    }));
    const targetPorts = node.data.targetHandles.map((id) => ({
      id,
      properties: {
        side: isHorizontal ? "WEST" : "NORTH",
      },
    }));
    return {
      id: node.id,
      width: widthWithDefault,
      height: heightWithDefault,
      ports: [...targetPorts, ...sourcePorts],
      properties: {
        "org.eclipse.elk.portConstraints": "FIXED_ORDER",
      },
    };
  });

  const layoutEdges = edges.map((edge) => {
    return {
      id: edge.id,
      sources: [edge.sourceHandle || edge.source],
      targets: [edge.targetHandle || edge.target],
    };
  });

  // Connect sub-workflows' root nodes to the rootNode
  const rootNode: any = { id: "#root", width: 1, height: 1 };
  layoutNodes.push(rootNode);
  for (const subWorkflowRootNode of subWorkflowRootNodes) {
    layoutEdges.push({
      id: `${rootNode.id}-${subWorkflowRootNode.id}`,
      sources: [rootNode.id],
      targets: [subWorkflowRootNode.id],
    });
  }

  const layouted = await elk
    .layout({
      id: "@root",
      children: layoutNodes,
      edges: layoutEdges,
      layoutOptions: {
        // - https://www.eclipse.org/elk/reference/algorithms.html
        "elk.algorithm": algorithms[algorithm],
        "elk.direction": isHorizontal ? "RIGHT" : "DOWN",
        // - https://www.eclipse.org/elk/reference/options.html
        "elk.spacing.nodeNode": isHorizontal
          ? spacing.y.toString()
          : spacing.x.toString(),
        "elk.layered.spacing.nodeNodeBetweenLayers": isHorizontal
          ? spacing.x.toString()
          : spacing.y.toString(),
      },
    })
    .catch((e) => {
      console.log("❌ ELK layout failed", e);
    });

  if (!layouted?.children) {
    return;
  }

  const layoutedNodePositions = layouted.children.reduce((pre, v) => {
    pre[v.id] = {
      x: v.x ?? 0,
      y: v.y ?? 0,
    };
    return pre;
  }, {} as Record<string, { x: number; y: number }>);

  return {
    nodes: nodes.map((node) => {
      const position = layoutedNodePositions[node.id];
      return getNodeLayouted({ node, position, direction, visibility });
    }),
    edges: edges.map((edge) => getEdgeLayouted({ edge, visibility })),
  };
};

export const kElkAlgorithms: Record<string, LayoutAlgorithm> = Object.keys(
  algorithms
).reduce((pre, algorithm) => {
  pre[algorithm] = (props: any) => {
    return layoutELK({ ...props, algorithm });
  };
  return pre;
}, {} as any);
