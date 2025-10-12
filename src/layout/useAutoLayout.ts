import { useState } from 'react';

import { nextTick } from '@/utils/base';

import { getReactflowData, kReactflow } from '../states/reactflow';
import { type ILayoutReactflow, layoutReactflow } from './node';

const layoutWithFlush = async (options: ILayoutReactflow) => {
  const layout = await layoutReactflow(options);

  // Wait for the nodes and edges to be cleared
  kReactflow.instance?.setNodes([]);
  kReactflow.instance?.setEdges([]);
  while (kReactflow.instance!.getNodes().length > 0) {
    await nextTick(3);
  }

  // Wait for the nodes and edges to be measured
  kReactflow.instance?.setNodes(layout.nodes);
  kReactflow.instance?.setEdges(layout.edges);
  while (!kReactflow.instance?.getNodes()[0]?.measured) {
    await nextTick(3);
  }

  // Get the layout data
  const { nodes, edges } = getReactflowData();
  return { layout, nodes, edges };
};

export const useAutoLayout = () => {
  const [isDirty, setIsDirty] = useState(false);

  const layout = async (options: ILayoutReactflow) => {
    if (!kReactflow.instance || isDirty || options.nodes.length < 1) {
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
    await kReactflow.instance.fitView({ duration: 0 });
    await kReactflow.instance.zoomTo(kReactflow.instance.getZoom() * 0.8);

    return secondLayout.layout;
  };

  return { layout, isDirty };
};
