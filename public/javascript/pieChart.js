 // Get the canvas element
 var ctx = document.getElementById("examChart").getContext("2d");

 // Data for the pie chart
 var data = {
   labels: ["Math", "Science", "History", "English", "Art"],
   datasets: [
     {
       data: [85, 78, 92, 70, 88],
       backgroundColor: ["#FF5733", "#FFC300", "#33FF8E", "#33A2FF", "#FF33E9"],
     },
   ],
 };

 // Create the pie chart
 let typeArray = ["polarArea","polarArea","doughnut","pie"];
 let rand = Math.floor(Math.random()*4);
 var examChart = new Chart(ctx, {
   type: typeArray[rand],
   data: data,
 });