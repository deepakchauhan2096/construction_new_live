import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assests/css/sidebar.css";
import "./assests/css/style.css";
import "./assests/css/graph.css";
import AdminDashboard from "./Admin/AdminDashboard";
import EmployeeAttendance from "./employee/EmployeeAttendance";
import EmployeeLogin from "./auth/EmployeeLogin";
import EmployeeHistory from "./employee/EmployeeHistory";
// import CompanyDashboard from "./company/dashboard/Dashboard";
import ProjectHome from "./company/myproject/ProjectAllocate";
import EmployeeSrc from "./employee/EmployeeSrc";
import AttendanceReport from "./company/attendance/AttendanceAcknowledge";
import Document from "./Document/Documents";
import Signup from "./auth/Signup";
import { auth } from "./firebase";
import SubContract from "./subcontract/SubContract";
import AdminLogin from "./auth/AdminLogin";
import Firecreate from "./components/Firecreate";
import UserLogin from "./auth/UserLogin";
import Updates from "./auth/Update";
import EmployeeTimeSheet from "./company/myemployee/EmployeeTimeSheet";
import EmployeeTimeSheetUser from "./employee/EmployeeTimeSheetUser";
import Sidebar from "./components/Sidebar";
import Project from "./company/myproject/Project";
import axios from "axios";
import ProjectDetail from "./company/myproject/ProjectDetail";
import ProjectAllocate from "./company/myproject/ProjectAllocate";
import ProjectLoc from "./company/myproject/ProjectLoc";
import ProjectDocuments from "./company/myproject/ProjectDocuments";
import Employee from "./company/myemployee/Employee";
import EmployeeDetail from "./employee/EmployeeDetail";
import EmployeeDetai from "./company/myemployee/EmployeeDetail";
import EmployeeManual from "./company/myemployee/EmployeeManual";
import EmployeeDocuments from "./company/myemployee/EmployeeDocuments";
import AttendanceAcknowledge from "./company/attendance/AttendanceAcknowledge";
import Documents from "./company/document/Documents";
import Contractor from "./company/mycontractor/Contractor";
import ContractorDetail from "./company/mycontractor/ContractorDetail";
import Dashboard from "./contractors/dashboard/Dashboard";

