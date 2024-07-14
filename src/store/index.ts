import { TreeLike, treeToPlain } from "lib/utils.ts";
import { MutationResponse, TreeRow } from "schema";
import { Listener, Provider, Revert, Tree_Store } from "store/types.ts";

export class Store implements Tree_Store, Provider {
  #rowsDict: Record<TreeLike["id"], TreeLike> = {};
  #rows: TreeLike[] = [];
  #listeners: Listener[] = [];
  #deletes = new Map<TreeLike["id"], TreeLike>();

  /////////////////////////////////////////////////////////////////////

  subscribe(cb: Listener) {
    this.#listeners.push(cb);

    return () => {
      this.#listeners = this.#listeners.filter((listener) => listener !== cb);
    };
  }

  /////////////////////////////////////////////////////////////////////

  #notify() {
    //  for immutability
    // const updates = this.#rows.map((node) => selector(node, { exclude: ["child"] }));
    // this.#listeners.forEach((listener) => listener(updates));
    console.log(" #notify", this.#rows);
    this.#listeners.forEach((listener) => listener(this.#rows));
  }

  /////////////////////////////////////////////////////////////////////

  initState(data: TreeRow[]) {
    const { rows, rowsDict } = treeToPlain(data as unknown as TreeLike[]);
    this.#rowsDict = rowsDict;
    this.#rows = rows;

    this.#notify();
  }

  /////////////////////////////////////////////////////////////////////

  setState({
    replaceId,
    current,
    changed = [],
  }: { replaceId?: TreeLike["id"] } & Partial<MutationResponse>) {
    if (replaceId && current) {
      this.#rowsDict[current.id] = Object.assign(this.#rowsDict[replaceId], current);
      delete this.#rowsDict[replaceId];
    }

    if (!replaceId && current) Object.assign(this.#rowsDict[current.id], current);

    changed?.forEach((row) => {
      Object.assign(this.#rowsDict[row.id], row);
    });

    this.#notify();
  }

  /////////////////////////////////////////////////////////////////////

  #traverseUp(fromNode: TreeLike) {
    const nodes = {
      currentNode: fromNode,
      parentNode: fromNode.parentId ? this.#rowsDict[fromNode.parentId] : null,
    };

    const next = () => {
      if (!nodes.parentNode) return;

      nodes.currentNode = nodes.parentNode;
      nodes.parentNode = nodes.currentNode.parentId
        ? this.#rowsDict[nodes.currentNode.parentId]
        : null;
    };

    return {
      nodes: new Proxy(nodes, { set: () => false }),
      next,
    } as const;
  }

  /////////////////////////////////////////////////////////////////////

  addNode(node: TreeLike) {
    // debugger;
    const { rows, rowsDict } = treeToPlain([node]);
    Object.assign(this.#rowsDict, rowsDict); // add reference to #rowsDict

    const addCount = rows.length;
    let isAdded = false;
    const { nodes, next } = this.#traverseUp(node);

    if (nodes.parentNode) {
      nodes.parentNode.child.push(node); // add reference to parents.child array
      nodes.parentNode.childCount.push(addCount);
    }

    //traverse tree up
    while ((next(), nodes.parentNode)) {
      if (nodes.parentNode.childCount.length === 1) {
        nodes.parentNode.childCount[0] += addCount;
        continue;
      }

      const idx = nodes.parentNode.child.findIndex((node) => node.id === nodes.currentNode.id);
      nodes.parentNode.childCount[idx] += addCount;

      const nextSibling = nodes.parentNode.child[idx + 1];
      if (nextSibling) nextSibling.pinFactor += addCount;

      if (!isAdded && nextSibling) {
        const idx = this.#rows.findIndex((node) => node.id === nextSibling.id);
        this.#rows.splice(idx, 0, ...rows); // add reference to #rows
        isAdded = true;
      }
    }

    if (!isAdded) this.#rows.push(...rows); // add reference to #rows

    this.#notify();
  }

  /////////////////////////////////////////////////////////////////////

  deleteNode(id: TreeLike["id"]) {
    const { nodes, next } = this.#traverseUp(this.#rowsDict[id]);
    this.#deletes.set(id, nodes.currentNode);
    const deleteCount = nodes.currentNode.childCount.reduce((a, b) => a + b, 1); //already count itself

    if (nodes.parentNode) {
      const idx = nodes.parentNode.child.findIndex((node) => node.id === id);
      const nextSibling = nodes.parentNode.child[idx + 1];
      if (nextSibling) nextSibling.pinFactor = idx > 0 ? nodes.parentNode.childCount[idx - 1] : 1;

      nodes.parentNode.childCount[idx] -= deleteCount;
      if (nodes.parentNode.childCount[idx] === 0) nodes.parentNode.childCount.splice(idx, 1);

      nodes.parentNode.child.splice(idx, 1); // delete reference from parents.child array
    }

    //traverse tree up
    while ((next(), nodes.parentNode)) {
      const idx = nodes.parentNode.child.findIndex((node) => node.id === nodes.currentNode.id);
      nodes.parentNode.childCount[idx] -= deleteCount;
      if (nodes.parentNode.childCount[idx] === 0) nodes.parentNode.childCount.splice(idx, 1);

      const nextSibling = nodes.parentNode.child[idx + 1];
      if (nextSibling) nextSibling.pinFactor -= deleteCount;
    }

    const idx = this.#rows.findIndex((node) => node.id === id);
    const deleted = this.#rows.splice(idx, deleteCount); // delete reference from #rows

    deleted.forEach((node) => {
      delete this.#rowsDict[node.id]; // delete reference from #rowsDict
    });

    this.#notify();
  }

  /////////////////////////////////////////////////////////////////////

  revert({ type, id }: Revert) {
    if (type === "add") this.deleteNode(id);

    if (type === "delete") {
      const deletedNode = this.#deletes.get(id);
      if (deletedNode) this.addNode(deletedNode);

      this.#deletes.clear(); // only 1 node can be stored
    }
  }
}

export const store = new Store();
