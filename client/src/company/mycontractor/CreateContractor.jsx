import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import country from "../../jsonlist/countriess.json";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import env from "react-dotenv";

import { Button, Grid } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export default function CreateContractor(props) {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createSubcontract, setCreatesubcontract] = useState({
    SUBCONTRACTOR_PARENT_ID: props.COMPANY_ID,
    SUBCONTRACTOR_PARENT_USERNAME: props.COMPANY_USERNAME,
    SUBCONTRACTOR_MEMBER_PARENT_ID: props.COMPANY_PARENT_ID,
    SUBCONTRACTOR_MEMBER_PARENT_USERNAME: props.COMPANY_PARENT_USERNAME,
  });

  const subcontractorRoleOptions = [
    { value: "Painter", label: "Painter" },
    { value: "Fitter", label: "Fitter" },
    { value: "Plumber", label: "Plumber" },
    { value: "Engineer", label: "Engineer" },
  ];


  const [resStatus, setResStatus] = useState(false); //adding newline


  useEffect(() => {
    setCreatesubcontract((prevState) => ({
      ...prevState,
      SUBCONTRACTOR_PARENT_ID: props.COMPANY_ID,
    }));
    setCreatesubcontract((prevState) => ({
      ...prevState,
      SUBCONTRACTOR_PARENT_USERNAME: props.COMPANY_USERNAME,
    }));
    setCreatesubcontract((prevState) => ({
      ...prevState,
      SUBCONTRACTOR_MEMBER_PARENT_ID: props.COMPANY_PARENT_ID,
    }));
    setCreatesubcontract((prevState) => ({
      ...prevState,
      SUBCONTRACTOR_MEMBER_PARENT_USERNAME:
        props.COMPANY_PARENT_USERNAME,
    }));
  }, [open]);





  const availableState = country?.find(
    (c) => c.name === createSubcontract.SUBCONTRACTOR_COUNTRY
  );

  const availableCities = availableState?.states?.find(
    (s) => s.name === createSubcontract.SUBCONTRACTOR_STATE
  );


  const handleCreate = (e) => {
    const { name, value } = e.target;
    setCreatesubcontract((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "SUBCONTRACTOR_PARENT_ID",
      "SUBCONTRACTOR_PARENT_USERNAME",
      "SUBCONTRACTOR_MEMBER_PARENT_ID",
      "SUBCONTRACTOR_MEMBER_PARENT_USERNAME",
      "SUBCONTRACTOR_USERNAME",
      "SUBCONTRACTOR_NAME",
      "SUBCONTRACTOR_PHONE",
    ];

    const hasEmptyFields = requiredFields.some(
      (field) => !createSubcontract[field]
    );

    if (hasEmptyFields) {
      setErrorMsg("Fill all fields");
      toast.error("Please fill in all fields", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    }

    setErrorMsg("");

    axios
      .post("/api/create_subcontractor", createSubcontract)
      .then((response) => {
        if (response.data.operation === "failed") {
          setErrorMsg(response.data.errorMsg);
          toast.error(response.data.errorMsg, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        } else if (response.data.operation === "successfull") {
          setResStatus(false);
          handleClose();
          toast.success("Subcontract Created successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
          props.Update();

        }
      })
      .catch((error) => {
        console.error(error, "ERR");
      });
  };



  return (
    <>
      <button
        onClick={handleOpen}
        style={{ color: "#277099" }}
        className="btn rounded-0 border-0  rounded-0 text-light btn-sm"
        variant="contained"
        size="small"
      >
        + Add Contractor
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{zIndex:9999999}}
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <div className="row py-2">
              <div className="form-group col-xl-4">
                <label>Contractor Email</label>
                <input
                  type="text"
                  className="form-control form-control-2 rounded-0"
                  placeholder="Username"
                  value={createSubcontract.SUBCONTRACTOR_USERNAME}
                  name="SUBCONTRACTOR_USERNAME"
                  onChange={handleCreate}
                />
              </div>
              <div className="form-group col-xl-4">
                <label>Contractor Name</label>
                <input
                  type="text"
                  className="form-control form-control-2 rounded-0"
                  id="inputname"
                  placeholder="Project Name"
                  value={createSubcontract.SUBCONTRACTOR_NAME}
                  name="SUBCONTRACTOR_NAME"
                  onChange={handleCreate}
                />
              </div>
              <div className="form-group col-xl-4">
                <label>Contact</label>
                <input
                  type="number"
                  className="form-control form-control-2 rounded-0"
                  id="inputPassword4"
                  placeholder="Enter Phone Number"
                  name="SUBCONTRACTOR_PHONE"
                  value={createSubcontract.SUBCONTRACTOR_PHONE}
                  onChange={handleCreate}
                />
              </div>
            </div>
            {/* <div className="row py-2">
              <div className="form-group col-xl-6">
                <label>Project start date</label>
                <input
                  type="date"
                  value={createSubcontract.SUBCONTRACTOR_START_DATE}
                  name="SUBCONTRACTOR_START_DATE"
                  onChange={handleCreate}
                  className="form-control form-control-2 rounded-0"
                //required
                />
              </div>
              <div className="form-group col-xl-6">
                <label>Project End date</label>
                <input
                  type="date"
                  value={createSubcontract.SUBCONTRACTOR_END_DATE}
                  name="SUBCONTRACTOR_END_DATE"
                  onChange={handleCreate}
                  className="form-control form-control-2 rounded-0"
                //required
                />
              </div>
            </div> */}
            <div className="row py-2">
              <div className="form-group col-xl-6">
                <label>Subcontract ROLE</label>
                <select
                  id="inputEnroll"
                  className="form-control form-control-2 border rounded-0"
                  onChange={handleCreate}
                  name="SUBCONTRACTOR_ROLE"
                  value={createSubcontract.SUBCONTRACTOR_ROLE}
                >
                  <option value="" disabled>Select Subcontractor Role</option>
                  {subcontractorRoleOptions.map((roleOption, index) => (
                    <option key={index} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label>Sub Contractor</label>
                <input
                  type="text"
                  className="form-control form-control-2 rounded-0 "
                  id="inputsupervisor"
                  name="SUBCONTRACTOR_SUPERVISOR"
                  value={createSubcontract.SUBCONTRACTOR_SUPERVISOR}
                  onChange={handleCreate}
                />
              </div>
            </div>
            <div className="row py-2">
              <div className="form-group  col-md-12">
                <label>Address</label>
                <textarea
                  type="text"
                  className="form-control form-control-2 rounded-0"
                  id="inputAddress2"
                  placeholder="Apartment, studio, or floor"
                  name="SUBCONTRACTOR_ADD"
                  value={createSubcontract.SUBCONTRACTOR_ADD}
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
                  name="SUBCONTRACTOR_COUNTRY"
                  value={createSubcontract.SUBCONTRACTOR_COUNTRY}
                  onChange={handleCreate}
                >
                  <option>--Choose Country--</option>
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
                  className="
                  form-control form-control-2 border rounded-0"
                  placeholder="State"
                  name="SUBCONTRACTOR_STATE"
                  value={createSubcontract.SUBCONTRACTOR_STATE}
                  onChange={handleCreate}
                >
                  <option selected>--Choose State--</option>
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
                  name="SUBCONTRACTOR_CITY"
                  value={createSubcontract.SUBCONTRACTOR_CITY}
                  onChange={handleCreate}
                >
                  <option>--Choose City--</option>
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
            <div className="FormButtonAlign">
              <button
                type="submit"
                className="btn btn-info text-white"
                onClick={handleSubmit}
              >
                Create Subcontractor
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
