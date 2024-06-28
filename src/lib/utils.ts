type TreeLike = {
  child: TreeLike[];
} & Record<string, unknown>;

export interface AugmentedTree extends TreeLike {
  id: string | number;
  parentId: AugmentedTree["id"] | null;
  childCount: number[];
  depth: number;
  pinFactor: number;
}

export const treeToPlain = (tree: TreeLike[]) => {
  const COUNT_ITSELF = 1;
  const rows: AugmentedTree[] = [];
  const rowsDict: Record<AugmentedTree["id"], AugmentedTree> = {};

  const traverse = (
    elem: TreeLike,
    parentId: AugmentedTree["parentId"] = null,
    depth: AugmentedTree["depth"] = 0,
  ) => {
    const row = elem as AugmentedTree;

    row.parentId = parentId;
    row.childCount = [];
    row.depth = depth;

    rows.push(row);
    rowsDict[row.id] = row;

    row.child.forEach((item, index) => {
      row.childCount.push(traverse(item, row.id, depth + 1));
      item.pinFactor = index > 0 ? row.childCount[index - 1] : 1;
    });

    return !row.child.length
      ? COUNT_ITSELF
      : row.childCount.reduce((acc, curr) => acc + curr, COUNT_ITSELF);
  };

  tree.forEach((item) => {
    traverse(item);
  });

  return { tree, rows, rowsDict };
};
