import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { queryClient } from "api";
import { getTreeRowsQuery } from "api/queries.ts";
import { deleteRowMutation } from "api/mutations.ts";
import { treeToPlain } from "lib/utils.ts";
import { createNewRow, MARGIN, NEW_ROW_PREFIX, ROW_HEIGHT } from "./helper.ts";

interface ActionProps {
  depth: number;
  id: number;
  pinFactor: number;
}

export default function ActionButtons({ depth, id, pinFactor }: ActionProps) {
  const apiRef = useGridApiContext();
  const { data } = useQuery(getTreeRowsQuery);
  const deleteRow = useMutation(deleteRowMutation);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isGlobalEditing, setIsGlobalEditing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(() => `${id}`.startsWith(NEW_ROW_PREFIX));

  useGridApiEventHandler(apiRef, "stateChange", (state: GridState) => {
    setIsEditing(Boolean(state.editRows[id]));
    setIsGlobalEditing(Object.values(state.editRows).length > 0);
  });

  const onAdd = () => {
    if (isGlobalEditing) return;

    const newRow = createNewRow(id);
    data?.rowsDict[id].child?.push(newRow);

    queryClient.setQueryData(getTreeRowsQuery.queryKey, treeToPlain(data?.tree ?? []));

    setTimeout(() => {
      apiRef.current.startRowEditMode({ id: newRow.id, fieldToFocus: "rowName" });
    });
  };

  const onDelete = () => {
    if (!data || isGlobalEditing) return;
    deleteRow.mutate(id);
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
        marginLeft: depth * MARGIN + "px",
        background: "transparent",
        marginRight: isHovered && !isGlobalEditing ? 0 : "30px",
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

            ...(depth > 0 && {
              "&::before": {
                height: ROW_HEIGHT * pinFactor,
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
      {isHovered && !isGlobalEditing && (
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
