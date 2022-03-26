const ICON_URL='http://openweathermap.org/img/wn/10d@2x.png'
window.onload=()=>{
    let loc=document.getElementById("location");
    let lat;
    let lon;
    if (navigator.geolocation) {
        arr=navigator.geolocation.getCurrentPosition(position=>{
            lat=position.coords.latitude;
            lon=position.coords.longitude;
            const API=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a67fcec1d1c5864bde8582e81af4e4ce`;
            const daily_data=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minute,hourly&appid=a67fcec1d1c5864bde8582e81af4e4ce`
            setMaindata(API);
            setDailyData(daily_data)
        })
    } 
}

function setMaindata(API){
    fetch(API)
            .then((response)=>response.json())
            .then((data)=>{
                let parent=document.getElementById("location");
                parent.classList.remove("hide");
                let backimg_path=getImage(data.weather[0].id);
                
                backimg=`linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),${backimg_path}`
                document.body.style.backgroundImage=backimg;
        
                setSearchColor(data.weather[0].id);

                let img_iconpath=getAnimatedSvg(data.weather[0].id)
                // let heading=document.createElement('h2');
                let heading=document.querySelector("#location h2");
                let celsius_temp=data.main.temp-273;
                celsius_temp=celsius_temp.toFixed(1);
                let place=data.name+", "+data.sys.country;
                heading.innerText=place;

                
                // let temp_section=document.createElement('div');
                let temp_section=parent.children[1];
                temp_section.innerHTML=`<span><img src=${img_iconpath}></span><span class="heading-temp">${celsius_temp} &#8451</span>
               <span>${data.weather[0].main}</span>`;

                let unixtime=data.dt*1000;
                let dateObject=new Date(unixtime);
                let hours=dateObject.getHours();
                let minutes=dateObject.getMinutes();
                if(dateObject.getHours()<10){
                    hours='0'+hours;
                }
                if(dateObject.getMinutes()<10)
                minutes='0'+minutes;
                let time='Updated as of :'+hours+':'+minutes;
                // let status=document.createElement('div');
                let status=parent.children[2];
                status.innerHTML=`<h3 >${time}</h3>`

                let feelslike=data.main.feels_like-273;
                feelslike=feelslike.toFixed(1)+"&#8451";
                let wind_speed=data.wind.speed+" mph";
                let visibility=(data.visibility)/1000;
                visibility=visibility+" Km";
                let humidity=data.main.humidity+'%';
                // let otherparams=document.createElement("div")
                let otherparams=parent.children[2];
                otherparams.setAttribute('id','box')
                otherparams.innerHTML=`<div class='other-params'>Feels Like ${feelslike}</div><div class='other-params'>Wind <i class="fa-solid fa-wind"></i> ${wind_speed}</div><div class='other-params'>Visibility ${visibility}</div>
                <div class='other-params'>Humidity ${humidity}</div>`
    
            })
}
async function searchData(){
    let searchValue=document.getElementById("search-text").value;
    const searchURL=`https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=a67fcec1d1c5864bde8582e81af4e4ce`
    setMaindata(searchURL);
       let response=await fetch(searchURL);
       let parsedResponse=await response.json();
       const lat=parsedResponse.coord.lat;
       const lon=parsedResponse.coord.lon;

       const daily_data=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minute,hourly&appid=a67fcec1d1c5864bde8582e81af4e4ce`;
       setDailyData(daily_data);

}

function setDailyData(daily_data){
    fetch(daily_data)
    .then((response)=>response.json())
    .then((data)=>{
        let data_daily=data['daily'];
        let count=1;
        document.getElementById("daily").classList.remove('hide');
        data_daily.forEach((daily_response)=>{
            let unixtime=daily_response.dt*1000;
            let dateObject=new Date(unixtime);
            let date=dateObject.getDate();
            let day=dateObject.getDay();
            day=getDay(day);
            let parent=document.querySelector(`#daily #p${count}`)
            parent.children[0].innerText=day+" "+date;
            
            
            let img_iconpath=getAnimatedSvg(daily_response.weather[0].id)
            parent.children[1].innerHTML=`<img src='${img_iconpath}'>`

            let max_temp=daily_response.temp.max-273;
            max_temp=max_temp.toFixed(1)
            let min_temp=daily_response.temp.min-273;
            min_temp=min_temp.toFixed(1)
            parent.children[2].innerHTML=`<span style="padding-right:10px;font-size:1.4em;">${max_temp}</span><span class="intensity">${min_temp}</span>`

            let desc=daily_response.weather[0].main;
            parent.children[3].innerText=desc;
            count++;

        })

    })
}

