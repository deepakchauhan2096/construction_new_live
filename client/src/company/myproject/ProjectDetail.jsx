import React, { useEffect, useState} from "react";
import Box from "@mui/material/Box";
import { useLocation} from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProjectNav from "./ProjectNav";
import { RotatingLines } from "react-loader-spinner";

const ProjectDetail = () => {
  const filteredProject = useLocation();

  const filterData = filteredProject?.state[0]
  const COMPANY_ID = filteredProject?.state[1]
  const COMPANY_USERNAME = filteredProject?.state[2]
  const COMPANY_PARENT_ID = filteredProject?.state[3]
  const COMPANY_PARENT_USERNAME = filteredProject?.state[4]

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(1);
  const [resStatus, setResStatus] = useState(false);

  useEffect(()=> {
    if(filteredProject) {  setResStatus(true) } else {
      setResStatus("error");
    }
  },[filteredProject])


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

        <ProjectNav filterData={filterData} active={1}  COMPANY_ID={COMPANY_ID}  COMPANY_USERNAME={COMPANY_USERNAME} COMPANY_PARENT_ID={COMPANY_PARENT_ID} COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME} />
        {resStatus == true ? ( 
        <div className="myscreen p-3">
          {index === 1 && (
            <div className="container-fluid g-0">
              <div className="row">
                <div className="col-md-2">
                  <b>Project Name</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_NAME}
                  </p>
                </div>
                <div className="col-md-2">
                  <b>Account</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_ACCOUNT}
                  </p>
                </div>
                <div className="col-md-2">
                  <b>Username</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_USERNAME}
                  </p>
                </div>
                <div className="col-md-2">
                  <b>Supervisor</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_SUPERVISOR}
                  </p>
                </div>
                <div className="col-2">
                  <b>Project Value</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {`${filterData.PROJECT_VALUE} ${filterData.PROJECT_CURRENCY}`}
                  </p>
                </div>
                <div className="col-2">
                  <b>Employement Type</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_TYPE}
                  </p>
                </div>
                <div className="col-2">
                  <b>Country</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_COUNTRY}
                  </p>
                </div>
                <div className="col-2">
                  <b>State</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_STATE}
                  </p>
                </div>
                <div className="col-2">
                  <b>City</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_CITY}
                  </p>
                </div>

                <div className="col-4">
                  <b>Location</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_ADD}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col">
                  <b>Project Role</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_ROLE
                      ? filterData.PROJECT_ROLE
                      : "not mentioned !"}
                  </p>
                </div>
                <div className="col">
                  <b>Project Status</b>
                  <p className="bg-success text-dark p-2 rounded-2">
                    In Execution
                  </p>
                </div>
                <div className="col">
                  <b>Project Start</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_START_DATE}
                  </p>
                </div>
                <div className="col">
                  <b>Project End</b>
                  <p className="bg-light text-dark p-2 rounded-2">
                    {filterData.PROJECT_END_DATE}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <b>Project Progress</b>
                  <div className="p-2 rounded-3 bg-light">
                    <div
                      className="progress-bar"
                      style={{
                        background: `radial-gradient(closest-side, white 79%, transparent 80% 100%),conic-gradient(hotpink ${filterData.PROJECT_PROGRESS}%, pink 0)`,
                      }}
                    >
                      <div className="counter">
                        {filterData.PROJECT_PROGRESS}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>) : resStatus === "error" ? (
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
                  // onClick={fetchProjects}
                  className="btn btn-sm btn-secondary"
                >
                  Retry
                </button>
              </center>
            </small>
          </div>
      ) : (
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
      )}
      </Box> 
    </>
  );
};

export default ProjectDetail;
