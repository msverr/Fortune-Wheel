import React, { useState } from "react";
import "./Wheel.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Wheel = ({ sectors, size = 400, screenWidth }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const center = size / 2;
  const radius = center - 20; // Retreat from the edge
  const numSectors = sectors.length;
  const anglePerSector = 360 / numSectors;

  const getCoordinatesForAngle = (angle) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  const spinWheel = () => {
    if (isSpinning) return; // Blocking of repeated pressing

    const randomRotation = Math.round(2000 + Math.random() * 1000); // Rotation between 2000 and 3000 degrees
    const newRotation = rotation + randomRotation;
    setRotation(newRotation - 10);
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      const finalRotation = (rotation + randomRotation) % 360;
      // Note that 0 degrees is the top, so we subtract finalRotation
      const adjustedRotation = (360 - finalRotation + anglePerSector / 2) % 360;
      const selectedSector =
        Math.floor(adjustedRotation / anglePerSector) % numSectors;
      setSelectedSector(sectors[selectedSector]);
      setIsModalOpen(true);
    }, 5000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const arrowWidth =
    screenWidth < 420
      ? 11
      : screenWidth < 780
      ? 15
      : screenWidth < 1024
      ? 18
      : 21;
  const arrowHeight =
    screenWidth < 420
      ? 7
      : screenWidth < 780
      ? 10
      : screenWidth < 1024
      ? 14
      : 15;

  return (
    <div
      className="wheel-container"
      style={{ position: "relative", margin: "0 auto" }}>
      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "90%",
          transform: "translateY(-50%)",
          width: "0",
          height: "0",
          borderTop: `${arrowHeight}px solid transparent`,
          borderBottom: `${arrowHeight}px solid transparent`,
          borderRight: `${arrowWidth}px solid rgb(243, 189, 39)`,
          zIndex: isModalOpen ? -1 : 2,
        }}
      />
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transition: "transform 5s cubic-bezier(0.33, 1, 0.68, 1)",
          transform: `rotate(${rotation}deg)`,
        }}>
        {/* Define a linear gradient for the center */}
        <defs>
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(233,227,103)" />
            <stop offset="100%" stopColor="rgb(243,189,39)" />
          </linearGradient>
        </defs>

        {/* Wheel outline */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 20}
          fill="none"
          stroke="rgb(243, 189, 39)"
          strokeWidth="10"
        />

        {sectors.map((sector, index) => {
          const startAngle = index * anglePerSector;
          const endAngle = startAngle + anglePerSector;
          const largeArcFlag = anglePerSector > 180 ? 1 : 0;

          const start = getCoordinatesForAngle(startAngle);
          const end = getCoordinatesForAngle(endAngle);

          // Arc description
          const pathData = [
            `M ${size / 2} ${size / 2}`, // Moving to the center
            `L ${start.x} ${start.y}`, // Line to the beginning of the sector
            `A ${size / 2 - 20} ${size / 2 - 20} 0 ${largeArcFlag} 1 ${end.x} ${
              end.y
            }`, // Arc
            "Z", // Path closure
          ].join(" ");

          // Calculate the average angle for text placement
          const midAngle = startAngle + anglePerSector / 2;
          const textRadius = (size / 2 - 40) * 0.6; // Distance from center to text

          const textX =
            size / 2 + textRadius * Math.cos((midAngle * Math.PI) / 180);
          const textY =
            size / 2 + textRadius * Math.sin((midAngle * Math.PI) / 180);

          // Define sector and text color
          const sectorColor = index % 2 ? "#FFFFFF" : "#FF0000"; // White and red
          const textColor = index % 2 ? "#FF0000" : "#FFFFFF"; // Opposite color

          return (
            <g key={index}>
              <path
                d={pathData}
                fill={sectorColor}
                stroke="#000"
                strokeWidth="1"
              />
              <text
                x={textX + 10}
                y={textY}
                fill={textColor}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midAngle} ${textX} ${textY})`}>
                {sector.value}
              </text>
            </g>
          );
        })}

        {/* Wheel center with linear gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="20"
          fill="url(#centerGradient)"
          stroke="#000"
          strokeWidth="2"
        />
      </svg>
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        style={{ cursor: isSpinning ? "wait" : "pointer" }}
        className="spin-button">
        SPIN!
      </button>

      {/* React Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Winning Modal"
        className="custom-modal"
        overlayClassName="custom-overlay">
        <h2>Congratulation!</h2>
        {selectedSector && <p>You won: {selectedSector.value}!</p>}
      </Modal>
    </div>
  );
};

export default Wheel;
