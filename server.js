const mongoose = require("mongoose");
const dotenv = require("dotenv");
//ENV config
dotenv.config({ path: "./config.env" });

const app = require("./app");

// CONENCT TO DATABASE
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB, {}).then(() => {
  console.log("DB connection sucesfull");
});

const port = process.env.PORT || 8000;
// APP START
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
