import { GridColDef, GridEventListener, GridRowEditStopReasons } from "@mui/x-data-grid";
import { renderActions } from "./renderFn.tsx";
import { NewRow } from "schema";
import { TreeLike } from "lib/utils.ts";

export const NEW_ROW_PREFIX = "add-";
export const ROW_HEIGHT = 60;
export const MARGIN = 20;

export const columns: GridColDef[] = [
  {
    field: "actions",
    type: "actions",
    headerName: "Уровень",
    headerAlign: "left",
    align: "left",
    getActions: renderActions,
  },
  {
    flex: 2,
    field: "rowName",
    headerName: "Наименование работ",
    headerAlign: "left",
    align: "left",
    sortable: false,
    editable: true,
    minWidth: 150,
  },
  {
    flex: 1,
    field: "salary",
    headerName: "Основная з/п",
    headerAlign: "left",
    align: "left",
    sortable: false,
    editable: true,
    minWidth: 150,
    type: "number",
  },
  {
    flex: 1,
    field: "equipmentCosts",
    headerName: "Оборудование",
    headerAlign: "left",
    align: "left",
    sortable: false,
    editable: true,
    minWidth: 150,
    type: "number",
  },
  {
    flex: 1,
    field: "overheads",
    headerName: "Накладные расходы",
    headerAlign: "left",
    align: "left",
    sortable: false,
    editable: true,
    minWidth: 160,
    type: "number",
  },
  {
    flex: 1,
    field: "estimatedProfit",
    headerName: "Сметная прибыль",
    headerAlign: "left",
    align: "left",
    sortable: false,
    editable: true,
    minWidth: 150,
    type: "number",
  },
];

export const onRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};

export const createNewRow = (parentRow: NewRow & TreeLike) => ({
  id: `${NEW_ROW_PREFIX}${Date.now()}`,
  parentId: parentRow.id,
  depth: parentRow.depth + 1,
  pinFactor: parentRow.childCount.reduce((a, b) => a + b, 1), //already count itself
  equipmentCosts: 0,
  estimatedProfit: 0,
  machineOperatorSalary: 0,
  mainCosts: 0,
  materials: 0,
  mimExploitation: 0,
  overheads: 0,
  rowName: "",
  salary: 0,
  supportCosts: 0,
  child: [],
  childCount: [],
});
