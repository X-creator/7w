import { queryOptions } from "@tanstack/react-query";
import { getTreeRows, QUERY_KEYS } from "api";
import { store } from "store";

export const getTreeRowsQuery = queryOptions({
  queryKey: [QUERY_KEYS.getTreeRows] as const,
  queryFn: async () => {
    const data = await getTreeRows();
    store.initState(data);

    return data;
  },
  staleTime: Infinity,
  throwOnError: true,
});
