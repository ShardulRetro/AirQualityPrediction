import React from 'react';
import { Box, Card, CardContent, Typography, Grid ,LinearProgress} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

function HVACRecommendation () {
  const airQualityData = [
    { time: '8:00 AM', PM2_5: 35, CO: 0.4, NO2: 22, recommendation: 'Increase Ventilation', energyUsage: 10, ventilationLevel: 40 },
    { time: '10:00 AM', PM2_5: 45, CO: 0.5, NO2: 30, recommendation: 'Run air purifier', energyUsage: 15, ventilationLevel: 60 },
    { time: '12:00 PM', PM2_5: 50, CO: 0.6, NO2: 28, recommendation: 'Decrease Ventilation', energyUsage: 18, ventilationLevel: 30 },
    { time: '2:00 PM', PM2_5: 55, CO: 0.7, NO2: 35, recommendation: 'Run air conditioner', energyUsage: 22, ventilationLevel: 70 },
    { time: '4:00 PM', PM2_5: 60, CO: 0.9, NO2: 40, recommendation: 'Run air purifier', energyUsage: 25, ventilationLevel: 50 },
    { time: '6:00 PM', PM2_5: 65, CO: 1.1, NO2: 45, recommendation: 'Turn on HVAC system at full power', energyUsage: 30, ventilationLevel: 80 }
  ];

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        HVAC System Optimization Based on Air Quality
      </Typography>
      
      <Grid container spacing={3}>
        {/* Air Quality Line Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Air Quality Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={airQualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'Concentration', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'PM2_5') return [`${value} µg/m³`, 'PM2.5'];
                    if (name === 'CO') return [`${value} ppm`, 'CO'];
                    if (name === 'NO2') return [`${value} ppb`, 'NO2'];
                    return value;
                  }} />
                  <Legend />
                  <Line type="monotone" dataKey="PM2_5" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="CO" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="NO2" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Energy Usage and Ventilation Levels */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Energy Usage and Ventilation Levels
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={airQualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'energyUsage') return [`${value} kWh`, 'Energy Usage'];
                    if (name === 'ventilationLevel') return [`${value}%`, 'Ventilation Level'];
                    return value;
                  }} />
                  <Legend />
                  <Bar dataKey="energyUsage" fill="#8884d8" />
                  <Bar dataKey="ventilationLevel" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                HVAC Recommendations
              </Typography>
              <Box>
                {airQualityData.map((data, index) => (
                  <Box key={index} sx={{ marginBottom: '16px' }}>
                    <Typography variant="body1">
                      <strong>Time:</strong> {data.time}
                    </Typography>
                    <Typography variant="body1">
                      <strong>PM2.5:</strong> {data.PM2_5} µg/m³
                    </Typography>
                    <Typography variant="body1">
                      <strong>CO:</strong> {data.CO} ppm
                    </Typography>
                    <Typography variant="body1">
                      <strong>NO2:</strong> {data.NO2} ppb
                    </Typography>
                    <Typography variant="body1">
                      <strong>Recommendation:</strong> {data.recommendation}
                    </Typography>
                    <hr />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Efficiency and Performance */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Efficiency and Performance
              </Typography>
              <Box sx={{ padding: '10px' }}>
                <Typography variant="body2">
                  <strong>Current Energy Efficiency:</strong> 80%
                </Typography>
                <LinearProgress variant="determinate" value={80} />
              </Box>
              <Box sx={{ padding: '10px' }}>
                <Typography variant="body2">
                  <strong>Cooling Performance:</strong> 70%
                </Typography>
                <LinearProgress variant="determinate" value={70} />
              </Box>
              <Box sx={{ padding: '10px' }}>
                <Typography variant="body2">
                  <strong>Ventilation Efficiency:</strong> 60%
                </Typography>
                <LinearProgress variant="determinate" value={60} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HVACRecommendation;
