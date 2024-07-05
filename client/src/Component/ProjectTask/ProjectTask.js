import Board, { moveCard, moveColumn, removeCard, addCard, changeCard } from "@asseinfo/react-kanban"
import "@asseinfo/react-kanban/dist/styles.css";
import useBoard from '../../Component/ProjectTask/Board';
import "./kanvan.css"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AddTaskModal from '../../Component/ProjectTask/AddTask';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { deleteSingleTaskApi, filterProjectTask, getAllTaskApi, getSingleTaskApi, taskSummaryApi, updateATaskApi } from "../../api/projectApi";
import { profileImg, taskDataPrepration, _debounce } from "../functions/commonFunc";
import Cookies from "js-cookie";
import styles from './AddTaskModal.module.css'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//icons
import EventIcon from '@mui/icons-material/Event';
import { Avatar, AvatarGroup, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import userInfo from "../Hook/useUseInfo";
import { styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { priorityStat, taskStatus, } from "../../Component/ProjectTask/AddTask";
import TaskFilter from "./TaskFilter";
import TaskSummary from "./TaskSummary";
import userRole from "../Hook/userHook";
// Modal Styling
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200
        }
    },
    getContentAnchorEl: null,
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "center"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "center"
    },
    variant: "menu"
};

// Modal Styling
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
        overflowY: 'revert',
        marginTop: '20px'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        overflowY: 'revert',
        marginTop: '20px'
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

