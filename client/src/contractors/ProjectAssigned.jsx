import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectAssigned = (props) => {

  const filterData = props.projectData;
  const [project, setProject] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = filterData.PROJECT_ASSIGN?.map((item) => {
          const {
            EMPLOYEE_MEMBER_PARENT_USERNAME,
            EMPLOYEE_ID
          } = item;

          const data = {
            ADMIN_USERNAME: EMPLOYEE_MEMBER_PARENT_USERNAME,
            EMPLOYEE_ID: EMPLOYEE_ID
          };

          return axios.put(
            "/api/emp_data_one",
            data,
       
          );
        });

        const responses = await Promise.all(requests);

        const arry = responses.map((response) => response?.data.result);
        if (arry) {
          setProject(arry);
          // console.log( arry,"arry -2")
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [filterData]);

  console.log(project,"lalal")

  return (
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
  );
};

export default ProjectAssigned;
