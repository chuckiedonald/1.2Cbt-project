// add subject
$("#clsbtn").click(()=>{
    $("#addsub-cont").addClass("hide"); 
})
$("#addsub-rev").click(()=>{
    $("#addsub-cont").removeClass("hide"); 
})
// ////////////

// view question
$("#cls-view-btn").click(()=>{
    $("#viewqst-cont").addClass("hide"); 
})
$("#viewqst-rev").click(()=>{
    $("#viewqst-cont").removeClass("hide"); 
})
// ////////////

// view result
$("#cls-viewResult-btn").click(()=>{
    $("#viewresult-cont").addClass("hide"); 
})
$("#viewresult-rev").click(()=>{
    $("#viewresult-cont").removeClass("hide"); 
})
// ////////////


// close with esc key
$(document).on('keydown',(event)=>{
    if(event.key==="Escape"){
        $("#viewresult-cont").addClass("hide"); 
        $("#viewqst-cont").addClass("hide"); 
        $("#addsub-cont").addClass("hide"); 
    }
})
// ////////////////////

$(document).click((e)=>{
    console.log(e.target)
})