import React from 'react';

import cat_img_on from './../cat_on.png';
import cat_img_off from './../cat_off.png';

interface BatteryLevelIndicatorProps {
  level: number;
  threshold: number;
}

const PercentageLevelIndicator: React.FC<BatteryLevelIndicatorProps> = ({ level, threshold }) => {
  // const batteryContainerStyle: React.CSSProperties = {
  //   // width: '100%',
  //   border: '1px solid gray',
  //   borderRadius: '5px',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#3a3a3e',
  //   padding: "0.1rem",
  //   minWidth: '3.5rem', // set the minimum width to the width of the text element plus padding
  //   maxHeight: "3rem"
  // };

  // const batteryLevelStyle: React.CSSProperties = {
  //   width: `${level}%`,
  //   // Map battery color ranging from not too bright green to red passing by yellowish
  //   backgroundColor: `rgb(${255 - 2.55 * level}, ${2.55 * level * 0.8}, 0)`,
  //   borderRadius: '2.5px',
  //   // Apply a smooth animation effect when the width changes
  //   transition: 'all 0.5s ease',
  //   alignItems: 'left',
  //   justifyContent: 'center',
  //   // maxHeight: "100%",
  // };

  // const batteryTextStyle: React.CSSProperties = {
  //   fontSize: '1rem',
  //   fontWeight: 'bold',
  //   color: '#fff',
  //   textAlign: 'center',
  //   verticalAlign: "center",
  //   padding: "0.5rem",
  // };

  // const catImageStyle: React.CSSProperties = {
    
  // }
  
  if (level > threshold) {
    var cat_img = <img src={cat_img_on} />;
  }
  else {
    var cat_img = <img src={cat_img_off} />;
  }
  
  
  return (
    <div style={{ padding: "1rem", borderRadius: "0.5rem" }}>
      {cat_img}

      <p>Level: {(level).toFixed(2)}</p>  
      <p>Threshold: {(threshold).toFixed(2)}</p>  
    </div>
  );
};

export default PercentageLevelIndicator;