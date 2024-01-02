const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require("request");
const middlewareFunction = require('./middlewareFunction/middlewareFunction');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dotenv = require("dotenv").config()
const app = express();

const port = process.env.PORT || 5001; // You can choose any port you prefer;

// Middleware
app.use(bodyParser.json());
app.use(express.json())
console.log(process.env.SERVERAPIREQUEST);


app.use(cors());


function sendHttpRequest(method, url, req, res) {
  const options = {
    method,
    url,
    json: true,
    body: req.body, // Forward the request body

  };


  request(options, (error, response, body) => {
    const status = response ? response.statusCode : 500;
    console.log(error, body);
    if (error === null) {
      res.status(status).send(body);
    } else {
      res.status(status).send(error);
    }
  });
}

app.post("/api/create_admin", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_admin`, req, res)
})
app.post('/api/login', (req, res) => {
  console.log("login hit");
  console.log(req, res);
  console.log("process env link", process.env);
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/login`, req, res);
});
app.post("/api/emplogin", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/emplogin`, req, res);
})

app.put("/api/update_employee", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/update_employee`, req, res)
});
app.post("/api/create_employee", middlewareFunction.vaildateClient, (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_employee`, req, res);
})

app.post("/api/create_company", middlewareFunction.vaildateMember, (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_company`, req, res);
})

app.put("/api/update_company", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/update_company`, req, res);
})

app.post("/api/create_project", middlewareFunction.vaildateProject, (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_project`, req, res);
})

app.post("/api/attendance", middlewareFunction.vaildateMember, (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/attendance`, req, res);
})

app.post("/api/create_subcontractor", middlewareFunction.vaildateSubContractor, (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_subcontractor`, req, res);
})
app.post("/api/create_subcontractor_employee", middlewareFunction.vaildateEmployeeSubContractor, (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_subcontractor_employee`, req, res);
})
app.post("/api/create_sub_emp_attendance", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_sub_emp_attendance`, req, res);
})
app.put("/api/subemp", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/subemp`, req, res);
})
app.put("/api/getSubAttendance", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/getSubAttendance`, req, res);
})

app.put("/api/get_admin", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_admin`, req, res);
});

app.get("/api/getvalidateusername/:username", (req, res) => {
  sendHttpRequest("GET", `${process.env.SERVERAPIREQUEST}/getvalidateusername:${req.params.username}`, req, res)
})

app.put("/api/get_company", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_company`, req, res)
})

app.put("/api/get_companies/:user", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_companies:${req.params.user}`, req, res)
});

app.post("/api/querytochatgp", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/querytochatgp`, req, res)
});

app.get("/api/getalltask", (req, res) => {
  sendHttpRequest("GET", `${process.env.SERVERAPIREQUEST}/querytochatgp`, req, res)
});

app.put("/api/get_employee", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_employee`, req, res)
});

// app.put("/api/get_employee_for_employee",(req,res)=> {
//   sendHttpRequest("PUT",`${process.env.SERVERAPIREQUEST}/get_employee_for_employee`,req,res)
// });

app.put("/api/get_employee_for_employee", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_employee_for_employee`, req, res)
});

app.put("/api/get_employee_all", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_employee_all`, req, res)

});

app.put("/api/get_employee_all_for_attendence", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_employee_all_for_attendence`, req, res)
});



app.put("/api/get_projects", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_projects`, req, res)
});


app.put("/api/get_projects_one", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_projects_one`, req, res)
});



app.post("/api/create_emp_attendance", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_emp_attendance`, req, res)
});


app.put("/api/get_projects_one", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_projects_one`, req, res)
});

app.put("/api/emp_data_one", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/emp_data_one`, req, res)
});

app.post("/api/create_emp_attendence", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_emp_attendance`, req, res)
});




app.put("/api/get_subcontractor", (req, res) => {
  console.log(req.body);
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_subcontractor`, req, res)

});

app.put("/api/get_all_attendance", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_all_attendance`, req, res)
});


app.put("/api/update_projects", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/update_projects`, req, res)
});


app.post("/api/projectreport", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/projectreport`, req, res)
});

app.put("/api/getprojectreport", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/getprojectreport`, req, res)
});

app.delete("/api/deleteproject", (req, res) => {
  sendHttpRequest("DELETE", `${process.env.SERVERAPIREQUEST}/deleteproject`, req, res)
});

app.put("/api/update_projects", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/update_projects`, req, res)
});



app.put("/api/get_all_company", (req, res) => {
  console.log("req", req);
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_all_company`, req, res)
});






app.post("/api/testapi", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/testapi`, req, res)
});

// app.post("/api/create_document",(req,res)=> {
//   console.log(req.body);
//   sendHttpRequest("POST",`${process.env.SERVERAPIREQUEST}/create_document`,req,res)
// });

const createDocumentProxy = createProxyMiddleware('/api/create_document', {
  target: process.env.SERVERAPIREQUEST, // Set the target URL for create_document
  changeOrigin: true,
  pathRewrite: {
    '/api/create_document': '/create_document', // Modify the path as needed
  },
});
app.use(createDocumentProxy);


app.post("/api/create_documentnew", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/create_documentnew`, req, res)
});

app.post("/api/archive-employee", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/archive-employee`, req, res)
});

app.get("/api/getall-archived-employees", (req, res) => {
  sendHttpRequest("GET", `${process.env.SERVERAPIREQUEST}/getall-archived-employees`, req, res)
});





