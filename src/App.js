import React from 'react';
import RadialLineGraph from './Airquality';
import { dataString, data19 } from "./data";

const parseData = (datak) => {
  const lines = datak.split("\n");
  const data = lines.map((line) => {
    const [date, AQI] = line.split(",");
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(`${year}-${month}-${day}`);
    return { date: formattedDate, AQI: parseInt(AQI) };
  });
  return data;
};

const data = parseData(data19);
const data2 = parseData(dataString);

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh",
      }}
    >
      <h1>Air Quality Index</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          // justifyContent: "center",
          // alignItems: "center",
          // height: "100vh",
        }}
      >
        <h3>Year - 2019</h3>
        <RadialLineGraph data={data} />
        <h3>Year - 2015</h3>
        <RadialLineGraph data={data2} />
      </div>
    </div>
  );
};

export default App;
