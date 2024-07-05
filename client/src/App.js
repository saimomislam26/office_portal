// Importing React Components
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom"
import './'

// Importing bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'
import 'draft-js/dist/Draft.css';

// Importing Packages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// importing Project Components
import Topnavbar from "./Component/shared/Topnavbar";
import Signin from "./Component/Signin";
import AdminCombinedProtected from "./Component/Protected Router/AdminCombinedProtected";
import AuthenticateUser from "./Component/Protected Router/AuthenticateUser";
import Loading from "./Component/Hook/Loading/Loading";
import AdminController from "./Component/KnowledgeShareing/AdminController";
import SubProject from "./Component/Sub Project/SubProject";
import SubProjectDetail from "./Component/Sub Project/SubProjectDetail";
import SingleKnowledge from "./Component/KnowledgeShareing/SingleKnowledge";

import Main from "./Component/Planner/Main";

const Punch = lazy(()=> import("./Component/Attendance/Punch"));
const Profile = lazy(()=> import("./Component/Profile/Profile"));
const AllEmployees = lazy(()=> import("./Component/AllEmployees"));
const Attendancesheet = lazy(()=> import("./Component/Attendance/Attendancesheet"));
const Holidays = lazy(()=> import("./Component/Leave/Holidays"));
const LeaveEmployee = lazy(()=> import("./Component/Leave/LeaveEmployee"));
const LeaveStatusLead = lazy(()=> import("./Component/Leave/LeaveStatusLead"));
const Teamlead = lazy(()=> import("./Component/TeamLead/Teamlead"));
const Project = lazy(()=> import("./Component/Project/Project"));
const ProjectDetail = lazy(()=> import("./Component/Project/ProjectDetail"));
const KnowledgeShareing = lazy(()=> import("./Component/KnowledgeShareing/Main"));



const App = () => {
  return (
    <div className="App">
      <Topnavbar />
      <Suspense fallback ={ <Loading />}>
      <Routes>
        <Route path="/signin" exact element={<Signin/>}/>
        <Route path='/profile/:id'  element={<AuthenticateUser><Profile/></AuthenticateUser>}/>
        <Route path='/allemployee' element={<AuthenticateUser><AllEmployees/></AuthenticateUser>}/>
        <Route path='/' element={<AuthenticateUser><Punch/></AuthenticateUser>}/>
        <Route path='/attendance' element={<AuthenticateUser><Attendancesheet/> </AuthenticateUser>}/>
        <Route path='/holiday' element={<AuthenticateUser> <Holidays/> </AuthenticateUser>}/>
        <Route path='/leaveemployee' element={<AuthenticateUser> <LeaveEmployee/> </AuthenticateUser>}/>
        <Route path='/leaveadmin' element={<AdminCombinedProtected><LeaveStatusLead/></AdminCombinedProtected> }/>
        {/* <Route path='/teamlead' element={  <Teamlead/>}/> */}
        <Route path='/projects' element={<AuthenticateUser><Project /></AuthenticateUser>}/>
        <Route path='/projects/:id/:subId' element={ <AuthenticateUser> <SubProjectDetail /> </AuthenticateUser> }/>
        <Route path='/projects/:id' element={ <AuthenticateUser> <SubProject /> </AuthenticateUser> }/>
        {/* All Employees */}

        {/* knowledge shareing */}
        <Route path='/knowledge_shareing' element={ <AuthenticateUser> <KnowledgeShareing /> </AuthenticateUser> }/>
        <Route path='/knowledge_shareing/controller' element={ <AuthenticateUser> <AdminController /> </AuthenticateUser> }/>
        <Route path='/knowledge_shareing/:id' element={ <AuthenticateUser> <SingleKnowledge /> </AuthenticateUser> }/>
        <Route path="/Planner" element={<Main/>}/>
      </Routes>

      </Suspense>
      <ToastContainer />
    </div>
  );
}


// What is Redux?

export default App;
