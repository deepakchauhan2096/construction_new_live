import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Box, Container, Grid } from "@mui/material";


import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));


const data = [
  {
    contractname: "Contracts",
    counts: "300",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing",
    url: "Learn More",
  },
  {
    contractname: "Employees",
    counts: "200",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing",
    url: "Learn More",
  },
  {
    contractname: "Supplier",
    counts: "200",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing",
    url: "Learn More",
  },
  {
    contractname: "Sub-Contractors",
    counts: "200",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing",
    url: "Learn More",
  },
  {
    contractname: "Payments",
    counts: "200",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing",
    url: "Learn More",
  },
  {
    contractname: "Reminders",
    counts: "200",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing",
    url: "Learn More",
  },
  {
    contractname: "Reminders",
    counts: "200",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing",
    url: "Learn More",
  },
];

const data2 = [
  {
    Paymentstatus: "15",
    Pending: "300",
    Paymentcomplete: "14",
    Approval: "Learn More",
  },
];

const card = (
  <>
    {data.map((post) => (
      <Grid xl={4} xs={12} item spacing={3}>
        <Card sx={{ m: 0.5 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 0 }} color="primary">
              {post.contractname}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Total {post.contractname}: {post.counts}
            </Typography>
            <Typography component="div">{post.description}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">{post.url}</Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </>
);

const card2 = (
  <>
    {data2.map((post) => (
      <Grid xl={12} item spacing={3}>
        <Card sx={{ m: 0.5 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ mb: 1, display: "inline-block" }}
              color="primary"
            >
              Payment Status{" "}
              <Typography
                sx={{
                  display: "inline-block",
                  color: "#fff",
                  background: "red",
                  px: 1,
                  borderRadius: 10,
                }}
              ></Typography>
            </Typography>
            <Typography
              variant=""
              sx={{ mb: 1, display: "inline-block" }}
              color="primary"
            >
              Pending{" "}
              <Typography
                sx={{
                  display: "inline-block",
                  color: "#333",
                  background: "yellow",
                  px: 1,
                  borderRadius: 10,
                }}
              >
                {post.Pending}
              </Typography>
            </Typography>
            <Typography
              variant=""
              sx={{ mb: 1, display: "inline-block" }}
              color="primary"
            >
              Payment Complete{" "}
              <Typography
                sx={{
                  display: "inline-block",
                  color: "#fff",
                  background: "green",
                  px: 1,
                  borderRadius: 10,
                }}
              >
                {post.Paymentcomplete}
              </Typography>
            </Typography>
            <Typography
              variant=""
              sx={{ mb: 1, display: "inline-block" }}
              color="primary"
            >
              Waiting for Approval{" "}
              <Typography
                sx={{
                  display: "inline-block",
                  color: "#fff",
                  background: "red",
                  px: 1,
                  borderRadius: 10,
                }}
              >
                {post.Paymentcomplete}
              </Typography>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">{post.url}</Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </>
);


export default function CompanyDashboard(props) {

  const data = props?.data;
  // console.log(data,"lala")
  const COMPANY_ID = data[0];
  const COMPANY_USERNAME = data[1];
  const COMPANY_ROOT_ID = data[2];
  const COMPANY_ROOT_USERNAME = data[3];
  const [open, setOpen] = React.useState(false);

  console.log(open, "open");

  return (
    <>
      <Sidebar
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_ROOT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_ROOT_USERNAME}
        active={0}
        toggle={open}
      />

      <Navbar toggle={() => setOpen((e) => !e)} />

      <Container
        id="content"
        style={{ height: "100vh", position: "relative" }}
        maxWidth="xl"
      >

        <Box className="box" overflow={"auto"}>
          <Grid container spacing={2} sx={{ p: 3.5 }}>
            <Grid container item xl={9} xs={12}>
              {card}
            </Grid>

            <Grid container item xl={3} xs={12}>
              {card2}
            </Grid>
          </Grid>
        </Box>
  

    </Container >
    </>
  );
}
