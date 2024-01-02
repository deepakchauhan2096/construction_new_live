import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExpiryReminder from "../../components/ExpiryReminder";
import EmployeeDocCreate from "./EmployeeDocCreate";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import EmployeeNav from "./EmployeeNav";

const EmployeeDocuments = () => {

  const filteredEmployee = useLocation();
  const filterData = filteredEmployee?.state[0];
  const COMPANY_ID = filteredEmployee?.state[1];
  const COMPANY_USERNAME = filteredEmployee?.state[2];
  const COMPANY_PARENT_ID = filteredEmployee?.state[3];
  const COMPANY_PARENT_USERNAME = filteredEmployee?.state[4];


  const [deleteItem, setDeleteItem] = useState("");
  const [open, setOpen] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [empDoc, setEmpDoc] = useState("");
  const [resStatus, setResStatus] = useState(false);

  useEffect(() => {
    getEmployeeDocuments();
  }, [deleteItem]);

  const getEmployeeDocuments = async () => {
    const requestData = {
      DOCUMENT_PARENT_USERNAME: COMPANY_USERNAME,
      DOCUMENT_REF_ID: filterData.EMPLOYEE_ID,
    };

    console.log(requestData, "requestData");
    try {
      const response = await axios.put(
        "/api/get_all_employee_document",
        requestData
      );

      if (!response.data) {
        throw new Error("Response data is empty");
      }

      const data = response.data;
      console.log("requestdata", data);
      setResStatus(true);
      setEmpDoc(data);
    } catch (error) {
      setResStatus("error");

      console.log("Error Fetching Data :", error);
    }
  };

  // downloadfile

  const downloadFile = (base64Data, fileName) => {
    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${base64Data}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // for downoad file funciton
  const handleDownload = async (documentId, fileName) => {
    console.log("hi", documentId);
    try {
      const data = {
        DOCUMENT_ID: documentId,
        DOCUMENT_PARENT_USERNAME: COMPANY_USERNAME,
      };

      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: "/api/download_employe_document",
        data: data,
      };

      const response = await axios.request(config);
      downloadFile(response.data, fileName.name);
    } catch (error) {
      console.log(error);
    }
  };

  // function for Delete the document

  const handleDelDoc = async (e, documentId) => {
    setBackdrop(true);
    const data = {
      DOCUMENT_ID: documentId,
      DOCUMENT_PARENT_USERNAME: COMPANY_USERNAME,
    };

    try {
      const response = await fetch(`/api/delete_employee_document`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setDeleteItem(jsonResponse);
        setBackdrop(false);
        toast.success("Document Deleted successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the document.", {});
    }
  };

  // function to formate Size

  const formatSize = (bytes) => {
    if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return bytes + " Bytes";
    }
  };

  // function togetFileIcon

  const getFileIcon = (fileType) => {
    const fileTypeLowerCase = fileType.toLowerCase();
    if (fileTypeLowerCase.includes("pdf")) {
      return <DescriptionIcon color="error" />;
    } else if (
      fileTypeLowerCase.includes("excel") ||
      fileTypeLowerCase.includes("spreadsheet")
    ) {
      return <InsertChartIcon color="primary" />;
    } else if (
      fileTypeLowerCase.includes("word") ||
      fileTypeLowerCase.includes("document")
    ) {
      return <AssignmentIcon color="primary" />;
    } else if (
      fileTypeLowerCase.includes("jpeg") ||
      fileTypeLowerCase.includes("jpg")
    ) {
      return <InsertPhotoIcon color="primary" />;
    } else if (fileTypeLowerCase.includes("csv")) {
      return <InsertDriveFileIcon color="primary" />;
    } else {
      return <InsertDriveFileIcon color="disabled" />;
    }
  };

  // function to fomate Date ----

  const formatDate = (dateString, withTimezone = false) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return withTimezone ? formattedDate : formattedDate.split(", ")[0];
  };

  // function for add icons in document cell ----

  const renderDocumentNameCell = (cellValues) => {
    const { name, fileType } = cellValues.value;
    const icon = getFileIcon(fileType);

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <span style={{ marginLeft: "8px" }}>{name}</span>
      </div>
    );
  };

  const columns = [
    { field: "sr", headerName: "S No.", width: 60 },
    {
      field: "documentName",
      headerName: "Document Name",
      width: 140,
      renderCell: renderDocumentNameCell,
    },
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "documentSize",
      headerName: "Size",
      description: "Document Size",
      width: 80,
      editable: false,
    },
    {
      field: "uploadDate",
      headerName: "Upload Date",
      type: "number",
      width: 120,
      editable: false,
    },
    {
      field: "documentExpDate",
      headerName: "Expiry Date",
      description: "Document Expiry Date",
      type: "number",
      width: 120,
      editable: false,
    },

    {
      field: "documentIdType",
      headerName: "Document Type",
      description: "Document Type",
      type: "text",
      width: 150,
      editable: false,
    },
    {
      field: "ExpiryDate",
      headerName: "Expiry Status",
      description: "Document Expiry",
      sortable: false,
      width: 140,
      editable: false,
      renderCell: (cellValues) => {
        return <ExpiryReminder data={cellValues?.value} />;
      },
      size: "small",
    },
    {
      field: "download",
      headerName: "Download",
      width: 120,
      renderCell: (cellValues) => {
        console.log("heelo world", cellValues.row.documentName, cellValues.id);
        return (
          <Button
            variant="contained"
            className="view-btn primary btn btn-success"
            style={{ padding: "2px 8px" }}
            onClick={(e) => {
              handleDownload(cellValues.id, cellValues.row.documentName);
            }}
          >
            Download
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            className="view-btn "
            color="error"
            style={{ padding: "2px 2px" }}
            onClick={(e) => {
              handleDelDoc(e, cellValues.id);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const rows = useMemo(() => {
    return (
      empDoc?.result?.map((item, index) => ({
        id: item.DOCUMENT_ID,
        sr: index + 1,
        documentName: {
          name: item.DOCUMENT_FILEDATA?.originalname || "",
          fileType: item.DOCUMENT_FILEDATA?.mimetype || "",
        },
        documentSize: formatSize(item.DOCUMENT_FILEDATA?.size) || "",
        uploadDate: formatDate(item.createdAt),
        documentType: item.DOCUMENT_FILEDATA?.mimetype || "",
        ExpiryDate: formatDate(item.DOCUMENT_EXPIRY_DATE, true) || "",
        documentExpDate: formatDate(item.DOCUMENT_EXPIRY_DATE),
        documentIdType: item.DOCUMENT_TYPE || "",
      })) || []
    );
  }, [empDoc]);

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
        <>
          <EmployeeDocCreate
            EMPLOYEE_ID={filterData?.EMPLOYEE_ID}
            EMPLOYEE_USERNAME={filterData?.EMPLOYEE_USERNAME}
            COMPANY_USERNAME={COMPANY_USERNAME}
            update={getEmployeeDocuments}
          />
          {resStatus === true ? (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 14,
                  },
                },
              }}
              density="compact"
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              sx={{ height: "80vh" }}
              getRowId={(row) => row.id}
              localeText={{
                noRowsLabel: rows.length === 0 && "No Document Available",
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
                    onClick={getEmployeeDocuments}
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
        </>
      </div>
    </Box>
  );
};

export default EmployeeDocuments;
