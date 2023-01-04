
const searchInput = document.querySelector(".search-input")

                                                                //=== CLOCK ===
const hourEl = document.getElementById("hour");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const amEl = document.getElementById("am");

function updateClock() {
    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();
    let am = "AM";
    
    if (h > 12) {
        h = h - 12;
        am = "PM";
    };
    
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    
    hourEl.innerText = h;
    minutesEl.innerText = m;
    secondsEl.innerText = s;
    amEl, (innerText = am);
    setTimeout(() => {
        updateClock();
    }, 1000)
}
updateClock();
                                                 // ===SEARCHED===

function searched() {
    const search = document.querySelector(".search-input")
    const historyList = document.querySelector(".history")
    const searchedBtn = document.querySelector(".searchedBtn")
    let clicked = false
    
    const li = document.createElement("li")
    li.className = "search-list"
    li.textContent = search.value
    historyList.appendChild(li)
   
    
    li.addEventListener("click", () => {
        search.value = li.textContent
        weather.search(search.value)
        fetchEvents()
    })
    
    li.addEventListener("dblclick", (e) => {
        e.preventDefault()
        li.remove()
    })

    searchedBtn.addEventListener("click", (e) => {
        e.preventDefault()
        clicked = !clicked
        clicked? historyList.classList.remove('loading') : historyList.classList.add('loading')
    })
}



                                                    // FETCH THE WEATHER 
let weather = {
   "apiKey": api_key,
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
   displayWeather: function (data) {
       const { name } = data
       const { icon, description } = data.weather[0]
       const { temp, humidity, feels_like, temp_min, temp_max } = data.main
       const { speed } = data.wind
      
       document.querySelector('.temp').textContent = temp + " °F"
       document.querySelector('.feels_like').textContent = "Feels like: " + feels_like
       document.querySelector('.temp_min').textContent = "High: " +temp_min + " °F"
       document.querySelector('.temp_max').textContent = "Low: " +temp_max + " °F"
       document.querySelector('.description').textContent = description
       document.querySelector('.humidity').textContent = "Humidity: " + humidity + "%"
       document.querySelector('.wind').textContent = "Wind speed: " + speed + " mph"
       document.querySelector('.content').classList.remove('loading')
       document.querySelector('.img1').style.backgroundImage = "url('https://source.unsplash.com/200x200/?" + name + "')"
       document.querySelector('.img2').style.backgroundImage = "url('https://source.unsplash.com/350x200/?" + name + "')"
       document.querySelector('.img3').style.backgroundImage = "url('https://source.unsplash.com/200x250/?" + name + "')"
       document.querySelector('.img4').style.backgroundImage = "url('https://source.unsplash.com/350x250/?" + name + "')"
     
   },
   search: function () {
       this.fetchWeather(document.querySelector('.search-input').value)
   }
}

const searchBtn = document.querySelector('.btn');
searchBtn.addEventListener('click', (e) => {
   e.preventDefault();
   weather.search()
   searched()
   fetchEvents()
})

document.querySelector('.search-input').addEventListener('keyup', (e) => {
   e.preventDefault();
   if (e.key === 'Enter') {
       weather.search()
       fetchEvents()
       searched()
   }
})
weather.fetchWeather()



                                                     // FETCH EVENTS  



const eventBox = document.querySelector(".events")
const categoryName = document.querySelector("#category")
                                        
function fetchEvents() {
        console.log(searchInput.value)
        eventBox.innerHTML = ""
        type = categoryName.value
        city = searchInput.value
                                                
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

                                                                              
function createBoxEvent(e) {
   
    const event = document.createElement("div")
    event.className = "event"
    eventBox.appendChild(event)
           
    const imgTitleTime = document.createElement("div")
    imgTitleTime.className = "img-title-date"
    event.appendChild(imgTitleTime)

    const buttonBox = document.createElement("div")
    buttonBox.className = "button-box"
    event.appendChild(buttonBox)

    const imgBox = document.createElement("img")
    imgBox.className = "imgBox"
    imgBox.src = e.performers[0].image
    imgTitleTime.appendChild(imgBox)
                                        
    const detailsBox = document.createElement("div")
    detailsBox.className = "detailsBox"
    imgTitleTime.appendChild(detailsBox)
                                        
    const title = document.createElement("div")
    title.className = "title"
    title.textContent = e.title
    detailsBox.appendChild(title)
                                        
                                        
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
                                        
   
    const purchaseBtn = document.createElement("button")
    purchaseBtn.className = "purchaseBtn"
    purchaseBtn.innerText = "Buy Tickets"
    event.appendChild(purchaseBtn)
                                        
    purchaseBtn.onclick = () => {
        window.open(e.url)
    }
}