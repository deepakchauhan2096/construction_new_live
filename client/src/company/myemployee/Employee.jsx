import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmployeeEdit from "./EmployeeEdit";
import EmployeeCreate from "./EmployeeCreate";
import Sidebar from "../../components/Sidebar";
import moment from "moment";

const Employee = ({
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

  //fatch Employees
  const fetchData = async () => {
    try {
      const response = await axios.put("/api/get_employee", {
        EMPLOYEE_MEMBER_PARENT_ID: COMPANY_PARENT_ID,
        EMPLOYEE_MEMBER_PARENT_USERNAME: COMPANY_PARENT_USERNAME,
        EMPLOYEE_PARENT_USERNAME: COMPANY_USERNAME,
        EMPLOYEE_PARENT_ID: COMPANY_ID,
      });

      const data = response.data;
      // console.log("Employee Data: =>", data);
      setEmpData(data.result);
    } catch (err) {
      console.log("Something Went Wrong: =>", err);
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
        EMPLOYEE_PARENT_ID: archiveData.row?.EMPLOYEE_PARENT_ID,
        EMPLOYEE_PARENT_USERNAME: archiveData.row?.EMPLOYEE_PARENT_USERNAME,
        EMPLOYEE_MEMBER_PARENT_ID: archiveData.row?.EMPLOYEE_MEMBER_PARENT_ID,
        EMPLOYEE_MEMBER_PARENT_USERNAME:
          archiveData.row?.EMPLOYEE_MEMBER_PARENT_USERNAME,
        EMPLOYEE_ID: archiveData.row?.EMPLOYEE_ID,
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
        EMPLOYEE_PARENT_ID: archiveemp.row?.EMPLOYEE_PARENT_ID,
        EMPLOYEE_PARENT_USERNAME: archiveemp.row?.EMPLOYEE_PARENT_USERNAME,
        EMPLOYEE_MEMBER_PARENT_ID: archiveemp.row?.EMPLOYEE_MEMBER_PARENT_ID,
        EMPLOYEE_MEMBER_PARENT_USERNAME:
          archiveemp.row?.EMPLOYEE_MEMBER_PARENT_USERNAME,
        EMPLOYEE_ID: archiveemp.row?.EMPLOYEE_ID,
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
    navigate("/company/employees/detail", {
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

  const FilterArchive = empData?.filter(
    (newData) => newData?.ARCHIVED === false
  );
  const rows = FilterArchive;
  const archivedData = empData?.filter((newData) => newData?.ARCHIVED === true);
  const rows2 = archivedData;

  const filterData = data?.row;

  return (
    <>
      <Sidebar
        active={2}
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME
      />
      <Box className="box" style={{ background: "#277099" }}>
        {/* <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} /> */}
        <Button
          size="small"
          variant={"outlined"}
          className={
            display === "unarchive"
              ? "btn button border-bottom-0 bg-white"
              : "btn btn-sm btn-primary rounded-0 border-0  rounded-0 text-light"
          }
          onClick={() => setDisplay("unarchive")}
        >
          My Employees
        </Button>
        <Button
          size="small"
          variant={"outlined"}
          className={
            display === "archive"
              ? "btn button border-bottom-0 bg-white"
              : "btn btn-sm btn-primary rounded-0 border-0  rounded-0 text-light"
          }
          onClick={() => setDisplay("archive")}
        >
          Archive
        </Button>
        <EmployeeCreate
          COMPANY_ID={COMPANY_ID}
          COMPANY_USERNAME={COMPANY_USERNAME}
          COMPANY_PARENT_ID={COMPANY_PARENT_ID}
          COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
          name={"Project"}
          Update={fetchData}
        />

        <div className="myscreen p-3">
          <Box style={{ height: "100%", padding: 0, paddingBottom: "0" }}>
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
                disableRowSelectionOnClick
                localeText={{
                  noRowsLabel: rows.length === 0 && "There is no Emploies..",
                }}
              />
            </>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Employee;
