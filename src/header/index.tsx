import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import IconButton from "@mui/material/IconButton";
import AppsIcon from "@mui/icons-material/Apps";
import ReplyIcon from "@mui/icons-material/Reply";

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <AppsIcon />
        </IconButton>
        <IconButton size="large" color="inherit" aria-label="menu">
          <ReplyIcon />
        </IconButton>
        <Tabs
          value={0}
          aria-label="full width tabs example"
          sx={{
            "& .MuiTab-root": { textTransform: "none" },
            "& .MuiButtonBase-root.Mui-selected": { color: "#fff" },
            "& .MuiTabs-indicator": { background: "#fff" },
          }}
        >
          <Tab label="Просмотр" {...a11yProps(0)} />
          <Tab label="Управление" {...a11yProps(1)} />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
