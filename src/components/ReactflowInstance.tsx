import { useReactFlow, useStoreApi } from 'reactflow';

import { kReactflow } from '../states/reactflow';

// 用于挂载到 ReactFlow 子组件，获取对应的 ReactFlowInstance
export const ReactflowInstance = (): any => {
  kReactflow.instance = useReactFlow();
  kReactflow.store = useStoreApi();
  return undefined;
};
