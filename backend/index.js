const express = require("express");
const bodyParser = require("body-parser")
const mainRouter = require("./routes/index")
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/vi", mainRouter);

app.listen(port, () => {
    console.log("Server is running")
})


