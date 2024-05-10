import express from "express"
import { config } from "dotenv"
import DB_connection from "./DB/connection.js"
import { globalResponse } from "./Src/middleWares/globalResponse.js"
import userRouter from "./Src/modules/User/user.routes.js"
import companyRouter from "./Src/modules/Company/company.routes.js"
import jobRouter from "./Src/modules/Job/job.routes.js"
const app = express()

app.use(express.json())
config()
DB_connection()

app.use("/user" , userRouter)
app.use("/company" , companyRouter)
app.use("/job" , jobRouter)


app.use(globalResponse)


app.listen(process.env.PORT , ()=> {console.log("SERVER RUN")})








