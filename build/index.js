let btnSubmit = document.getElementById("btn-submit");
const KEY_API = "e764d3c4a1ea30c95aaea83beea1d309";
const API_ROOT = "https://id3treedecisive.herokuapp.com/id3"
const API_EXAMPLE = `https://api.openweathermap.org/data/2.5/weather?id=${1581129}&lang=vi&appid=${KEY_API}`

async function callAPI(ID) {
  const API = `https://api.openweathermap.org/data/2.5/weather?id=${ID}&lang=vi&appid=${KEY_API}`
  if(window.fetch) {
    try {
      const res = await window.fetch(API, {
        method: "GET"
      })
      const response = await res.json();

      return {
        coord: response.coord,
        weather: response.weather,
        main: response.main,
        wind: response.wind,
        clouds: response.clouds,
        name: response.name,
        id: response.id
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    alert("Not support fetch API")
    return false
  }
}

const dataCity = {
  HN: {
    id: 1581129,
    name: "Thủ Ðô Hà Nội",
    state: "",
    country: "VN",
    coord: {
      lon: "105.883331",
      lat: "21.116671"
    }
  },
  DN: {
    id: 1905468,
    name: "Tỉnh Ðà Nẵng",
    state: "",
    country: "VN",
    coord: {
      lon: "108.083328",
      lat: "16.08333"
    }
  },
  HCM: {
    id: 1580578,
    name: "Thành phố Hồ Chí Minh",
    state: "",
    country: "VN",
    coord: {
      lon: "106.666672",
      lat: "10.83333"
    }
  }
}

const nameCity = document.getElementById("name-city")
const nameCityLocation = document.getElementById("name-city__location")
const minMax = document.getElementById("min-max")
const weatherStatus = document.getElementById("weather-status")
const tocDoGio = document.getElementById("toc-do-gio")
const doAm = document.getElementById("do-am")
const nhietDo = document.getElementById("nhiet-do")
const imgIcon = document.getElementById("image-icon")

const resultReview = document.getElementById("result-review")
const clickNo = document.getElementById("click-no")
const clickYes = document.getElementById("click-yes")
clickNo.onclick = () => reviewByUser("no")
clickYes.onclick = () => reviewByUser("yes")

async function reviewByUser(idea) {
  const API_REVIEW = API_ROOT
  try {
    if(window.fetch) {
      let spanData = document.getElementById("my-data");
      const data = await callAPI(spanData.innerHTML)

      const body = getBody(data)

      const response = await window.fetch(API_REVIEW, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outlook: body.outlook,
          temp: body.temp,
          wind: body.wind,
          date: body.date,
          decisive: idea
        })
      })

      const res = await response.json()

      if (res) {
        alert(`ĐÁNH GIÁ "${idea.toUpperCase()}" THÀNH CÔNG`)
      } else {
        alert("Ơ ĐÃ CÓ MỘT LỖI GÌ ĐÓ XẢY RA")
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function handleSubmit() {
  try {
    if(window.fetch) {
      let spanData = document.getElementById("my-data");
      const data = await callAPI(spanData.innerHTML)

      const body = getBody(data)

      const API_REVIEW = `${API_ROOT}?wind=${body.wind}&outlook=${body.outlook}&date=${body.date}&temp=${parseInt(body.temp)}`

      const response = await window.fetch(API_REVIEW, { method: "GET" })
      const res = await response.json()
      resultReview.innerHTML = (res.message == "yes") ? "Nên đi xem phim" : "Không nên đi xem phim"
      resultReview.className = (res.message == "yes") ? "btn btn-success" : "btn btn-danger"
    }
  } catch (error) {
    console.log(error)
  }
}

function getBody(data) {
  nameCity.innerHTML = getName(data.id)
  nameCityLocation.innerHTML = `${getNameLocation(data.id)} (${data.coord.lat}, ${data.coord.lon})`
  minMax.innerHTML = `${(data.main.feels_like - 273.15).toFixed(2)} (°C)`
  weatherStatus.innerHTML = data.weather[0].description
  tocDoGio.innerHTML = data.wind.speed
  doAm.innerHTML = data.clouds.all
  nhietDo.innerHTML = (data.main.temp - 273.15).toFixed(2)
  imgIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

  let outlook = getOutlook(data.weather[0].icon)
  let temp = parseInt(data.main.temp - 273.15)
  let wind = (data.wind.speed > 2)? true : false
  let date = getDay()

  return {
    outlook,
    temp,
    wind,
    date
  }
}

btnSubmit.onclick = handleSubmit;

handleSubmit()

function getName(id) {
  let result = "Hà Nội"

  switch (id) {
    case 1581129:
      result = "Thủ đô Hà Nội"
      break
    case 1905468:
      result = "Thành phố Đà Nẵng"
      break
    case 1580578:
      result = "Thành phố Hồ Chí Minh"
      break
    default:
      break;
  }

  return result
}

function getNameLocation(id) {
  let result = "Hà Nội"

  switch (id) {
    case 1581129:
      result =  "Hà Nội"
      break
    case 1905468:
      result = "Đà Nẵng"
      break
    case 1580578:
      result = "Hồ Chí Minh"
      break
    default:
      break;
  }

  return result
}

function getOutlook(key) {
  let result = "rain"

  switch (key) {
    case "01d":
    case "01n":
    case "02d":
    case "02n":
      result = "sunny"
      break;
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      result = "overcast"
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
    case "11d":
    case "11n":
      result = "rainy"
      break;
  
    default:
      break;
  }

  return result
}

function setDate() {
  let dateObj = new Date();
  const date = document.getElementById("date")
  
  let myDate = (dateObj.getUTCFullYear()) + "/" + (dateObj.getMonth() + 1)+ "/" + (dateObj.getUTCDate());
  date.innerHTML = myDate + " 00:00"
}
setDate();

function getDay() {
  const day = new Date().getDay();
  let result = "weekend"

  switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      result = "midweek"
      break;
    default:
      result = "weekend"
      break;
  }

  return result;
}