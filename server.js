// ENV

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// APP
const app = require("./app");

const port = process.env.PORT;

// APP START
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
