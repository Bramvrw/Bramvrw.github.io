//voor wachtwoord laten zien bij klikken in checkbox
function WachtwoordZien() {
  var x = document.getElementById("NepWachtwoord");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}