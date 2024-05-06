import { useState } from "react";

import { nextTick } from "@/utils/base";

import { getReactflowData, kReactflow } from "../states/reactflow";
import { getRootNode } from "./metadata";
import { ILayoutReactflow, layoutReactflow } from "./node";

export const layoutWithFlush = async (options: ILayoutReactflow) => {
  const layout = await layoutReactflow(options);
  kReactflow.instance?.setNodes(layout.nodes);
  kReactflow.instance?.setEdges(layout.edges);
  await nextTick(10); // 等待 render 完毕
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
    // 第一次布局（获取元素尺寸）
    const firstLayout = await layoutWithFlush({
      ...options,
      visibility: "hidden",
    });
    // 第二次布局（使用元素实际尺寸）
    const secondLayout = await layoutWithFlush({
      visibility: "visible",
      ...options,
      nodes: firstLayout.nodes ?? options.nodes,
      edges: firstLayout.edges ?? options.edges,
    });
    setLayouting(false);

    // 居中到 root 节点的位置
    const root = getRootNode(secondLayout.layout.nodes);
    // 来一点偏移，使其视觉上居中
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
