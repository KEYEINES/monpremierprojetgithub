function getWeatherLocation() {
	return {
  	officeId: "SEW",
    gridX: 124,
    gridY: 67
  };
}

async function getWeather(officeId, gridX, gridY) {
	const apiUrl = `https://api.weather.gov/gridpoints/${officeId}/${gridX},${gridY}/forecast`;
	const resp = await fetch(apiUrl);
	return await resp.json();
}

function App() {
	const [weatherPeriods, setWeatherPeriods] = React.useState([]);
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date().toLocaleTimeString());
  
  const refreshWeather = React.useCallback(async () => {
  	const { officeId, gridX, gridY } = getWeatherLocation();
  	const weather = await getWeather(officeId, gridX, gridY);
   	setWeatherPeriods(weather.properties.periods);
    setLastRefreshed(new Date().toLocaleTimeString());
  });
  
	React.useEffect(() => {
    
    let timeout = null;
    const update = async () => {
    	await refreshWeather();
      timeout = setTimeout(update, 5000);
    };
    
    update();
    
    return () => timeout && clearTimeout(timeout);
    
  }, []);
  
	return (<div class="appContainer">
    <div><b>Last updated: </b> {lastRefreshed}</div>
    {weatherPeriods.map(period => <WeatherTile key={period.number} {...period} />)}
    </div>);
}

function AppBasic() {
	const [weatherPeriods, setWeatherPeriods] = React.useState([]);
  

  
	React.useEffect(() => {
     const refreshWeather = React.useCallback(async () => {
        const resp = await fetch(`https://api.weather.gov/gridpoints/SEW/124,67/forecast`);
        const weather = await resp.json();
        setWeatherPeriods(weather.properties.periods);
    });
    refreshWeather()
      .catch(console.error);
  }, []);
  
	return (<div class="appContainer">
    {weatherPeriods.map(period => <WeatherTile key={period.number} {...period} />)}
    </div>);
}

function WeatherTile(props) {
	return (
  	<div class="weatherTile">
      <img src={props.icon} />
	    <div class="weatherInfo">
      <div><b>Temperature:</b> {props.temperature}°{props.temperatureUnit}</div>
        <div>{props.shortForecast}</div>
      </div>
	  </div>
  );
}

const container= document.getElementById("container");
ReactDOM.render(<App />, container);