const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type City {
    id: ID!
    name: String!
    country: String!
  }

  type Location {
    name: String
    region: String
    country: String
    lat: Float
    lon: Float
    tz_id: String
    localtime_epoch: Int
    localtime: String
  }

  type Condition {
    text: String
    code: Int
    icon: String
  }

  type CurrentWeather {
    last_updated: String
    temp_c: Float
    condition: Condition
    wind_dir: String
    precip_mm: Float
    humidity: Int
    feelslike_c: Float
    uv: Int
  }

  type DayForecast {
    date: String
    day: DayDetails
  }

  type DayDetails {
    maxtemp_c: Float
    mintemp_c: Float
    condition: Condition
  }

  type Forecast {
    forecastday: [DayForecast]
  }

  type WeatherData {
    location: Location
    current: CurrentWeather
    forecast: Forecast
  }

  type Query {
    weather: WeatherData
  }

  type HistoricalWeather {
    date: String!
    temperature: Float!
    description: String!
  }

  type Query {
    searchCities(query: String!): [City]!
    getCurrentWeather(cityId: ID!): WeatherData!
    getHistoricalWeather(
      cityId: ID!
      from: String!
      to: String!
    ): [HistoricalWeather]!
  }
`;

module.exports = typeDefs;
