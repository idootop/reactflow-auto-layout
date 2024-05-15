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
   * Current Node output port
   *
   * 端口 ID 格式: nodeID#source#idx
   * Port ID format: nodeID#source#idX
   */
  sourceHandles: string[];
  /**
   * 当前 Node 的输入端口（只有一个）
   * Current Node input port (only one)
   *
   * 端口 ID 格式: nodeID#target#idx
   * Port ID format: nodeID#target#idX
   */
  targetHandles: string[];
};

export interface ReactflowEdgePort {
  /**
   * 边的总数
   * Total number of edges
   */
  edges: number;
  /**
   * 端口序号
   * Port serial number
   */
  portIndex: number;
  /**
   * 端口数量
   * Number of ports
   */
  portCount: number;
  /**
   * 当前端口下，Edge 的序号
   * Under the current port, Edge’s serial number
   */
  edgeIndex: number;
  /**
   * 当前端口下，Edge 的总数
   * Under the current port, the total number of Edge
   */
  edgeCount: number;
}

export interface EdgeLayout {
  /**
   * 当前布局参数依赖变量（变更时重新布局）
   * Current layout parameters dependent variables (re -layout at the time of change)
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
