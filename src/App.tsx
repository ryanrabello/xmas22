import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Ragdolls } from "./ragdoll";

function App() {
  const ragRef = useRef<Ragdolls>();

  // useEffect(() => () => ragRef.current?.stop(), []);

  return (
    <div
      ref={(el) => {
        if (el && !ragRef.current) {
          ragRef.current = new Ragdolls(el);
        }
      }}
    />
  );
}

export default App;
