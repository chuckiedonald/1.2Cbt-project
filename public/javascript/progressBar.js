$(document).ready(function () {
  // Function to initiate the sending process
  function sendData() {
    $(".progress").show();

    let progress = 0;
    const interval = setInterval(function () {
      progress += 10;
      $(".progress-bar").css("width", progress + "%");

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(function () {
          // Reset progress bar and show the "sending" text again. Sending text has been removed from the code
          $(".progress").hide();
          $(".progress-bar").css("width", "0%");
          $(".sending-text").show();
        }, 500); // Adding a small delay to make it more visible

        // Simulate sending data to the server
        $.ajax({
          type: "GET",
          url: "/autCode",
          success: function (data) {
            // Handle the server response here
            alert("Code sent to your email!");
            $(".sending-text").hide();
            $(".aut-code-field").css("visibility","visible");
            $(".aut-button").html("Enter code sent to you" );
            $(".aut-button").addClass("aut-button2");
            $(".aut-button").removeClass("aut-button");

          },
          error: function (jqXHR, textStatus, errorThrown) {
            // Handle the error if the request fails
            alert("Error sending data: " + errorThrown);
          },
        });
      }
    }, 500);
  }

  // Bind the click event to the "Send Data" button
  $(".aut-button").on('click', function(){
    sendData();
    $(this).off('click');
  })
});
