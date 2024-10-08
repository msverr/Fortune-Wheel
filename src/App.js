import "./App.css";
import Wheel from "./components/Wheel";
import { sectors } from "./api/data";
import { useState, useEffect } from "react";

function App() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="center">
      <div>
        <Wheel sectors={sectors} size={400} screenWidth={screenWidth} />
      </div>
    </div>
  );
}

export default App;
