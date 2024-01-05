import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmployeeEdit from "../myemployee/EmployeeEdit";
// import EmployeeCreate from "../myemployee/EmployeeCreate";
import Sidebar from "../../components/Sidebar";
import moment from "moment";
import { RotatingLines } from "react-loader-spinner";
import CreateContractor from "./CreateContractor";

const Contractor = ({
  COMPANY_ID,
  COMPANY_USERNAME,
  COMPANY_PARENT_ID,
  COMPANY_PARENT_USERNAME,
}) => {
  const [open, setOpen] = useState(false);
  const [empData, setEmpData] = useState([{}]);
  const [data, setData] = useState({ row: {} });
  const [archived, setArchived] = useState([{}]);
  const [display, setDisplay] = useState("unarchive");
  const [resStatus, setResStatus] = useState(false);
  const navigate = useNavigate();


  const headers = {
    "Content-Type": "application/json",
    authorization_key: "qzOUsBmZFgMDlwGtrgYypxUz",
  };

  //fatch Employees
  const fetchData = async () => {
    try {
      const response = await axios.put("/api/get_subcontractor", {
        SUBCONTRACTOR_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
        SUBCONTRACTOR_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
        SUBCONTRACTOR_PARENT_USERNAME: COMPANY_USERNAME,
        SUBCONTRACTOR_PARENT_ID: COMPANY_ID,
      },{headers});

      const data = response.data;
      // console.log("Employee Data: =>", data);
      setResStatus(true)
      setEmpData(data.result);
    } catch (err) {
      console.log("Something Went Wrong: =>", err);
      setResStatus("error");
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [COMPANY_ID]);

  // archive
  const archiveEmployee = async (archiveData) => {
    try {
      const data = {
        SUBCONTRACTOR_PARENT_ID: archiveData.row?.SUBCONTRACTOR_PARENT_ID,
        SUBCONTRACTOR_PARENT_USERNAME: archiveData.row?.SUBCONTRACTOR_PARENT_USERNAME,
        SUBCONTRACTOR_MEMBER_PARENT_ID: archiveData.row?.SUBCONTRACTOR_MEMBER_PARENT_ID,
        SUBCONTRACTOR_MEMBER_PARENT_USERNAME:
          archiveData.row?.SUBCONTRACTOR_MEMBER_PARENT_USERNAME,
        SUBCONTRACTOR_ID: archiveData.row?.SUBCONTRACTOR_ID,
      };

      console.log("Data:", data);

      const response = await axios.post("/api/archive-employee", data);

      if (response.status === 200) {
        toast.success("Employee Archived!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        fetchData();
      } else {
        toast.error("Failed to Archived!", {});
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while archiving the employee.", {
        // Show for 2 seconds
      });
    }
  };

  // unarchieve
  const unarchiveEmployee = async (archiveemp) => {
    try {
      const data = {
        SUBCONTRACTOR_PARENT_ID: archiveemp.row?.SUBCONTRACTOR_PARENT_ID,
        SUBCONTRACTOR_PARENT_USERNAME: archiveemp.row?.SUBCONTRACTOR_PARENT_USERNAME,
        SUBCONTRACTOR_MEMBER_PARENT_ID: archiveemp.row?.SUBCONTRACTOR_MEMBER_PARENT_ID,
        SUBCONTRACTOR_MEMBER_PARENT_USERNAME:
          archiveemp.row?.SUBCONTRACTOR_MEMBER_PARENT_USERNAME,
        SUBCONTRACTOR_ID: archiveemp.row?.SUBCONTRACTOR_ID,
      };

      console.log("Data:", data);

      const response = await axios.put("/api/unarchive-employee", data);

      if (response.status === 200) {
        toast.success("Employee UnArchived!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        fetchData();
      } else {
        toast.error("Failed to UnArchived!", {
          // Show for 2 seconds
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while archiving the employee.", {
        // Show for 2 seconds
      });
    }
  };

  console.log(data, "data");

  const handleClick = (event) => {
    navigate("/company/contractors/detail", {
      state: [
        event.row,
        COMPANY_ID,
        COMPANY_USERNAME,
        COMPANY_PARENT_ID,
        COMPANY_PARENT_USERNAME,
      ],
    });
  };




// attendance status

const columns = [
  { field: "SUBCONTRACTOR_ID", headerName: "ID", width: 90 },
  {
    field: "SUBCONTRACTOR_USERNAME",
    headerName: "Contractor Email",
    width: 150,
  },
  {
    field: "SUBCONTRACTOR_NAME",
    headerName: "Name",
    width: 150,
  },
  {
    field: "SUBCONTRACTOR_PHONE",
    headerName: "Phone",
    width: 150,
  },
  {
    field: "SUBCONTRACTOR_START_DATE",
    headerName: "Start Date",
    width: 150,
  },
  {
    field: "SUBCONTRACTOR_END_DATE",
    headerName: "End Date",
    type: "number",
    width: 100,
  },

  {
    field: "SUBCONTRACTOR_SUPERVISOR",
    headerName: "Supervisor",
    width: 120,
  },
  {
    field: "action",
    headerName: "Action",
    width: 80,
    renderCell: (cellValues) => {
      return (
        <Button
          variant="contained"
          className="view-btn btn btn-success"
          style={{ padding: "2px 2px" }}
          onClick={(event) => {
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
      return <EmployeeEdit edit={cellValues} refetch={fetchData} />;
    },
  },
  {
    field: "archive",
    headerName: "Archive",
    width: 120,
    renderCell: (cellValues) => {
      return (
        <>
          {display === "unarchive" ? (
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: "12px", padding: "2px 10px" }}
              size="small"
              onClick={() => archiveEmployee(cellValues)}
            >
              Archive
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: "12px", padding: "2px 10px" }}
              size="small"
              onClick={() => unarchiveEmployee(cellValues)}
            >
              UnArchive
            </Button>
          )}
        </>
      );
    },
  }

];

  // const FilterArchive = empData?.filter(
  //   (newData) => newData?.ARCHIVED === false
  // );
  // const rows = FilterArchive;
  // const archivedData = empData?.filter((newData) => newData?.ARCHIVED === true);
  // const rows2 = archivedData;

  const rows = empData;

  return (
    <>
      <Sidebar
        active={5}
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
      />
      <Box className="box" style={{ background: "#277099" }}>
        {/* <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} /> */}
        {resStatus == true ? (<><button
          variant={"outlined"}
          className={
            display === "unarchive"
              ? "btn button border-bottom-0 bg-white btn-sm"
              : "btn btn-sm btn-primary rounded-0 border-0  rounded-0 text-light btn-sm"
          }
          onClick={() => setDisplay("unarchive")}
        >
          My Contractors
        </button>

        <button
          size="small"
          variant={"outlined"}
          className={
            display === "archive"
              ? "btn button border-bottom-0 bg-white btn-sm"
              : "btn btn-sm btn-primary rounded-0 border-0  rounded-0 text-light btn-sm"
          }
          onClick={() => setDisplay("archive")}
        >
          Archive
        </button>
        <CreateContractor
          COMPANY_ID={COMPANY_ID}
          COMPANY_USERNAME={COMPANY_USERNAME}
          COMPANY_PARENT_ID={COMPANY_PARENT_ID}
          COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
          name={"Project"}
          Update={fetchData}
        /></> ) : <>
        <button
          size="small"
          disabled
          className={"btn button border-bottom-0 bg-white btn-sm"}
        >
          My Employees
        </button>
        <button
          size="small"
          disabled
          className={"btn rounded-0 border-0  rounded-0 text-light btn-primary btn-sm"}
        >
           Archive
        </button>
        <button

          style={{ color: "#277099" }}
          className="btn rounded-0 border-0  rounded-0 text-light btn-primary btn-sm"
          size="small"
          disabled
        >
            + Add Contractor
        </button>
      </>} 

        <div className="myscreen p-3">
          <Box style={{ height: "100%", padding: 0, paddingBottom: "0" }}>
            <>
            {resStatus == true ? ( <DataGrid
                className="display"
                sx={{ border: "none" }}
                // rows={display === "archive" ? rows2 : rows}
                rows={rows}
                columns={columns}
                getRowId={(row) => row.SUBCONTRACTOR_ID}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 20,
                    },
                  },
                }}
                density="compact"
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                localeText={{
                  noRowsLabel: rows.length === 0 && "There is no Emploies..",
                }}
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
                          onClick={fetchData}
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

export default Contractor;
