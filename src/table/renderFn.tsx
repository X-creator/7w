import { GridRowParams } from "@mui/x-data-grid";
import ActionButtons from "table/action-buttons.tsx";
import { NewRow } from "schema";
import { TreeLike } from "lib/utils.ts";

export const renderActions = (params: GridRowParams<NewRow & TreeLike>) => [
  <ActionButtons row={params.row} key="actions" />,
];
