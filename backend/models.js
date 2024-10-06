const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  cityId: {
    type: String,
    required: true,
    unique: true, // Ensure cityId is unique
  },
  current: {
    last_updated: String,
    temp_c: Number,
    condition: {
      text: String,
      code: Number,
    },
    wind_dir: String,
    precip_mm: Number,
    humidity: Number,
    feelslike_c: Number,
    uv: Number,
  },
  location: {
    name: String,
    region: String,
    country: String,
    lat: Number,
    lon: Number,
    tz_id: String,
    localtime_epoch: Number,
    localtime: String,
  },
  forecast: {
    forecastday: [
      {
        date: String,
        day: {
          maxtemp_c: Number,
          mintemp_c: Number,
          condition: {
            text: String,
            code: Number,
          },
        },
      },
    ],
  },
  historical: [
    {
      last_updated: String,
      temp_c: Number,
      wind_dir: String,
      precip_mm: Number,
      humidity: Number,
      feelslike_c: Number,
      uv: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;
