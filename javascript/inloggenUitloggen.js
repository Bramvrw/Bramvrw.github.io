// Voor wachtwoord laten zien bij klikken van de checkbox
function WachtwoordZien() {
  var x = document.getElementById("NepWachtwoord");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

// functie voor confirmatie bij uitloggen
function confirmLogout() {
    if (confirm("Weet je zeker dat je wilt uitloggen?")) {
        return true; // Ga door naar index.html
    } else {
        return false; // Blijf op huidige pagina
    }
}