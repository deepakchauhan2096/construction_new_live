import React, { useState, useEffect } from "react";
import ProjectCreate from "./ProjectCreate";
import { Box, Button, Paper, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ProjectEdit from "./ProjectEdit";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { RotatingLines } from "react-loader-spinner";

const Project = ({
  COMPANY_ID,
  COMPANY_USERNAME,
  COMPANY_PARENT_ID,
  COMPANY_PARENT_USERNAME,
}) => {
  console.log(COMPANY_ID, "COMPANY_ID");

  const [open, setOpen] = useState(false);
  const [ProjectData, setProjectData] = useState([]);
  const [data, setData] = useState({ row: {} });
  const [resStatus, setResStatus] = useState(false);
  const navigate = useNavigate();

  //fatch Projects
  const fetchProjects = async (e) => {
    try {
      const response = await axios.put("/api/get_projects", {
        PROJECT_PARENT_ID: COMPANY_ID,
        PROJECT_PARENT_USERNAME: COMPANY_USERNAME,
        PROJECT_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
        PROJECT_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
      });
      const data = response.data;
      setResStatus(true);
      setProjectData(data?.result);
    } catch (err) {
      console.log("Something Went Wrong: =>", err);
      setResStatus("error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [COMPANY_ID]);

  const MyScreen = styled(Paper)((props) => ({
    height: "calc(100vh - 29px)",
    padding: 0,
    background: "#fff",
    paddingBottom: "0",
    overflow: "auto",
    borderRadius: 0,
    Border: 0,
    display: props.screenIndex ? "block" : "flex",
  }));

  const handleClick = (event) => {
    navigate("/company/projects/detail", {
      state: [
        event.row,
        COMPANY_ID,
        COMPANY_USERNAME,
        COMPANY_PARENT_ID,
        COMPANY_PARENT_USERNAME,
      ],
    });
  };


  const columns = [
    { field: "PROJECT_ID", headerName: "ID", width: 60 },
    {
      field: "PROJECT_USERNAME",
      headerName: "Username",
      width: 120,
    },
    {
      field: "PROJECT_NAME",
      headerName: "Name",
      width: 120,
    },
    {
      field: "PROJECT_ACCOUNT",
      headerName: "Account",
      width: 130,
    },
    {
      field: "PROJECT_START_DATE",
      headerName: "Start Date",
      width: 100,
    },
    {
      field: "PROJECT_END_DATE",
      headerName: "End Date",
      type: "number",
      width: 100,
    },

    {
      field: "PROJECT_SUPERVISOR",
      headerName: "Supervisor",
      width: 150,
    },

    {
      field: "PROJECT_VALUE",
      headerName: "Project Value",
      width: 120,
      renderCell: (cellValues) => {
        return (
          <span>
            {cellValues.row.PROJECT_VALUE} {cellValues.row.PROJECT_CURRENCY}
          </span>
        );
      },
    },

    {
      field: "PROJECT_TYPE",
      headerName: "Project Type",
      width: 140,
    },

    {
      field: "action",
      headerName: "Detail",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            className="view-btn primary btn btn-success"
            style={{ padding: "2px 2px" }}
            onClick={() => {
              handleClick(cellValues);
            }}
          >
            view
          </Button>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button>
            <ProjectEdit edit={cellValues} Update={fetchProjects} />
          </Button>
        );
      },
    },
  ];

  const rows = ProjectData;
  const filterData = data?.row;

  return (
    <>
      <Sidebar
        active={1}
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
      />

      <Box className="box" style={{ background: "#277099" }}>
        {/* <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} /> */}
        {resStatus == true ? (<ProjectCreate
          COMPANY_ID={COMPANY_ID}
          COMPANY_USERNAME={COMPANY_USERNAME}
          COMPANY_PARENT_ID={COMPANY_PARENT_ID}
          COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
          name={"Project"}
          Update={fetchProjects}
        />) : <>
          <button
            size="small"
            disabled
            className={"btn button border-bottom-0 bg-white btn-sm"}
          >
            My Projects
          </button>
          <button

            style={{ color: "#277099" }}
            className="btn rounded-0 border-0  rounded-0 text-light btn-primary btn-sm"
            size="small"
            disabled
          >
            + Add New Project
          </button>
        </>}

        <div className="myscreen p-3">
          <Box style={{ height: "100%", padding: 0, paddingBottom: "0" }}>
            <>
              {resStatus == true ? (<DataGrid
                sx={{ border: "none" }}
                rows={rows}
                columns={columns}
                getRowId={(row) => row.PROJECT_ID}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 20,
                    },
                  },
                }}
                density="compact"
                pageSizeOptions={[5]}
                checkboxSelection={false}
                disableRowSelectionOnClick
              />) : resStatus === "error" ? (
                <Box>
                  <div
                    className="p-3"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <small className="text-dark">
                      <p>Check your connection and try again. :(</p>
                      <center>
                        <button
                          onClick={fetchProjects}
                          className="btn btn-sm btn-secondary"
                        >
                          Retry
                        </button>
                      </center>
                    </small>
                  </div>
                </Box>
              ) : (
                <Box>
                  <div
                    className="p-3"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <RotatingLines
                      strokeColor="#2D5169"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="50"
                      visible={true}

                    />
                  </div>
                </Box>
              )}
            </>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Project;
