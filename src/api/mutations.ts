import { UseMutationOptions } from "@tanstack/react-query";
import { MutationResponse, NewRow, UpdateRow } from "schema";
import { getTreeRowsQuery } from "api/queries.ts";
import { createRow, deleteRow, MUTATION_KEYS, queryClient, updateRow } from "api";
import { treeToPlain } from "lib/utils.ts";

const onMutate = () => queryClient.getQueryData(getTreeRowsQuery.queryKey);

export const createRowMutation: UseMutationOptions<
  MutationResponse,
  Error,
  { id: string; newRow: NewRow },
  ReturnType<typeof onMutate>
> = {
  mutationKey: [MUTATION_KEYS.createRow],
  mutationFn: ({ newRow }) => createRow(newRow),
  onMutate,
  onSettled: (data, err, { id }, context) => {
    const parentId = context?.rowsDict[id].parentId;

    if (err && context) {
      if (!parentId) context.tree = context.tree.filter((row) => row.id !== id);
      else {
        const ref = context.rowsDict[parentId];
        ref.child = ref.child.filter((row) => row.id !== id);
      }
    }

    if (data && context) {
      if (!parentId)
        context.tree = context.tree.map((row) =>
          row.id === id ? { ...row, ...data.current } : row,
        );
      else {
        const ref = context.rowsDict[parentId];
        ref.child = ref.child.map((row) => (row.id === id ? { ...row, ...data.current } : row));
      }

      data.changed.forEach((row) => {
        if (context?.rowsDict?.[row.id])
          context.rowsDict[row.id] = Object.assign(context.rowsDict[row.id], row);
      });
    }

    queryClient.setQueryData(getTreeRowsQuery.queryKey, treeToPlain(context?.tree ?? []));
  },
};

export const updateRowMutation: UseMutationOptions<
  MutationResponse,
  Error,
  UpdateRow,
  ReturnType<typeof onMutate>
> = {
  mutationKey: [MUTATION_KEYS.createRow],
  mutationFn: updateRow,
  onMutate,
  onSettled: (data, _, row, context) => {
    if (data?.current && context?.rowsDict[row.id])
      context.rowsDict[row.id] = Object.assign(context.rowsDict[row.id], data.current);

    data?.changed.forEach((row) => {
      if (context?.rowsDict[row.id])
        context.rowsDict[row.id] = Object.assign(context.rowsDict[row.id], row);
    });

    const newState = {
      rows: [...context!.rows],
      tree: context!.tree,
      rowsDict: context!.rowsDict,
    };
    queryClient.setQueryData(getTreeRowsQuery.queryKey, newState);
  },
};

export const deleteRowMutation: UseMutationOptions<
  MutationResponse,
  Error,
  number,
  { errorContext: ReturnType<typeof onMutate> }
> = {
  mutationKey: [MUTATION_KEYS.createRow],
  mutationFn: deleteRow,
  onMutate: (id) => {
    const data = queryClient.getQueryData(getTreeRowsQuery.queryKey);
    const errorContext = structuredClone(data);

    if (data) {
      const parentId = data.rowsDict[id].parentId;
      if (!parentId) data.tree = data.tree.filter((row) => row.id !== id);
      else {
        const ref = data.rowsDict[parentId];
        ref.child = ref.child.filter((row) => row.id !== id);
      }

      queryClient.setQueryData(getTreeRowsQuery.queryKey, treeToPlain(data.tree));
    }

    return { errorContext };
  },
  onSettled: (data, err, _, context) => {
    if (err && context?.errorContext) {
      queryClient.setQueryData(getTreeRowsQuery.queryKey, context.errorContext);
      return;
    }

    const { rows, tree, rowsDict } = queryClient.getQueryData(getTreeRowsQuery.queryKey)!;

    data?.changed.forEach((row) => {
      if (rowsDict?.[row.id]) rowsDict[row.id] = Object.assign(rowsDict[row.id], row);
    });

    const newState = {
      rows: [...rows],
      tree,
      rowsDict,
    };
    queryClient.setQueryData(getTreeRowsQuery.queryKey, newState);
  },
};
