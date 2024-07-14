import { CSSProperties, KeyboardEvent, MouseEvent, useLayoutEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DataGrid,
  GridCellParams,
  GridRowModes,
  GridValidRowModel,
  MuiEvent,
  useGridApiRef,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { shallowEqualObjects } from "shallow-equal";
import { getTreeRowsQuery } from "api/queries.ts";
import { columns, NEW_ROW_PREFIX, onRowEditStop } from "./helper.ts";
import { createRowMutation, updateRowMutation } from "api/mutations.ts";
import { NewRowSchema, UpdateRowSchema } from "schema";
import { useStore } from "lib/store/use-store.ts";

const StyledTable = styled(DataGrid)({
  "& .MuiDataGrid-cell[data-field='actions']": {
    overflow: "initial",
  },
});

interface TableProps {
  sx?: CSSProperties;
}

export default function Table({ sx }: TableProps) {
  const store = useStore();
  const apiRef = useGridApiRef();
  const { isLoading } = useQuery(getTreeRowsQuery);
  const createRow = useMutation(createRowMutation);
  const updateRow = useMutation(updateRowMutation);

  useLayoutEffect(() => {
    return store.subscribe((rows) => {
      apiRef.current.setRows(rows);

      setTimeout(() => {
        void apiRef.current
          .autosizeColumns({
            expand: true,
          })
          .then(() => {
            setTimeout(() => {
              void apiRef.current.autosizeColumns({
                includeHeaders: true,
                includeOutliers: true,
              });
            });
          });
      });
    });
  }, []);

  const onCellKeyDown = (params: GridCellParams, event: MuiEvent<KeyboardEvent>) => {
    event.defaultMuiPrevented = true;

    if (event.key === "Enter" && params.cellMode === GridRowModes.Edit)
      apiRef.current.stopRowEditMode({ id: params.id });
  };

  const onCellDoubleClick = (_: GridCellParams, event: MuiEvent<MouseEvent>) => {
    if (Object.values(apiRef.current.state.editRows).length > 0) event.defaultMuiPrevented = true;
  };

  const processRowUpdate = (n: GridValidRowModel, o: GridValidRowModel) => {
    if (`${n.id}`.startsWith(NEW_ROW_PREFIX)) {
      const newRow = NewRowSchema.strip().parse(n);
      createRow.mutate(
        { id: n.id as string, newRow },
        {
          onSuccess: (data, { id }) => store.setState({ replaceId: id, ...data }),
          onError: (_, { id }) => store.revert({ type: "add", id }),
        },
      );
      return n;
    }

    if (shallowEqualObjects(n, o)) return o;

    const updatedRow = UpdateRowSchema.strip().parse(n);
    updateRow.mutate(updatedRow, {
      onSuccess: (data) => store.setState(data),
      onError: () => store.setState({}),
    });

    return n;
  };

  return (
    <StyledTable
      sx={sx}
      autoHeight
      hideFooter
      editMode="row"
      rowHeight={60}
      sortingOrder={["asc", "desc"]}
      columns={columns}
      loading={isLoading || createRow.isPending || updateRow.isPending}
      apiRef={apiRef}
      onRowEditStop={onRowEditStop}
      onCellKeyDown={onCellKeyDown}
      onCellDoubleClick={onCellDoubleClick}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={(error: Error) => {
        console.log("onProcessRowUpdateError", error, error.message);
      }}
    />
  );
}
