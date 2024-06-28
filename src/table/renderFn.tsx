import { GridRowParams } from "@mui/x-data-grid";
import ActionButtons from "table/action-buttons.tsx";

export const renderActions = (params: GridRowParams) => [
  <ActionButtons {...params.row} key="actions" />,
];