app.put("/api/unarchive-employee", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/unarchive-employee`, req, res)
});

// delete document api 

app.delete("/api/delete_document/:DOCUMENT_ID", (req, res) => {
  console.log(process.env.SERVERAPIREQUEST);
  console.log("wole data1", req.body);
  console.log("res data", res);
  const documentId = req.params.DOCUMENT_ID
  console.log(documentId);
  sendHttpRequest("DELETE", `${process.env.SERVERAPIREQUEST}/delete_document/${documentId}`, req, res)
});


app.delete("/api/delete_employee_document", (req, res) => {
  sendHttpRequest("DELETE", `${process.env.SERVERAPIREQUEST}/delete_employee_document`, req, res)
});


app.delete("/api/delete_project_document", (req, res) => {
  sendHttpRequest("DELETE", `${process.env.SERVERAPIREQUEST}/delete_project_document`, req, res)
});

app.delete("/api/delete_subContractor_document", (req, res) => {
  sendHttpRequest("DELETE", `${process.env.SERVERAPIREQUEST}/delete_subContractor_document`, req, res)
});



// download document api 

app.put("/api/download_document", (req, res) => {
  console.log(req.body);
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/download_document`, req, res)
});
app.put("/api/download_project_document", (req, res) => {
  console.log(req.body);
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/download_project_document`, req, res)
});

app.put("/api/download_employe_document", (req, res) => {
  console.log(req.body);
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/download_employe_document`, req, res)
});

app.put("/api/download_subContractor_document", (req, res) => {
  console.log(req.body);
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/download_subContractor_document`, req, res)
});
// --------------------------------

app.post("/api/subContractor_assign_project", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/subContractor_assign_project`, req, res)
})

app.put("/api/editbankdetail", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/editbankdetail`, req, res)
})

// get all documents ------
app.put("/api/get_all_document", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_all_document`, req, res)
});

//create  Employee documents 

const employee_document = createProxyMiddleware('/api/create_employee_document', {
  target: process.env.SERVERAPIREQUEST, // Set the target URL for create_document
  changeOrigin: true,
  pathRewrite: {
    '/api/create_employee_document': '/create_employee_document', // Modify the path as needed
  },
});
app.use(employee_document);



//create  subcontrcator documents 

const subcontractor_document = createProxyMiddleware('/api/create_subcontractor_document', {
  target: process.env.SERVERAPIREQUEST, // Set the target URL for create_document
  changeOrigin: true,
  pathRewrite: {
    '/api/create_subcontractor_document': '/create_subcontractor_document', // Modify the path as needed
  },
});
app.use(subcontractor_document);



const project_document = createProxyMiddleware('/api/create_project_document', {
  target: process.env.SERVERAPIREQUEST, // Set the target URL for create_document
  changeOrigin: true,
  pathRewrite: {
    '/api/create_project_document': '/create_project_document', // Modify the path as needed
  },
});
app.use(project_document);

// get all project Document .......................
app.put("/api/get_all_project_document", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_all_project_document`, req, res)
});

// get all Subcontractor Document .......................
app.put("/api/get_all_subContractor_document", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_all_subContractor_document`, req, res)
});

app.put("/api/get_all_employee_document", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_all_employee_document`, req, res)
});

app.put("/api/get_employee_details_for_attendence", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_employee_details_for_attendence`, req, res)
});

app.put("/api/update_subcontructor", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/update_subcontructor`, req, res)
});

app.get("/api/calculate-overtime/:employeeId'", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/calculate-overtime:${req.params.employeeId}`, req, res)
});

app.post("/api/check_user", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/check_user: ${req.params.employeeId}`, req, res)
});

app.post("/api/bankDetail", (download_subContractor_documentreq, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/bankDetail`, req, res)
});
app.post("/api/SubConbankDetail", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/SubConbankDetail`, req, res)
});

app.put("/api/getallbankdetailofemployee", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/getallbankdetailofemployeel`, req, res)
})
app.get("/api/logout", (req, res) => {
  sendHttpRequest("GET", `${process.env.SERVERAPIREQUEST}/logout`, req, res)
})
app.get("/api/profile", (req, res) => {
  sendHttpRequest("GET", `${process.env.SERVERAPIREQUEST}/profile`, req, res)
  console.log("data found :", res, req);
})
app.put("/api/editbankdetail", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/editbankdetail`, req, res)
})
// app.put("/api/editbankdetail",(req,res)=> {
//   sendHttpRequest("PUT",`${process.env.SERVERAPIREQUEST}/editbankdetail`,req,res)
// })



app.post("/api/assign_project", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/assign_project`, req, res)
})

app.post("/api/subContractor_assign_project", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/subContractor_assign_project`, req, res)
})

app.put("/api/editbankdetail", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/editbankdetail`, req, res)
})


app.put("/api/send-email", (req, res) => {
  sendHttpRequest("POST", `${process.env.SERVERAPIREQUEST}/send-email`, req, res)
})



app.put("/api/update_emp_attendance", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/update_emp_attendance`, req, res)
});


app.put("/api/get_assigned_employees", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_assigned_employees`, req, res)
})



app.put("/api/get_assigned_projects", (req, res) => {
  sendHttpRequest("PUT", `${process.env.SERVERAPIREQUEST}/get_assigned_projects`, req, res)
})









// Dummy data for demonstration
// const data = [
//   { id: 1, name: 'Item 1' },
//   { id: 2, name: 'Item 2' },
//   { id: 3, name: 'Item 3' },
// ];

// Create a route to fetch data
// app.post('/api/items', (req, res) => {
// app.post('/api/login', (req, res) => { 


//   let options = {
//     method: "POST",
//     url: ` process.env.SERVERAPIREQUEST/login`,
//     json: true,
//   };
//   function callback(error, response, body) {
//     const status = response.statusCode;
//     console.log(error, body);
//     if (error === null) {
//       res.status(status).send(body);
//     } else {
//       res.status(status).send(error);
//     }
//   }
//   request(options, callback);

// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
