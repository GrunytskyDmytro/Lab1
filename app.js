const express = require('express')
const fetch = require("node-fetch")
const hbs = require('hbs')
const fs = require('fs')
const path = require('path')
let app = express()

app.set('view engine', 'hbs');

let citiesArr = []

const CitiesPath = path.join(__dirname, 'cities.json')
let data = JSON.parse(fs.readFileSync(CitiesPath, 'utf-8'))

data.forEach(city => {
    citiesArr.push(city.nameCity)
})

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/weather/:city', (req, res) => {
    hbs.registerPartials(__dirname + '/views/partials')
    let string = ''

    hbs.registerHelper("ListCities", (citiesArr) => {
        for (let i = 0; i < citiesArr.length; i++) {
            string += `<a href="/weather/${citiesArr[i]}" class="list-group-item list-group-item-action">${citiesArr[i]}</a>`
        }
        return new hbs.SafeString(`${string}`)
    })

    let city = req.params.city
    let apiKey = '5f51fcb7c4a8b13e38a9fecc27631255'
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const InfoCity = {
                nameCity: `${city}`,
                pressure: `${data.main.pressure}`,
                humidity: `${data.main.humidity}`,
                temperature: `${Math.round(data.main.temp - 273)}`,
                icon: `${data.weather[0].icon}`
            }
            //console.log(data)
            //console.log(InfoCity)
            const AllCities = {
                Cities: citiesArr
            }
            res.render('weather.hbs', {InfoCity, AllCities})
        })
})

app.listen(3000, () => {
    console.log("Example app listening on port 3000")
})


// request(
//     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5f51fcb7c4a8b13e38a9fecc27631255`,
//     function(err, response, body)  {
//         let data = JSON.parse(body)
//         const InfoCity = {
//             //NameCity:`${city}`,
//             Pressure:`${data.main[0].pressure}`,
//             Humidity:`${data.main[0].humidity}`,
//             Temperature:`${data.main[0].temp}`
//         }
//         if(response.statusCode === 200) {
//             res.send(`Місто:Тиск:${InfoCity.Pressure}`)
//         }
//     })

//res.render('weather.hbs', {InfoCity});

