import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { Box, Paper, Typography, Button, IconButton, TextField, Autocomplete } from '@mui/material';
import Draggable from 'react-draggable';
import RadarChart from './RadarChart';
import StatCard from './StatCard';
import ArticleIcon from '@mui/icons-material/Article';
import axios from 'axios';

const MapComponent = () => {
    const [markers, setMarkers] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]);
    const [isCardVisible, setIsCardVisible] = useState(true);
    const featureGroupRef = useRef(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const markerIcon = L.icon({
        iconUrl: require('./marker.png'),
        iconSize: [64, 64],
        iconAnchor: [32, 64],
    });

    const fetchAirQuality = async (lat, lon) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lat, lon }),
            });
            const data = await response.json();
            console.log(data);
            setPredictions((prev) => ({
                ...prev,
                [`${lat},${lon}`]: data,
            }));
            setSelectedPrediction(data);
        } catch (error) {
            console.error('Error fetching air quality data:', error);
        }
    };

    const handleDrawCreated = (e) => {
        const { layerType, layer } = e;
        if (layerType === 'marker') {
            const { lat, lng } = layer.getLatLng();
            setMarkers((prevMarkers) => [...prevMarkers, { lat, lon: lng }]);
            fetchAirQuality(lat, lng).then(() => {
                // Option 2: Log the prediction for each marker here after fetching
                const prediction = predictions[`${lat},${lng}`];
                console.log(`Air Quality Prediction for [${lat}, ${lng}]:`, prediction);
            });
    
            layer.setIcon(markerIcon);
            setSelectedPrediction(null);
        }
    };

    const handleDrawDeleted = (e) => {
        const layers = e.layers;
        layers.eachLayer((layer) => {
            const { lat, lng } = layer.getLatLng();
            setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.lat !== lat || marker.lon !== lng));
        });
    };

    const clearMarkers = () => {
        setMarkers([]);
        setPredictions({});
        setSelectedPrediction(null);
        if (featureGroupRef.current) {
            featureGroupRef.current.clearLayers();
        }
    };

    const handleSearch = async (event) => {
        if (event.target.value) {
            setSearchInput(event.target.value);
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${event.target.value}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectLocation = (location) => {
        const { lat, lon } = location;
        setMapCenter([lat, lon]);
        fetchAirQuality(lat, lon);
        setSearchResults([]);
    };

    const mumbaiBounds = [
        [18.8900, 72.7750],
        [19.3000, 73.0000],
    ];

    return (
        <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0,
            overflow: "hidden"
        }}>
            <Box sx={{ position: 'absolute', zIndex: 1000, padding: '10px', background: 'white' }}>
                <Autocomplete
                    freeSolo
                    options={searchResults}
                    getOptionLabel={(option) => option.display_name}
                    onInputChange={handleSearch}
                    renderInput={(params) => (
                        <TextField {...params} label="Search location" variant="outlined" />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            handleSelectLocation(newValue);
                        }
                    }}
                />
            </Box>

            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
                maxBounds={mumbaiBounds}
                minZoom={13}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                        position="topright"
                        onCreated={handleDrawCreated}
                        onDeleted={handleDrawDeleted}
                        draw={{
                            rectangle: false,
                            polyline: false,
                            circle: false,
                            polygon: false,
                            marker: true
                        }}
                        edit={{
                            remove: true
                        }}
                    />
                    {markers.map((marker, index) => (
                        <Marker key={index} position={[marker.lat, marker.lon]} icon={markerIcon}>
                            <Popup>
                                <p>
                                    Lat: {marker.lat}, Lon: {marker.lon}
                                    <br />
                                    Air Quality Prediction: {predictions[`${marker.lat},${marker.lon}`]?.prediction || 'Loading...'}
                                </p>
                            </Popup>
                        </Marker>
                    ))}
                </FeatureGroup>
            </MapContainer>

            <IconButton
                variant="contained"
                onClick={() => setIsCardVisible(prev => !prev)}
                sx={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}
            >
                <ArticleIcon />
            </IconButton>

            {isCardVisible && selectedPrediction && (
                <Draggable>
                    <Paper
                        elevation={3}
                        sx={{
                            position: "absolute",
                            top: "70px",
                            right: "20px",
                            width: "250px",
                            padding: "16px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <RadarChart data={selectedPrediction} />
                        <Typography variant="h6" gutterBottom>
                            Air Quality Prediction
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography>PM2.5: {selectedPrediction["PM2.5"] ? selectedPrediction["PM2.5"].toFixed(2) : 'Loading...'}</Typography>
                                <Typography>NO: {selectedPrediction["NO"] ? selectedPrediction["NO"].toFixed(2) : 'Loading...'}</Typography>
                                <Typography>SO₂: {selectedPrediction["SO2"] ? selectedPrediction["SO2"].toFixed(2) : 'Loading...'}</Typography>
                                <Typography>Ozone: {selectedPrediction["Ozone"] ? selectedPrediction["Ozone"].toFixed(2) : 'Loading...'}</Typography>
                            </Box>
                            <Box>
                                <Typography>AQI: {selectedPrediction.AQI ? selectedPrediction.AQI.toFixed(2) : 'Loading...'}</Typography>
                                <Typography>PM10: {selectedPrediction["PM10"] ? selectedPrediction["PM10"].toFixed(2) : 'Loading...'}</Typography>
                                <Typography>CO: {selectedPrediction["CO"] ? selectedPrediction["CO"].toFixed(2) : 'Loading...'}</Typography>
                            </Box>
                        </Box>
                        <StatCard
                            title="Air Quality Status"
                            value={selectedPrediction.AQI ? selectedPrediction.AQI.toFixed(2) : 'Loading...'}
                            interval="Current"
                            trend={selectedPrediction.AQI > 100 ? 'down' : 'up'}
                            data={[...Array(7).keys()].map(i => Math.random() * 100)}
                        />
                        <Button variant="contained" onClick={clearMarkers}>Clear Markers</Button>
                    </Paper>
                </Draggable>
            )}
        </Box>
    );
};

export default MapComponent;
