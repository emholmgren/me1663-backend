// Imports
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express(); // Create Express app
app.use(cors()); // Enable integration with React application

// Endpoint to fetch weather data
app.get("/api/weather", async (req, res) => {

    // Prepare coordinates
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitud och longitud krävs" });
    }

    // Get weather data
    try {
        const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude: lat,
                longitude: lon,
                current_weather: true,
            },
        });

        const weatherData = response.data.current_weather;

        res.json({
            temperature: weatherData.temperature, // Temperature
            weatherCode: weatherData.weathercode, // Weather description
        });

        console.log(`API-response from Open Meteo - Temperature: ${weatherData.temperature}, Weather Code: ${weatherData.weathercode}`);

    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta väderdata" });
    }
});

// Endpoint to fetch location name
app.get('/api/geocode', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat,
                lon,
                format: 'json',
                addressdetails: 1, // Hämtar detaljerad information
                accept_language: 'sv', // Svenska språket för platsnamn
            },
        });

        const address = response.data.address;
        const location = 
            address.city || address.town || address.village || "Okänd plats";
        res.json({ location });
    } catch (error) {
        console.error("Geokodning misslyckades:", error);
        res.status(500).send("Kunde inte hämta platsnamn.");
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Servern kör på port ${PORT}`));
