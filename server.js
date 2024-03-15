const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname)));

app.get("/Admin", (req, res) => {
  res.sendFile(path.join(__dirname, "index1.html"));
});

app.get("/Client", (req, res) => {
  res.sendFile(path.join(__dirname, "index2.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
