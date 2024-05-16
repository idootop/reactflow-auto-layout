import { useReactFlow, useStoreApi } from 'reactflow';

import { kReactflow } from '../states/reactflow';

// 用于挂载到 ReactFlow 子组件，获取对应的 ReactFlowInstance
// Used to mount it to the ReactFlow sub-component to get the corresponding ReactFlowInstance
export const ReactflowInstance = (): any => {
  kReactflow.instance = useReactFlow();
  kReactflow.store = useStoreApi();
  return undefined;
};
