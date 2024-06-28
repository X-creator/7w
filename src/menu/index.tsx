import { CSSProperties } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";

const LIST = [
  "По проекту",
  "Объекты",
  "РД",
  "МТО",
  "СМР",
  "График",
  "МиМ",
  "Рабочие",
  "Капвложения",
  "Бюджет",
  "Финансирование",
  "Панорамы",
  "Камеры",
  "Поручения",
  "Контрагенты",
];

export default function Menu({ sx }: { sx?: CSSProperties }) {
  return (
    <List sx={sx}>
      <ListSubheader
        sx={{
          lineHeight: 1,
          paddingBottom: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography>Название проекта</Typography>
          <Typography variant="caption">Аббревиатура</Typography>
        </div>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 3,
            justifyContent: "center",
          }}
        >
          <ExpandMoreIcon />
        </ListItemIcon>
      </ListSubheader>
      <Divider />
      {LIST.map((text) => (
        <ListItem key={text} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            selected={text === "СМР"}
            sx={{
              minHeight: 48,
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: "center",
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
