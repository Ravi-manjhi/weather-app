# Weather App

## Task Description
This project is a mobile-friendly weather application that fetches real-time weather data from the **OpenWeatherMap API** and displays it in a user-friendly interface. Additionally, it stores weather data in a database and allows users to filter historical weather data by location and date.

### Features:
1. **Fetch Weather Data**: Get current weather data from WeatherAPI.
2. **Responsive UI**: A clean, mobile-friendly interface.
3. **Weather Information Display**: Shows current temperature, weather description, and a relevant weather icon.
4. **Error Handling**: Graceful handling of network request errors.
5. **Historical Data Storage**: Store and filter weather data by date range (max 30 days) and location (Delhi, Moscow, Paris, New York, Sydney, Riyadh).
6. **Validations**: Date range restricted to a maximum of 30 days.
7. **Backend API**: Implemented with Node.js and GraphQL.
8. **Database**: Uses MongoDB/PostgreSQL for data storage.

## Technologies Used:
- **Backend**: Node.js, GraphQL
- **Frontend**: Vue.js, Tailwind CSS
- **Database**: MongoDB/PostgreSQL
- **Weather API**: OpenWeatherMap API

## Setup Instructions:

1. **Clone the Repository**:
    ```bash
    git clone [repository-link]
    cd [repository-name]
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Environment Variables**:
   - Create a `.env` file in the root of the project with your OpenWeatherMap API key:
     ```
     VUE_APP_WEATHER_API_KEY=your_api_key
     ```

4. **Run the Backend**:
    ```bash
    node server.js
    ```

5. **Run the Frontend**:
    ```bash
    npm run serve
    ```

6. **Database Setup**:
    - Make sure you have either MongoDB or PostgreSQL installed and running.
    - Update the database connection string in the `config` file.

7. **Access the App**:
    - Open your browser and visit: `http://localhost:8080`

## Additional Comments:
- The app is designed to be mobile-responsive.
- Historical data can be filtered by date and location.
- Date range validation ensures a maximum of 30 days for better performance.


## Notes:
- Please ensure you have signed up for a free API key from OpenWeatherMap to run the application.

---

You can modify the placeholders such as `[repository-link]`, `[repository-name]`, and `demo-link` with your actual project details.
