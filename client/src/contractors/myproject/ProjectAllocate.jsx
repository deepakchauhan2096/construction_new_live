import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProjectCreate from "./ProjectCreate";
// import { MyContext } from "../context/Mycontext";
import ProjectEdit from "./ProjectEdit";
import ProjectLoc from "./ProjectLoc";
import ProjectAssigned from "../ProjectAssigned";
import { Button, Paper, Skeleton, styled } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProjectDocuments from "./ProjectDocuments";
import ProjectDetail from "./ProjectDetail";
import ProjectNav from "./ProjectNav";

const ProjectAllocate = () => {
  const [project, setProject] = useState();
  const [open, setOpen] = useState(false);
   const [resStatus, setResStatus] = useState(false);
  const filteredProject = useLocation();
  const filterData = filteredProject?.state[0]
  const COMPANY_ID = filteredProject?.state[1]
  const COMPANY_USERNAME = filteredProject?.state[2]
  const COMPANY_PARENT_ID = filteredProject?.state[3]
  const COMPANY_PARENT_USERNAME = filteredProject?.state[4]


  useEffect(() => {
    const fetchData = async (e) => {
      try {
        const response = await axios.put("/api/get_assigned_employees", {
                  "PROJECT_ID": filterData.PROJECT_ID,
                  "PROJECT_MEMBER_PARENT_USERNAME": filterData.PROJECT_MEMBER_PARENT_USERNAME
                });
        const data = response.data;
        setResStatus(true);
        setProject(data?.result.assignedProjects);
      } catch (err) {
        console.log("Something Went Wrong: =>", err);
        setResStatus("error");
      }
    };

    fetchData();
  }, [filterData]);


  console.log(filterData,"project IN PROJECT")


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

        <ProjectNav filterData={filterData} active={2}  COMPANY_ID={COMPANY_ID}  COMPANY_USERNAME={COMPANY_USERNAME} COMPANY_PARENT_ID={COMPANY_PARENT_ID} COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME} />
        <div className="myscreen p-3">
          <div className="container-fluid g-0">
            <div className="row">
              <div className="col-12">

                <table className="table table-fixed table-sm">
                  <thead>
                    <tr >
                      <td>
                        <b>S. No.</b>
                      </td>
                      <td>
                        <b>Employee ID</b>
                      </td>
                      <td>
                        <b>Employee Name</b>
                      </td>
                      <td>
                        <b>Employee Email</b>
                      </td>
                      <td>
                        <b>Employee Phone</b>
                      </td>
                      <td>
                        <b>Hourly Wages</b>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {project?.map((assignproject, key) => (
                      <>
                        <tr key={key}>
                          <td>
                            {key + 1}
                          </td>
                          <td>
                            <span>{assignproject.EMPLOYEE_ID}</span>
                          </td>
                          <td>
                            <span>{assignproject.EMPLOYEE_NAME}</span>
                          </td>
                          <td>
                            <span>{assignproject.EMPLOYEE_USERNAME}</span>
                          </td>
                          <td>
                            <span>{assignproject.EMPLOYEE_PHONE}</span>
                          </td>
                          <td>
                            <span>{assignproject.EMPLOYEE_HOURLY_WAGE}</span>
                          </td>

                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default ProjectAllocate;
