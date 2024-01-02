import React, { useEffect, useState, version } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import moment from "moment/moment";
import { RotatingLines } from "react-loader-spinner";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import InfoIcon from "@mui/icons-material/Info";
import { PDFDownloadLink, PDFViewer, ReactPDF } from "@react-pdf/renderer";
// import SalaryPDF from "../Invoices/SalaryPDF";
import env from "react-dotenv";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Tooltip } from "@mui/material";
import EmployeeNav from "./EmployeeNav";

// current day
let MyDateCurrent = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
const formattedMyDateCurrent = moment(MyDateCurrent)
  .utcOffset(0)
  .format("YYYY-MM-DD");

//Day before 30
let MyDateBefore = moment()
  .subtract(30, "days")
  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
const formattedMyDateBefore = moment(MyDateBefore)
  .utcOffset(0)
  .format("YYYY-MM-DD");

const EmployeeTimeSheet = () => {
  const filteredEmployee = useLocation();
  const filterData = filteredEmployee?.state[0];
  const COMPANY_ID = filteredEmployee?.state[1];
  const COMPANY_USERNAME = filteredEmployee?.state[2];
  const COMPANY_PARENT_ID = filteredEmployee?.state[3];
  const COMPANY_PARENT_USERNAME = filteredEmployee?.state[4];

  const [workvalue, setWorkvalue] = useState([]);
  const [dateValue, setDate] = useState({
    ATTENDANCE_START_DATE: formattedMyDateBefore,
    ATTENDANCE_END_DATE: formattedMyDateCurrent,
  });
  const [resStatus, setResStatus] = useState(false);

  useEffect(() => {
    gettimesheet();
  }, [
    filterData?.EMPLOYEE_MEMBER_PARENT_USERNAME,
    dateValue.ATTENDANCE_START_DATE,
    dateValue.ATTENDANCE_END_DATE,
  ]);

  const gettimesheet = async (e) => {
    try {
      const response = await axios.put("/api/get_employee_all_for_attendence", {
        ATTENDANCE_ADMIN_USERNAME: filterData?.EMPLOYEE_MEMBER_PARENT_USERNAME,
        ATTENDANCE_EMPLOYEE_USERNAME: filterData?.EMPLOYEE_USERNAME,
        ATTENDANCE_START_DATE: dateValue.ATTENDANCE_START_DATE,
        ATTENDANCE_END_DATE: dateValue.ATTENDANCE_END_DATE,
      });
      setTimeout(() => {
        setResStatus(true);
        setWorkvalue(response.data.result);
      }, 1000);
    } catch (err) {
      console.log("something Went wrong: =>", err);
      setResStatus("error");
    }
  };

  // time calculation
  const timeValueHours = (x, y) => {
    // console.log(x,"xxxxxx")
    const attendanceIn = moment(y, "hh:mm A").utcOffset(0);
    const attendanceOut = moment(x, "hh:mm A").utcOffset(0);
    const duration = moment.duration(attendanceOut.diff(attendanceIn));
    const totalHours = Math.floor(duration.asHours());
    const totalMinutes = duration.minutes();
    return `${totalHours} hours and ${totalMinutes} minutes`;
  };

  // overtime calculation
  const Overtime = (x, y) => {
    // console.log(x,"xxxxxx")
    const attendanceIn = moment(y, "hh:mm A").utcOffset(0);
    const attendanceOut = moment(x, "hh:mm A").utcOffset(0);
    const duration = moment.duration(attendanceOut.diff(attendanceIn));
    const totalHours = Math.floor(duration.asHours());

    // Define a threshold for regular hours (e.g., 40 hours per week)
    const regularHoursThreshold = 8;
    let overtimeHours = 0;

    if (totalHours > regularHoursThreshold) {
      overtimeHours = totalHours - regularHoursThreshold;
    }

    return `${overtimeHours} hours`;
  };

  const attendanceIn = moment("11:50 AM", "hh:mm A");
  const attendanceOut = moment("5:00 PM", "hh:mm A");
  const duration = moment.duration(attendanceOut.diff(attendanceIn));
  const totalHours = Math.floor(duration.asHours());
  const totalMinutes = duration.minutes().toString().padStart(2, "0");

  console.log(`${totalHours} hours and ${totalMinutes} minutes`);

  const allHours = workvalue?.map((e) => {
    return timeValueHours(
      moment(e.ATTENDANCE_TYPE_OUT == "automatic" ? e.ATTENDANCE_OUT : "")
        .utcOffset(0)
        .format("LT"),
      moment(e.ATTENDANCE_TYPE_IN == "automatic" ? e.ATTENDANCE_IN : "")
        .utcOffset(0)
        .format("LT")
    );
  });

  const convertToDuration = (timeString) => {
    const [hours, minutes] = timeString.match(/\d+/g)?.map(Number) || [0, 0];
    return moment.duration({ hours, minutes });
  };

  // read duration
  const ReadDuration = (event) => {
    const totalDuration = event.reduce((acc, timeString) => {
      const duration = convertToDuration(timeString);
      return acc.add(duration);
    }, moment.duration());
    return totalDuration;
  };

  //overall time
  const overallTime = (event) => {
    // Add up all durations in the array
    const totalDuration = ReadDuration(event);

    // Get total hours and minutes from the total duration
    const totalHourss = Math.floor(totalDuration.asHours());
    const totalMinutess = totalDuration.minutes();
    return `${totalHourss} hours and ${totalMinutess} minutes`;
  };

  // calculations
  const ResultantTime = overallTime(allHours);
  const ExtractHours = convertToDuration(ResultantTime)?._data.hours;
  const totalIncome = ExtractHours * filterData.EMPLOYEE_HOURLY_WAGE;
  // const Automatic = workvalue?.filter((prev) => prev.ATTENDANCE_TYPE_IN === "automatic" && prev.ATTENDANCE_TYPE_OUT === "automatic")

  const columns = [
    {
      field: "ATTENDANCE_PROJECT_ID",
      headerName: "Project Id",
      width: 120,
    },
    { field: "ATTENDANCE_DATE_ID", headerName: "Date", width: 150 },

    {
      field: "ATTENDANCE_IN",
      headerName: "In",
      width: 120,
      renderCell: (cellValues) => {
        return cellValues?.row.ATTENDANCE_TYPE_IN == "automatic" &&
          cellValues?.row.ATTENDANCE_IN ? (
          <>
            {cellValues.row.ATTENDANCE_IN &&
              moment(cellValues?.row.ATTENDANCE_IN).utcOffset(0).format("LT")}
          </>
        ) : (
          <>{"absent"}</>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues?.row.ATTENDANCE_TYPE_IN == "automatic" &&
          cellValues?.row.ATTENDANCE_IN
          ? "bg-success text-white border"
          : "bg-danger text-white border";
      },
    },

    {
      field: "ATTENDANCE_OUT",
      headerName: "Out",
      width: 150,
      renderCell: (cellValues) => {
        return cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic" &&
          cellValues?.row.ATTENDANCE_OUT ? (
          <>
            {cellValues?.row.ATTENDANCE_OUT &&
              moment(cellValues?.row.ATTENDANCE_OUT).utcOffset(0).format("LT")}
          </>
        ) : (
          <>{"absent"}</>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic" &&
          cellValues?.row.ATTENDANCE_OUT
          ? "bg-success text-white border"
          : "bg-danger text-white border";
      },
    },

    {
      field: "Working hours",
      headerName: "Working hours",
      width: 200,
      renderCell: (cellValues) => {
        return cellValues?.row.ATTENDANCE_OUT &&
          cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic" ? (
          <>
            {timeValueHours(
              moment(
                cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic"
                  ? cellValues?.row.ATTENDANCE_OUT
                  : ""
              )
                .utcOffset(0)
                .format("LT"),
              moment(
                cellValues?.row.ATTENDANCE_TYPE_IN == "automatic"
                  ? cellValues?.row.ATTENDANCE_IN
                  : ""
              )
                .utcOffset(0)
                .format("LT")
            )}
          </>
        ) : (
          ""
        );
      },
      cellClassName: (cellValues) => {
        return cellValues.row.ATTENDANCE_IN && cellValues.row.ATTENDANCE_OUT
          ? "bg-light text-dark border"
          : "text-dark border";
      },
    },
    {
      field: "overtime",
      headerName: "Overtime",
      width: 170,
      renderCell: (cellValues) => {
        return (
          cellValues?.row.ATTENDANCE_OUT && (
            <>
              {Overtime(
                moment(
                  cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic"
                    ? cellValues?.row.ATTENDANCE_OUT
                    : ""
                )
                  .utcOffset(0)
                  .format("LT"),
                moment(
                  cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic"
                    ? cellValues?.row.ATTENDANCE_IN
                    : ""
                )
                  .utcOffset(0)
                  .format("LT")
              )}
            </>
          )
        );
      },
    },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      renderCell: (cellValues) => {
        return cellValues?.row.ATTENDANCE_TYPE_IN == "automatic" &&
          cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic" &&
          cellValues?.row.ATTENDANCE_IN &&
          cellValues?.row.ATTENDANCE_OUT ? (
          <>{"present"}</>
        ) : (
          <>{"absent"}</>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues?.row.ATTENDANCE_TYPE_IN == "automatic" &&
          cellValues?.row.ATTENDANCE_TYPE_OUT == "automatic" &&
          cellValues?.row.ATTENDANCE_IN &&
          cellValues?.row.ATTENDANCE_OUT
          ? "bg-success text-light border"
          : "bg-danger text-white border";
      },
    },
    {
      type: "number",
      field: "Location",
      headerName: "Location",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <center>
            <Tooltip
              title={`(Location In) : ${cellValues.row.ATTENDENCE_LOCATION_IN} (Location Out) : ${cellValues.row.ATTENDENCE_LOCATION_OUT}`}
              enterDelay={500}
              leaveDelay={200}
            >
              <i
                className="fa fa-info-circle fs-6 "
                style={{ cursor: "pointer" }}
              ></i>
            </Tooltip>
          </center>
        );
      },
    },
  ];

  return (
    <Box
      style={{
        display: "block",
        height: "100vh",
      }}
      className="box position-absolute"
    >
      {/* <Navbar toggle={() => setOpenNav((e) => !e)} name={COMPANY_USERNAME} /> */}

      <EmployeeNav
        filterData={filterData}
        active={2}
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
      />
      <div className="myscreen p-3">
        <div className="container-fluid border" style={{ height: "70vh" }}>
          <p>
            {" "}
            <b style={{ fontWeight: "600", color: "black" }}>
              Employee Name :{" "}
            </b>
            {filterData.EMPLOYEE_NAME}
          </p>
          <div style={{ display: "flex", gap: 10, padding: "5px 0" }}></div>
          <div className="col-3">
            <table className="table p-0 m-0">
              <tr>
                <th>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <DatePicker
                        label="Date from"
                        // onChange={(newValue) => setstartDateString(newValue)}
                        onChange={(event) =>
                          setDate((prev) => ({
                            ...prev,
                            ATTENDANCE_START_DATE: event,
                          }))
                        }
                        defaultValue={dayjs(dateValue.ATTENDANCE_START_DATE)}
                        sx={{}}
                        formatDensity="spacious"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </th>
                <th>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker", "DatePicker"]}>
                      <DatePicker
                        label="Date to"
                        // onChange={(newValue) => setstartDateString(newValue)}
                        onChange={(event) =>
                          setDate((prev) => ({
                            ...prev,
                            ATTENDANCE_END_DATE: event,
                          }))
                        }
                        defaultValue={dayjs(dateValue.ATTENDANCE_END_DATE)}
                        sx={{ height: "10" }}
                        formatDensity="spacious"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </th>
              </tr>
            </table>
          </div>

          {/* data gird */}
          {resStatus == true ? (
            <DataGrid
              className="display"
              style={{ height: "55vh" }}
              rows={workvalue}
              columns={columns}
              getRowId={(row) => row.ATTENDANCE_ID}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 8,
                  },
                },
                sorting: {
                  sortModel: [
                    {
                      field: "ATTENDANCE_DATE_ID",
                      sort: "asc",
                    },
                  ],
                },

                aggregation: {
                  model: {
                    size: "sum",
                    updatedAt: "max",
                  },
                },
              }}
              density="compact"
              pageSizeOptions={[5]}
              // checkboxSelection
              disableRowSelectionOnClick
              localeText={{
                noRowsLabel: workvalue.length == 0 && "No request available",
              }}
            />
          ) : resStatus === "error" ? (
            <div
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
                    onClick={gettimesheet}
                    className="btn btn-sm btn-secondary"
                  >
                    Retry
                  </button>
                </center>
              </small>
            </div>
          ) : (
            <div
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
        </div>
        <div className="container-fluid" style={{ position: "", bottom: "0" }}>
          <div className="row border">
            <div className="col-6  pt-5 ">
              <p className="fw-semibold text-dark">
                Employee Signature:{" "}
                <span
                  style={{
                    borderBottom: "2px solid black",
                    width: "200px",
                  }}
                ></span>
              </p>
            </div>

            <div className="col-5">
              <div className="row">
                <div className="col-5  m-2">
                  <p className="text-dark fw-semibold">Total Hours</p>
                  <p className="text-dark fw-semibold">Rate Per Hour</p>
                  <p className="text-dark fw-semibold">Total Pay</p>
                </div>
                <div className="col-6  m-2">
                  <p className="bg-warning text-center fs-6 text-dark">
                    {ResultantTime}
                  </p>
                  <p className="bg-primary text-center fs-6 text-light">
                    {filterData.EMPLOYEE_HOURLY_WAGE}
                  </p>
                  <p className="bg-success text-center fs-6 text-light">
                    $ {totalIncome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default EmployeeTimeSheet;
