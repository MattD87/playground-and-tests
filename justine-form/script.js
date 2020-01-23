const slider = document.getElementById("myRange");
// let output = slider.value;

// Update the current slider value (each time you drag the slider handle)
// slider.oninput = function() {
//   output.innerHTML = donationAmount;
// };

function checkValue() {
  let donationAmount = "";
  if ($("#myRange").val() == 1) {
    donationAmount = 50; //change to value of donation form preselect code
    $("#custom").val("50");
    // $("#custom").attr("placeholder", "50");
    // output= donationAmount;
  } else if ($("#myRange").val() == 2) {
    donationAmount = 75; //change to value of donation form preselect code
    $("#custom").val("75");
    // $("#custom").attr("placeholder", "75");
    // output = donationAmount;
  } else if ($("#myRange").val() == 3) {
    donationAmount = 125; //change to value of donation form preselect code
    $("#custom").val("125");
    // $("#custom").attr("placeholder", "125");
    // output = donationAmount;
  } else if ($("#myRange").val() == 4) {
    donationAmount = 500; //change to value of donation form preselect code
    $("#custom").val("500");
    // $("#custom").attr("placeholder", "500");
    // output = donationAmount;
  } else if ($("#myRange").val() == 5) {
    donationAmount = 1000; //change to value of donation form preselect code
    $("#custom").val("1000");
    // $("#custom").attr("placeholder", "1000");
    // output = donationAmount;
  } else {
    donationAmount = ""; //no value, failsafe
    $("#custom").val("0");
    // $("#custom").attr("placeholder", "0");
    // output = donationAmount;
  }
}

$(document).ready(function(){
  checkValue();  
});
