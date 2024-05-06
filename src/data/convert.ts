import { lastOf } from "@/utils/base";
import { Reactflow, Workflow } from "./types";

export const workflow2reactflow = (workflow: Workflow): Reactflow => {
  const { nodes = [], edges = [] } = workflow ?? {};
  const edgesCount: Record<string, number> = {};
  const edgesIndex: Record<string, { source: number; target: number }> = {};
  const nodeHandles: Record<
    string,
    {
      sourceHandles: Record<string, number>;
      targetHandles: Record<string, number>;
    }
  > = {};

  for (const edge of edges) {
    const { source, target, sourceHandle, targetHandle } = edge;
    if (!edgesCount[sourceHandle]) {
      edgesCount[sourceHandle] = 1;
    } else {
      edgesCount[sourceHandle] += 1;
    }
    if (!edgesCount[targetHandle]) {
      edgesCount[targetHandle] = 1;
    } else {
      edgesCount[targetHandle] += 1;
    }
    if (!edgesCount[`source-${source}`]) {
      edgesCount[`source-${source}`] = 1;
    } else {
      edgesCount[`source-${source}`] += 1;
    }
    if (!edgesCount[`target-${target}`]) {
      edgesCount[`target-${target}`] = 1;
    } else {
      edgesCount[`target-${target}`] += 1;
    }
    edgesIndex[edge.id] = {
      source: edgesCount[sourceHandle] - 1,
      target: edgesCount[targetHandle] - 1,
    };
    if (!nodeHandles[source]) {
      nodeHandles[source] = { sourceHandles: {}, targetHandles: {} };
    }
    if (!nodeHandles[target]) {
      nodeHandles[target] = { sourceHandles: {}, targetHandles: {} };
    }
    if (!nodeHandles[source].sourceHandles[sourceHandle]) {
      nodeHandles[source].sourceHandles[sourceHandle] = 1;
    } else {
      nodeHandles[source].sourceHandles[sourceHandle] += 1;
    }
    if (!nodeHandles[target].targetHandles[targetHandle]) {
      nodeHandles[target].targetHandles[targetHandle] = 1;
    } else {
      nodeHandles[target].targetHandles[targetHandle] += 1;
    }
  }

  return {
    nodes: nodes.map((node) => ({
      ...node,
      data: {
        ...node,
        sourceHandles: Object.keys(nodeHandles[node.id].sourceHandles) ?? [],
        targetHandles: Object.keys(nodeHandles[node.id].targetHandles) ?? [],
      },
      position: { x: 0, y: 0 },
    })),
    edges: edges.map((edge) => ({
      ...edge,
      data: {
        sourcePort: {
          edges: edgesCount[`source-${edge.source}`],
          portIndex: parseInt(lastOf(edge.sourceHandle.split("#"))!, 10),
          portCount: Object.keys(nodeHandles[edge.source].sourceHandles).length,
          edgeIndex: edgesIndex[edge.id].source,
          edgeCount: edgesCount[edge.sourceHandle],
        },
        targetPort: {
          edges: edgesCount[`target-${edge.target}`],
          portIndex: parseInt(lastOf(edge.targetHandle.split("#"))!, 10),
          portCount: Object.keys(nodeHandles[edge.target].targetHandles).length,
          edgeIndex: edgesIndex[edge.id].target,
          edgeCount: edgesCount[edge.targetHandle],
        },
      },
    })),
  };
};
