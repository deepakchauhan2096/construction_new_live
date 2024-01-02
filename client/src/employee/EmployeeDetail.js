import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";


const EmployeeDetail = ({ state }) => {



  console.log(state, "state")

  const navigate = useNavigate();
  const [project, setProject] = useState();
  const [empdata, setEmpdata] = useState([]);
  console.log(state, "userEmp");
 

  // get employee
  useEffect(() => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "/api/emp_data_one",

      data: {
        ADMIN_USERNAME: state[3],
        EMPLOYEE_ID: state[0]
      }
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data, "mylogin ll");
        const data = response.data;
        if (data.result) {
          setEmpdata(data.result);
        }
      })
      .catch((error) => {
        console.log(error, "errors");
      });
  }, [state[3]]);

 
  // get  all projects
  const PROJECTS = empdata.EMPLOYEE_ASSIGN;
  console.log(PROJECTS, "PROJECTS")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = PROJECTS.map((item) => {
          const {
            PROJECT_ID,
            PROJECT_PARENT_ID,
            PROJECT_MEMBER_PARENT_ID,
            PROJECT_MEMBER_PARENT_USERNAME,
            PROJECT_USERNAME,
          } = item;

          const data = {
            PROJECT_ID,
            PROJECT_PARENT_ID,
            PROJECT_MEMBER_PARENT_ID,
            PROJECT_MEMBER_PARENT_USERNAME,
            PROJECT_USERNAME,
          };

          return axios.put(
            "/api/get_projects_one",
            data,
       
          );
        });

        const responses = await Promise.all(requests);

        const arry = responses.map((response) => response.data.result[0]);
        if (arry) {
          setProject(arry);
          console.log(arry,"arry")
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [empdata]);




  const logout = async () => {
    try {
      await auth.signOut();
      // Add any additional logout-related actions here
      navigate('/')
    } catch (error) {
      // Handle any errors here
      console.error('Error logging out: ', error);
    }
  };

  console.log(project,"project---")

  return (
    <>
      <div className="container-fluid g-0">
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-dark"
          style={{ marginBottom: 0 }}
        >
          <div className="container">
            <a className="navbar-brand" href="#">
              {state.EMPLOYEE_NAME} (Employee)
            </a>
            <button
              className="btn btn-outline-primary my-2 my-sm-0 btn-sm"
              type="submit"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </nav>

        <nav
          className="navbar navbar-expand-lg navbar-light bg-light"
          style={{ height: "40px" }}
        >
          <div className="container">
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="bg-white text-dark nav-link">My Projects</a>
                <Link className="bg-light text-dark nav-link" to={`/employee/timesheet?Id=${state[1]}&eid=${state[3]}`}>My attendance history</Link>
              </div>
            </div>
          </div>
        </nav>
       
        {project?.length > 0 ? (project ? (
          <div className="container">
            <div className="row">
              <div className="col-12   d-lg-none overflow-auto" />
              <h5 className="py-4 text-underline">My Projects</h5>
            
              <table className="table table-striped table-sm">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Project Id</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Punch</th>
                  </tr>
                </thead>

                <tbody>
                  {project?.map((item, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item?.PROJECT_NAME}</td>
                      <td>{item?.PROJECT_ID}</td>
                      <td>{item?.PROJECT_START_DATE}</td>
                      <td>{item?.PROJECT_END_DATE}</td>
                      <td>
                        <Link to={`/employee/attendance/${item?.LATITUDE}/${item?.LONGITUDE}/${item?.AREA}/${item?.LOCATION_NAME}/${empdata?.EMPLOYEE_NAME}/${item?.PROJECT_NAME}/${item?.PROJECT_ID}`}
                          className="btn btn-sm btn-primary"
                        // to={`/employee/attendance/${item?.LATITUDE}&${item?.LONGITUDE}&${item?.AREA}&${item?.LOCATION_NAME}&${state.EMPLOYEE_NAME}&${item?.PROJECT_NAME}&${item?.PROJECT_ID}`}
                        >
                          Visit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="container">loading...</div>
        )) :<div className="container position-absolute top-50 text-center" style={{transform:"translate(-50%,-50%)",left:"50%"}}> Currently no project is assign for you.</div>}
      </div>
    </>
  );
};

export default EmployeeDetail;
