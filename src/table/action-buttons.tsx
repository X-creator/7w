import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  GridActionsCellItem,
  GridState,
  useGridApiContext,
  useGridApiEventHandler,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import FeedIcon from "@mui/icons-material/Feed";
import DeleteIcon from "@mui/icons-material/Delete";
import { deepOrange } from "@mui/material/colors";
import { deleteRowMutation } from "api/mutations.ts";
import { createNewRow, MARGIN, NEW_ROW_PREFIX, ROW_HEIGHT } from "./helper.ts";
import { NewRow } from "schema";
import { TreeLike } from "lib/utils.ts";
import { useStore } from "lib/store/use-store.ts";

interface ActionProps {
  row: NewRow & TreeLike;
}

export default function ActionButtons({ row }: ActionProps) {
  const store = useStore();
  const apiRef = useGridApiContext();
  const deleteRow = useMutation(deleteRowMutation);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isGlobalEditing, setIsGlobalEditing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(() => `${row.id}`.startsWith(NEW_ROW_PREFIX));
  const isPending = isGlobalEditing || deleteRow.isPending; // prevent race condition

  useGridApiEventHandler(apiRef, "stateChange", (state: GridState) => {
    setIsEditing(Boolean(state.editRows[row.id]));
    setIsGlobalEditing(Object.values(state.editRows).length > 0);
  });

  const onAdd = () => {
    if (isPending) return;

    const newRow = createNewRow(row);
    store.addNode(newRow);

    setTimeout(() => {
      apiRef.current.startRowEditMode({ id: newRow.id, fieldToFocus: "rowName" });
    });
  };

  const onDelete = () => {
    if (isPending) return;

    store.deleteNode(row.id);

    deleteRow.mutate(row.id as number, {
      onSuccess: (data) => store.setState(data),
      onError: () => {
        store.revert({
          type: "delete",
          id: row.id,
        });
      },
    });
  };

  const onMouseOver = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Paper
      elevation={0}
      onMouseLeave={onMouseLeave}
      sx={{
        marginLeft: row.depth * MARGIN + "px",
        background: "transparent",
        marginRight: isHovered && !isPending ? 0 : "30px",
        "&:hover": {
          background: "rgb(65, 65, 68)",
        },
      }}
    >
      <GridActionsCellItem
        icon={
          <div className="wrapper">
            <FeedIcon sx={{ fontSize: 20, color: isEditing ? deepOrange[500] : "inherit" }} />
          </div>
        }
        key="Edit"
        label="Edit"
        color="primary"
        onMouseOver={onMouseOver}
        onClick={onAdd}
        sx={{
          position: "relative",
          "& .wrapper": {
            position: "relative",
            display: "flex",

            ...(row.depth > 0 && {
              "&::before": {
                height: ROW_HEIGHT * row.pinFactor,
                content: "''",
                position: "absolute",
                bottom: "50%",
                translate: "-11px",
                borderLeft: "solid 1px white",
                borderBottom: "solid 1px white",
                width: "14px",
                background: "transparent",
                pointerEvents: "none",
              },
            }),
            "&::after": {
              content: "''",
              position: "absolute",
              inset: "3px",
              borderRadius: "50%",
              background: "#121212",
              zIndex: 1,
            },
          },
          "& .MuiSvgIcon-root": {
            position: "relative",
            zIndex: 2,
          },
        }}
      />
      {isHovered && !isPending && (
        <GridActionsCellItem
          icon={<DeleteIcon />}
          key="Delete"
          label="Delete"
          color="error"
          onClick={onDelete}
        />
      )}
    </Paper>
  );
}
