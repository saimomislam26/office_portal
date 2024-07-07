const userRouters = require("../routers/userRouter");
const roleRouters = require("../routers/roleRouter");
const departmentRouters = require("../routers/departmentRouter");
const designationRouters = require("../routers/designationRouter");
const attendenceRouters = require("../routers/attendenceRouter");
const holidayRouters = require("../routers/holidayRouter")
const projectRouters = require("../routers/projectRouter");
const leaveRouters = require("../routers/leaveRouter");
const taskRouter = require("../routers/taskRouter");
const knowledgeShareingRouter = require("../routers/knowledgeShareRouter");
const subProjectRouter = require("../routers/subProjectRouter")
const contributionRouter = require("../routers/contributionRouter")
const cors = require("cors");

const v1 = "/api/v1"
module.exports = (app) => {
    app.use(`${v1}/users`, userRouters, cors());
    app.use(`${v1}/roles`, roleRouters, cors());
    app.use(`${v1}/depts`, departmentRouters, cors());
    app.use(`${v1}/designations`, designationRouters, cors());
    app.use(`${v1}/attendence`, attendenceRouters, cors())
    app.use(`${v1}/holiday`, holidayRouters, cors())
    app.use(`${v1}/projects`, projectRouters, cors());
    app.use(`${v1}/leave`, leaveRouters, cors());
    app.use(`${v1}/task`, taskRouter, cors());
    app.use(`${v1}/knowledge`, knowledgeShareingRouter, cors());
    app.use(`${v1}/subproject`,subProjectRouter, cors())
    app.use(`${v1}/contribution`,contributionRouter, cors())
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWJjNTk1ZTQwOWQ3MWM2YjAwN2I0ZSIsImlhdCI6MTY3OTU0MTgyMCwiZXhwIjoxNjgwMTQ2NjIwfQ.Et3TVdf3O4Bww3PVYKNGAxsumm49FnFGyLLFDI8mKoc