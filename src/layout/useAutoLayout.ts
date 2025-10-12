import { nextTick } from '@del-wang/utils/web';
import { useState } from 'react';

import { flowStore } from '../states/reactflow';
import { type ILayoutReactflow, layoutReactflow } from './node';

const layoutWithFlush = async (options: ILayoutReactflow) => {
  const layout = await layoutReactflow(options);

  // Wait for the nodes and edges to be cleared
  flowStore.value.setNodes([]);
  flowStore.value.setEdges([]);
  while (flowStore.value.getNodes().length > 0) {
    await nextTick(3);
  }

  // Wait for the nodes and edges to be measured
  flowStore.value.setNodes(layout.nodes);
  flowStore.value.setEdges(layout.edges);
  while (!flowStore.value.getNodes()[0]?.measured) {
    await nextTick(3);
  }

  // Get layouted nodes and edges
  const { nodes, edges } = flowStore.value.getNodesAndEdges();
  return { layout, nodes, edges };
};

export const useAutoLayout = () => {
  const [isDirty, setIsDirty] = useState(false);

  const layout = async (options: ILayoutReactflow) => {
    if (!flowStore.value.initialized || isDirty || options.nodes.length < 1) {
      return;
    }

    setIsDirty(true);
    // Perform the first layout to measure node sizes
    const firstLayout = await layoutWithFlush({
      ...options,
      visibility: 'hidden', // Hide layout during the first layout pass
    });
    // Perform the second layout using actual node sizes
    const secondLayout = await layoutWithFlush({
      visibility: 'visible',
      ...options,
      nodes: firstLayout.nodes,
      edges: firstLayout.edges,
    });
    setIsDirty(false);

    // Center the viewpoint
    await flowStore.value.fitView({ duration: 0 });
    await flowStore.value.zoomTo(flowStore.value.getZoom() * 0.8);

    return secondLayout.layout;
  };

  return { layout, isDirty };
};