function uniqueObj(data) {
    return data?.reduce((acc, curr) => {
        // Check if the _id is already present in the accumulator array
        if (!acc.some((item) => item._id === curr._id)) {
            // If not present, add the current object to the accumulator array
            acc.push(curr);
        }
        return acc;
    }, []);

}
// feature", "bug", "test", "meeting", "design", "others"
// const taskStatus = ['open', 'doing', 'pause', 'done'];
// const priorityStat = ['high', 'medium', 'low']
export const taskTypes = ["feature", "bug", "test", "meeting", "research", "design", "others"]
const ProjectTaskBoard = ({ membersNameId, projectDetails }) => {
    const jwt = Cookies.get("_token");
    const user = userInfo();
    const role = userRole();
    // const role = 
    const [allTask, setAllTask] = useState([]);
    const [tasks, setTasks] = useState([]);
    const { subId: projectCode } = useParams()
    const { board, setBoard } = useBoard();
    const [task, setTask] = useState({
        projectCode: projectCode,
        taskName: "",
        startTime: "",
        endTime: "",
        status: "",
        totalHour: "",
        additionalNotes: "",
        assignedMembers: [],
        assignedMembersNameId: [],
        priority: "",
        progress: "",
        taskType: ""

    })
    const limit = 3
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [singleTask, setSingleTask] = useState({

        // taskName: "",
        // status: "",
        // startTime:"",
        // endTime: "",
        // totalHour: "",
        // additionalNotes: "",
        // assignedMembers: "",
        // priority: "",
        // progress: "",
        // taskType: ""
    })

    const [query, setQuery] = useState({
        userId: [],
        userIdName: [],
        priority: [],
        startTime: "",
        endTime: "",
        taskType: [],
        sortBy: "",
        status: ""
    })
    // console.log("query", query);

    const [data, setData] = useState([])
    const [othersData, setOthersData] = useState({
        totalData: "",
        totalTodaysDeadline: ""
    })
    // For Modal open
    const handleModalOpen = () => {
        setOpenModal(true);
    };

    // For Modal Close
    const handleModalClose = () => {
        setOpenModal(false);
    };

    const getAllTask = async () => {
        try {
            const response = await getAllTaskApi(projectCode, jwt);
            if (response.status === 200) {
                let data = await response.json()
                // console.log(data);
                // setTasks(taskDataPrepration(data.data));
                setBoard(taskDataPrepration(data?.data))
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        // console.log("ALL Task changed");
        setAllTask(allTask)

    }, [allTask])


    // console.log("all task",allTask);

    const filterTask = async (pageNum, taskList) => {
        const data = {
            pcd: projectCode,
            query: {
                userId: query.userId,
                startTime: query.startTime,
                endTime: query.endTime,
                priority: query.priority,
                taskType: query.taskType,
                sortBy: query.sortBy,
                status: query.status,
                limit: limit,
                page: pageNum
            },

        }

        try {
            if (data.query.startTime && data.query.endTime && data.query.startTime > data.query.endTime) {
                toast.warning("Invalid date range", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
                })
                return
            }
            const response = await filterProjectTask(data, jwt);
            if (response.status === 200) {
                const responseData = await response.json();

                responseData.data.length <= 0 ? setPageNumber((prev) => prev - 1) : setPageNumber((prev) => prev)
                setAllTask([...taskList, ...responseData.data])
                setBoard(taskDataPrepration([...taskList, ...responseData.data]))
            } else {
                toast.warning("Fetching error", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    pauseOnHover: false,
                })
            }

        } catch (err) {

        }

    }


    const handleColumnMove = (_card, source, destination) => {
        const updatedBoard = moveColumn(board, source, destination)
        setBoard(updatedBoard)
    }

    const handleCardMove = (_card, source, destination) => {

        if (projectDetails.isCurrentlyActive ===  true) {
            toast.warning("This Project is Locked ", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            });
            setTask({
                ...task,
                taskName: "",
                startTime: "",
                endTime: "",
                status: "",
                totalHour: "",
                additionalNotes: "",
                assignedMembers: [],
                assignedMembersNameId: [],
                priority: "",
                progress: "",
                taskType: ""
            })
            return;
        }
        if (_card.assignedMembers.includes(userInfo()._id) || ["Admin", "Project Lead", "Team Lead"].includes(role)) {

            const fromCloumn = board.columns[source.fromColumnId - 1];
            let status = board.columns[destination.toColumnId - 1].title.toLowerCase();
            const updatedBoard = moveCard(board, source, destination)
            // console.log(updatedBoard);
            setBoard(updatedBoard)

            statusChangeOnDrag(_card, status).then(() => {

            }).catch(err => {
                // console.log(err);
                const updateBoard = moveCard(board, destination, source)
                setBoard(updateBoard)
            })
        } else {

            return toast.warning("You are not authorize to update the task status", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            })
        }

    }

    const getColumn = (card) => {
        const column = board.columns.filter((column) => column.cards.includes(card))
        return column[0]
    }

    const getGradient = (card) => {
        const column = getColumn(card)
        const title = column.title
        if (title === "Todo") {
            return {
                backgroundColor: "#5F97EB",
                // backgroundImage: "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)"

            };
        } else if (title === "In Progress") {
            return {

                backgroundColor: "#D9DB6C",
                // backgroundImage: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)"


            };
        } else if (title === "Pause") {
            return {
                background: "rgb(204 71 71 / 85%)"
                // "linear-gradient(65.35deg, rgba(65, 65, 65, 0.67) -1.72%, rgba(48, 220, 86) 163.54%)",
                // backgroundImage: " linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)"
            };
        } else if (title === "Done") {
            return {
                background: "rgb(27, 187, 27)"
                // background:"linear-gradient(to right, #859398 100%, #283048)",
            };
        }
    }

    const fetchSummary = async () => {
        const response = await taskSummaryApi(projectCode, query, jwt);
        if (response.status === 200) {
            const responseData = await response.json();
            // console.log(responseData.data[0]);
            setData(Object.values(responseData.data[0].summary))
            setOthersData({
                ...othersData,
                totalData: responseData.data[0].totalTasks,
                totalTodaysDeadline: responseData.data[0].totalDeadelineToday
            })
        }
    }

    useEffect(() => {
        fetchSummary()
    }, [projectCode])


    useEffect(() => {
        getAllTask()
    }, [projectCode])

    useEffect(() => {
        filterTask(1, allTask)
    }, [projectCode])

    function replaceKeyValue(array, key, searchValue, replaceValue) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === searchValue) {
                array[i] = replaceValue;
            }
        }
        return array
    }

    const statusChangeOnDrag = async (card, status, cb) => {
        // setLoading(true)

        const cardData = {
            taskid: card._id,
            pcd: projectCode,
            updatedData: {
                status: status.toLowerCase()
            }
        }

        const response = await updateATaskApi(cardData, jwt);
        if (response.status === 200) {
            fetchSummary()
            // setLoading(false)
            const responseData = await response.json();
            const modifiedArray = replaceKeyValue(allTask, '_id', responseData.data[0]._id, responseData.data[0])
            setAllTask(modifiedArray)
            // console.log("Modified array",modifiedArray);
            // console.log("after change status", responseData);
        } else {
            // setLoading(false)
            await filterTask(pageNumber, allTask)
            throw new Error("Error occured")
        }



    }

    const getSingleTask = async ({ taskId, projectCode }) => {
        const response = await getSingleTaskApi({ taskId, projectCode }, jwt);
        if (response.status === 200) {
            const data = await response.json();
            let temp = data.data[0];
            setSingleTask({
                ...temp,
                membersNameId: membersNameId,
                selectedMembers: temp.assignedMembersData?.map(v => v._id + "_" + v.firstName) || []

            })
        } else {

        }
    }

    const updateSingleTask = async (taskId, projectCode) => {
        if (projectDetails.isCurrentlyActive ===  true) {
            toast.warning("This Project is Locked ", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            });
            setTask({
                ...task,
                taskName: "",
                startTime: "",
                endTime: "",
                status: "",
                totalHour: "",
                additionalNotes: "",
                assignedMembers: [],
                assignedMembersNameId: [],
                priority: "",
                progress: "",
                taskType: ""
            })
            setEdit(false)
            setOpenModal(false)
            return;
        }
        let updatedData = {
            taskName: singleTask?.taskName,
            assignedMembers: singleTask?.assignedMembers,
            startTime: singleTask?.startTime,
            endTime: singleTask?.endTime,
            totalHour: singleTask?.totalHour,
            progess: singleTask?.progress,
            taskType: singleTask?.taskType,
            priority: singleTask?.priority,
            status: singleTask?.status,
            additionalNotes: singleTask?.additionalNotes
        }
        if ((updatedData.startTime && updatedData.endTime) && (new Date(updatedData.startTime) > new Date(updatedData.endTime))) {
            toast.warning("Invalid date range", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            })
        }

        let response = await updateATaskApi({ pcd: projectCode, taskid: taskId, updatedData: updatedData }, jwt)
        if (response.status === 200) {
            fetchSummary()
            // console.log("update response page no", pageNumber);
            await filterTask(pageNumber, allTask)
            const data = await response.json();
            const temp = data.data[0];
            // console.log(" update response data", temp);
            setSingleTask({
                ...temp, membersNameId: membersNameId,
                selectedMembers: temp.assignedMembersData?.map(v => v._id + "_" + v.firstName) || []
            });
            let tempTasks = replaceKeyValue(allTask, "_id", taskId, temp);
            setBoard(taskDataPrepration(tempTasks))
            setAllTask(tempTasks)
            setEdit(false)
            setOpenModal(false)
        } else {
            toast.warning("Something went wrong", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            })
        }
    }


    const updateTask = async () => {
        await updateSingleTask(singleTask?._id, singleTask?.projectCode)
    }

    const deleateATask = async (data) => {
        if (projectDetails.isCurrentlyActive ===  true) {
            toast.warning("This Project is Locked ", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            });
            setTask({
                ...task,
                taskName: "",
                startTime: "",
                endTime: "",
                status: "",
                totalHour: "",
                additionalNotes: "",
                assignedMembers: [],
                assignedMembersNameId: [],
                priority: "",
                progress: "",
                taskType: ""
            })
            setEdit(false)
            setOpenModal(false)
            return;
        }
        const response = await deleteSingleTaskApi(data, jwt);
        // console.log("Delete Task",data);
        let responseData = await response.json();
        if (response.status === 200) {
            fetchSummary()
            toast.success("Task deleted", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            })
            const filteredData = allTask.filter((val) => val._id !== data.taskId)

            await filterTask(pageNumber, filteredData)
        } else {
            toast.warning(response?.data?.message || "Something went wrong", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                pauseOnHover: false,
            })
        }
    }

    const viewSingleTask = () => {

    }

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <>
            <div className="board-container" id="board-container" style={{ position: "relative", }}>

                <span>Task Board</span>

                <div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Filter</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TaskFilter >
                                <Box sx={{ display: "flex", flexDirection: "column", gap: ".4rem", marginBottom: ".4rem" }}>

                                    <Box sx={{ display: "flex", justifyContent: "start", gap: ".2rem", flexFlow: { xs: "column wrap", md: "row wrap" } }}>
                                        {/* <Typography>Search By Date</Typography> */}

                                        {/* starttime  */}
                                        <Box sx={{}} className="task-div" >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                                <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "29px", } }} >
                                                    <DatePicker label="Start Time *" slotProps={{
                                                        textField: {
                                                            error: false,
                                                        },
                                                    }}
                                                        value={dayjs(query.startTime)}

                                                        onChange={(e) => {
                                                            if (e?.['$d']) {
                                                                setQuery({ ...query, startTime: new Date(new Date(e['$d']).setHours(0, 0, 0, 0)) })

                                                            }
                                                        }}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>


                                        </Box>

                                        {/* - end time */}
                                        <Box sx={{}} className="task-div" >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                                <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "29px", } }} >
                                                    <DatePicker label="End Time *" slotProps={{
                                                        textField: {
                                                            error: false,
                                                        },

                                                    }}
                                                        value={dayjs(query.endTime)}

                                                        onChange={(e) => {
                                                            if (e?.['$d']) {
                                                                setQuery({ ...query, endTime: new Date(new Date(e['$d']).setHours(23, 59, 59, 999)) })
                                                            }

                                                        }}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>


                                        </Box>
                                        {/* sortby end time or dead line */}
                                        <Box sx={{ marginTop: "10px" }} className="task-div">
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                                                <Select

                                                    sx={{ width: "150px" }}
                                                    label="Sort"
                                                    labelId="demo-simple-select-label"
                                                    onChange={(e) => {
                                                        setQuery({ ...query, sortBy: e.target.value })
                                                    }}
                                                >
                                                    <MenuItem value={"asc"}>ASC</MenuItem>
                                                    <MenuItem value={"desc"}>DESC</MenuItem>

                                                </Select>
                                            </FormControl>

                                        </Box>

                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center", }}>
                                        {/* <Typography>Search By User</Typography> */}
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Users</InputLabel>

                                            <Select
                                                sx={{ width: "50%" }}
                                                label="User"
                                                labelId="demo-simple-select-label"
                                                value={query.userIdName}
                                                multiple
                                                onChange={(e) => {
                                                    let mappEdValue = e.target.value?.map(v => v.split("_")[0])
                                                    setQuery({ ...query, userId: mappEdValue, userIdName: e.target.value })
                                                }}
                                                renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value.split("_")[1]}
                                                        />
                                                    ))}


                                                </Box>}
                                            >
                                                {membersNameId.length && membersNameId.map((option, i) => {
                                                    return (

                                                        <MenuItem key={i} value={option._id + "_" + option.firstName} data-name={option._id} >
                                                            <ListItemIcon>
                                                                <Checkbox checked={query?.userId?.indexOf(option._id) > -1} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={option.firstName} />
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                        {/* <Typography>Search By Priority</Typography> */}
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Priority</InputLabel>

                                            <Select
                                                label="Priority"
                                                multiple
                                                value={query?.priority}
                                                labelId="demo-simple-select-label"
                                                sx={{ width: "50%" }}
                                                onChange={(e) => {
                                                    setQuery({ ...query, priority: e.target.value })
                                                }}
                                                renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value}


                                                        />
                                                    ))}


                                                </Box>}
                                            >
                                                {priorityStat.length && priorityStat.map((option, i) => {

                                                    return (

                                                        <MenuItem key={i} value={option}  >
                                                            <ListItemIcon>
                                                                <Checkbox checked={query?.priority?.indexOf(option) > -1} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={option} />
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>

                                        </FormControl>
                                    </Box>


                                    {/* Search by status */}
                                    <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center" }} >

                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                            <Select
                                                sx={{ width: "50%" }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                // size="small"
                                                label="Select Type"
                                                value={query.status}
                                                onChange={(e) => {
                                                    console.log(e.target.value);
                                                    setQuery({ ...query, status: e.target.value })
                                                }}
                                            >
                                                {[...taskStatus, "missed"].map((v, i) => (
                                                    <MenuItem key={i} value={v} >{v}</MenuItem>
                                                ))

                                                }

                                            </Select>
                                        </FormControl>


                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                        {/* <Typography>Search By Priority</Typography> */}
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Type</InputLabel>

                                            <Select
                                                label="Type"
                                                labelId="demo-simple-select-label"
                                                sx={{ width: "50%" }}
                                                multiple
                                                value={query?.taskType}
                                                onChange={(e) => {
                                                    setQuery({ ...query, taskType: e.target.value })
                                                }}
                                                renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value}
                                                        />
                                                    ))}


                                                </Box>}
                                            >
                                                {taskTypes.length && taskTypes.map((option, i) => {

                                                    return (

                                                        <MenuItem key={i} value={option}  >
                                                            <ListItemIcon>
                                                                <Checkbox checked={query?.taskType?.indexOf(option) > -1} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={option} />
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>

                                        </FormControl>
                                    </Box>

                                </Box>
                                <Button variant="contained" onClick={() => {
                                    if (query?.startTime && query.endTime && (query.startTime > query.endTime)) {
                                        toast.warning("Invalid Date Range", {
                                            position: toast.POSITION.TOP_CENTER,
                                            autoClose: 1000,
                                            pauseOnHover: false,
                                        })
                                        return
                                    }
                                    setAllTask([])
                                    setBoard(taskDataPrepration([]))
                                    setPageNumber((prev) => (prev * 0) + 1)
                                    filterTask(1, [])
                                    fetchSummary()

                                }}
                                >Search</Button>
                            </TaskFilter>
                        </AccordionDetails>
                    </Accordion>

                </div>
                <div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Summary</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TaskSummary data={data} othersData={othersData} />
                        </AccordionDetails>
                    </Accordion>
                </div>

                <Board
                    allowAddColumn
                    // allowRenameColumn
                    allowRemoveCard
                    onCardDragEnd={handleCardMove}
                    disableColumnDrag

                    renderCard={(props) => (
                        <div
                            data-id={props?.assignedMembers?.join(",")} onDoubleClick={(e) => {
                                getSingleTask({ taskId: props._id, projectCode: props.projectCode });
                                setOpenModal(true);


                            }} className='kanban-card' style={getGradient(props)}>
                            {/* drwaer */}
                            <div style={{ position: "relative" }}>
                                {/* <span>{props?.type}</span> */}
                                <span style={{ fontWeight: "700" }}>
                                    {props?.taskName?.slice(0, 20)}
                                    {props?.taskName?.length > 20 ? "..." : null}
                                </span>
                                {(props?.assignedMembers.includes(user?._id) || (user.role?.name === "admin" || user.role?.name === "teamlead" || user.role?.name === "projectlead")) ? (
                                    <button className='remove-button' style={{ position: "absolute", right: -15, top: -15 }} type='button'
                                        onClick={() => {

                                            deleateATask({ taskId: props._id, projectCode: props.projectCode })
                                        }}
                                    >
                                        <CloseIcon color="white" size={15} />
                                    </button>

                                ) : null}

                            </div>
                            <div className="task-tag">
                                {props?.priority ? <span className="priority">{props?.priority}</span> : null}
                                {props?.taskType ? <span className="task-type">{props?.taskType}</span> : null}

                            </div>
                            <div >
                                {/* <span className="kanban-card-starttime">{new Date(props?.startTime).toLocaleDateString()}</span> */}
                                <span> <EventIcon sx={{ color: "" }} /> </span>
                                {props?.endTime ? (<span style={{ color: "Black", fontWeight: "600" }} className="kanban-card-endtime">{new Date(props?.endTime).toLocaleDateString()}</span>) : "N/A"}

                            </div>
                            <div>
                                <AvatarGroup sx={{ justifyContent: "start", flexWrap: "wrap" }}>
                                    {props?.assignedMembersData?.map((v) => (
                                        <Tooltip title={`${v?.firstName}`}>
                                            <Avatar imgProps={{ crossOrigin: "false" }} src={profileImg(v?.imagePath)} />
                                        </Tooltip>

                                    ))}
                                </AvatarGroup>
                            </div>
                            {/* <span style={{ fontSize: "15px" }}>{props.description}</span> */}
                        </div>
                    )}
                    renderColumnHeader={(props) => {

                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const [modalOpened, setModalOpened] = useState(false)

                        const handleCardAdd = (title, detail) => {
                            // console.log("title", title);
                            // console.log("detail", detail);

                            const card = {
                                id: detail._id,
                                ...detail
                                // description: {...detail}
                            };

                            console.log("card", card);

                            const updatedBoard = addCard(board, props, card)
                            setBoard(updatedBoard)
                            setModalOpened(false)

                        }

                        const removeCard = (title, detail) => {
                            // console.log("remove card", title, detail);
                        }

                        return (
                            <div className={`column-header ${props.title}`} style={{ padding: '.7rem', borderRadius: "10px", fontWeight: "bolder", }}>
                                <span>{props.title}</span>

                                <AddIcon
                                    color="white"
                                    size={25} title="Add task"
                                    onClick={(e) => {
                                        setModalOpened(true)

                                        if (user?.role?.name !== "admin") {
                                            setTask({
                                                ...task,
                                                status: props.title.toLowerCase(),
                                                assignedMembers: [user._id],
                                                assignedMembersNameId: [user._id + "_" + user.firstName]
                                            })

                                        }

                                    }
                                    }
                                />
                                <AddTaskModal visible={modalOpened} handleCardAdd={handleCardAdd} status={props.title} projectCode={projectCode} membersNameId={membersNameId}
                                    setAllTask={setAllTask} allTask={allTask} filterTask={filterTask} pageNumber={pageNumber}
                                    task={task} setTask={setTask} setPageNumber={setPageNumber} fetchSummary={fetchSummary} projectDetails={projectDetails}
                                    onClose={() => {

                                        setModalOpened(false)
                                        setTask({
                                            taskName: "",
                                            startTime: "",
                                            endTime: "",
                                            status: "",
                                            totalHour: "",
                                            additionalNotes: "",
                                            assignedMembers: [],
                                            assignedMembersNameId: [],
                                            priority: "",
                                            progress: "",
                                            taskType: ""
                                        })
                                    }} />
                            </div>
                        )
                    }}

                >
                    {board}
                </Board>

                < >
                    {/* <Button onClick={toggleDrawer(true)}>Add</Button> */}
                    <Drawer
                        PaperProps={{ style: { position: 'absolute', backgroundColor: "white", width: "500px", opacity: "0.8", padding: "1rem" } }}
                        BackdropProps={{ style: { position: 'absolute' } }}
                        sx={{

                        }}
                        slots={{
                        }}
                        slotProps={
                            {
                                root: {
                                    style: {
                                        position: "absolute"
                                    }
                                },

                            }
                        }
                        ModalProps={{
                            container: document.getElementById('board-container'),
                            style: { position: 'relative' }
                        }}
                        variant="temporary"
                        anchor={"left"}
                        open={open}
                        onClose={toggleDrawer(false)}
                    >

                        <Box sx={{ display: { xs: "inline-block", sm: "flex" }, justifyContent: "space-between" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem", } }} >
                                    <DatePicker label="Start Time *" slotProps={{
                                        textField: {
                                            error: false,
                                        },
                                    }} />
                                </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem" } }} >
                                    <DatePicker label="End Time *" slotProps={{
                                        textField: {
                                            error: false,
                                        },
                                    }} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ m: 1, }}>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                <span>Priority</span>
                                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox name="high" />
                                        }
                                        label="high"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox name="medium" />
                                        }
                                        label="medium"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox name="low" />
                                        }
                                        label="low"
                                    />
                                </FormGroup>

                            </div>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                <span>Task Types</span>
                                <FormControl sx={{ width: "60%" }}>

                                    <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        size="small"
                                    // renderValue={(selected) => selected.map(v=> v.split("_")[0]).join(", ")}
                                    // MenuProps={MenuProps}

                                    >
                                        {taskTypes.map((option, ind) => {
                                            return (
                                                // value={{id:option._id,name:option.userName}}

                                                <MenuItem key={ind} value={option}  >
                                                    {option}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>


                            </div>
                        </Box>
                        <Box sx={{ m: 1, display: "flex", justifyContent: "space-around", alignItems: "center" }}>

                            <span>Sort by</span>
                            <FormControl sx={{ width: "60%" }}>

                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    size="small"
                                // renderValue={(selected) => selected.map(v=> v.split("_")[0]).join(", ")}
                                // MenuProps={MenuProps}


                                >

                                    <MenuItem value={"asc"}  >
                                        ASC
                                    </MenuItem>
                                    <MenuItem value={"desc"}  >
                                        Desc
                                    </MenuItem>
                                </Select>
                            </FormControl>

                        </Box>

                        <Button variant="contained" sx={{ width: "50%", margin: "auto" }}  >Filter</Button>

                    </Drawer>
                </>



                {/* modal  */}

                <BootstrapDialog
                    onClose={handleModalClose}
                    aria-labelledby="customized-dialog-title"
                    open={openModal}

                    sx={{ ".MuiPaper-root": { width: "800px", }, "label input": { padding: ".5rem", } }}

                >
                    <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleModalClose}>
                        Task
                    </BootstrapDialogTitle>
                    <DialogContent sx={{
                        display: "flex", justifyContent: "center", flexDirection: "column",
                        overflowY: "auto",
                        marginTop: "1rem"



                    }}>

                        <div className={styles.container} style={{ margin: "1rem 0" }}>

                            {/* taskName */}
                            <Box className="task-div" sx={{ marginTop: { xs: "9rem !important", sm: "7rem !important", md: "6rem !important", lg: "1rem !important" }, }}  >
                                <label htmlFor="taskName">Task Name: </label>
                                {edit ? <TextField value={singleTask.taskName} onChange={(e) => {
                                    setSingleTask({
                                        ...singleTask,
                                        taskName: e.target.value,
                                    })

                                }
                                } /> : (
                                    // <TextField  value={singleTask.taskName} />
                                    <span>{singleTask?.taskName}</span>

                                )}
                                {/* <input type="text" name="taskName" id="taskName" /> */}
                            </Box>

                            {/* priority  & types */}
                            {/* <Box> */}

                            <Box sx={{ display: "flex", justifyContent: "start" }} className="task-div" >
                                <label htmlFor="taskName">Priority: </label>
                                {edit ? (
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Priority</InputLabel>

                                        <Select
                                            // sx={{ width: "100%" }}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"

                                            value={singleTask?.priority}
                                            label="Select Priority*"
                                            onChange={(e) => {
                                                setSingleTask({
                                                    ...singleTask,
                                                    priority: e.target.value
                                                })
                                            }}
                                        >
                                            {priorityStat.length && priorityStat.map((v, i) => (
                                                <MenuItem key={i} value={v} >{v}</MenuItem>
                                            ))

                                            }

                                        </Select>
                                    </FormControl>
                                )


                                    : (
                                        // <TextField  value={singleTask.taskName} />
                                        <span>{singleTask?.priority}</span>

                                    )}
                            </Box>

                            {/* {task type} */}
                            <Box sx={{ display: "flex", justifyContent: "start" }} className="task-div" >
                                <label htmlFor="taskName">Types: </label>
                                {edit ? (
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Types*</InputLabel>

                                        <Select
                                            // sx={{ width: "100%" }}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"

                                            value={singleTask?.taskType}
                                            label="Select Types*"
                                            onChange={(e) => {
                                                setSingleTask({
                                                    ...singleTask,
                                                    taskType: e.target.value
                                                })
                                            }}
                                        >
                                            {taskTypes.length && taskTypes.map((v, i) => (
                                                <MenuItem key={i} value={v} >{v}</MenuItem>
                                            ))

                                            }

                                        </Select>
                                    </FormControl>
                                )


                                    : (
                                        // <TextField  value={singleTask.taskName} />
                                        <span>{singleTask?.taskType}</span>

                                    )}
                            </Box>


                            {/* </Box> */}




                            {/* status selection */}

                            <Box style={{ display: "flex", }} className="task-div" >
                                {/* <span className={styles.label}>Type</span> */}
                                <label htmlFor="taskName">Status: </label>

                                {edit ? (

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select status*</InputLabel>

                                        <Select
                                            // sx={{ width: "100%" }}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // size="small"
                                            label="Select Type"
                                            value={singleTask.status}
                                            onChange={(e) => {
                                                setSingleTask({ ...singleTask, status: e.target.value })
                                            }}
                                        >
                                            {taskStatus?.map((v, i) => (
                                                <MenuItem key={i} value={v} >{v}</MenuItem>
                                            ))

                                            }

                                        </Select>
                                    </FormControl>

                                ) : (
                                    <span>{singleTask?.status}</span>

                                )
                                }
                            </Box>


                            {/* approx hour */}
                            <Box sx={{ display: "flex", justifyContent: "start" }} className="task-div" >
                                <label>Total Time(hour): </label>
                                {edit ? <TextField value={singleTask?.totalHour} onChange={(e) => {
                                    let val = e.target.value.replace(/[^0-9]/g, '');

                                    setSingleTask({
                                        ...singleTask,
                                        totalHour: val,
                                    })

                                }
                                } /> : (
                                    // <TextField  value={singleTask.taskName} />
                                    <span>{singleTask?.totalHour}</span>

                                )}
                            </Box>


                            {/* starttime  */}
                            <Box sx={{ display: "flex", justifyContent: "start" }} className="task-div" >
                                <label>Start Date: </label>
                                {edit ? (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                        <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem", } }} >
                                            <DatePicker label="Start Time *" slotProps={{
                                                textField: {
                                                    error: false,
                                                },
                                            }}
                                                value={dayjs(singleTask.startTime)}

                                                onChange={(e) => {
                                                    if (e?.['$d']) {

                                                        setSingleTask({
                                                            ...singleTask,
                                                            startTime: new Date(e?.['$d'])
                                                        })
                                                    }
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>

                                ) : (
                                    <span>{new Date(singleTask?.startTime).toLocaleDateString() || "N/A"}</span>
                                )}

                            </Box>

                            {/* - end time */}
                            <Box sx={{ display: "flex", justifyContent: "start" }} className="task-div" >
                                <label>Start Date: </label>
                                {edit ? (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                        <DemoContainer components={['DatePicker']} sx={{ ".MuiInputBase-input": { height: "39px", p: ".5rem", } }} >
                                            <DatePicker label="Start Time *" slotProps={{
                                                textField: {
                                                    error: false,
                                                },
                                            }}
                                                value={dayjs(singleTask.endTime)}

                                                onChange={(e) => {
                                                    if (e?.['$d']) {

                                                        setSingleTask({
                                                            ...singleTask,
                                                            endTime: new Date(e?.['$d'])
                                                        })
                                                    }
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>

                                ) : (
                                    <span>{new Date(singleTask?.endTime).toLocaleDateString() || "N/A"}</span>
                                )}

                            </Box>

                            {/* assigned members* */}

                            <Box sx={{ display: "flex", justifyContent: "start", alignItems: "baseline" }} className="task-div" >
                                <label>Assign Members: </label>
                                {edit ? (
                                    <Box sx={{ width: { xs: "100%", md: "45%" } }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Assign To</InputLabel>

                                            <Select
                                                // sx={{ width: "100%" }}
                                                disabled={(user?.role?.name === "admin" || user?.role?.name === "projectLead" || user?.role?.name === "teamlead") ? false : true}


                                                value={singleTask?.selectedMembers}
                                                multiple
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                // size="small"
                                                label="Select Type"
                                                onChange={(e) => {
                                                    // console.log(e.target.value);
                                                    let mappedValue = e.target.value.map((val) => val.split("_")[0]);

                                                    setSingleTask({ ...singleTask, selectedMembers: e.target.value, assignedMembers: mappedValue })
                                                }}
                                                renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value.split("_")[1]} />
                                                    ))}
                                                </Box>}
                                            >
                                                {membersNameId?.length && membersNameId?.map((option) => {
                                                    return (

                                                        <MenuItem key={option._id} value={option?._id + "_" + option?.firstName}  >
                                                            <ListItemIcon>
                                                                <Checkbox checked={singleTask.assignedMembers?.indexOf(option._id) > -1} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={option?.firstName} />
                                                        </MenuItem>
                                                    )
                                                })}

                                            </Select>
                                        </FormControl>
                                    </Box>
                                ) : (
                                    <div style={{ fontSize: "1.2rem", display: "flex" }}>
                                        {singleTask?.assignedMembersData?.length && singleTask?.assignedMembersData?.map((v, i) => {
                                            return (
                                                // <Tooltip key={i} title={v?.firstName}>
                                                //     <Avatar imgProps={{crossOrigin: "false"}} src={profileImg(v?.imagePath)} />
                                                // </Tooltip>
                                                <p>{v?.firstName + ","}</p>
                                            )
                                        })}
                                    </div>
                                )}
                            </Box>



                            <Box sx={{ display: "flex", justifyContent: "start" }} className="task-div" >
                                <label>Additional Notes: </label>
                                {edit ? (
                                    <textarea

                                        rows={5} className={styles.input} value={singleTask.additionalNotes}
                                        type="text" onChange={(e) => setSingleTask({ ...singleTask, additionalNotes: e.target.value })}
                                        placeholder="What you wish to do?" />
                                ) : (
                                    <span>{singleTask?.additionalNotes}</span>
                                )}
                            </Box>


                        </div>

                    </DialogContent>
                    {(userInfo()?.role?.name === "admin" || userInfo()?.role?.name === "projectlead" || userInfo()?.role?.name === "teamlead") || (
                        singleTask?.assignedMembers?.includes(userInfo()?._id)
                    ) ? (

                        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>

                            <Button variant="contained"
                                onClick={updateTask}
                                disabled={edit ? false : "true"}
                            >
                                Update
                            </Button>
                            <Button onClick={(e) => {
                                setEdit(!edit)
                            }} variant="contained"
                            >
                                {edit ? "Cancel" : "Edit"}


                            </Button>
                        </DialogActions>

                    ) : null}
                </BootstrapDialog>
            </div>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }} onClick={() => {
                setPageNumber((prev) => prev + 1)
                filterTask(pageNumber + 1, allTask)
            }
            }>See More</Box>
        </>
    )
}

export default ProjectTaskBoard