function setSearchColor(id){
    let search=document.querySelector(".search")
    let search_text=document.querySelector("#search-text")
    let search_bar=document.querySelector("#search-bar")

    let id_str=id.toString();
    let ch=id_str.charAt(0);
    let ch3=id_str.charAt(2);
    if(ch==='8' && ch3!=='0'){
        search.style.backgroundColor='#858585';
    search_text.style.backgroundColor='#bcbcbc'
    search_bar.style.backgroundColor='#bcbcbc'  
    }
else if(ch==='8' && ch3==='0'){
    search.style.backgroundColor='#4ea2de';
    search_text.style.backgroundColor='#3f8dc4'
    search_bar.style.backgroundColor='#3f8dc4'
}
else if(ch==='3'){
    search.style.backgroundColor='#284654';
    search_text.style.backgroundColor='#1d333d'
    search_bar.style.backgroundColor='#1d333d'
}
else if(ch==='7'){
    if(id===701||id===741){
        search.style.backgroundColor='#858585';
        search_text.style.backgroundColor='#bcbcbc'
        search_bar.style.backgroundColor='#bcbcbc' 
    }
    else{
        search.style.backgroundColor='#b07609';
        search_text.style.backgroundColor='#785108'
        search_bar.style.backgroundColor='#785108'
    }
}
else if(ch==='5'){
    search.style.backgroundColor='#284654';
    search_text.style.backgroundColor='#1d333d'
    search_bar.style.backgroundColor='#1d333d'
}
else if(ch==='6'){
    search.style.backgroundColor='#01284d';
    search_text.style.backgroundColor='#083f73'
    search_bar.style.backgroundColor='#083f73' 
}
}

function mouseEnter(){
    let search_icon=document.querySelector("#search-icon")
    let color=document.querySelector(".search").style.backgroundColor;
    search_icon.style.backgroundColor=color;
}

function mouseLeave(){
    let search_icon=document.querySelector("#search-icon")
    let color=document.querySelector("#search-text").style.backgroundColor;
    search_icon.style.backgroundColor=color;
}

function getImage(id){
let id_str=id.toString();
let ch=id_str.charAt(0);
let ch3=id_str.charAt(2);
if(ch==='8' && ch3!=='0')
return "url('cloudy.jpg')";
else if(ch==='8' && ch3==='0')
return "url('clear.jpg')";
else if(ch==='3')
return "url('rain.jpg')";
else if(ch==='7'){
    if(id===701 ||id===741)
    return "url('cloudy.jpg')"
else
return "url('summer_haze.jpg')"
}
else if(ch==='5')
return "url('rain.jpg')"
else if(ch==='6')
return "url('snow.jpg')"
}

function getAnimatedSvg(id){
let idstr=id.toString();
let ch=idstr.charAt(0);
let ch3=idstr.charAt(3);
if(ch==='2'){
  return 'animated/thunder.svg'
}
else if(ch==='3')
return 'animated/rainy-4.svg'
else if(ch==='5'){
    if(id===500||id===501)
    return 'animated/rainy-5.svg'
    else if(id===502||id===503)
    return 'animated/rainy-6.svg'
    else
    return 'animated/rainy-7.svg'
}
else if(ch==='6'){
    if(id===600||id===601)
    return 'animated/snowy-4.svg'
    else if(id===602||id===601)
    return 'animated/snowy-5.svg'
    else
    return 'animated/snowy-6.svg'
}
else if(ch==='7')
return 'animated/cloudy-night-3.svg'
else if(ch==='8'){
    if(id===800)
    return 'animated/day.svg'
    else if(id===801||id===802)
    return 'animated/cloudy-day-2.svg'
    else
    return 'animated/cloudy-night-3.svg'
}
}

function getDay(num){
    switch(num){
        case 0:
            return 'Mon';
            break;
        case 1:
            return 'Tue';
            break;
        case 2:
            return 'Wed';
            break;
        case 3:
            return 'Thu';
            break;
        case 4:
            return 'Fri';
            break;
        case 5:
            return 'Sat';
            break;
        case 6:
            return 'Sun';
            break;
    }
}
