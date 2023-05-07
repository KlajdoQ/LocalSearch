
const searchInput = document.querySelector(".search-input")

/******************************
 *     CLOCK                  *
 * ***************************/

// Get the clock elements from the HTML document
const hourEl = document.getElementById("hour")
const minutesEl = document.getElementById("minutes")
const secondsEl = document.getElementById("seconds")
const amEl = document.getElementById("am")


function updateClock() {
      // Get the current time
    let h = new Date().getHours()
    let m = new Date().getMinutes()
    let s = new Date().getSeconds()
    let am = "AM"
    console.log()
      // Convert the hours to 12-hour format
    if (h > 12) {
        h = h - 12
        amEl.textContent = "PM"
    };
    
      // Add leading zeros to the hours, minutes and seconds
    h = h < 10 ? "0" + h : h
    m = m < 10 ? "0" + m : m
    s = s < 10 ? "0" + s : s
    
      // Update the clock elements with the current time
    hourEl.innerText = h
    minutesEl.innerText = m
    secondsEl.innerText = s
    amEl, (innerText = am)

      // Call the function after 1 second
    setTimeout(() => {
        updateClock()
    }, 1000)
}
updateClock()

/******************************
 *     SEARCHED BUTTON        *
 * ***************************/
function searched() {
      // Get the search input element
    const search = document.querySelector(".search-input")
      // Get the history list element
    const historyList = document.querySelector(".history")
      // Get the searched button element
    const searchedBtn = document.querySelector(".searchedBtn")

    let clicked = false
    
      // Create a list element to display the search history
    const li = document.createElement("li")
    li.className = "search-list"
    li.textContent = search.value
    historyList.appendChild(li)
   
      // Add a click event listener to the list element
    li.addEventListener("click", () => {
            // Set the search input value to the clicked list element text content
        search.value = li.textContent
            // Call the weather search function and pass the input value as a parameter
        weather.search(search.value)
        fetchEvents()
    })
    
      // Add an event listener to the list element so it removes the list when double-clicking
    li.addEventListener("dblclick", (e) => {
        e.preventDefault()
        li.remove()
    })

      // Add a click event listener to the searched button so it shows the searches when clicked
    searchedBtn.addEventListener("click", (e) => {
        e.preventDefault()
        clicked = !clicked
        clicked? historyList.classList.remove('loading') : historyList.classList.add('loading')
    })
}

/******************************
 *     FETCH WEATHER          *
 * ***************************/
let weather = {
   "apiKey": api_key,
     // Fetch weather data from API for a given city
   fetchWeather: function (city) {
       fetch("https://api.openweathermap.org/data/2.5/weather?q="
           + city
           + "&units=imperial&appid="
           + this.apiKey)
           .then((response) => response.json())
           .then(data => {
               this.displayWeather(data);
           })
   },

     // Display weather data on the page
   displayWeather: function (data) {
       const { name } = data
       const { description } = data.weather[0]
       const { temp, humidity, feels_like, temp_min, temp_max } = data.main
       const { speed } = data.wind

          // Update weather information on the page
       document.querySelector('.temp').textContent = temp + " °F"
       document.querySelector('.feels_like').textContent = "Feels like: " + feels_like
       document.querySelector('.temp_min').textContent = "Low: " +temp_min + " °F"
       document.querySelector('.temp_max').textContent = "High: " +temp_max + " °F"
       document.querySelector('.description').textContent = description
       document.querySelector('.humidity').textContent = "Humidity: " + humidity + "%"
       document.querySelector('.wind').textContent = "Wind speed: " + speed + " mph"
       document.querySelector('.content').classList.remove('loading')

       // Load the images on the page
       document.querySelector('.img1').style.backgroundImage = "url('https://source.unsplash.com/200x200/?" + name + "')"
       document.querySelector('.img2').style.backgroundImage = "url('https://source.unsplash.com/350x200/?" + name + "')"
       document.querySelector('.img3').style.backgroundImage = "url('https://source.unsplash.com/200x250/?" + name + "')"
       document.querySelector('.img4').style.backgroundImage = "url('https://source.unsplash.com/350x250/?" + name + "')"
     
   },
     // Search for weather based on city name
   search: function () {
       this.fetchWeather(document.querySelector('.search-input').value)
   }
}

// Handle search button click to display events and weather on a particular city when clicked
const searchBtn = document.querySelector('.btn');
searchBtn.addEventListener('click', (e) => {
   e.preventDefault();
   if (searchBtn.value.trim().length > 0) {
     searched();
    }
  weather.search();
  fetchEvents();
})

// Update the function so the user can press 'Enter' to search 
document.querySelector('.search-input').addEventListener('keyup', (e) => {
   e.preventDefault();
   if (e.key === 'Enter') {
       weather.search()
       fetchEvents()
       searched()
   }
})
weather.fetchWeather()

/******************************
 *     FETCH EVENTS           *
 * ***************************/
const eventBox = document.querySelector(".events")
const categoryName = document.querySelector("#category")
  
// add event listener to the category dropdown
categoryName.addEventListener("change", () => {
  fetchEvents();
})

// fetch events based on the category and city name
function fetchEvents() {
        eventBox.innerHTML = ""
        type = categoryName.value
        city = searchInput.value

        // fetch events from the API                                       
        fetch(`https://api.seatgeek.com/2/events?per_page=6&type=${type}&venue.city=${city}&client_id=` + client_id)
        .then((response) => response.json())
        .then((event) => {
        let arr = event.events
        arr.forEach((event) => {
        createBoxEvent(event)
        searchInput.value = ""
     })
    })
}
 
// create event boxes
function createBoxEvent(e) {
   
    const event = document.createElement("div")
    event.className = "event"
    eventBox.appendChild(event)

      // create a div for image, title and date       
    const imgTitleTime = document.createElement("div")
    imgTitleTime.className = "img-title-date"
    event.appendChild(imgTitleTime)

     // create a div for the purchase button
    const buttonBox = document.createElement("div")
    buttonBox.className = "button-box"
    event.appendChild(buttonBox)

      // create an image for the event
    const imgBox = document.createElement("img")
    imgBox.className = "imgBox"
    imgBox.src = e.performers[0].image
    imgTitleTime.appendChild(imgBox)
    
      // create a div for the details of the event
    const detailsBox = document.createElement("div")
    detailsBox.className = "detailsBox"
    imgTitleTime.appendChild(detailsBox)

       // create a div for the title of the event                                   
    const title = document.createElement("div")
    title.className = "title"
    title.textContent = e.title
    detailsBox.appendChild(title)
     
      // create a div for the date of the event
    const date = document.createElement("div")
    date.className = "date"
    date.innerText = e.datetime_local
    let dateEl = new Date(e.datetime_local)
    let formatedDate = { 
        day:    '2-digit', 
        month:  '2-digit', 
        year:   'numeric',
        hour:   '2-digit', 
        minute: '2-digit',
        hour12: true 
    };
    let dateString = dateEl.toLocaleDateString('en-US', formatedDate)
    date.innerText = dateString
    detailsBox.appendChild(date)
     
      // create a button for purchasing tickets
    const purchaseBtn = document.createElement("button")
    purchaseBtn.className = "purchaseBtn"
    purchaseBtn.innerText = "Buy Tickets"
    event.appendChild(purchaseBtn)
    
      // open the event URL on button click
    purchaseBtn.onclick = () => {
        window.open(e.url)
    }
}