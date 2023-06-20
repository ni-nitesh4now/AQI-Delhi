import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";


const getColor = (aqi) => {
  if (aqi >= 0 && aqi <= 50) return "green";
  if (aqi >= 51 && aqi <= 100) return "yellow";
  if (aqi >= 101 && aqi <= 150) return "orange";
  if (aqi >= 151 && aqi <= 200) return "red";
  if (aqi >= 201 && aqi <= 300) return "purple";
  if (aqi >= 301 && aqi <= 500) return "maroon";
  return "black";
};

const RadialLineGraph = ({data}) => {
    const [path, setPath] = useState("");
    const [lineColor, setLineColor] = useState("currentColor");
    const [pointColors, setPointColors] = useState([]);
  
    const graphSize = 600; // Adjust this value as needed
  
    useEffect(() => {
      const calculatePath = () => {
        const radius = (graphSize - 100) / 2;
        const center = graphSize / 2;
        const angleStep = (Math.PI * 2) / 365;
        const pathData = data
          .map((item, index) => {
            const daysFromStart = index;
            const angle = daysFromStart * angleStep;
            const maxAQI = Math.max(...data.map((item) => item.AQI));
            const r = (item.AQI / maxAQI) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
          })
          .join(" ");
        setPath(`M${pathData}`);
      };
  
      calculatePath();
    }, [graphSize]);
  
    useEffect(() => {
      const pointColors = data.map((item) => getColor(item.AQI));
      setPointColors(pointColors);
    }, [data]);
  
    const drawBoundaryCircles = () => {
      const maxAQI = Math.max(...data.map((item) => item.AQI));
      const radiusStep = (graphSize - 100) / 6;
      const boundaryCircles = [];
      const colorC = ["green", "yellow", "orange", "violet", "red","purple"];
      const rad = [50, 100, 150, 200, 300, 500];
      const qualityCategories = [
        "Good",
        "Satisfactory",
        "Moderate",
        "Poor",
        "Very Poor",
        "Severe",
      ];
  
      for (let i = 5; i >= 0; i--) {
        const radius = (rad[i] / maxAQI) * ((graphSize - 100) / 2);
        const color = colorC[i];
        const category = qualityCategories[i];
  
        boundaryCircles.push(
          <g key={i}>
            <circle
              cx={graphSize / 2}
              cy={graphSize / 2}
              r={radius}
              fill={color}
              stroke={color}
              strokeWidth="1"
              style={{ zIndex: 6 - i }}
            />
            <text
              x={graphSize / 2 - radius + 20}
              y={graphSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="15"
              fontWeight="bold"
              fill="black"
              transform={`rotate(-90, ${graphSize / 2 - radius + 20}, ${graphSize / 2})`}
              style={{ pointerEvents: "none" }}
            >
              {category}
            </text>
            <text
              x={graphSize / 2 + radius}
              y={graphSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fontWeight="bold"
              fill="currentColor"
            >
              {rad[i]}
            </text>
          </g>
        );
      }
  
      return boundaryCircles;
    };
  
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <svg width={graphSize} height={graphSize}>
          {/* Boundary Circles */}
          {drawBoundaryCircles()}
          <line
            x1={graphSize / 2}
            y1="0"
            x2={graphSize / 2}
            y2={graphSize}
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={graphSize / 2}
            x2={graphSize}
            y2={graphSize / 2}
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Axis Scale */}
          <text
            x={graphSize / 2}
            y={graphSize / 2}
            textAnchor="start"
            fontSize="10"
            fill="currentColor"
          >
            0
          </text>
          {/* Months */}
          {data.map((item, index) => {
            const daysFromStart = index;
            const angle = daysFromStart * ((Math.PI * 2) / 365);
            const radius = (graphSize -50) / 2;
            const x = graphSize / 2 + radius * Math.cos(angle);
            const y = graphSize / 2 + radius * Math.sin(angle);
            const month = item.date.getMonth();
            const prevMonth = index > 0 ? data[index - 1].date.getMonth() : -1;
            const drawLabel = prevMonth !== month && month !== 0;
            const showMonthLabel = item.date.getDate() === 15;
  
            return (
              <React.Fragment key={index}>
                {drawLabel && (
                  <React.Fragment>
                    <line
                      x1={graphSize / 2}
                      y1={graphSize / 2}
                      x2={x}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="2"
                    />
                  </React.Fragment>
                )}
                {showMonthLabel && (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fontSize="18"
                    fill="currentColor"
                  >
                    {new Date(0, month).toLocaleString("default", {
                      month: "short",
                    })}
                  </text>
                )}
              </React.Fragment>
            );
          })}
          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 20 }}
            d={path}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  };
  
  export default RadialLineGraph;
  