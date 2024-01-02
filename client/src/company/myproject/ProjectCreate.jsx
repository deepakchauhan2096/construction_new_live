import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import country from "../../Api/countriess.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import projectList from "../../jsonlist/typeOfProject.json";
import { Button } from "@mui/material";




export default function ProjectCreate({
  COMPANY_ID,
  COMPANY_USERNAME,
  COMPANY_PARENT_ID,
  COMPANY_PARENT_USERNAME,
  Update,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createProject, setCreateProject] = useState({
    PROJECT_PARENT_ID: "",
    PROJECT_PARENT_USERNAME: "",
    PROJECT_MEMBER_PARENT_ID: "",
    PROJECT_MEMBER_PARENT_USERNAME: "",
    PROJECT_NAME: "",
    PROJECT_USERNAME: "",
    PROJECT_ADD: "",
    PROJECT_CITY: "",
    PROJECT_START_DATE: "",
    PROJECT_END_DATE: "",
    PROJECT_SUPERVISOR: "",
    PROJECT_COUNTRY: "",
    PROJECT_TYPE: "",
    PROJECT_STATE: "",
    PROJECT_ACCOUNT: "",
    PROJECT_VALUE: "",
    PROJECT_CURRENCY: "",
  });
  const [usernameErr, setUsernameError] = useState("");
  const [companyaccError, setCompanyAccError] = useState("");
  const [nameError, setNameError] = useState("");

  console.log("project", createProject);

  useEffect(() => {
    setCreateProject((prevState) => ({
      ...prevState,
      PROJECT_PARENT_ID: COMPANY_ID,
    }));
    setCreateProject((prevState) => ({
      ...prevState,
      PROJECT_PARENT_USERNAME: COMPANY_USERNAME,
    }));
    setCreateProject((prevState) => ({
      ...prevState,
      PROJECT_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
    }));
    setCreateProject((prevState) => ({
      ...prevState,
      PROJECT_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
    }));

  }, [open]);

  console.log(createProject, "check");

  const availableState = country?.find(
    (c) => c.name === createProject.PROJECT_COUNTRY
  );

  // console.log("all states : ===> ", availableState,"country=>",country);
  const availableCities = availableState?.states?.find(
    (s) => s.name === createProject.PROJECT_STATE
  );


  const handleCreate = (e) => {
    const { name, value } = e.target;
    setCreateProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous validation errors
    setNameError("");
    setUsernameError("");
    setCompanyAccError("");

    const isValidName = createProject.PROJECT_NAME !== "";
    const isValidUsername = createProject.PROJECT_USERNAME !== "";
    const isValidCompAccount = createProject.PROJECT_ACCOUNT !== "";
    
    if (!isValidUsername) {
      setUsernameError("Username should not be empty");
      return;
    }

    if (!isValidName) {
      setNameError("Name should not be empty");
      return;
    }

    if (!isValidCompAccount) {
      setCompanyAccError("Company Account should not be empty");
      return;
    }

    // Perform API validation and request
    axios
      .post("/api/create_project", createProject)
      .then((response) => {
        if (response.data.operation === "failed") {
          setErrorMsg(response.data.errorMsg);
          toast.error(response.data.errorMsg, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        } else if (response.data.operation === "successfull") {
          toast.success("Project Created successfully!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          Update();
          setOpen(false);
          setCreateProject({});
        }
      })
      .catch((error) => {
        console.error(error, "ERR");
        toast.error("An error occurred. Please try again later.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      });
  };

  // const timeZones = moment.tz.names(); // Get the array of time zone names

  return (
    <>
      <Button
        size="small"
        variant={"outlined"}
        className={"btn button border-bottom-0 bg-white"}
      >
        My Projects
      </Button>
      <button
        onClick={handleOpen}
        sx={{ color: "#277099" }}
        className="btn rounded-0 border-0  rounded-0 text-light btn-primary btn-sm"
        // variant="contained"
        size="small"
      >
        + Add New Project
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{zIndex:9999999}}
      >
        <Box className="modal-content">
          <form onSubmit={handleSubmit} className="overflow-auto">
          <h5>Create project</h5>
            <div className="row py-2">
              <div className="form-group col-xl-4">
                <label> Project Username</label>
                <input
                  type="text"
                  className={`form-control form-control-2 rounded-0 ${usernameErr ? "is-invalid" : ""
                    }`}
                  placeholder="Username"
                  value={createProject.PROJECT_USERNAME}
                  name="PROJECT_USERNAME"
                  onChange={handleCreate}
                />
                {usernameErr && (
                  <div className="invalid-feedback">{usernameErr}</div>
                )}
              </div>
              <div className="form-group col-xl-4">
                <label>Project Name</label>
                <input
                  type="text"
                  className={`form-control form-control-2 rounded-0 ${nameError ? "is-invalid" : ""
                    }`}
                  id="inputname"
                  placeholder="Project Name"
                  value={createProject.PROJECT_NAME}
                  name="PROJECT_NAME"
                  onChange={handleCreate}
     
                />
                {nameError && (
                  <div className="invalid-feedback">{nameError}</div>
                )}
              </div>
              <div className="form-group col-xl-4">
                <label>Account</label>
                <input
                  type="number"
                  className={`form-control form-control-2 rounded-0 ${companyaccError ? "is-invalid" : ""
                    }`}
                  id="inputPassword4"
                  placeholder="Enter your Account"
                  name="PROJECT_ACCOUNT"
                  value={createProject.PROJECT_ACCOUNT}
                  onChange={handleCreate}
       
                />
                {companyaccError && (
                  <div className="invalid-feedback">{companyaccError}</div>
                )}
              </div>
            </div>
            <div className="row py-2">
              <div className="form-group col-xl-4">
                <label>Project start date</label>
                <input
                  type="date"
                  value={createProject.PROJECT_START_DATE}
                  name="PROJECT_START_DATE"
                  onChange={handleCreate}
                  className="form-control form-control-2 rounded-0 "
                />

              </div>
              <div className="form-group col-xl-4">
                <label>Project End date</label>
                <input
                  type="date"
                  value={createProject.PROJECT_END_DATE}
                  name="PROJECT_END_DATE"
                  onChange={handleCreate}
                  className="form-control form-control-2 rounded-0"
                />
              </div>
              <div className="form-group col-xl-4">
                <label>Project Type</label>
                <select
                  id="inputEnroll"
                  className="form-control form-control-2 border rounded-0"
                  onChange={handleCreate}
                  name="PROJECT_TYPE"
                  value={createProject.PROJECT_TYPE}
                >
                  <option selected>--Choose Project Type--</option>
                  {projectList.map((e, key) => {
                    return (
                      <option value={e} key={key}>
                        {e}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="row py-2">
              <div className="form-group col-md-4">
                <label>Supervisor</label>
                <input
                  type="text"
                  className="form-control form-control-2 rounded-0 "
                  id="inputsupervisor"
                  name="PROJECT_SUPERVISOR"
                  value={createProject.PROJECT_SUPERVISOR}
                  onChange={handleCreate}
                />
              </div>

              <div className="form-group col-md-4">
                <label>Project Value</label>
                <input
                  type="number"
                  className="form-control form-control-2 rounded-0 "
                  id="inputsupervisor"
                  name="PROJECT_VALUE"
                  value={createProject.PROJECT_VALUE}
                  onChange={handleCreate}
                />
              </div>

              <div className="form-group col-md-4">
                <label></label>
                <select
                  id="inputEnroll"
                  className="form-control form-control-2 border rounded-0"
                  onChange={handleCreate}
                  name="PROJECT_CURRENCY"
                  value={createProject.PROJECT_CURRENCY}
                >
                  <option value="">--Select Currency--</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>

                  {/* <option>Plumber</option>
                  <option>Engineer</option> */}
                </select>
              </div>
            </div>
            <div className="row py-2">
              <div className="form-group  col-md-12">
                <label>Address</label>
                <textarea
                  type="text"
                  className="form-control rounded-0"
                  id="inputAddress2"
                  placeholder="Apartment, studio, or floor"
                  name="PROJECT_ADD"
                  value={createProject.PROJECT_ADD}
                  onChange={handleCreate}
                />
              </div>
            </div>
            <div className="row py-2">
              <div className="form-group col-xl-4">
                <label>Country</label>
                <select
                  className="form-control form-control-2 border rounded-0"
                  placeholder="Country"
                  name="PROJECT_COUNTRY"
                  value={createProject.PROJECT_COUNTRY}
                  onChange={handleCreate}
                >
                  <option value="">--Choose Country--</option>
                  {country?.map((value, key) => {
                    return (
                      <option value={value.name} key={key}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group col-xl-4">
                <label>State</label>
                <select
                  className="form-control form-control-2 border rounded-0"
                  placeholder="State"
                  name="PROJECT_STATE"
                  value={createProject.PROJECT_STATE}
                  onChange={handleCreate}
                >
                  <option value="">--Choose State--</option>
                  {availableState?.states?.map((e, key) => {
                    return (
                      <option value={e.name} key={key}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group col-xl-4">
                <label>City</label>
                <select
                  className="form-control form-control-2 border rounded-0"
                  placeholder="City"
                  name="PROJECT_CITY"
                  value={createProject.PROJECT_CITY}
                  onChange={handleCreate}
                >
                  <option value="">--Choose City--</option>
                  {availableCities?.cities?.map((e, key) => {
                    return (
                      <option value={e.name} key={key}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="py-2">
              <button
                type="submit"
                className="btn btn-info text-white"
                onClick={handleSubmit}
              >
                Create Project
              </button>{" "}
              <button
                onClick={handleClose}
                className="btn btn-danger text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}
