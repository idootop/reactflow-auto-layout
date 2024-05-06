import { Edge, Node, XYPosition } from "reactflow";

import { ControlPoint } from "../layout/edge/point";

interface WorkflowNode {
  id: string;
  type: string;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export type ReactflowNode<
  D = any,
  T extends string | undefined = string | undefined
> = Node<D, T>;
export type ReactflowEdge<D = any> = Edge<D>;

export type ReactflowNodeData = WorkflowNode & {
  /**
   * 当前 Node 的输出端口
   *
   * 端口 ID 格式: nodeID#source#idx
   */
  sourceHandles: string[];
  /**
   * 当前 Node 的输入端口（只有一个）
   *
   * 端口 ID 格式: nodeID#target#idx
   */
  targetHandles: string[];
};

export interface ReactflowEdgePort {
  /**
   * 边的总数
   */
  edges: number;
  /**
   * 端口序号
   */
  portIndex: number;
  /**
   * 端口数量
   */
  portCount: number;
  /**
   * 当前端口下，Edge 的序号
   */
  edgeIndex: number;
  /**
   * 当前端口下，Edge 的总数
   */
  edgeCount: number;
}

export interface EdgeLayout {
  /**
   * 当前布局参数依赖变量（变更时重新布局）
   */
  deps?: any;
  path: string;
  points: ControlPoint[];
  inputPoints: ControlPoint[];
  labelPosition: XYPosition;
}

export interface ReactflowEdgeData {
  layout?: EdgeLayout;
  sourcePort: ReactflowEdgePort;
  targetPort: ReactflowEdgePort;
}

export type ReactflowNodeWithData = ReactflowNode<ReactflowNodeData>;
export type ReactflowEdgeWithData = ReactflowEdge<ReactflowEdgeData>;

export interface Reactflow {
  nodes: ReactflowNodeWithData[];
  edges: ReactflowEdgeWithData[];
}
