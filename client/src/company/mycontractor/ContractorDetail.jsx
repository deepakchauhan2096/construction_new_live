import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import ContractorNav from "./ContractorNav";
import GenPassword from "../../employee/GenPassword";
import { toast } from "react-toastify";

import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import ContractorGenPassword from "./ContractorGenPassword";


const ContractorDetail = () => {
  const filteredEmployee = useLocation();
  const filterData = filteredEmployee?.state[0];
  const COMPANY_ID = filteredEmployee?.state[1];
  const COMPANY_USERNAME = filteredEmployee?.state[2];
  const COMPANY_PARENT_ID = filteredEmployee?.state[3];
  const COMPANY_PARENT_USERNAME = filteredEmployee?.state[4];

  const [selectedProject, setSelectedProject] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [resStatus, setResStatus] = useState(false);
  const [project, setProject] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(1);
  const [workvalue, setWorkvalue] = useState([]);

  console.log(projectData, "projectData");

  // fatch project
  const fetchProject = async () => {
    try {
      const response = await axios.put("/api/get_projects", {
        PROJECT_PARENT_ID: COMPANY_ID,
        PROJECT_PARENT_USERNAME: COMPANY_USERNAME,
        PROJECT_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
        PROJECT_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
      });

      const data = response.data;
      setProjectData(data.result);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProject();
  }, [filterData]);

  const getallparam = projectData?.filter(
    (e) => e?.PROJECT_ID === parseInt(selectedProject)
  );

  // assign project
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
      SUBCONTRACTOR_ID: filterData?.SUBCONTRACTOR_ID,
      SUBCONTRACTOR_PARENT_ID: filterData?.SUBCONTRACTOR_PARENT_ID,
      SUBCONTRACTOR_PARENT_USERNAME: filterData?.SUBCONTRACTOR_PARENT_USERNAME,
      SUBCONTRACTOR_MEMBER_PARENT_ID: filterData?.SUBCONTRACTOR_MEMBER_PARENT_ID,
      SUBCONTRACTOR_MEMBER_PARENT_USERNAME:
        filterData?.SUBCONTRACTOR_MEMBER_PARENT_USERNAME,
    };

    // Validate the form data before submission

    axios
      .post("/api/assign_project", mergedData)
      .then((response) => {
        setSelectedProject(response.data.result);
        toast.success("Project Assign successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        fetchProject();
        fetchData();
        if (response.data.result?.employee) {
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

  console.log(projectData, "projectData in employee");

  const fetchData = async (e) => {
    try {
      const response = await axios.put("/api/get_assigned_projects", {
        SUBCONTRACTOR_ID: filterData?.SUBCONTRACTOR_ID,
        SUBCONTRACTOR_MEMBER_PARENT_USERNAME: filterData?.SUBCONTRACTOR_MEMBER_PARENT_USERNAME,
      });
      const data = response.data;
      setResStatus(true);
      setProject(data?.result.assignedProjects);
    } catch (err) {
      console.log("Something Went Wrong: =>", err);
      setResStatus("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterData]);






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
      field: "PROJECT_TYPE",
      headerName: "Project Type",
      width: 140,
    }
  ];




  // useEffect(() => {
  //   gettimesheet();
  // }, [filterData]);


  // const Manual = workvalue?.filter(
  //   (prev) =>
  //     prev.ATTENDANCE_TYPE_OUT === "manual" ||
  //     prev.ATTENDANCE_TYPE_IN === "manual"
  // );


  // console.log(Manual.length, "total")




  return (
    <>
      <Box
        style={{
          display: "block",
          height: "100vh",
        }}
        className="box position-absolute"
      >
        {/* <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} /> */}

        <ContractorNav
          filterData={filterData}
          active={1}
          COMPANY_ID={COMPANY_ID}
          COMPANY_USERNAME={COMPANY_USERNAME}
          COMPANY_PARENT_ID={COMPANY_PARENT_ID}
          COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
        />
        <div className="myscreen p-3">
          <div className="container mt-1">
            {/* <h1 className="text-center">Employee Detail Dashboard</h1> */}
            <div className="row">
              <div className="col-xl-6">
                <div className="row mt-2">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Contractor Details</h5>
                        <table className="table" style={{ tableLayout: "" }}>
                          <tbody>
                            <ContractorGenPassword
                              SUBCONTRACTOR_ID={filterData?.SUBCONTRACTOR_ID}
                              SUBCONTRACTOR_USERNAME={filterData?.SUBCONTRACTOR_USERNAME}
                              SUBCONTRACTOR_PHONE={filterData?.SUBCONTRACTOR_PHONE}
                              ADMIN_ID={filterData?.SUBCONTRACTOR_MEMBER_PARENT_ID}
                              ADMIN_USERNAME={
                                filterData?.SUBCONTRACTOR_MEMBER_PARENT_USERNAME
                              }
                            />

                            <tr>
                              <td>
                                <b>Username :</b>
                              </td>
                              <>
                                <td>{filterData?.SUBCONTRACTOR_USERNAME}</td>
                              </>
                            </tr>

                            <tr>
                              <td>
                                <b>Phone :</b>
                              </td>
                              <>
                                <td>{filterData?.SUBCONTRACTOR_PHONE}</td>
                              </>
                            </tr>

                            <tr>
                              <td>
                                <b>Address :</b>
                              </td>
                              <>
                                <td>
                                  {filterData.SUBCONTRACTOR_STATE
                                    ? filterData?.SUBCONTRACTOR_STATE
                                    : "Not Available"}{" "}
                                  {filterData?.SUBCONTRACTOR_CITY}
                                </td>
                              </>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-12 mt-2">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Work Details</h5>
                        <p className="card-text">
                          <strong>Role:</strong> {filterData.SUBCONTRACTOR_ROLE}
                        </p>
                        <p className="card-text">
                          <strong>Employee type:</strong>{" "}
                          {filterData.SUBCONTRACTOR_EMPLMNTTYPE}
                        </p>
                        <p className="card-text">
                          <strong>Hire Date:</strong>{" "}
                          {filterData.SUBCONTRACTOR_HIRE_DATE}
                        </p>
                        <p className="card-text">
                          <strong> Hourly Wages:</strong>{" "}
                          {filterData.SUBCONTRACTOR_HOURLY_WAGE}
                        </p>
                      </div>
                    </div>
                  </div> */}
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
                            {filterData.SUBCONTRACTOR_NAME}
                          </span>
                        </h5>
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: 4 }}
                        >
                          <select
                            className="form-select form-control-2"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                          >
                            <option value="Select Project">
                              Select Project
                            </option>
                            {projectData?.map((project, key) => (
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
                        <h5>List of Projects Assigned to Contractor:</h5>
                        <DataGrid
                          sx={{ border: "none", height:"60vh" }}
                          rows={project}
                          columns={columns}
                          getRowId={(row) => row?.PROJECT_ID}
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default ContractorDetail;
