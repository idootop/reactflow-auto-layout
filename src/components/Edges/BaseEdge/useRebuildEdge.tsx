import { useXState, XSta } from "xsta";

export const rebuildEdge = (id: string) => {
  XSta.set("rebuildEdge-" + id, (e: any) => !e);
};

export const useRebuildEdge = (id: string) => {
  useXState("rebuildEdge-" + id, false);
};
