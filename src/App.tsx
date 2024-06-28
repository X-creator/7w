import Table from "table";
import Header from "header";
import Menu from "menu";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

function App() {
  return (
    <>
      <Header />
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gridTemplateRows: "56px 1fr",
          gridTemplateAreas: `
          "menu text"
          "menu table"`,
          height: "100%",
        }}
      >
        <Menu sx={{ gridArea: "menu" }} />
        <div style={{ display: "flex", alignItems: "center", gridArea: "text" }}>
          <Divider orientation="vertical" />
          <Typography variant="h6" sx={{ px: 3 }}>
            Строительно-монтажные работы
          </Typography>
          <Divider orientation="vertical" />
        </div>
        <Table sx={{ gridArea: "table" }} />
      </main>
    </>
  );
}

export default App;
