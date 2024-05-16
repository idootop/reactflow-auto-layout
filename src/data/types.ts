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
   * The output ports of the current node.
   *
   * Format of Port ID: `nodeID#source#idx`
   */
  sourceHandles: string[];
  /**
   * The input port of the current node (only one).
   *
   * Format of Port ID: `nodeID#target#idx`
   */
  targetHandles: string[];
};

export interface ReactflowEdgePort {
  /**
   * Total number of edges in this direction (source or target).
   */
  edges: number;
  /**
   * Number of ports
   */
  portCount: number;
  /**
   * Port's index.
   */
  portIndex: number;
  /**
   * Total number of Edges under the current port.
   */
  edgeCount: number;
  /**
   * Index of the Edge under the current port.
   */
  edgeIndex: number;
}

export interface EdgeLayout {
  /**
   * SVG path for edge rendering
   */
  path: string;
  /**
   * Control points on the edge.
   */
  points: ControlPoint[];
  labelPosition: XYPosition;
  /**
   * Current layout dependent variables (re-layout when changed).
   */
  deps?: any;
  /**
   * Potential control points on the edge, for debugging purposes only.
   */
  inputPoints: ControlPoint[];
}

export interface ReactflowEdgeData {
  /**
   * Data related to the current edge's layout, such as control points.
   */
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
