import "reactflow/dist/style.css";

import { useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { jsonDecode } from "@/utils/base";

import { ControlPanel } from "./components/ControlPanel";
import { kEdgeTypes } from "./components/Edges";
import { ColorfulMarkerDefinitions } from "./components/Edges/Marker";
import { kNodeTypes } from "./components/Nodes";
import { ReactflowInstance } from "./components/ReactflowInstance";
import defaultWorkflow from "./data/data.json";
import { workflow2reactflow } from "./data/convert";
import { kDefaultLayoutConfig, ReactflowLayoutConfig } from "./layout/node";
import { useAutoLayout } from "./layout/useAutoLayout";

const EditWorkFlow = () => {
  const [nodes, _setNodes, onNodesChange] = useNodesState([]);
  const [edges, _setEdges, onEdgesChange] = useEdgesState([]);

  const { layout, layouting } = useAutoLayout();

  const layoutReactflow = async (
    props: ReactflowLayoutConfig & {
      workflow: string;
    }
  ) => {
    if (layouting) {
      return;
    }
    const input = props.workflow;
    const data = jsonDecode(input);
    if (!data) {
      alert("Invalid workflow JSON data");
      return;
    }
    const workflow = workflow2reactflow(data);
    await layout({ ...workflow, ...props });
  };

  useEffect(() => {
    const { nodes, edges } = workflow2reactflow(defaultWorkflow as any);
    console.log({ nodes, edges });
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
        <MiniMap
          pannable
          zoomable
          maskColor="transparent"
          maskStrokeColor="black"
          maskStrokeWidth={10}
        />
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
