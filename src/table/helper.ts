import { GridColDef, GridEventListener, GridRowEditStopReasons } from "@mui/x-data-grid";
import { renderActions } from "./renderFn.tsx";

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
    sortable: false,
  },
  {
    flex: 1,
    field: "rowName",
    headerName: "Наименование работ",
    headerAlign: "left",
    align: "left",
    sortable: false,
    editable: true,
  },
  {
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

export const createNewRow = (parentId: number | null) => ({
  id: `${NEW_ROW_PREFIX}${Date.now()}`,
  parentId,
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
});