function App() {
  const [userName, setUserName] = useState("");

  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const data = user?.displayName;
        const splitedData = data?.split("&&");
        console.log(user, "user");
        setUserName(splitedData);
        console.log(splitedData, "splitedData");
      } else setUserName("");
    });
  }, []);

  // extract company
  const COMPANY_ID = userName[0];
  const COMPANY_USERNAME = userName[1];
  const COMPANY_PARENT_ID = userName[2];
  const COMPANY_PARENT_USERNAME = userName[3];
  console.log(COMPANY_ID, "uni");

  return (
    <div
      className="wrapper"
      style={{ overflowX: "scroll", overflow: "hidden" }}
    >
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/root" element={<AdminLogin />} />
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/employee/history" element={<EmployeeHistory />} />
            <Route path="/myadmin" element={<AdminDashboard />} />
            <Route path="/test" element={<Updates />} />
            {/* <Route
              path="/company/dashboard"
              element={<CompanyDashboard data={userName} />}
            /> */}
            <Route
              path="/employee/:COMPANY_ID/:COMPANY_USERNAME/:COMPANY_PARENT_ID/:COMPANY_PARENT_USERNAME"
              element={<EmployeeDetail state={userName} />}
            />
            <Route
              path="/employee/attendance"
              element={<EmployeeAttendance state={userName} />}
            />
            <Route
              path="/employee/timesheet"
              element={<EmployeeTimeSheetUser />}
            />
            <Route
              path="/employee/attendance/:latt/:lngi/:areas/:loca/:employees/:projects/:projectids"
              element={<EmployeeAttendance state={userName} />}
            />

            {/* compnay dashboard */}
            <Route
              path="/company/dashboard/"
              element={
                <Dashboard
                  COMPANY_ID={COMPANY_ID}
                  COMPANY_USERNAME={COMPANY_USERNAME}
                  COMPANY_PARENT_ID={COMPANY_PARENT_ID}
                  COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
                />
              }
            />
            {/* company dashboard */}

            {/* project */}
            <Route
              path="/company/projects/"
              element={
                <Project
                  COMPANY_ID={COMPANY_ID}
                  COMPANY_USERNAME={COMPANY_USERNAME}
                  COMPANY_PARENT_ID={COMPANY_PARENT_ID}
                  COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
                />
              }
            />
            <Route
              path="/company/projects/detail"
              element={<ProjectDetail />}
            />
            <Route
              path="/company/projects/allocate-employee"
              element={<ProjectAllocate />}
            />
            <Route path="/company/projects/tracking" element={<ProjectLoc />} />
            <Route
              path="/company/projects/documents"
              element={<ProjectDocuments />}
            />
            {/* project */}

            {/* My employees */}
            <Route
              path="/company/employees"
              element={
                <Employee
                  COMPANY_ID={COMPANY_ID}
                  COMPANY_USERNAME={COMPANY_USERNAME}
                  COMPANY_PARENT_ID={COMPANY_PARENT_ID}
                  COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
                />
              }
            />

            <Route
              path="/company/employees/detail"
              element={<EmployeeDetai />}
            />
            <Route
              path="/company/employees/timesheet"
              element={<EmployeeTimeSheet />}
            />
            <Route
              path="/company/employees/manual-attendence"
              element={<EmployeeManual />}
            />
            <Route
              path="/company/employees/documents"
              element={<EmployeeDocuments />}
            />
            {/* My employees */}

            {/* attendance */}
            <Route
              path="/company/attendance"
              element={
                <AttendanceAcknowledge
                  COMPANY_ID={COMPANY_ID}
                  COMPANY_USERNAME={COMPANY_USERNAME}
                  COMPANY_PARENT_ID={COMPANY_PARENT_ID}
                  COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
                />
              }
            />
            {/* attendance */}

            {/* document company */}
            <Route
              path="/company/documents"
              element={
                <Documents
                  COMPANY_ID={COMPANY_ID}
                  COMPANY_USERNAME={COMPANY_USERNAME}
                  COMPANY_PARENT_ID={COMPANY_PARENT_ID}
                  COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
                />
              }
            />
            {/* document company */}


            {/* My contractors */}
            <Route
              path="/company/contractors"
              element={
                <Contractor
                  COMPANY_ID={COMPANY_ID}
                  COMPANY_USERNAME={COMPANY_USERNAME}
                  COMPANY_PARENT_ID={COMPANY_PARENT_ID}
                  COMPANY_PARENT_USERNAME={COMPANY_PARENT_USERNAME}
                />
              }
            />
            <Route
              path="/company/contractors/detail"
              element={<ContractorDetail />}
            />
            {/* My contractos */}







            <Route
              path="/company/employees/:COMPANY_ID/:COMPANY_USERNAME/:COMPANY_PARENT_ID/:COMPANY_PARENT_USERNAME"
              element={<EmployeeSrc />}
            />
            <Route
              path="/company/attendance/:COMPANY_ID/:COMPANY_USERNAME/:COMPANY_PARENT_ID/:COMPANY_PARENT_USERNAME"
              element={<AttendanceReport />}
            />
            <Route
              path="/company/documents/:COMPANY_ID/:COMPANY_USERNAME/:COMPANY_PARENT_ID/:COMPANY_PARENT_USERNAME"
              element={<Document />}
            />
            <Route
              path="/company/contractor/:COMPANY_ID/:COMPANY_USERNAME/:COMPANY_PARENT_ID/:COMPANY_PARENT_USERNAME"
              element={<SubContract />}
            />
            <Route path="/temp/" element={<Firecreate />} />
          </>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
