
 $(".top-score-sub").click(()=>{
     $("#top-sel-opt-cont").toggleClass("hide");
 })


 function sel(){
    let x = document.querySelector("#top-sub-selected").value;
    if(x!="Select Subject"){
        $("#subj").html(x);
        $("#top-sel-opt-cont").addClass("hide");

        // funtion for top student


    }$("#top-sel-opt-cont").addClass("hide");
 }
