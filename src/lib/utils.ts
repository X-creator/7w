export interface TreeLike {
  child: TreeLike[];
  id: string | number;
  parentId: TreeLike["id"] | null;
  childCount: number[];
  depth: number;
  pinFactor: number;
}

export const treeToPlain = (tree: TreeLike[]) => {
  const COUNT_ITSELF = 1;
  const rows: TreeLike[] = [];
  const rowsDict: Record<TreeLike["id"], TreeLike> = {};

  const traverse = (row: TreeLike, parentId: TreeLike["parentId"], depth: TreeLike["depth"]) => {
    row.parentId = parentId;
    row.childCount = [];
    row.depth = depth;

    rows.push(row);
    rowsDict[row.id] = row;

    row.child.forEach((childRow, index) => {
      row.childCount.push(traverse(childRow, row.id, depth + 1));
      childRow.pinFactor = index > 0 ? row.childCount[index - 1] : 1;
    });

    return !row.child.length ? COUNT_ITSELF : row.childCount.reduce((a, b) => a + b, COUNT_ITSELF);
  };

  tree.forEach((item) => {
    traverse(item, item.parentId ?? null, item.depth ?? 0);
  });

  return { rows, rowsDict };
};

interface IncludeOptions<T> {
  include: (keyof T)[];
  exclude?: never;
}

interface ExcludeOptions<T> {
  exclude: (keyof T)[];
  include?: never;
}

type SelectorOptions<T> = IncludeOptions<T> | ExcludeOptions<T>;

export function selector<T>(node: T): T;

export function selector<T extends object, Opt extends IncludeOptions<T>>(
  node: T,
  options: Opt,
): Pick<T, Opt["include"][number]>;

export function selector<T extends object, Opt extends ExcludeOptions<T>>(
  node: T,
  options: Opt,
): Omit<T, Opt["exclude"][number]>;

export function selector<T extends object, Opt extends SelectorOptions<T>>(node: T, options?: Opt) {
  if (typeof node !== "object" || Array.isArray(node)) return node;

  const reducer = (res: T, key: keyof T) => {
    res[key] =
      typeof node[key] === "object"
        ? Object.assign(
            Array.isArray(node[key]) ? [] : {}, // 1 level copy
            node[key],
          )
        : node[key];

    return res;
  };

  if (options && options.include) return options.include.reduce(reducer, {} as T);

  const copy = (Object.keys(node) as (keyof T)[]).reduce(reducer, {} as T);

  if (options && options.exclude)
    return options.exclude.reduce((res, key) => {
      delete res[key];
      return res;
    }, copy);

  return copy; // returns node copy when no options
}
