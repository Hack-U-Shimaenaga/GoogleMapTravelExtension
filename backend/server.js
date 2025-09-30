const express = require("express");
const cors = require("cors");
require("dotenv").config();

const directionsRoutes = require("./routes/directions");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use("/api/directions", directionsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
