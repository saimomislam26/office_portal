import React, { useEffect, useState } from "react";
import Loading from "../Hook/Loading/Loading.js";
import { useParams } from "react-router-dom";
import userInfo from "../Hook/useUseInfo.js";

import dayjs from "dayjs";
import imageSrc from "../../images/saimom.jpg";
import { Avatar, Button, DialogContent, FormControl, IconButton, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { red } from "@mui/material/colors";
import moment from "moment"
import Cookies from 'js-cookie';
import { makeStyles } from "@material-ui/core"
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import UploadIcon from '@mui/icons-material/Upload';
import Input from '@mui/material/Input';
import { fileUpload, getCvApi } from "../../api/userApi.js";
import { profileImg } from "../functions/commonFunc.js";
import { getAllRoles } from "../../api/roleApi.js";
import { createLeaveBoardApi, getUserLeaveBoardApi } from "../../api/leaveRequestApi.js";



// Modal Styling
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),

    },
}));


function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}


const useStyles = makeStyles(theme => ({
    mainPofileStyle: {
        color: "red",
    }
}))

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};

const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 320px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

const Profile = () => {
    const jwt = Cookies.get('_token')
    const styles = useStyles();
    const { id } = useParams();
    const [file, setFile] = useState();
    const [imageFile, setImageFile] = useState();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [cardEdit, setCardEdit] = useState({
        main: false,
        intro: false,
        personalInfo: false,
        skills: false,
        goalSetting: false,
        eduInfo: false,
        experience: false,
        leaveSetting: false,
    });
    const [openModal, setOpenModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [roles, setRoles] = useState([]);
    // For Modal open
    const handleModalOpen = () => {
        setOpenModal(true);
    };

    // For Modal Close
    const handleModalClose = () => {
        setOpenModal(false);
    };
    const userInfoData = userInfo();

    // const [userMain, setUserMain] = useState({})
    const [intro, setIntro] = useState({
        personalPhone: "",
        nationality: "",
        religion: "",
        maritalStatus: "",
        bloodGroup: "",
    });
    const [skillFiled, setSkillField] = useState({
        title: "",
        tools: "",
    });

    const [goalSettingField, setGoalSettingField] = useState({
        goalName: "",
        goalType: "",
    });
    const [educationField, setEducationField] = useState({
        institution: "",
        location: "",
        endYear: "",
        startYear: "",
        degree: "",
    });

    const [experienceField, setExperienceField] = useState({
        company: "",
        location: "",
        title: "",
        startYear: "",
        endYear: "",
    });

    const [leaveSettings, setleaveSettings] = useState({

    });

    const [skills, setSkills] = useState([]);
    const [goals, setGoals] = useState([]);
    const [educations, setEducations] = useState([]);
    const [experinces, setExperiences] = useState([]);
    const [designation, setDesignation] = useState([])
    const [mainInfo, setMainInfo] = useState({
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        designation: userData?.designation?._id,
        empId: userData?.empId,
        birthDate: userData?.birthDate,
        joiningDate: userData?.joiningDate,
        role: userData?.role?._id
    })

    const [updateLeaveSettings, setUpdateLeaveSettings] = useState({

    })



    let name;
    let value;

    const handleFields = (e, cardName) => {
        name = e.target.name;
        value = e.target.value;
        if (cardName === "intro") {
            setIntro({ ...intro, [name]: value });
        }
        if (cardName === "expert") {
            setSkillField({ ...skillFiled, [name]: value });
        }
        if (cardName === "goal") {
            setGoalSettingField({ ...goalSettingField, [name]: value });
        }
        if (cardName === "eduInfo") {
            setEducationField({ ...educationField, [name]: value });
        }
        if (cardName === "experiences") {
            setExperienceField({ ...experienceField, [name]: value });
        }
        if (cardName === "main") {
            setMainInfo({ ...mainInfo, [name]: value })
        }
    };
    // console.log("main", mainInfo);

    const addskills = () => {
        setSkills([...skills, skillFiled]);
        setSkillField({
            title: "",
            tools: "",
        });
    };
    const addGoals = () => {
        setGoals([...goals, goalSettingField]);
        setGoalSettingField({
            goalName: "",
            goalType: "",
        });
    };

    const addEducations = () => {
        setEducations([...educations, educationField]);
        setEducationField({
            institution: "",
            degree: "",
            startYear: "",
            endYear: "",
            location: ""
        });
    };
    const addExperineces = () => {
        setExperiences([...experinces, experienceField]);
        setExperienceField({
            title: "",
            company: "",
            startYear: "",
            endYear: "",
            location: "",
            contribution: ""
        });
    };
    const getSingleUser = async () => {
        setLoading(true);
        const res = await fetch(
            `${process.env.REACT_APP_URL}/users/getsingleuser/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                },
            }
        );
        const data = await res.json();
        const tempInfo = data[0];
        if (res.status === 200) {
            setUserData(data[0]);
            setIntro({
                personalPhone: tempInfo?.personalPhone,
                nationality: tempInfo?.nationality,
                religion: tempInfo?.religion,
                maritalStatus: tempInfo?.maritalStatus,
                bloodGroup: tempInfo?.bloodGroup,
            });
            setMainInfo({
                firstName: tempInfo?.firstName,
                lastName: tempInfo?.lastName,
                email: tempInfo?.email,
                designation: tempInfo?.designation?._id,
                empId: tempInfo?.empId,
                joiningDate: tempInfo?.joiningDate,
                birthDate: tempInfo?.birthDate || "",
                role: tempInfo?.role?._id
            })
            setSkills(tempInfo?.skills);
            setGoals(tempInfo?.goals);
            setEducations(tempInfo?.educations);
            setExperiences(tempInfo?.experinces);

            setLoading(false);
        } else {
            setLoading(false);
            toast.warning(data, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    const getImagePath = (imagePath) => {
        const pathArray = imagePath.split("/");
        const lastTwo = `${pathArray[pathArray.length - 2]}/${pathArray[pathArray.length - 1]}`
        console.log("last two", lastTwo);
        return lastTwo;
    }
    const updateUser = async (card) => {
        console.log("Card Name", card);

        var sentData;
        if (card === "intro") {
            sentData = intro;
        }
        if (card === "skills") {
            sentData = {
                skills,
            };
        }
        if (card === "goal") {
            sentData = { goals };
        }
        if (card === "eduInfo") {
            sentData = { educations };
        }
        if (card === "experiences") {
            sentData = { experinces };
        }

        if (card === "main") {
            sentData = { ...mainInfo }
        }
        // console.log("data", sentData);
        // return;
        const res = await fetch(
            `${process.env.REACT_APP_URL}/users/updateUser/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                },
                body: JSON.stringify(sentData),
            }
        );
        const data = await res.json();
        // console.log("user Data", data);
        if (res.status === 200) {
            // setUserData(data);
            // setMainInfo({
            //     firstName: data?.firstName,
            //     lastName: data?.lastName,
            //     email: data?.email,
            //     designation: data?.designation,
            //     empId: data?.empId,
            //     birthDate: data?.birthDate || "",
            //     joiningDate: data?.joiningDate
            // })
            // setSkills(data?.skills);
            // setGoals(data?.goals);
            // setEducations(data?.educations);
            // setExperiences(data?.experinces);
            await getSingleUser()

            toast.success("Profile updated successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            });
        } else {
            toast.warning("Something went wrong", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    const getAllDesignations = async () => {
        const res = await fetch(`${process.env.REACT_APP_URL}/designations/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer " + jwt
            },
        })
        const data = await res.json()
        if (res.status === 200) {
            setDesignation(data.roles)
        } else {
            toast.warning(data, { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })
        }

    }

    const getCv = async () => {
        try {
            const data = await getCvApi({ userId: id }, jwt);
            if (data.status !== 200) {
                toast.warning("Cv not found", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

            } else if (data.status === 200) {
                const response = await data.json();

                var a = document.createElement("a"); //Create <a>
                a.href = "data:application/pdf;base64," + response.data; //Image Base64 Goes here
                a.download = `${userInfoData?.firstName}_cv.pdf`;
                // console.log(a);//File name Here
                a.click(); //Downloaded file
                // getCv()
            } else {
                toast.warning("Something went wrong", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

            }
        } catch (err) {
            toast.warning("Cv not found", { position: toast.POSITION.TOP_CENTER, autoClose: 2000, pauseOnHover: false })

        }
    }

    const getUsersLeave = async () => {
        const response = await getUserLeaveBoardApi(id, jwt)
        if (response.status === 200) {
            const data = await response.json();
            setleaveSettings({ ...data.data })

        }
    }

    const updateLeaveBoard = async () => {
        const data = {}
        const response = await createLeaveBoardApi(data, jwt);
        if (response.status === 200) { }
    }

    const updateLeaveBoardSetting = async () => {
        try {
            if (!Object.entries(updateLeaveSettings).length) return;
            for (let s in updateLeaveSettings) {
                let response = await createLeaveBoardApi({
                    userId: id,
                    leaveCategory: s,
                    leaveAmount: parseInt(updateLeaveSettings[s])
                }, jwt)
            }

            await getUserLeaveBoardApi(id, jwt);
            setCardEdit({ ...cardEdit, leaveSetting: false })

        } catch (e) {

        } finally {
            setUpdateLeaveSettings({})
        }
    }


    useEffect(() => {
        getSingleUser();
        getUsersLeave();
    }, [id]);

    useEffect(() => {
        getAllDesignations();
        getAllRoles().then(d => {
            setRoles(d.data.roles);
        })
    }, [])

    return loading ? (
        <Loading />
    ) : (
        <>
            <div class="page-wrapper">
                <div class="content container-fluid">
                    <div class="page-header">
                        <div class="row">
                            <div class="col-sm-8">
                                <h3 class="page-title">Profile</h3>
                            </div>
                            {(userInfoData?.role?.alias === "Admin" || userInfoData?._id === id) && (
                                <div class="col-sm-4">
                                    {/* <Button variant="contained" sx={{ borderRadius: "50px" }} ocn >Change password</Button> */}
                                    {/* <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Employee</Typography> */}
                                    {<Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: "50px" }} onClick={handleModalOpen} >
                                        Add CV
                                    </Button>}
                                </div>

                            )}
                        </div>
                    </div>
                    {/* Intro */}
                    <div class="card mb-0">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">

                                    <div class="profile-view">
                                        <div class="profile-img-wrap">
                                            <div class="profile-img">
                                                {/* <a href="#"> */}
                                                {/* {geeeetImg()} */}
                                                <Avatar imgProps={{ crossOrigin: "false" }} alt='Employee' src={profileImg(userData?.imagePath)} sx={{ width: 120, height: 120 }} />

                                                {(userInfoData?._id === id) ? (
                                                <div class="middle">
                                                    <label for="file-input" style={{ color: "#2776d3" }}>
                                                        <UploadIcon sx={{ color: "#2776D3" }} />
                                                        Upload
                                                    </label>
                                                    <input id="file-input" accept="image/*" type="file" style={{ display: "none" }}

                                                        onChange={(e) => {

                                                            let formData = new FormData();
                                                            formData.append("type", "img")
                                                            formData.append("userId", id)
                                                            formData.append("file", e.target.files[0])
                                                            fileUpload(formData, jwt).then(d => {
                                                                // setOpenModal(false)
                                                                if (d.status === 200) {
                                                                    toast.success("img uploaded successfully", {
                                                                        position: toast.POSITION.TOP_CENTER,
                                                                        autoClose: 2000,
                                                                        pauseOnHover: false,
                                                                    })
                                                                    getSingleUser()
                                                                }
                                                                else {

                                                                    toast.warning("Something went wrong", {
                                                                        position: toast.POSITION.TOP_CENTER,
                                                                        autoClose: 2000,
                                                                        pauseOnHover: false,
                                                                    });
                                                            }
                                                            }).catch(err => {
                                                                console.log(err.response.data.message);
                                                                toast.warning(err?.response?.data?.message || "Something went wrong", {
                                                                    position: toast.POSITION.TOP_CENTER,
                                                                    autoClose: 2000,
                                                                    pauseOnHover: false,
                                                                });
                                                            })
                                                        }}
                                                    />
                                                </div>

                                                ) : null}
                                                {/* </a> */}
                                            </div>
                                        </div>
                                        <div class="profile-basic">
                                            <div class="row">
                                                <div class="col-md-5" >
                                                    <div class="profile-info-left">
                                                        <h3 class="user-name m-t-0 mb-0">
                                                            {!cardEdit.main ? (
                                                                `${mainInfo?.firstName} ${mainInfo?.lastName}`

                                                            ) : (
                                                                <>
                                                                    <TextField
                                                                        label="Frist Name"
                                                                        size="small"
                                                                        sx={{ width: .7 }}
                                                                        type="text"
                                                                        name="firstName"
                                                                        placeholder="firstame"
                                                                        value={mainInfo.firstName}
                                                                        onChange={(e) => {
                                                                            // console.log(e.target.value);
                                                                            handleFields(e, "main");
                                                                        }}
                                                                    />

                                                                    <br />

                                                                    <TextField
                                                                        label="Last Name"
                                                                        size="small"
                                                                        sx={{ width: .7 }}

                                                                        style={{ marginTop: "10px" }}
                                                                        type="text"
                                                                        name="lastName"
                                                                        placeholder="last name"
                                                                        value={mainInfo.lastName}
                                                                        onChange={(e) => {
                                                                            handleFields(e, "main");
                                                                        }}

                                                                    />

                                                                </>
                                                            )}

                                                            {/* {userData?.firstName} {userData?.lastName} */}
                                                        </h3>
                                                        {!cardEdit.main ? (<small>{userData?.designation?.name} {`(${roles.length && roles?.find(r => userData.role._id === r._id).alias})`}</small>)
                                                            : (
                                                                <>
                                                                    <br />
                                                                    <Select name="designation"
                                                                        label="Select designation"
                                                                        size="small"
                                                                        sx={{ width: .7 }}
                                                                        value={mainInfo?.designation}
                                                                        onChange={(e) => {
                                                                            setMainInfo({ ...mainInfo, designation: e.target.value })

                                                                        }}
                                                                    >

                                                                        {designation.map((val, ind) => {
                                                                            return (
                                                                                <MenuItem key={val._id} value={val?._id}>{val?.name}</MenuItem>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    <br />
                                                                    <br />

                                                                    <Select name="role"
                                                                        label="Select Role"
                                                                        size="small"
                                                                        sx={{ width: .7 }}
                                                                        value={mainInfo?.role}
                                                                        onChange={(e) => {
                                                                            setMainInfo({ ...mainInfo, role: e.target.value })

                                                                        }}
                                                                    >

                                                                        {roles?.map((val, ind) => {
                                                                            return (
                                                                                <MenuItem key={val._id} value={val?._id}>{val?.alias}</MenuItem>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                </>
                                                            )
                                                        }

                                                        <div class="staff-id">
                                                            {!cardEdit.main ? `Employee ID : ${userData?.empId}` : <>
                                                                <TextField
                                                                    size="small"
                                                                    sx={{ maxWidth: .7 }}
                                                                    label="Employee Id"
                                                                    style={{ marginTop: "10px", width: "70%" }}

                                                                    type="text"
                                                                    name="empId"
                                                                    value={mainInfo?.empId}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "main");
                                                                    }}
                                                                />

                                                            </>}
                                                        </div>
                                                        <div class="small doj ">

                                                            {!cardEdit.main ? `Date of Join : ${moment(mainInfo?.joiningDate).format("YYYY-MM-DD")} ` : <>

                                                                <TextField
                                                                    style={{ marginTop: "10px" }}
                                                                    sx={{ width: .7 }}
                                                                    size="small"
                                                                    type="date"
                                                                    name="joiningDate"
                                                                    label="Joining Date"
                                                                    value={moment(mainInfo?.joiningDate).format("YYYY-MM-DD")}
                                                                    onChange={(e) => {
                                                                        // console.log(e.target.value);
                                                                        handleFields(e, "main");
                                                                    }}
                                                                />
                                                            </>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-7" >
                                                    <ul class="personal-info" >

                                                        <li>

                                                            {!cardEdit.main ? <div>
                                                                {/* <div class="title">Email:</div> */}
                                                                Email : {" "}
                                                                <span class="__cf_email__">
                                                                    {userData?.email ? userData?.email : "N/A"}
                                                                </span>
                                                            </div> : <>
                                                                <TextField
                                                                    type="email"
                                                                    label="Email"
                                                                    name="email"
                                                                    size="small"
                                                                    sx={{ width: .5 }}
                                                                    value={mainInfo?.email}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "main");
                                                                    }}
                                                                />
                                                            </>}

                                                        </li>
                                                        {(userInfoData?.role?.alias === "Admin" || userInfoData?._id === id) &&
                                                            (

                                                                <li>
                                                                    {!cardEdit.main ? <div>
                                                                        {/* <div class="title">Birthday:</div> */}
                                                                        Birthday : {" "}
                                                                        <span class="__cf_email__">
                                                                            {mainInfo?.birthDate ? moment(mainInfo?.birthDate).format("YYYY-MM-DD") : "N/A"}
                                                                        </span>
                                                                    </div> : <>
                                                                        <TextField
                                                                            sx={{ width: .5 }}

                                                                            type="date"
                                                                            name="birthDate"
                                                                            size="small"
                                                                            value={moment(mainInfo?.birthDate).format("YYYY-MM-DD")}
                                                                            onChange={(e) => {
                                                                                handleFields(e, "main");
                                                                            }}
                                                                        />
                                                                    </>}

                                                                </li>
                                                            )}

                                                        {
                                                            (userInfoData?.role?.alias === "Admin" || userInfoData?._id === id) &&
                                                            (

                                                                <li>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {

                                                                            getCv()
                                                                        }} >View CV</Button>
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="pro-edit">
                                            {/* <a data-bs-target="#profile_info" data-bs-toggle="modal"
                                            class="edit-icon" href="#"></a> */}
                                            {
                                                userInfoData?.role?.alias === "Admin" ? (
                                                    !cardEdit.main ? (
                                                        <Tooltip title="Edit">
                                                            <EditIcon
                                                                className="edit-icon"
                                                                onClick={() => {
                                                                    setCardEdit({ ...cardEdit, main: true });
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <>
                                                            <Tooltip title="Save" sx={{ marginLeft: "10px" }}>
                                                                <SendIcon
                                                                    sx={{
                                                                        display: (mainInfo.birthDate &&
                                                                            mainInfo.designation &&
                                                                            mainInfo.email &&
                                                                            mainInfo.empId &&
                                                                            mainInfo.firstName &&
                                                                            mainInfo.lastName &&
                                                                            mainInfo.joiningDate
                                                                        ) ? "block" : "block"
                                                                    }}

                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        updateUser("main");
                                                                        // console.log("main info", mainInfo);
                                                                        setCardEdit({ ...cardEdit, main: false });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Cancel">
                                                                <CancelIcon
                                                                    className="edit-icon"
                                                                    onClick={() =>
                                                                        setCardEdit({ ...cardEdit, main: false })
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </>
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content">
                        <div
                            id="emp_profile"
                            class="pro-overview tab-pane fade show active"
                        >
                            {/* Personal Information  and Emergency Contact*/}
                            <div class="row">
                                <div class="col-md-12 d-flex">
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                Personal Informations
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    !cardEdit.intro ? (
                                                        <Tooltip title="Edit">
                                                            <EditIcon
                                                                className="edit-icon"
                                                                onClick={() => {
                                                                    setCardEdit({ ...cardEdit, intro: true });
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <>
                                                            <Tooltip title="Save" sx={{ marginLeft: "10px" }}>
                                                                <SendIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        updateUser("intro");
                                                                        setCardEdit({ ...cardEdit, intro: false });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Cancel">
                                                                <CancelIcon
                                                                    className="edit-icon"
                                                                    onClick={() =>
                                                                        setCardEdit({ ...cardEdit, intro: false })
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </>
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <ul class="personal-info">
                                                {(userInfoData?.role?.alias === "Admin" || userInfoData?._id === id) && (

                                                    <li>
                                                        <div class="title">Phone</div>
                                                        {!cardEdit.intro ? (
                                                            <div>{userData?.personalPhone}</div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                name="personalPhone"
                                                                value={intro.personalPhone}
                                                                onChange={(e) => {
                                                                    handleFields(e, "intro");
                                                                }}
                                                            />
                                                        )}
                                                    </li>
                                                )}
                                                <li>
                                                    <div class="title">Nationality</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.nationality}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="nationality"
                                                            value={intro.nationality}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                                <li>
                                                    <div class="title">Religion</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.religion}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="religion"
                                                            value={intro.religion}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                                {
                                                    (userInfoData?.role?.alias === "Admin" || userInfoData?._id.toString() === id)
                                                    && (

                                                        <li>
                                                            <div class="title">Marital status</div>
                                                            {!cardEdit.intro ? (
                                                                <div>{userData?.maritalStatus}</div>
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    name="maritalStatus"
                                                                    value={intro.maritalStatus}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "intro");
                                                                    }}
                                                                />
                                                            )}
                                                        </li>
                                                    )
                                                }
                                                <li>
                                                    <div class="title">Blood Group</div>
                                                    {!cardEdit.intro ? (
                                                        <div>{userData?.bloodGroup}</div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="bloodGroup"
                                                            value={intro.bloodGroup}
                                                            onChange={(e) => {
                                                                handleFields(e, "intro");
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* skills And Goal Setting */}
                            <div class="row">
                                <div class={`col-md-${(userInfoData?.role?.alias === "Admin" || userInfoData?._id === id) ? "6" : "12"} d-flex`}>
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                skills

                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.skills ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon
                                                                        className="edit-icon"
                                                                        onClick={() => {
                                                                            updateUser("skills");
                                                                            setCardEdit({ ...cardEdit, skills: false })

                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title="cancel">
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                skills: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.skills && (
                                                            <Tooltip title="Edit" sx={{ marginLeft: "10px" }}>
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({ ...cardEdit, skills: true });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <div class="experience-box">
                                                <ul class="experience-list">
                                                    {skills?.map((val, ind) => {
                                                        return (
                                                            <>
                                                                <li key={ind}>
                                                                    <div class="experience-user">
                                                                        <div class="before-circle"></div>
                                                                    </div>
                                                                    <div class="experience-content">
                                                                        {cardEdit.skills && (
                                                                            <Tooltip title='delete'>
                                                                                <DeleteIcon
                                                                                    id={ind}
                                                                                    className="edit-icon"
                                                                                    onClick={() =>
                                                                                        setSkills(
                                                                                            skills.filter(
                                                                                                (val, indx) => indx !== ind
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Tooltip>
                                                                        )}

                                                                        <div class="timeline-content">
                                                                            <a href="#/" class="name">
                                                                                {val?.title}
                                                                            </a>
                                                                            <div>{val?.tools}</div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        );
                                                    })}
                                                </ul>

                                                {cardEdit.skills && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            placeholder="Add skills Field Name"
                                                            name="title"
                                                            value={skillFiled.title}
                                                            onChange={(e) => {
                                                                handleFields(e, "expert");
                                                            }}
                                                        />
                                                        <br />
                                                        <input
                                                            type="text"
                                                            placeholder="Add Stack Name"
                                                            name="tools"
                                                            style={{
                                                                marginTop: "10px",
                                                                marginBottom: "10px",
                                                            }}
                                                            value={skillFiled.tools}
                                                            onChange={(e) => {
                                                                handleFields(e, "expert");
                                                            }}
                                                        />
                                                        <br />
                                                        <Button
                                                            disabled={(skillFiled.title && skillFiled.tools) ? false : true}
                                                            variant="contained"
                                                            onClick={() => {
                                                                addskills();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {(userInfoData?.role?.alias === "Admin" || userInfoData?._id === id) &&
                                    (
                                        <div class="col-md-6 d-flex">
                                            <div class="card profile-box flex-fill">
                                                <div class="card-body">
                                                    <h3 class="card-title">
                                                        Goal Setting
                                                        {userInfoData?._id.toString() === id ||
                                                            userInfoData?.role.alias === "Admin" ? (
                                                            <>
                                                                {cardEdit.goalSetting ? (
                                                                    <>
                                                                        <Tooltip sx={{ marginLeft: "10px" }}>
                                                                            <SendIcon
                                                                                className="edit-icon"
                                                                                onClick={() => {
                                                                                    updateUser("goal");
                                                                                    setCardEdit({ ...cardEdit, goalSetting: false })
                                                                                }}

                                                                            />
                                                                        </Tooltip>
                                                                        <Tooltip title="Cancel">
                                                                            <CancelIcon
                                                                                className="edit-icon"
                                                                                onClick={() =>
                                                                                    setCardEdit({
                                                                                        ...cardEdit,
                                                                                        goalSetting: false,
                                                                                    })
                                                                                }
                                                                            />
                                                                        </Tooltip>
                                                                    </>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                {!cardEdit.goalSetting && (
                                                                    <Tooltip title="Edit" sx={{ marginLeft: "10px" }}>
                                                                        <EditIcon
                                                                            className="edit-icon"
                                                                            onClick={() => {
                                                                                setCardEdit({
                                                                                    ...cardEdit,
                                                                                    goalSetting: true,
                                                                                });
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </h3>
                                                    <div class="experience-box">
                                                        <ul class="experience-list">
                                                            {goals?.map((val, ind) => {
                                                                return (
                                                                    <>
                                                                        <li key={ind}>
                                                                            <div class="experience-user">
                                                                                <div class="before-circle"></div>
                                                                            </div>
                                                                            <div class="experience-content">
                                                                                {cardEdit.goalSetting && (
                                                                                    <Tooltip title='delete'>
                                                                                        <DeleteIcon
                                                                                            className="edit-icon"
                                                                                            onClick={() =>
                                                                                                setGoals(
                                                                                                    goals.filter(
                                                                                                        (val, indx) => indx !== ind
                                                                                                    )
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </Tooltip>
                                                                                )}
                                                                                <div class="timeline-content">
                                                                                    <a href="#/" class="name">
                                                                                        {val.goalType}
                                                                                    </a>
                                                                                    <div>{val.goalName}</div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    </>
                                                                );
                                                            })}
                                                        </ul>

                                                        {cardEdit.goalSetting && (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Goal Type"
                                                                    name="goalType"
                                                                    value={goalSettingField.goalType}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "goal");
                                                                    }}
                                                                />
                                                                <br />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Goal Names"
                                                                    name="goalName"
                                                                    style={{
                                                                        marginTop: "10px",
                                                                        marginBottom: "10px",
                                                                    }}
                                                                    value={goalSettingField.goalName}
                                                                    onChange={(e) => {
                                                                        handleFields(e, "goal");
                                                                    }}
                                                                />
                                                                <br />
                                                                <Button
                                                                    disabled={(goalSettingField.goalName && goalSettingField.goalType) ? false : true}
                                                                    variant="contained"
                                                                    onClick={() => {
                                                                        addGoals();
                                                                    }}
                                                                >
                                                                    Add
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                            </div>
                            {/* Education And Experience */}
                            <div class="row">
                                <div class="col-md-6 d-flex">
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                Education Informations{" "}
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.eduInfo ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon className="edit-icon"
                                                                        onClick={() => { updateUser("eduInfo"); setCardEdit({ ...cardEdit, eduInfo: false }) }
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title='cancel'>
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                eduInfo: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.eduInfo && (
                                                            <Tooltip title="Edit" sx={{ marginLeft: "10px" }}>
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({ ...cardEdit, eduInfo: true });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <div class="experience-box">
                                                <ul class="experience-list">
                                                    {educations?.map((val, ind) => {
                                                        return (
                                                            <>
                                                                <li key={ind}>
                                                                    <div class="experience-user">
                                                                        <div class="before-circle"></div>
                                                                    </div>
                                                                    <div class="experience-content">
                                                                        {cardEdit.eduInfo && (
                                                                            <Tooltip title='delete'>
                                                                                <DeleteIcon className="edit-icon"
                                                                                    onClick={() =>
                                                                                        setEducations(
                                                                                            educations.filter(
                                                                                                (val, indx) => indx !== ind
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Tooltip>
                                                                        )}
                                                                        <div class="timeline-content">
                                                                            <a href="#/" class="name">
                                                                                {val.institution}
                                                                            </a>
                                                                            <div>{val.degree}</div>
                                                                            <span class="time">
                                                                                {val?.startYear && new Date(val.startYear).toLocaleDateString()}  {val?.endYear && `- ${new Date(val.endYear).toLocaleDateString()}`}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        );
                                                    })}
                                                </ul>

                                                {cardEdit.eduInfo && (
                                                    <>
                                                        {/* <input type="text" placeholder='Institution' name="institution" value={educationField.institution} onChange={(e) => {
                                                            handleFields(e, 'eduInfo')
                                                        }} /> */}
                                                        <TextField
                                                            id="outlined-search"
                                                            label="Degree / Certifiacation*"
                                                            name="degree"
                                                            value={educationField.degree}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "eduInfo");
                                                            }}
                                                        />
                                                        <br />
                                                        <TextField

                                                            id="outlined-search"
                                                            label="Institution*"
                                                            name="institution"
                                                            value={educationField.institution}
                                                            type="text"
                                                            sx={{
                                                                // minWidth: "50%",
                                                                // maxHeight: 345,
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "eduInfo");
                                                            }}
                                                        />
                                                        <br />
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                        maxHeight: 345,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}

                                                                    label="Start Year"
                                                                    value={dayjs(educationField.startYear)}
                                                                    onChange={(e) =>
                                                                        setEducationField({
                                                                            ...educationField,
                                                                            startYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        {/* <br /> */}
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}
                                                                    // slotProps={{ textField: { size: 'small' } }}
                                                                    label="End Year "
                                                                    value={dayjs(educationField.endYear)}
                                                                    onChange={(e) =>
                                                                        setEducationField({
                                                                            ...educationField,
                                                                            endYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        {/* <br /> */}

                                                        <TextField
                                                            id="outlined-search"
                                                            label="Location"
                                                            name="location"
                                                            value={educationField.location}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                maxHeight: 345,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "eduInfo");
                                                            }}
                                                        />
                                                        <br />
                                                        <br />

                                                        <Button
                                                            disabled={(educationField.institution &&
                                                                educationField.degree
                                                            ) ? false : true}
                                                            sx={{
                                                                // width: .5
                                                            }}
                                                            variant="contained"
                                                            onClick={() => {
                                                                addEducations();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 d-flex">
                                    <div class="card profile-box flex-fill">
                                        <div class="card-body">
                                            <h3 class="card-title">
                                                Experiences{" "}
                                                {userInfoData?._id.toString() === id ||
                                                    userInfoData?.role.alias === "Admin" ? (
                                                    <>
                                                        {cardEdit.experience ? (
                                                            <>
                                                                <Tooltip sx={{ marginLeft: "10px" }}>
                                                                    <SendIcon className="edit-icon"
                                                                        onClick={() => { updateUser("experiences"); setCardEdit({ ...cardEdit, experience: false }) }}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title='cancel'>
                                                                    <CancelIcon
                                                                        className="edit-icon"
                                                                        onClick={() =>
                                                                            setCardEdit({
                                                                                ...cardEdit,
                                                                                experience: false,
                                                                            })
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {!cardEdit.experience && (
                                                            <Tooltip
                                                                title="Edit"
                                                                sx={{ marginLeft: "-10px" }}
                                                            >
                                                                <EditIcon
                                                                    className="edit-icon"
                                                                    onClick={() => {
                                                                        setCardEdit({
                                                                            ...cardEdit,
                                                                            experience: true,
                                                                        });
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </h3>
                                            <div class="experience-box">
                                                <ul class="experience-list">
                                                    {experinces?.map((val, ind) => {
                                                        return (
                                                            <>
                                                                <li key={ind}>
                                                                    <div class="experience-user">
                                                                        <div class="before-circle"></div>
                                                                    </div>
                                                                    <div class="experience-content">
                                                                        {cardEdit.experience && (
                                                                            <Tooltip title="delete">
                                                                                <DeleteIcon className="edit-icon"
                                                                                    onClick={() =>
                                                                                        setExperiences(
                                                                                            experinces.filter(
                                                                                                (val, indx) => indx !== ind
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Tooltip>
                                                                        )}
                                                                        <div class="timeline-content">
                                                                            <a href="#/" class="name">
                                                                                {val?.title} {val?.contribution ? "on" : "at"} {val?.company}.
                                                                            </a>
                                                                            <br />
                                                                            {val?.contribution && (

                                                                                <span>
                                                                                    {val.contribution}
                                                                                </span>
                                                                            )}
                                                                            <span class="time">
                                                                                {val?.startYear && new Date(val.startYear).toLocaleDateString()} -{" "}
                                                                                {val.endYear ? new Date(val.endYear).toLocaleDateString() : "Ongoing"}
                                                                            </span>
                                                                            {/* <br /> */}
                                                                            <span>{val?.location}</span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        );
                                                    })}
                                                </ul>

                                                {cardEdit.experience && (
                                                    <>
                                                        {/* <input type="text" placeholder='Institution' name="institution" value={educationField.institution} onChange={(e) => {
                                                            handleFields(e, 'eduInfo')
                                                        }} /> */}

                                                        <TextField
                                                            id="outlined-search"
                                                            label="Company / Project*"
                                                            name="company"
                                                            value={experienceField.company}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                // console.log(e.target.value);
                                                                handleFields(e, "experiences");
                                                            }}
                                                        />
                                                        <br />
                                                        <TextField
                                                            id="outlined-search"
                                                            label="Designation*"
                                                            name="title"
                                                            value={experienceField.title}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "experiences");
                                                            }}
                                                        />
                                                        <br />
                                                        <StyledTextarea
                                                            id="outlined-search"
                                                            label="Major Role or Cntribution "
                                                            name="contribution"
                                                            type="textarea"
                                                            aria-label="minimum height"
                                                            minRows={2}
                                                            placeholder="Major Role / Contribution <If it's a project>"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "experiences");
                                                            }}
                                                        />
                                                        <br />
                                                        <TextField
                                                            id="outlined-search"
                                                            label="Work Location*"
                                                            name="location"
                                                            value={experienceField.location}
                                                            type="text"
                                                            sx={{
                                                                width: .9,
                                                                margin: "10px 20px 0px 0px",
                                                            }}
                                                            onChange={(e) => {
                                                                handleFields(e, "experiences");
                                                            }}
                                                        />
                                                        <br />
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}
                                                                    label="Start Date"
                                                                    value={dayjs(experienceField.startYear)}
                                                                    onChange={(e) =>
                                                                        setExperienceField({
                                                                            ...experienceField,
                                                                            startYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        <br />
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]}>
                                                                <DatePicker
                                                                    sx={{
                                                                        width: .9,
                                                                    }}
                                                                    slotProps={{
                                                                        textField: {
                                                                            error: false,
                                                                        },
                                                                    }}
                                                                    label="End Date"
                                                                    value={dayjs(experienceField.endYear)}
                                                                    onChange={(e) =>
                                                                        setExperienceField({
                                                                            ...experienceField,
                                                                            endYear: new Date(
                                                                                e["$d"]
                                                                            ).toLocaleDateString(),
                                                                        })
                                                                    }
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        <br />


                                                        <Button
                                                            variant="contained"
                                                            disabled={(experienceField.company && experienceField.startYear && experienceField.location && experienceField.title) ? false : true}
                                                            onClick={() => {
                                                                addExperineces();
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Leave Setting */}
                            {(userInfoData?.role?.alias === "Admin" || userInfoData?._id === id) &&
                                (

                                    <div class="row">
                                        <div class="col-md-12 d-flex">
                                            <div class="card profile-box flex-fill">
                                                <div class="card-body">
                                                    <h3 class="card-title">
                                                        Leave Setting
                                                        {userInfoData?.role.alias === "Admin" ? (
                                                            <>
                                                                {cardEdit.leaveSetting ? (
                                                                    <>
                                                                        <Tooltip title="send" sx={{ marginLeft: "10px" }}>
                                                                            <SendIcon className="edit-icon"
                                                                                onClick={(e) => {
                                                                                    updateLeaveBoardSetting()
                                                                                }}

                                                                            />
                                                                        </Tooltip>
                                                                        <Tooltip>
                                                                            <CancelIcon
                                                                                className="edit-icon"
                                                                                onClick={(e) => {
                                                                                    setUpdateLeaveSettings({
                                                                                        general: "",
                                                                                        sick: ""
                                                                                    })
                                                                                    setCardEdit({
                                                                                        ...cardEdit,
                                                                                        leaveSetting: false,
                                                                                    })

                                                                                }

                                                                                }
                                                                            />
                                                                        </Tooltip>
                                                                    </>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                {!cardEdit.leaveSetting && (
                                                                    <Tooltip
                                                                        title="Edit"
                                                                        sx={{ marginLeft: "-10px" }}
                                                                    >
                                                                        <EditIcon
                                                                            className="edit-icon"
                                                                            onClick={() => {
                                                                                setCardEdit({
                                                                                    ...cardEdit,
                                                                                    leaveSetting: true,
                                                                                });
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </h3>
                                                    <ul class="personal-info">
                                                        <li style={{ display: "flex", alignItems: "center" }}>
                                                            <div class="title">Annual Casual Leave</div>
                                                            <TextField
                                                                id="outlined-search"
                                                                // label={leaveSettings?.general? leaveSettings.general: 0}
                                                                sx={{
                                                                    "input::placeholder": {
                                                                        fontSize: "1rem",
                                                                        color: "black",
                                                                        opacity: 1
                                                                    }
                                                                }}
                                                                placeholder={leaveSettings?.general}
                                                                type="search"
                                                                value={updateLeaveSettings?.general}
                                                                disabled={cardEdit.leaveSetting ? false : true}
                                                                onChange={(e) => {
                                                                    setUpdateLeaveSettings({
                                                                        ...updateLeaveSettings,
                                                                        general: e.target.value
                                                                    })
                                                                }}
                                                            />
                                                        </li>
                                                        <li style={{ display: "flex", alignItems: "center" }}>
                                                            <div class="title">Annual Sick Leave {leaveSettings.sickLeave}</div>
                                                            <TextField
                                                                id="outlined-search"
                                                                sx={{
                                                                    "input::placeholder": {
                                                                        fontSize: "1rem",
                                                                        color: "black",
                                                                        opacity: 1
                                                                    }
                                                                }}
                                                                // label="Annual sick leave"
                                                                placeholder={leaveSettings?.sick}
                                                                value={updateLeaveSettings?.sick}
                                                                type="search"
                                                                // label={leaveSettings?.sick ? leaveSettings.sick: 0}
                                                                disabled={cardEdit.leaveSetting ? false : true}
                                                                onChange={(e) => {

                                                                    setUpdateLeaveSettings({
                                                                        ...updateLeaveSettings,
                                                                        sick: e.target.value
                                                                    })
                                                                }}
                                                            />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>




            {/* modal */}
            <BootstrapDialog
                onClose={handleModalClose}
                aria-labelledby="customized-dialog-title"
                open={openModal}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleModalClose}>
                    Add CV
                </BootstrapDialogTitle>
                <DialogContent sx={{
                    display: "flex", justifyContent: "center", flexDirection: "column",
                    overflowY: "auto"
                }}>

                    <input label="cv " name='file' onChange={(e) => {
                        setFile(e.target.files[0])
                    }} accept="application/pdf"
                        encType="multipart/form-data"
                        type="file" sx={{ minWidth: 365, maxHeight: 345, margin: "0px 20px 10px 0px" }}

                        required />

                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={() => {
                        let formData = new FormData();
                        formData.append("type", "cv")
                        formData.append("userId", id)
                        formData.append("file", file)
                        fileUpload(formData, jwt).then(d => {
                            setOpenModal(false)
                            toast.success("Cv uploaded successfully", {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnHover: false,
                            })
                        }).catch(err => {
                            toast.warning(err?.response?.data?.message || "Something went wrong", {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnHover: false,
                            });
                        })

                    }}  >
                        Upload
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );


};

export default Profile;
