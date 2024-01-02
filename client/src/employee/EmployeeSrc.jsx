import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import EmployeeCreate from "./EmployeeCreate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import teamImg1 from "../assests/images/team-1.jpg";
import { styled } from "@mui/material/styles";
// import Snackbar from "@mui/material/Snackbar";
import "../assests/css/employeesrc.css";
// import Cookies from "js-cookie";

import {
  Button,
  Paper,
  Skeleton,
} from "@mui/material";
import EmployeeTimeSheet from "./EmployeeTimeSheet";
import EmployeeEdit from "./EmployeeEdit";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import GenPassword from "./GenPassword";
import { toast } from "react-toastify";
// import EmployeeAttendance from "./EmployeeAttendance";
import EmployeeManual from "./EmployeeManual";
// import EmployeeDocCreate from "./EmployeeDocCreate";
import EmployeeDocuments from "./EmployeeDocuments";


const EmployeeSrc = () => {
  const { COMPANY_ID, COMPANY_USERNAME, COMPANY_PARENT_ID, COMPANY_PARENT_USERNAME } = useParams();
  const [archived, setArchived] = useState([{}]);
  const [getarchived, setGetrchived] = useState([{}]);
  //isLoading this is for the Skeleton
  const [isLoading, setIsLoading] = useState(true);

  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = useState(0);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState([]);
  const [openNav, setOpenNav] = useState(false);


  const [errorMsg, setErrorMsg] = useState("");
  const [display, setDisplay] = useState("unarchive")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // all employee data
  const [allempData, setAllempData] = useState([{
    COMPANY_PARENT_ID: "",
    COMPANY_PARENT_USERNAME: "",
  }]);

  const [data, setData] = useState([
    {
      PROJECT_ID: "",
      PROJECT_PARENT_ID: "",
      PROJECT_PARENT_USERNAME: "",
      PROJECT_MEMBER_PARENT_ID: "",
      PROJECT_MEMBER_PARENT_USERNAME: "",
      PROJECT_TYPE: "",
      PROJECT_NAME: "",
      PROJECT_ACCOUNT: "",
      PROJECT_USERNAME: "",
      PROJECT_START_DATE: "",
      PROJECT_END_DATE: "",
      PROJECT_SUPERVISOR: "",
      PROJECT_PROGRESS: "",
      PROJECT_ADD: "",
      PROJECT_VALUE: "",
      PROJECT_COUNTRY: "",
      PROJECT_STATE: "",
      PROJECT_CITY: "",
      PROJECT_CURRENCY: "",
    },
  ]);

  const [filterData, setFilteredData] = useState({
    row: {
      EMPLOYEE_DOB: "",
      EMPLOYEE_EMPLMNTTYPE: "",
      EMPLOYEE_HIRE_DATE: "",
      EMPLOYEE_HOURLY_WAGE: "",
      EMPLOYEE_ADD: "",
      EMPLOYEE_CITY: "",
      EMPLOYEE_PARENT_ID: "",
      EMPLOYEE_PARENT_USERNAME: "",
      EMPLOYEE_MEMBER_PARENT_ID: "",
      EMPLOYEE_MEMBER_PARENT_USERNAME: "",
      EMPLOYEE_ROLE: "",
      EMPLOYEE_NAME: "",
      EMPLOYEE_PHONE: "",
      EMPLOYEE_EMAIL: "",
      EMPLOYEE_USERNAME: "",
      EMPLOYEE_ID: "",
      EMPLOYEE_ASSIGN: [],
      __v: 0,
    },
  });


  // console.log(selectedProject, "selectedProject")

  const fetchProject = async () => {
    try {
      const response = await axios.put(
        "/api/get_projects",
        {
          PROJECT_PARENT_ID: COMPANY_ID,
          PROJECT_PARENT_USERNAME: COMPANY_USERNAME,
          PROJECT_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
          PROJECT_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
        },

      );

      const data = response.data;
      // setProjectData(data?.result);
      // console.log("Projects Data: =>", data);
      return data;
    } catch (err) {
      console.log("Something Went Wrong: =>", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [archived]);

  const fetchAllEmployees = async () => {
    try {
      const response = await axios.put(
        "/api/get_employee",
        {
          EMPLOYEE_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
          EMPLOYEE_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
          EMPLOYEE_PARENT_USERNAME: COMPANY_USERNAME,
          EMPLOYEE_PARENT_ID: COMPANY_ID,
        },

      );

      const data = response.data;

      // console.log("Employee Data: =>", data);
      return data;
    } catch (err) {
      console.log("Something Went Wrong: =>", err);
      throw err;
    }
  };

  const fetchData = async () => {
    try {
      const [employeeData, projectsData] = await Promise.all([
        fetchAllEmployees(),
        fetchProject(),
      ]);

      // Both requests have completed here
      setIsLoading(false);
      setData(projectsData.result);
      setAllempData(employeeData.result);
      // console.log("Both requests completed", employeeData, projectsData);

      // Now you can access employeeData and projectsData for further processing if needed
    } catch (err) {
      console.log("An error occurred:", err);
    }
  };

  // Call the fetchData function to fetch both sets of data concurrently

  // const filterRow = allempData?.filter(obj => obj?.ARCHIVED === false);

  console.log(allempData, "myRows")
  const FilterArchive = allempData?.filter(newData => newData?.ARCHIVED === false);
  const rows = FilterArchive;


  const archivedData = allempData?.filter(newData => newData?.ARCHIVED === true);
  const rows2 = archivedData;
  // For archive  employye 

  const archiveEmployee = async (archiveData) => {
    try {
      const data = {
        EMPLOYEE_PARENT_ID: archiveData.row?.EMPLOYEE_PARENT_ID,
        EMPLOYEE_PARENT_USERNAME: archiveData.row?.EMPLOYEE_PARENT_USERNAME,
        EMPLOYEE_MEMBER_PARENT_ID: archiveData.row?.EMPLOYEE_MEMBER_PARENT_ID,
        EMPLOYEE_MEMBER_PARENT_USERNAME: archiveData.row?.EMPLOYEE_MEMBER_PARENT_USERNAME,
        EMPLOYEE_ID: archiveData.row?.EMPLOYEE_ID
      };

      console.log("Data:", data);

      const response = await axios.post("/api/archive-employee", data);

      if (response.status === 200) {
        const jsonResponse = response.data;
        setArchived(jsonResponse)
        console.log("Response data:", jsonResponse);
        toast.success("Employee Archived!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      } else {
        console.error(response.status, response.statusText);
        toast.error('Document not found!', {
          // Show for 2 seconds
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while archiving the employee.', {
        // Show for 2 seconds
      });
    }
  };


  const unarchiveEmployee = async (archiveemp) => {
    try {
      const data = {
        EMPLOYEE_PARENT_ID: archiveemp.row?.EMPLOYEE_PARENT_ID,
        EMPLOYEE_PARENT_USERNAME: archiveemp.row?.EMPLOYEE_PARENT_USERNAME,
        EMPLOYEE_MEMBER_PARENT_ID: archiveemp.row?.EMPLOYEE_MEMBER_PARENT_ID,
        EMPLOYEE_MEMBER_PARENT_USERNAME: archiveemp.row?.EMPLOYEE_MEMBER_PARENT_USERNAME,
        EMPLOYEE_ID: archiveemp.row?.EMPLOYEE_ID
      };

      console.log("Data:", data);

      const response = await axios.put("/api/unarchive-employee", data);

      if (response.status === 200) {
        const jsonResponse = response.data;
        setArchived(jsonResponse)
        console.log("Response data:", jsonResponse);
        toast.success("Employee UnArchived!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      } else {
        console.error(response.status, response.statusText);
        toast.error('Document not found!', {
          // Show for 2 seconds
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while archiving the employee.', {
        // Show for 2 seconds
      });
    }
  };

  const columns = [
    { field: "EMPLOYEE_ID", headerName: "ID", width: 60 },
    {
      field: "EMPLOYEE_USERNAME",
      headerName: "Employee Email",
      width: 120,
    },
    {
      field: "EMPLOYEE_NAME",
      headerName: "Name",
      width: 120,
    },

    {
      field: "EMPLOYEE_ROLE",
      headerName: "Employee Role",
      width: 120,
    },
    {
      field: "EMPLOYEE_PHONE",
      headerName: "Phone",
      width: 110,
    },
    {
      field: "EMPLOYEE_HIRE_DATE",
      headerName: "Hire Date",
      width: 100,
    },
    {
      field: "EMPLOYEE_HOURLY_WAGE",
      headerName: "Hourly Wages",
      width: 110,
    },

    {
      field: "EMPLOYEE_EMPLMNTTYPE",
      headerName: "Employement Type",
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
        return (
          <Button
            variant="contained"
            color="warning"
            sx={{ borderRadius: "12px", padding: "0px 10px" }}
            size="small"
          >
            <EmployeeEdit edit={cellValues} refetch={fetchData} />
          </Button>
        );
      },
    },
    {
      field: "archive",
      headerName: "Archive",
      width: 120,
      renderCell: (cellValues) => {
        return (
          <>
            {display === "unarchive" ? <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: "12px", padding: "2px 10px" }}
              size="small"
              onClick={() => archiveEmployee(cellValues)}
            >
              Archive
            </Button> : <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: "12px", padding: "2px 10px" }}
              size="small"
              onClick={() => unarchiveEmployee(cellValues)}
            >
              UnArchive
            </Button>}
          </>
        );
      },
    },
  ];

  const columnsMobile = [
    { field: "EMPLOYEE_ID", headerName: "ID", width: 60 },
    {
      field: "EMPLOYEE_USERNAME",
      headerName: "Username",
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
            className="view-btn primary btn btn-success"
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
        return (
          <Button>
            <EmployeeEdit edit={cellValues} refetch={fetchData} />
          </Button>
        );
      },
    },
  ];

  function downloadPDF(pdf) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "abc.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const handleClick = (event) => {
    setFilteredData(event);
    handleOpen();
  };

  const MyScreen = styled(Paper)((props) => ({
    height: "calc(100vh - 30px)",
    padding: 0,
    paddingBottom: "0",
    overflow: "auto",
    borderRadius: 0,
    Border: 0,
    display: props.screenIndex ? "block" : "none",
  }));

  const Animations = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <Skeleton animation="pulse" height={60} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
        <Skeleton animation="pulse" height={50} />
      </Box>
    );
  };

  // console.log(data, "data");

  const getallparam = data.filter(
    (e) => e?.PROJECT_ID === parseInt(selectedProject)
  );

  // console.log(filterData, "getallparam");

  const handleAssignProject = (e) => {
    e.preventDefault();

    // Create a new object that combines the selected project data and employee data
    const mergedData = {
      PROJECT_ID: getallparam[0]?.PROJECT_ID,
      PROJECT_PARENT_ID: getallparam[0]?.PROJECT_PARENT_ID,
      PROJECT_MEMBER_PARENT_ID: getallparam[0]?.PROJECT_MEMBER_PARENT_ID,
      PROJECT_MEMBER_PARENT_USERNAME:
        getallparam[0]?.PROJECT_MEMBER_PARENT_USERNAME,
      PROJECT_USERNAME: getallparam[0]?.PROJECT_USERNAME,
      EMPLOYEE_ID: filterData?.row.EMPLOYEE_ID,
      EMPLOYEE_PARENT_ID: filterData?.row.EMPLOYEE_PARENT_ID,
      EMPLOYEE_PARENT_USERNAME: filterData?.row.EMPLOYEE_PARENT_USERNAME,
      EMPLOYEE_MEMBER_PARENT_ID: filterData?.row.EMPLOYEE_MEMBER_PARENT_ID,
      EMPLOYEE_MEMBER_PARENT_USERNAME:
        filterData?.row.EMPLOYEE_MEMBER_PARENT_USERNAME,
    };

    // Validate the form data before submission

    axios
      .post("/api/assign_project", mergedData)
      .then((response) => {
        setSelectedProject(response.data.result);

        setIsSuccessMessageVisible(true);
        toast.success("Project Assign successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        // console.log(response.data.result.employee ,"response.data.result")
        if (response.data.result?.employee) {
          setFilteredData((event) => ({ ...event, row: response.data.result?.employee }))
        } else {
          toast.success("Project Already Assign", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      })
      .catch((error) => {
        console.error(error, "ERR");
      });
  };

  console.log(allempData[0].EMPLOYEE_ID, "eployeeid")
  console.log(filterData.row?.EMPLOYEE_ASSIGN, "filterData.row")

  // const filterProjects =




  return (
    <>
      <Sidebar
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
        active={2}
        toggle={openNav}
      />
      <Box className="box" style={{ background: "#277099" }}>
        <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} />
        <Button
          size="small"
          variant={"outlined"}
          className={display === "unarchive" ? "btn button border-bottom-0 bg-white" : "btn btn-sm btn-primary rounded-0 border-0  rounded-0 text-light"}
          onClick={() => setDisplay("unarchive")}
        >
          My Employees
        </Button>
        <Button
          size="small"
          variant={"outlined"}
          className={display === "archive" ? "btn button border-bottom-0 bg-white" : "btn btn-sm btn-primary rounded-0 border-0  rounded-0 text-light"}
          onClick={() => setDisplay("archive")}
        >
          Archive
        </Button>


        <EmployeeCreate
          COMPANY_ID={COMPANY_ID}
          COMPANY_USERNAME={COMPANY_USERNAME}
          COMPANY_PARENT_ID={COMPANY_PARENT_ID}
          COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
          name={"Employee"}
          refetch={fetchData}
        />
        <MyScreen sx={{ display: "block", padding: 3 }}>
          <Box style={{ height: "100%", padding: 0, paddingBottom: "0" }}>
            {isLoading ? (
              <Animations />
            ) : (
              <>
                <DataGrid
                  className="display"
                  sx={{ border: "none" }}
                  rows={display === "archive" ? rows2 : rows}
                  columns={columns}
                  getRowId={(row) => row.EMPLOYEE_ID}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 20,
                      },
                    },
                  }}
                  density="compact"
                  pageSizeOptions={[5]}
                  // checkboxSelection
                  disableRowSelectionOnClick
                  localeText={{ noRowsLabel: rows.length === 0 && "There is no Emploies.." }}

                />
              </>
            )}
          </Box>
        </MyScreen>
      </Box>

      <Box
        style={{
          display: open ? "block" : "none",
        }}
        className="box position-absolute"
      >
        <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} />
        <div
          className="container-fluid pb-0 g-0"
          style={{ background: "#277099" }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            className="btn rounded-0 border-0"
            size="small"
          >
            <ArrowBackIcon style={{ fontSize: "22.5px" }} />
          </Button>
          {["Employee Details", "Timesheet", "Manual Attendance", "Documents"].map(
            (item, value) => (
              <Button
                onClick={(e, index) => setIndex(value)}
                variant={index === value ? "outlined" : "outlined"}
                className={
                  index === value
                    ? "btn button border-bottom-0 bg-white"
                    : "btn rounded-0 border-bottom-0  rounded-0 text-light"
                }
                size="small"
              >
                {item}
              </Button>
            )
          )}
        </div>

        <MyScreen screenIndex={index === 0} sx={{ padding: 3 }}>
          {index === 0 ? <div className="container mt-1">
            {/* <h1 className="text-center">Employee Detail Dashboard</h1> */}
            <div className="row">
              <div className="col-xl-6">
                <div className="row mt-2">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Employee Details</h5>
                        <table className="table" style={{ tableLayout: "" }}>
                          <tbody >
                            <GenPassword
                              EMPLOYEE_ID={filterData.row?.EMPLOYEE_ID}
                              EMPLOYEE_USERNAME={filterData.row?.EMPLOYEE_USERNAME}
                              EMPLOYEE_PHONE={filterData.row?.EMPLOYEE_PHONE}
                              ADMIN_ID={filterData.row?.EMPLOYEE_MEMBER_PARENT_ID}
                              ADMIN_USERNAME={filterData.row?.EMPLOYEE_MEMBER_PARENT_USERNAME}
                            />

                            <tr>
                              <td><b>Username :</b></td>
                              <>
                                <td>
                                  {filterData.row?.EMPLOYEE_USERNAME}
                                </td>
                              </>
                            </tr>

                            <tr>
                              <td><b>Phone :</b></td>
                              <>
                                <td>
                                  {filterData.row?.EMPLOYEE_PHONE}
                                </td>
                              </>
                            </tr>

                            <tr>
                              <td><b>Address :</b></td>
                              <>
                                <td>
                                  {filterData.row.EMPLOYEE_STATE ? filterData.row?.EMPLOYEE_STATE : "Not Available"}{" "}
                                  {filterData.row?.EMPLOYEE_CITY}
                                </td>
                              </>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-2">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Work Details</h5>
                        <p className="card-text">
                          <strong>Role:</strong> {filterData.row?.EMPLOYEE_ROLE}
                        </p>
                        <p className="card-text">
                          <strong>Employee type:</strong> {filterData.row?.EMPLOYEE_EMPLMNTTYPE}
                        </p>
                        <p className="card-text">
                          <strong>Hire Date:</strong> {filterData.row?.EMPLOYEE_HIRE_DATE}
                        </p>
                        <p className="card-text">
                          <strong> Hourly Wages:</strong> {filterData.row?.EMPLOYEE_HOURLY_WAGE}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="row">
                  <div className="col-xl-12 mt-2">
                    <div
                      className="card"
                      style={{ backgroundColor: "#f5f5f5" }}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 style={{ margin: "10px" }}>
                          Assigning Projects to{" "}
                          <span style={{ color: "tan" }}>
                            {filterData.row?.EMPLOYEE_NAME}
                          </span>
                        </h5>
                        <div className="d-flex align-items-center" style={{ gap: 4 }}>
                          <select
                            className="form-select form-control-2"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                          >
                            <option value="Select Project">
                              Select Project
                            </option>
                            {data?.map((project, key) => (
                              <option value={project?.PROJECT_ID} key={key}>
                                {project?.PROJECT_NAME}-{project?.PROJECT_ID}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={handleAssignProject}
                          >
                            Assign Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="card">
                      <div className="card-body">
                        <h5>List of Projects Assigned to Employee:</h5>
                        <table className="table table-sm overflow-scroll">
                          <thead>
                            <tr>
                              <th scope="col">S.No</th>
                              <th scope="col">Project ID</th>
                              {/* <th scope="col">Project Name</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {filterData.row?.EMPLOYEE_ASSIGN?.map((project, index) => (
                              <tr key={project?.PROJECT_ID} >
                                <td style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fffff" }}>{index + 1}</td>
                                <td style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fffff" }}>{project?.PROJECT_ID}</td>
                                {/* <td style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fffff" }}>{project.PROJECT_NAME}</td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Add more salary-related details here */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> : ""}
        </MyScreen>

        <MyScreen screenIndex={index === 1} sx={{ padding: 3 }}>
          <EmployeeTimeSheet mainData={filterData.row} />
        </MyScreen>


        <MyScreen screenIndex={index === 2} sx={{ padding: 3 }}>
          <EmployeeManual
            mainData={filterData.row}
          />
        </MyScreen>

        <MyScreen screenIndex={index === 3} sx={{ padding: 3 }}>

          {index === 3 ? <EmployeeDocuments
            EMPLOYEE_ID={filterData.row?.EMPLOYEE_ID}
            EMPLOYEE_USERNAME={filterData.row?.EMPLOYEE_USERNAME}
            COMPANY_USERNAME={COMPANY_USERNAME}

          /> : ""}
        </MyScreen>



      </Box>



    </>
  );
};

export default EmployeeSrc;
