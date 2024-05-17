// Voor wachtwoord laten zien bij klikken van de checkbox
function WachtwoordZien() {
  var x = document.getElementById("NepWachtwoord");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}