const axios = require("axios");
const Weather = require("./models");

const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

const resolvers = {
  Query: {
    searchCities: async (_, { query }) => {
      try {
        const response = await axios.get(
          `${WEATHER_API_BASE_URL}/search.json`,
          {
            params: {
              key: process.env.WEATHER_API_KEY,
              q: query,
            },
          }
        );
        return response.data.map((city) => ({
          id: city.id,
          name: city.name,
          country: city.country,
        }));
      } catch (error) {
        console.error("Error searching cities:", error);
        throw new Error("Failed to search cities");
      }
    },

    getCurrentWeather: async (_, { cityId }) => {
      try {
        // Check for cached weather data
        let weatherRecord = await Weather.findOne({ cityId });

        // Return cached weather data if available and not older than 10 minutes
        // if (
        //   weatherRecord &&
        //   new Date() - weatherRecord.createdAt < 10 * 60 * 1000
        // ) {
        //   console.log("Returning cached current weather data");
        //   return weatherRecord;
        // }

        // Fetch new weather data from the API
        const response = await axios.get(
          `${WEATHER_API_BASE_URL}/forecast.json?key=${process.env.WEATHER_API_KEY}&q=id:${cityId}&days=3&aqi=no&alerts=no`
        );

        const weatherData = {
          current: response.data.current,
          location: response.data.location,
          forecast: response.data.forecast,
        };

        // If the document exists, update it
        if (weatherRecord) {
          weatherRecord.current = weatherData.current;
          weatherRecord.location = weatherData.location;
          weatherRecord.forecast = weatherData.forecast;
          weatherRecord.historical.push({
            last_updated: weatherData.current.last_updated,
            temp_c: weatherData.current.temp_c,
            wind_dir: weatherData.current.wind_dir,
            precip_mm: weatherData.current.precip_mm,
            humidity: weatherData.current.humidity,
            feelslike_c: weatherData.current.feelslike_c,
            uv: weatherData.current.uv,
          });
          weatherRecord.createdAt = new Date(); // Update the timestamp
          await weatherRecord.save();
        } else {
          // If no record exists, create a new one
          await Weather.create({
            cityId,
            current: weatherData.current,
            location: weatherData.location,
            forecast: weatherData.forecast,
            historical: [
              {
                last_updated: weatherData.current.last_updated,
                temp_c: weatherData.current.temp_c,
                wind_dir: weatherData.current.wind_dir,
                precip_mm: weatherData.current.precip_mm,
                humidity: weatherData.current.humidity,
                feelslike_c: weatherData.current.feelslike_c,
                uv: weatherData.current.uv,
              },
            ],
            createdAt: new Date(),
          });
        }

        // Return the updated weather data
        return weatherData;
      } catch (error) {
        console.error("Error fetching current weather:", error);
        throw new Error("Failed to fetch current weather");
      }
    },

    getHistoricalWeather: async (_, { cityId, from, to }) => {
      try {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const daysDiff = (toDate - fromDate) / (1000 * 60 * 60 * 24);

        // Check if the date range exceeds 30 days
        if (daysDiff > 30) {
          throw new Error("Date range cannot exceed 30 days");
        }

        // Fetch the cached weather data for the city
        const cachedWeather = await Weather.findOne({ cityId });

        // If cached weather exists and historical data is available
        if (cachedWeather && cachedWeather.historical.length > 0) {
          // Filter historical data for the specific date range
          const filteredHistorical = cachedWeather.historical.filter(
            (entry) => {
              const entryDate = new Date(entry.last_updated);
              return entryDate >= fromDate && entryDate <= toDate;
            }
          );

          // If filtered historical data is found, return it
          if (filteredHistorical.length > 0) {
            console.log("Returning cached historical weather data");
            return filteredHistorical;
          }
        }

        // Fetch new historical weather data from the API
        const response = await axios.get(
          `${WEATHER_API_BASE_URL}/history.json`,
          {
            params: {
              key: process.env.WEATHER_API_KEY,
              q: cityId,
              dt: from,
              end_dt: to,
            },
          }
        );

        // Map the response data to match the expected structure
        const historicalData = response.data.forecast.forecastday.map(
          (day) => ({
            last_updated: day.date,
            temp_c: day.day.avgtemp_c,
            wind_dir: day.day.maxwind_kph,
            precip_mm: day.day.totalprecip_mm,
            humidity: day.day.avghumidity,
            feelslike_c: day.day.avgtemp_c,
            uv: day.day.uv,
          })
        );

        // If cached weather exists, update historical data
        if (cachedWeather) {
          // Ensure historical data is unique based on last_updated
          historicalData.forEach((newEntry) => {
            if (
              !cachedWeather.historical.some(
                (entry) => entry.last_updated === newEntry.last_updated
              )
            ) {
              cachedWeather.historical.push(newEntry);
            }
          });
          await cachedWeather.save(); // Save updated historical data
        }

        return historicalData; // Return the new historical data
      } catch (error) {
        console.error("Error fetching historical weather:", error);
        throw new Error("Failed to fetch historical weather");
      }
    },
  },
};

module.exports = resolvers;
