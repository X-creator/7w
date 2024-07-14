import { TreeLike } from "lib/utils.ts";
import { MutationResponse, TreeRow } from "schema";

export type Listener = (updates: Partial<TreeLike>[]) => void;

export interface Provider {
  // #notify(): void;
  // #listeners: Listener[];

  subscribe(cb: Listener): () => void;
}

export interface Tree_Store {
  // #rowsDict: Record<TreeLike["id"], TreeLike>;
  // #rows: TreeLike[];
  // #deletes: Map<TreeLike["id"], TreeLike>;

  initState(nodes: TreeRow[]): void;

  setState(state?: { replaceId?: TreeLike["id"] } & Partial<MutationResponse>): void;

  addNode(node: TreeLike): void;

  deleteNode(id: TreeLike["id"]): void;

  revert(props: Revert): void;
}

export interface Revert {
  type: "add" | "delete";
  id: TreeLike["id"];
}
