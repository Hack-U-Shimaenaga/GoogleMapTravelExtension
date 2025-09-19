const fetch = require("node-fetch");

const getDirections = async (req, res) => {
  const { origin, destination } = req.query;

  try {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);
    const mode = "DRIVING";
    const apiKey = "***"; // 実際のAPIキーに置き換え
    const departureTime = Math.floor(Date.now() / 1000);
    console.log(departureTime);


    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&departure_time=${departureTime}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getDirections };
