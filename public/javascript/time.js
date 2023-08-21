let id = null;
let sessionStat = null;
$.ajax({
  url: "/timmer",
  method: "GET",
  success: function (data) {
    id = data.id;
    if(localStorage.getItem(`stat${data.id}`) !='true'){
      localStorage.setItem(`stat${data.id}`,data.stat);
      sessionStat = localStorage.setItem(`stat${data.id}`,data.stat);
      localStorage.setItem(`sec${data.id}`,data.s);
      localStorage.setItem(`min${data.id}`,data.m);
      localStorage.setItem(`hr${data.id}`,data.h);
    }
  },
});

let h0 = "";
let m0 = "";
let s0 = "";
let counter = setInterval(
  function(){
      h0 = '';
      m0 ='';
      s0 ='';
      let sec = Number(localStorage.getItem(`sec${id}`));
      let hr = Number(localStorage.getItem(`hr${id}`));
      let min = Number(localStorage.getItem(`min${id}`));
      if(sec > 0 ){
        sec--;
      }
      localStorage.setItem(`sec${id}`,sec);
      if(sec == 0 && min > 0){
          min--;
          sec = 60;
          localStorage.setItem(`sec${id}`,sec);
          localStorage.setItem(`min${id}`,min);
      }
      if(min == 0 && hr > 0){
          hr--;
          min = 60;
          localStorage.setItem(`min${id}`,min);
          localStorage.setItem(`hr${id}`,hr);
          }
      if(hr == 0 && min == 0 && sec == 0){
          clearInterval(counter);

          //autSubmit();
          localStorage.setItem(`stat${id}`,`false`);
          //write a function to automatically submit exam once this condition is met
          
      }
      countNumber(hr,min,sec);
},1000);
function countNumber(x,z,k){
  if(x < 10 ){
    h0 = 0;
    document.querySelector("#timmer").innerHTML= `${h0}${x}:${m0}${z}:${s0}${k}`;
  }
  if(z < 10 ){
    m0 = 0;
    document.querySelector("#timmer").innerHTML= `${h0}${x}:${m0}${z}:${s0}${k}`;
  }
  if(k < 10 ){
    s0 = 0;
    document.querySelector("#timmer").innerHTML= `${h0}${x}:${m0}${z}:${s0}${k}`;
  }
}

function examsubmit(){
  document.querySelector("#subexambtn").addEventListener('click',()=>{
    let urlPara = document.querySelector("#hidnCnt").value;
    let form = document.querySelector("#examForm");
    form.setAttribute("action","/submitexam/"+urlPara);
    form.submit();
  })
}
examsubmit();
function autSubmit(){
    let urlPara = document.querySelector("#hidnCnt").value;
    let form = document.querySelector("#examForm");
    form.setAttribute("action","/submitexam/"+urlPara);
    form.submit();
}