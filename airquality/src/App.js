// App.js

import React from 'react';
import { Container } from '@mui/material';
import HVACRecommendation from './HVACRecommendation';
import MapComponent from "./MapComponent";
function App() {  return (
    <Container maxWidth="lg">
      <MapComponent/>
    </Container>
  );
}

export default App;
