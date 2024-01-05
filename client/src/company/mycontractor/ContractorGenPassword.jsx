import React, { useState } from 'react'
import { auth } from "../../firebase"
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";

const ContractorGenPassword = ({SUBCONTRACTOR_ID, SUBCONTRACTOR_USERNAME, ADMIN_ID, ADMIN_USERNAME ,SUBCONTRACTOR_PHONE}) => {



  // const [edit, setEdit] = useState(true)
  const [values] = useState({
    name: `${SUBCONTRACTOR_ID}&&${SUBCONTRACTOR_USERNAME}&&${ADMIN_ID}&&${ADMIN_USERNAME}&&contractors`,
    email: SUBCONTRACTOR_USERNAME,
    pass: SUBCONTRACTOR_PHONE,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [success, successMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [passwordMsg, setpasswordMsg] = useState("");
  const [userExist, setUserExist] = useState(false)


  // const handleSubmission = () => {
  //   if (!values.name || !values.email || !values.pass) {
  //     setErrorMsg("Fill all fields");
  //     return;
  //   }
  //   setErrorMsg("");

  //   setSubmitButtonDisabled(true);
  //   createUserWithEmailAndPassword(auth, values.email, values.pass)
  //     .then(async (res) => {
  //       setSubmitButtonDisabled(false);
  //       const user = res.user;
  //       await updateProfile(user, {
  //         displayName: values.name,
  //       });
  //       successMsg("password generated successfully");
  //       // navigate("/dashboard");
  //     })
  //     .catch((err) => {
  //       setSubmitButtonDisabled(false);
  //       setErrorMsg(err.message);
  //     });
  // };

  // const updatePass = (e, newPassword) => {
  //   e.preventDefault();
  //   const user = auth.currentUser;
  //   if (user) {
  //     updatePassword(user, newPassword)
  //       .then(() => {
  //         // Password updated successfully
  //         // console.log('Password updated successfully');
  //         successMsg('Password updated successfully');
  //       })
  //       .catch((error) => {
  //         // Handle error
  //         // console.error('Error updating password:', error);
  //         setErrorMsg('Error updating password:', error);

  //       });
  //   } else {
  //     console.error('No user is signed in');
  //   }
  // };


  // useEffect(() => {
  //   const checkUserExists = () => {
  //     fetchSignInMethodsForEmail(auth, values.email)
  //       .then((signInMethods) => {
  //         if (signInMethods.length > 0) {
  //           // User exists
  //           console.log('User exists');
  //           setUserExist(true)
  //         } else {
  //           // User does not exist
  //           console.log('User does not exist');
  //           setUserExist(false)
  //         }
  //       })
  //       .catch((error) => {
  //         // Handle error
  //         console.error('Error checking user existence:', error);
  //       });
  //   };
  //   checkUserExists()
  // }, [values.email])




  // console.log(values, "datainside")



  // check if user exists
  const checkUserExists = () => {
    fetchSignInMethodsForEmail(auth, values.email)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          // User exists
          console.log('User exists');
          setUserExist(true)
        } else {
          // User does not exist
          console.log('User does not exist');
          setUserExist(false)
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error checking user existence:', error);
      });
  };




  // create user
  const createUser = () => {

    if (!values.name || !values.email || !values.pass) {
      // setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        setpasswordMsg("Generating credential...");
        console.log("user created successfully")
        // navigate("/dashboard");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        // setErrorMsg(err.message);
      });

  }



  //send reset link
  const Resetlink = () => {
    sendPasswordResetEmail(auth, values.email)
      .then(() => {
        // Password reset email sent!
        // ..
        // successMsg('Password reset email sent successfully')
        setpasswordMsg("Password reset link is send to Employee");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        setErrorMsg(error.message)
      });
  }


  const handleSubmission = () => {


    checkUserExists()
    createUser();
    setErrorMsg("")

    if (!userExist) {
      createUser();
      setTimeout(() => {
      Resetlink();
      }, 2000)

    } else if (userExist) {
      Resetlink();
    } else {
      setpasswordMsg("something went wrong")
    }
  };




  return (
    <>




      {errorMsg && (
        <p className=" text-danger fw-light mb-0 fs-6">{errorMsg}</p>
      )}
      {passwordMsg && (
        <p className=" text-success fw-light mb-0 fs-6">{passwordMsg}</p>
      )}

      <tr>
        <td><b>Password :</b></td>
        <td className="d-flex" style={{ gap: 4 }}>
          <button className="btn btn-sm btn-primary" onClick={handleSubmission} disabled={submitButtonDisabled}>
            Send Password Reset Link
          </button>
        </td>
        
      </tr>


    </>

  )
}
export default ContractorGenPassword