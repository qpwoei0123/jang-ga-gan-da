import type { CSSProperties } from "react";

// All speech starts at the dog's centre and uses the same bounded flight.
export function speechFlight(): CSSProperties {
  const angle=(20+Math.random()*20)*Math.PI/180;
  const distance=80+Math.random()*20;
  const x=-Math.cos(angle)*distance, y=-Math.sin(angle)*distance;
  const flutter=(Math.random()<.5?-1:1)*2;
  return {
    '--flight-x':`${x}px`, '--flight-y':`${y}px`,
    '--flight-mid-x':`${x*.48}px`, '--flight-mid-y':`${y*.48+flutter}px`,
    '--flight-late-x':`${x*.76}px`, '--flight-late-y':`${y*.76-flutter}px`,
    '--flutter':`${flutter}deg`,
  } as CSSProperties;
}
