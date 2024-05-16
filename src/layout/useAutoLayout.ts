import { useState } from "react";

import { nextTick } from "@/utils/base";

import { getReactflowData, kReactflow } from "../states/reactflow";
import { getRootNode } from "./metadata";
import { ILayoutReactflow, layoutReactflow } from "./node";

export const layoutWithFlush = async (options: ILayoutReactflow) => {
  const layout = await layoutReactflow(options);
  kReactflow.instance?.setNodes(layout.nodes);
  kReactflow.instance?.setEdges(layout.edges);
  // Wait for render to complete
  await nextTick(10);
  const { nodes, edges } = getReactflowData();
  return { layout, nodes, edges };
};

export const useAutoLayout = () => {
  const [layouting, setLayouting] = useState(false);

  const layout = async (options: ILayoutReactflow) => {
    if (!kReactflow.instance || layouting || options.nodes.length < 1) {
      return;
    }
    const isHorizontal = options.direction === "horizontal";

    setLayouting(true);
    // Perform the first layout to acquire node sizes
    const firstLayout = await layoutWithFlush({
      ...options,
      visibility: "hidden", // Hide layout during the first layout pass
    });
    // Perform the second layout using actual node sizes
    const secondLayout = await layoutWithFlush({
      visibility: "visible",
      ...options,
      nodes: firstLayout.nodes ?? options.nodes,
      edges: firstLayout.edges ?? options.edges,
    });
    setLayouting(false);

    // Center the viewpoint to the position of the root node
    const root = getRootNode(secondLayout.layout.nodes);
    // Give it a little offset so it's visually centered
    const offset = isHorizontal
      ? {
          x: 0.2 * document.body.clientWidth,
          y: 0 * document.body.clientHeight,
        }
      : {
          x: 0 * document.body.clientHeight,
          y: 0.3 * document.body.clientHeight,
        };
    if (root) {
      kReactflow.instance.setCenter(
        root.position.x + offset.x,
        root.position.y + offset.y,
        {
          zoom: 1,
        }
      );
    }
    return secondLayout.layout;
  };

  return { layout, layouting };
};
