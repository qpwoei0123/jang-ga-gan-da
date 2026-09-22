import type { CSSProperties } from "react";

// All speech starts at the dog's centre and uses the same bounded flight.
export function speechFlight(): CSSProperties {
  const angle=(20+Math.random()*20)*Math.PI/180;
  const distance=80+Math.random()*20;
  const x=-Math.cos(angle)*distance, y=-Math.sin(angle)*distance;
  return {
    '--flight-x':`${x}px`, '--flight-y':`${y}px`,

  } as CSSProperties;
}
