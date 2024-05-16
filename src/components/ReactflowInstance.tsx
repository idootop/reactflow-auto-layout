import { useReactFlow, useStoreApi } from "reactflow";

import { kReactflow } from "../states/reactflow";

// Used to mount onto the ReactFlow component to get the corresponding ReactFlowInstance
export const ReactflowInstance = (): any => {
  kReactflow.instance = useReactFlow();
  kReactflow.store = useStoreApi();
  return undefined;
};
