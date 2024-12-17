import React from 'react';
import GaugeChart from 'react-gauge-chart';

const Gauge = ({ value }) => {
  return (
    <GaugeChart 
      id="gauge-chart" 
      nrOfLevels={20} 
      percent={value} 
      arcWidth={0.3} 
      textColor="#000000"
    />
  );
};

export default Gauge;
