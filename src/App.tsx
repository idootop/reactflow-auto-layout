import "@xyflow/react/dist/style.css";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useEffect } from "react";

import { jsonDecode } from "@/utils/base";

import { ControlPanel } from "./components/ControlPanel";
import { kEdgeTypes } from "./components/Edges";
import { ColorfulMarkerDefinitions } from "./components/Edges/Marker";
import { kNodeTypes } from "./components/Nodes";
import { ReactflowInstance } from "./components/ReactflowInstance";
import { workflow2reactflow } from "./data/convert";
import defaultWorkflow from "./data/data.json";
import { kDefaultLayoutConfig, ReactflowLayoutConfig } from "./layout/node";
import { useAutoLayout } from "./layout/useAutoLayout";

const EditWorkFlow = () => {
  const [nodes, _setNodes, onNodesChange] = useNodesState([]);
  const [edges, _setEdges, onEdgesChange] = useEdgesState([]);

  const { layout, isDirty } = useAutoLayout();

  const layoutReactflow = async (
    props: ReactflowLayoutConfig & {
      workflow: string;
    }
  ) => {
    if (isDirty) {
      return;
    }
    const input = props.workflow;
    const data = jsonDecode(input);
    if (!data) {
      alert("Invalid workflow JSON data");
      return;
    }
    const workflow = workflow2reactflow(data);
    layout({ ...workflow, ...props });
  };

  useEffect(() => {
    const { nodes, edges } = workflow2reactflow(defaultWorkflow as any);
    layout({ nodes, edges, ...kDefaultLayoutConfig });
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ColorfulMarkerDefinitions />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={kNodeTypes}
        edgeTypes={kEdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background id="0" color="#ccc" variant={BackgroundVariant.Dots} />
        <ReactflowInstance />
        <Controls />
        <MiniMap pannable zoomable />
        <ControlPanel layoutReactflow={layoutReactflow} />
      </ReactFlow>
    </div>
  );
};

export const WorkFlow = () => {
  return (
    <ReactFlowProvider>
      <EditWorkFlow />
    </ReactFlowProvider>
  );
};
