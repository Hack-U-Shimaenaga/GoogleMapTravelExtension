import { Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { useEffect } from "react";
export default function Directions({ origin, destination, places, departureTime, endTime }) {
  const [newPlaces, setNewPlaces] = useState([])
  const [info, setInfo] = useState([]);
  const addressList = places.map(place => place.address);

  console.log("????");
  console.log(addressList);

  const getDirections = async () => {
    const waypoints = [origin, ...addressList, destination];
    console.log("waypoints")
    console.log(waypoints)
    console.log(places)
    setNewPlaces(places);
    const results = [];
    let currentTime = departureTime; // 出発時間

    // dummy
    results.push({
        from: "",
        to: waypoints[0],
        duration: "",
        startTime: departureTime.format("HH:mm"),
        arriveTime: departureTime.format("HH:mm"),
        todo: "",
        staytime: "",
      });

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = encodeURIComponent(waypoints[i]);
      const to = encodeURIComponent(waypoints[i + 1]);

      const res = await fetch(
        `http://localhost:8000/api/directions?origin=${from}&destination=${to}&mode=driving`
      );
      const data = await res.json();

      const durationSec = data.routes[0].legs[0].duration.value; // 秒単位
      const durationText = data.routes[0].legs[0].duration.text;

      console.log("places??");
      console.log(newPlaces[i]);

      console.log("currentTime before")
      console.log(currentTime);

      console.log("durationSec");
      console.log(durationSec);

      const stayTimeMin = i < newPlaces.length ? newPlaces[i].time : 0;

      const arriveTime = currentTime.add(durationSec, 'second');
      console.log("arriveTime");
      console.log(arriveTime);

      results.push({
        from: waypoints[i],
        to: waypoints[i + 1],
        duration: durationText,
        startTime: currentTime.format("HH:mm"),
        arriveTime: arriveTime.format("HH:mm"),
        todo: i < newPlaces.length ? newPlaces[i].todo : "",
        staytime: stayTimeMin
      });

      console.log("stayTimeMin");
      console.log(stayTimeMin)

      currentTime = arriveTime.add(stayTimeMin, 'minute');
    }
    console.log("results");
    console.log(results);

    setInfo(results);
  };

  useEffect(() => {
    getDirections();
  }, [places, departureTime]);

  return (
    <div style={{ margin: "auto" }}>
      <button onClick={getDirections} style={{
        padding: "10px 20px",
        backgroundColor: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "1rem"
      }}>
        しおりを作る
      </button>

      {info.length > 0 &&
  info.map((leg, index) => (
    <div key={index} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>

      {/* 矢印と所要時間 */}
      {index != 0 && (
      <div style={{
        display: "flex",
        flexDirection: "column", // 縦に並べる
        alignItems: "center",
        margin: "12px 0",        // 上下に余白
        color: "#555",
        fontSize: "14px",
        lineHeight: "1.5"
      }}>
        <span>↓ 移動時間: {leg.duration} ↓</span>
        <span>到着予定: {leg.arriveTime}</span>
      </div>
      )}

      {/* 出発場所カード */}
      {index == 0 && (
      <Card style={{ width: "100%", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "4px" }}>
        <CardContent>
          <Typography variant="h6" align="center">
            {leg.to}
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary">
            出発: {leg.startTime}
          </Typography>
        </CardContent>
      </Card>
      )}

      {index > 0 && index < info.length - 1 && (
  <Card style={{ width: "100%", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "4px" }}>
    <CardContent>
      <Typography variant="h6" align="center">
        {leg.to} {leg.todo} (滞在時間: {leg.staytime}分)
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        出発: {dayjs(leg.arriveTime, "HH:mm").add(leg.staytime, 'minute').format("HH:mm")}
      </Typography>
    </CardContent>
  </Card>
)}



      {/* 最後のカードの場合は到着地も表示 */}
      {index === info.length - 1 && (
        <Card style={{ width: "100%", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "4px" }}>
          <CardContent>
            <Typography variant="h6" align="center">
              {leg.to} {index > 0 && leg.todo}
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary">
              到着予定: {leg.arriveTime}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
))}

    </div>
  );
}
