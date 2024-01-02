import React, { useEffect, useState, version } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import moment from "moment/moment";
import { RotatingLines, ThreeDots } from "react-loader-spinner";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
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

const EmployeeManual = () => {
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
  const [selectedTimeIn, setSelectedTimeIn] = useState("");
  const [selectedTimeOut, setSelectedTimeOut] = useState("");
  const [resStatus, setResStatus] = useState(false);
  const [updateIn, setUpdateIn] = useState(true);
  const [updateOut, setUpdateOut] = useState(true);

  const originalTimeIn = moment(`2023-12-21 ${selectedTimeIn}`).format(
    "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
  );

  console.log(selectedTimeIn, originalTimeIn, "selectedTimeIn");
  console.log(selectedTimeOut, "selectedTimeOut");

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
        ATTENDANCE_ADMIN_USERNAME:
          filterData?.EMPLOYEE_MEMBER_PARENT_USERNAME,
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
      moment(e.ATTENDANCE_OUT).utcOffset(0).format("LT"),
      moment(e.ATTENDANCE_IN).utcOffset(0).format("LT")
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
  // const totalIncome = ExtractHours * filterData.EMPLOYEE_HOURLY_WAGE;
  const Manual = workvalue?.filter(
    (prev) =>
      prev.ATTENDANCE_TYPE_OUT === "manual" ||
      prev.ATTENDANCE_TYPE_IN === "manual"
  );

  const time12Hour = (event) => {
    const time = moment(event, "hh:mm A").format("HH:mm");
    return time;
  };

  const HandleUpdateIn = async (event) => {
    setUpdateIn(false);
    const originalTimeIn = moment(
      `${event?.ATTENDANCE_DATE_ID} ${selectedTimeIn}`
    ).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const inTime =
      selectedTimeIn.length > 0 ? originalTimeIn : event?.ATTENDANCE_IN;
    // const outTime = selectedTimeOut.length > 0 ? originalTimeOut : event?.ATTENDANCE_OUT
    // console.log(inTime, originalTimeIn, "myval")

    const dataIn = {
      ATTENDANCE_ID: event?.ATTENDANCE_ID,
      ATTENDANCE_ADMIN_ID: event?.ATTENDANCE_ADMIN_ID,
      ATTENDANCE_ADMIN_USERNAME: event?.ATTENDANCE_ADMIN_USERNAME,
      ATTENDANCE_COMPANY_ID: event?.ATTENDANCE_COMPANY_ID,
      ATTENDANCE_COMPANY_USERNAME: event?.ATTENDANCE_COMPANY_USERNAME,
      ATTENDANCE_EMPLOYEE_ID: event?.NDANCE_EMPLOYEE_ID,
      ATTENDANCE_EMPLOYEE_USERNAME: event?.ATTENDANCE_EMPLOYEE_USERNAME,
      ATTENDANCE_DATE_ID: event?.ATTENDANCE_DATE_ID,
      ATTENDANCE_IN: inTime,
      ATTENDANCE_TYPE_IN: "automatic",
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "/api/update_emp_attendance",
      headers: {
        "Content-Type": "application/json",
      },
      data: dataIn,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setUpdateIn(true);
        gettimesheet();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HandleUpdateOut = async (event) => {
    setUpdateOut(true);
    const originalTimeOut = moment(
      `${event?.ATTENDANCE_DATE_ID} ${selectedTimeOut}`
    ).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const outTime =
      selectedTimeOut.length > 0 ? originalTimeOut : event?.ATTENDANCE_OUT;

    const dataIn = {
      ATTENDANCE_ID: event?.ATTENDANCE_ID,
      ATTENDANCE_ADMIN_ID: event?.ATTENDANCE_ADMIN_ID,
      ATTENDANCE_ADMIN_USERNAME: event?.ATTENDANCE_ADMIN_USERNAME,
      ATTENDANCE_COMPANY_ID: event?.ATTENDANCE_COMPANY_ID,
      ATTENDANCE_COMPANY_USERNAME: event?.ATTENDANCE_COMPANY_USERNAME,
      ATTENDANCE_EMPLOYEE_ID: event?.NDANCE_EMPLOYEE_ID,
      ATTENDANCE_EMPLOYEE_USERNAME: event?.ATTENDANCE_EMPLOYEE_USERNAME,
      ATTENDANCE_DATE_ID: event?.ATTENDANCE_DATE_ID,
      ATTENDANCE_OUT: outTime,
      ATTENDANCE_TYPE_OUT: "automatic",
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "/api/update_emp_attendance",
      headers: {
        "Content-Type": "application/json",
      },
      data: dataIn,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setUpdateOut(false);
        gettimesheet();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columnsEdit = [
    {
      field: "ATTENDANCE_PROJECT_ID",
      headerName: "Project Id",
      width: 120,
    },
    { field: "ATTENDANCE_DATE_ID", headerName: "Date", width: 150 },
    { field: "ATTENDANCE_ID", headerName: "Attendance Id", width: 150 },

    {
      field: "ATTENDANCE_IN",
      headerName: "In",
      width: 100,
      renderCell: (cellValues) => {
        const convertedTime = time12Hour(
          cellValues.row.ATTENDANCE_IN &&
            moment(cellValues?.row.ATTENDANCE_IN).utcOffset(0).format("LT")
        );
        return cellValues?.row.ATTENDANCE_TYPE_IN == "manual" ? (
          <>
            <input
              type="time"
              style={{
                outline: "none",
                height: "100%",
                width: "100%",
                border: "none",
              }}
              value={selectedTimeIn ? selectedTimeIn : convertedTime}
              onChange={(e) => setSelectedTimeIn(e.target.value)}
            />
          </>
        ) : (
          <>
            <button className="btn text-white">{"no request"}</button>
          </>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues.row.ATTENDANCE_IN
          ? "bg-success text-white border px-0"
          : "bg-danger text-white border px-0";
      },
    },
    {
      field: "Action In",
      headerName: "Action In",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <>
            <button
              variant="contained"
              disabled={
                cellValues.row.ATTENDANCE_TYPE_IN == "manual" &&
                cellValues.row.ATTENDANCE_IN
                  ? false
                  : true
              }
              className="position-relative btn btn-primary w-100 px-0 rounded-0"
              type="submit"
              onClick={() => HandleUpdateIn(cellValues.row)}
            >
              {updateIn ? (
                <>Update</>
              ) : (
                <>
                  Updating
                  <ThreeDots
                    visible={true}
                    height="12"
                    width="12"
                    color="#fff"
                    radius="2"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{ bottom: "7px", right: "2px" }}
                    wrapperClass="position-absolute"
                  />
                </>
              )}
            </button>
          </>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues.row.ATTENDANCE_IN && cellValues.row.ATTENDANCE_IN
          ? "text-light px-0 w-100 rounded-0 border"
          : "text-white px-0 w-100 rounded-0 border";
      },
    },

    {
      field: "ATTENDANCE_OUT",
      headerName: "Out",
      width: 100,
      renderCell: (cellValues) => {
        const convertedTime = time12Hour(
          cellValues.row.ATTENDANCE_OUT &&
            moment(cellValues?.row.ATTENDANCE_OUT).utcOffset(0).format("LT")
        );
        return cellValues?.row.ATTENDANCE_TYPE_OUT == "manual" ? (
          <>
            <input
              type="time"
              style={{
                outline: "none",
                height: "100%",
                width: "100%",
              }}
              value={selectedTimeOut ? selectedTimeOut : convertedTime}
              onChange={(e) => setSelectedTimeOut(e.target.value)}
            />
          </>
        ) : (
          <>
            <button className="btn text-white">{"no request"}</button>
          </>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues.row.ATTENDANCE_OUT
          ? "bg-success text-white border px-0"
          : "bg-secondary text-white border px-0";
      },
    },

    {
      field: "Action Out",
      headerName: "Action Out",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <>
            <button
              variant="contained"
              disabled={
                cellValues.row.ATTENDANCE_TYPE_OUT == "manual" &&
                cellValues.row.ATTENDANCE_OUT
                  ? false
                  : true
              }
              className="position-relative btn btn-primary w-100 px-0 rounded-0"
              type="submit"
              onClick={() => HandleUpdateOut(cellValues.row)}
            >
              {updateOut ? (
                <>Update</>
              ) : (
                <>
                  Updating
                  <ThreeDots
                    visible={true}
                    height="12"
                    width="12"
                    color="#fff"
                    radius="2"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{ bottom: "7px", right: "2px" }}
                    wrapperClass="position-absolute"
                  />
                </>
              )}
            </button>
          </>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues.row.ATTENDANCE_OUT && cellValues.row.ATTENDANCE_OUT
          ? "text-light px-0 w-100 rounded-0 border"
          : "text-white w-100 px-0 rounded-0 border";
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
                moment(cellValues?.row.ATTENDANCE_OUT)
                  .utcOffset(0)
                  .format("LT"),
                moment(cellValues?.row.ATTENDANCE_IN).utcOffset(0).format("LT")
              )}
            </>
          )
        );
      },
    },
    {
      field: "Status",
      headerName: "Status",
      width: 110,
      renderCell: (cellValues) => {
        return cellValues?.row.ATTENDANCE_IN &&
          cellValues?.row.ATTENDANCE_OUT ? (
          <>{"present"}</>
        ) : (
          <>{"absent"}</>
        );
      },
      cellClassName: (cellValues) => {
        return cellValues.row.ATTENDANCE_IN && cellValues.row.ATTENDANCE_OUT
          ? "bg-success text-light border"
          : "bg-danger text-white border";
      },
    },
  ];

  // console.log(resStatus, "Manual.length");

  // console.log(Manual.length, "total")

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
        active={3}
        COMPANY_ID={COMPANY_ID}
        COMPANY_USERNAME={COMPANY_USERNAME}
        COMPANY_PARENT_ID={COMPANY_PARENT_ID}
        COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
      />
      <div className="myscreen p-3">
        <div className="container-fluid border" style={{ height: "90vh" }}>
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
              style={{ height: "73vh" }}
              rows={Manual}
              columns={columnsEdit}
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
                noRowsLabel: Manual.length == 0 && "No request available",
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
      </div>
    </Box>
  );
};

export default EmployeeManual;
