export const ICON_MAP = new Map()

addMapping([0,1,2], "sun")
addMapping([3], "cloud-sun")
addMapping([4,5,19], "cloud")
addMapping([40,41,42,43,44,45,46,47,48,49], "smog")
addMapping([51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99], "cloud-showers-heavy")
addMapping([71,72,73,74,75,76,77,78,79], "snowflake")
addMapping([95,96,97,98,99], "cloud-bolt");

function addMapping(values,icon){
    values.forEach(value =>{
        ICON_MAP.set(value,icon)
    })
}