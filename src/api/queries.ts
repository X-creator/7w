import { queryOptions } from "@tanstack/react-query";
import { getTreeRows, QUERY_KEYS } from "api";
import { treeToPlain } from "lib/utils.ts";

export const getTreeRowsQuery = queryOptions({
  queryKey: [QUERY_KEYS.getTreeRows] as const,
  queryFn: async () =>
    getTreeRows()
      .then(treeToPlain)
      .catch((err: Error) => console.error(err.message)),
  staleTime: Infinity,
  structuralSharing: false,
});
