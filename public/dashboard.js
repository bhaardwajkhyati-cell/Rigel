function updateClock(){

  const now = new Date();
  
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  let ampm = hours >= 12 ? "PM" : "AM";
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  minutes = minutes < 10 ? "0"+minutes : minutes;
  
  const timeString = hours + ":" + minutes + " " + ampm;
  
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  const dateString = day + ", " + date + " " + month + " " + year;
  
  document.getElementById("time").innerText = timeString;
  document.getElementById("date").innerText = dateString;
  
  }
  
  setInterval(updateClock,1000);
  updateClock();
