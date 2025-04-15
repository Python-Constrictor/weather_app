import "./style.css"
import {getweather} from "./weather.js"
import {ICON_MAP} from "./iconmap.js"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)
function positionSuccess(position){
    getweather(position.coords.latitude,position.coords.longitude,Intl.DateTimeFormat().resolvedOptions().timezone).then(renderWeather).catch(e => {
        console.error(e);
        alert(e);
    })
}
function positionError(){
    alert("we couldn't find you")
}

function renderWeather({current,daily,hourly}) {
    renderCurrentWeather(current),
    renderDailyWeather(daily),
    renderHourlyWeather(hourly),
    changePageHue(current),
    document.body.classList.remove("blurred")
}

function setValue(selector, value, {parent = document} = {}){
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconcode){
    return `${import.meta.env.BASE_URL}/icons/${ICON_MAP.get(iconcode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current){
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-high", current.highTemp)
    setValue("current-low", current.lowTemp)
    setValue("current-fl-high", current.highFeelsLike)
    setValue("current-fl-low", current.lowFeelsLike)
    setValue("current-wind", current.windSpeed)
    setValue("current-precipitation", current.precip)

}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday: "long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily){
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        setValue("temp", day.maxTemp, {parent: element})
        setValue("day", DAY_FORMATTER.format(day.timestamp), {parent: element})
        setValue("precip", day.precipitation, {parent: element})
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    })
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric", hour12: true})
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly){
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp, {parent: element})
        setValue("fl-temp", hour.feelsLike, {parent: element})
        setValue("wind", hour.windSpeed, {parent: element})
        setValue("precip", hour.precip, {parent: element})
        setValue("precip-chance", hour.precip_chance, {parent: element})
        setValue("day", DAY_FORMATTER.format(hour.timestamp), {parent: element})
        setValue("time", HOUR_FORMATTER.format(hour.timestamp), {parent: element})
        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    })
}

function changePageHue(current){
    let hue;
    let iconCode = current.iconCode;
    //if(iconCode == 0 || iconCode == 1 || iconCode == 2 || iconCode == 3) hue = 40;
    //else hue = 200;
    hue = 40;
    document.documentElement.style.setProperty('--pageHue', hue);
    document.documentElement.style.setProperty('--iconHue', `${(360-200)+hue}deg`);
    return hue;
}