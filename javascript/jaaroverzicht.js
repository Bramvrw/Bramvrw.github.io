// ------------ OPMERKINGEN -------------//
//Bij elke grafiek in de opties ervoor zorgen dat de kleuren van lijnen overeenkomen  met de lijnen van de bars zodat duidelijk is wat bij wat hoort!!!
// kleur van de bar iets lichter dan de kleur van de lijn. Helpt met zichtbaarheid.
//functie opnamesMaand heeft een probleem waardoor de lijn van de grafiek niet altijd automatisch zichtbaar is. Als je de rode lijn aanklikt komt hij pas tevoorschijn
//functie opnametypesMaand heeft hetzelfde probleem als opnamesMaand, maar dan voor de hele tabel. 
//----------------------------------------------------------------

// Grafieken voor een overzicht van opnames in heel 2023
function Jaar() {
  opnamesMaand();
  opnametypesMaand();



  //deze grafieken gebruiken neppe data
  maakJaarGrafiekDiagnose();
  maakJaarGrafiekOpnamesLeeftijd();
  maakICGrafiek();
};

// --------------FUNCTIES OM DATA OP TE VRAGEN --------------------------//
// DATA AANTAL OPNAMES
// Deze functie haalt data over het totale aantal IC opnames uit 2021-2023 op uit de database en maakt een grafiek van deze data.
opnamesMaand = function() {
  // Specificatie van arrays en variabelen
  let opnamesArray = [];
  let referentieOpnamesArray = [];
  
  var januariOpnameData = 0;
  var februariOpnameData = 0;
  var maartOpnameData = 0;
  var aprilOpnameData = 0;
  var meiOpnameData = 0;
  var juniOpnameData = 0;
  var juliOpnameData = 0;
  var augustusOpnameData = 0;
  var septemberOpnameData = 0;
  var oktoberOpnameData = 0;
  var novemberOpnameData = 0;
  var decemberOpnameData = 0;

  var referentieJanuariOpnameData = 0;
  var referentieFebruariOpnameData = 0;
  var referentieMaartOpnameData = 0;
  var referentieAprilOpnameData = 0;
  var referentieMeiOpnameData = 0;
  var referentieJuniOpnameData = 0;
  var referentieJuliOpnameData = 0;
  var referentieAugustusOpnameData = 0;
  var referentieSeptemberOpnameData = 0;
  var referentieOktoberOpnameData = 0;
  var referentieNovemberOpnameData = 0;
  var referentieDecemberOpnameData = 0;
  
  //Queries. 
  const query1 = JSON.stringify({
    query: `{
      nvic_data(where: {datum: {_regex: "^2023"}}, order_by: {datum: asc}) {
        datum
        aantal_gepland
        aantal_medisch
        aantal_spoed
      }
    }`
  });

  const query2 = JSON.stringify({
    query: `{
      nvic_data(where: {
        _and: [
          { datum: { _lte: "2022-12-31" } }
        ]
      }, order_by: { datum: asc }) {
        datum
        aantal_gepland
        aantal_medisch
        aantal_spoed
      }
    }`
  });

  // Eerste request wordt geopend, query1 wordt verstuurd 
  const request1 = new XMLHttpRequest();
  request1.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request1.setRequestHeader('content-type', 'application/json');
  request1.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request1.send(query1);

  // Hier wordt het totale aantal opnames per maand berekend en in een array gezet. Dit wordt gedaan door de data te filteren op de maand en daarna de aantallen te tellen
  request1.onload = function() {
    const opnameData = JSON.parse(request1.response);
    opnameData.data.nvic_data.forEach(item => {
      if (item.datum.includes("-01-")) { januariOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-02-")) { februariOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-03-")) { maartOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-04-")) { aprilOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-05-")) { meiOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-06-")) { juniOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-07-")) { juliOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-08-")) { augustusOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-09-")) { septemberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-10-")) { oktoberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else if (item.datum.includes("-11-")) { novemberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      else { decemberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
    });

    // Hier worden de opgetelde waardes op volgorde aan de array toegevoegd
    opnamesArray.push(januariOpnameData, februariOpnameData, maartOpnameData, aprilOpnameData, meiOpnameData, juniOpnameData, juliOpnameData, augustusOpnameData, septemberOpnameData, oktoberOpnameData, novemberOpnameData, decemberOpnameData);

    // Tweede request wordt geopend, query2 wordt verstuurd
    const request2 = new XMLHttpRequest();
    request2.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
    request2.setRequestHeader('content-type', 'application/json');
    request2.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
    request2.send(query2);

    // De data van 2021 en 2022 wordt hier verwerkt door te filteren op maand en vervolgens de aantallen opnames bij elkaar op te tellen.
    request2.onload = function() {
      const referentieOpnameData = JSON.parse(request2.response);

      // Weer wordt de data gefilterd op maand en worden de aantallen geteld
      referentieOpnameData.data.nvic_data.forEach(item => {
        if (item.datum.includes("-01-")) { referentieJanuariOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-02-")) { referentieFebruariOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-03-")) { referentieMaartOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-04-")) { referentieAprilOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-05-")) { referentieMeiOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-06-")) { referentieJuniOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-07-")) { referentieJuliOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-08-")) { referentieAugustusOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-09-")) { referentieSeptemberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-10-")) { referentieOktoberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else if (item.datum.includes("-11-")) { referentieNovemberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
        else { referentieDecemberOpnameData += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed; }
      });

      // Hier worden de opgetelde waardes op volgorde aan de array toegevoegd nadat ze door 2 zijn gedeeld vanwege de twee jaar aan data die we als referentie gebruiken
      referentieOpnamesArray.push(referentieJanuariOpnameData / 2, referentieFebruariOpnameData / 2, referentieMaartOpnameData / 2, referentieAprilOpnameData / 2, referentieMeiOpnameData / 2, referentieJuniOpnameData / 2, referentieJuliOpnameData / 2, referentieAugustusOpnameData / 2, referentieSeptemberOpnameData / 2, referentieOktoberOpnameData / 2, referentieNovemberOpnameData / 2, referentieDecemberOpnameData / 2);
    };

    // Als laatste wordt de functie aangeroepen om de grafiek te maken
    maakJaarGrafiekOpnames(opnamesArray, referentieOpnamesArray);
  };
};

// DATA OPNAMETYPES 
// Deze functie maakt een overzicht van alle opnames per opnametype per maand in 2023, ten opzichte van de opnames per maand in 2021 en 2022.
opnametypesMaand = function() {
  // Specificatie van arrays en variabelen
  let medischArray = [];
  let spoedArray = [];
  let geplandArray = [];
  let referentieMedischArray = [];
  let referentieSpoedArray = [];
  let referentieGeplandArray = [];

  var janMedisch = 0;
  var febMedisch = 0;
  var marMedisch = 0;
  var aprMedisch = 0;
  var meiMedisch = 0;
  var junMedisch = 0;
  var julMedisch = 0;
  var augMedisch = 0;
  var sepMedisch = 0;
  var oktMedisch = 0;
  var novMedisch = 0;
  var decMedisch = 0;
  var janSpoed = 0;
  var febSpoed = 0;
  var marSpoed = 0;
  var aprSpoed = 0;
  var meiSpoed = 0;
  var junSpoed = 0;
  var julSpoed = 0;
  var augSpoed = 0;
  var sepSpoed = 0;
  var oktSpoed = 0;
  var novSpoed = 0;
  var decSpoed = 0;
  var janGepland = 0;
  var febGepland = 0;
  var marGepland = 0;
  var aprGepland = 0;
  var meiGepland = 0;
  var junGepland = 0;
  var julGepland = 0;
  var augGepland = 0;
  var sepGepland = 0;
  var oktGepland = 0;
  var novGepland = 0;
  var decGepland = 0;

  //Queries.
  const query3 = JSON.stringify({
    query: `{
        nvic_data(where: {datum: {_regex: "^2023"}}, order_by: {datum: asc}) {
        datum
        aantal_gepland
        aantal_medisch
        aantal_spoed
        }
      }`
  });

  const query4 = JSON.stringify({
    query: `{
        nvic_data(where: {
          _and: [
            { datum: { _lte: "2022-12-31" } }
          ]
        }, order_by: { datum: asc }) {
          datum
          aantal_gepland
          aantal_medisch
          aantal_spoed
        }
      }`
  });

  // Eerste request wordt geopend, query3 wordt verstuurd 
  const request3 = new XMLHttpRequest();
  request3.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request3.setRequestHeader('content-type', 'application/json');
  request3.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request3.send(query3);

  // Er wordt voor elke maand bijgehouden hoeveel van elk type opname er zijn
  request3.onload = function() {
    const opnametypesData = JSON.parse(request3.response);
    opnametypesData.data.nvic_data.forEach(item => {
      if (item.datum.includes("-01-")) {
        janMedisch += item.aantal_medisch;
        janSpoed += item.aantal_spoed;
        janGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-02-")) {
        febMedisch += item.aantal_medisch;
        febSpoed += item.aantal_spoed;
        febGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-03-")) {
        marMedisch += item.aantal_medisch;
        marSpoed += item.aantal_spoed;
        marGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-04-")) {
        aprMedisch += item.aantal_medisch;
        aprSpoed += item.aantal_spoed;
        aprGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-05-")) {
        meiMedisch += item.aantal_medisch;
        meiSpoed += item.aantal_spoed;
        meiGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-06-")) {
        junMedisch += item.aantal_medisch;
        junSpoed += item.aantal_spoed;
        junGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-07-")) {
        julMedisch += item.aantal_medisch;
        julSpoed += item.aantal_spoed;
        julGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-08-")) {
        augMedisch += item.aantal_medisch;
        augSpoed += item.aantal_spoed;
        augGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-09-")) {
        sepMedisch += item.aantal_medisch;
        sepSpoed += item.aantal_spoed;
        sepGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-10-")) {
        oktMedisch += item.aantal_medisch;
        oktSpoed += item.aantal_spoed;
        oktGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-11-")) {
        novMedisch += item.aantal_medisch;
        novSpoed += item.aantal_spoed;
        novGepland += item.aantal_gepland;
      }
      else {
        decMedisch += item.aantal_medisch;
        decSpoed += item.aantal_spoed;
        decGepland += item.aantal_gepland;
      }
    });

    // Daarna worden de waardes op volgorde aan de arrays toegevoegd
    medischArray.push(janMedisch, febMedisch, marMedisch, aprMedisch, meiMedisch, junMedisch, julMedisch, augMedisch, sepMedisch, oktMedisch, novMedisch, decMedisch);

    spoedArray.push(janSpoed, febSpoed, marSpoed, aprSpoed, meiSpoed, junSpoed, julSpoed, augSpoed, sepSpoed, oktSpoed, novSpoed, decSpoed);

    geplandArray.push(janGepland, febGepland, marGepland, aprGepland, meiGepland, junGepland, julGepland, augGepland, sepGepland, oktGepland, novGepland, decGepland);
  };

  // Tweede request wordt geopend, query4 wordt verstuurd
  const request4 = new XMLHttpRequest();
  request4.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request4.setRequestHeader('content-type', 'application/json');
  request4.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request4.send(query4);

  // De data van 2021 en 2022 wordt hier verwerkt door te filteren op maand en vervolgens de aantallen opnames voor elke soort opname bij elkaar op te tellen.
  request4.onload = function() {
    const referentieOpnametypeData = JSON.parse(request4.response);

    // Deze waardes worden gereset op opnieuw te gebruiken
    var janMedisch = 0;
    var febMedisch = 0;
    var marMedisch = 0;
    var aprMedisch = 0;
    var meiMedisch = 0;
    var junMedisch = 0;
    var julMedisch = 0;
    var augMedisch = 0;
    var sepMedisch = 0;
    var oktMedisch = 0;
    var novMedisch = 0;
    var decMedisch = 0;
    var janSpoed = 0;
    var febSpoed = 0;
    var marSpoed = 0;
    var aprSpoed = 0;
    var meiSpoed = 0;
    var junSpoed = 0;
    var julSpoed = 0;
    var augSpoed = 0;
    var sepSpoed = 0;
    var oktSpoed = 0;
    var novSpoed = 0;
    var decSpoed = 0;
    var janGepland = 0;
    var febGepland = 0;
    var marGepland = 0;
    var aprGepland = 0;
    var meiGepland = 0;
    var junGepland = 0;
    var julGepland = 0;
    var augGepland = 0;
    var sepGepland = 0;
    var oktGepland = 0;
    var novGepland = 0;
    var decGepland = 0;

    referentieOpnametypeData.data.nvic_data.forEach(item => {
      if (item.datum.includes("-01-")) {
        janMedisch += item.aantal_medisch;
        janSpoed += item.aantal_spoed;
        janGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-02-")) {
        febMedisch += item.aantal_medisch;
        febSpoed += item.aantal_spoed;
        febGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-03-")) {
        marMedisch += item.aantal_medisch;
        marSpoed += item.aantal_spoed;
        marGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-04-")) {
        aprMedisch += item.aantal_medisch;
        aprSpoed += item.aantal_spoed;
        aprGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-05-")) {
        meiMedisch += item.aantal_medisch;
        meiSpoed += item.aantal_spoed;
        meiGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-06-")) {
        junMedisch += item.aantal_medisch;
        junSpoed += item.aantal_spoed;
        junGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-07-")) {
        julMedisch += item.aantal_medisch;
        julSpoed += item.aantal_spoed;
        julGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-08-")) {
        augMedisch += item.aantal_medisch;
        augSpoed += item.aantal_spoed;
        augGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-09-")) {
        sepMedisch += item.aantal_medisch;
        sepSpoed += item.aantal_spoed;
        sepGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-10-")) {
        oktMedisch += item.aantal_medisch;
        oktSpoed += item.aantal_spoed;
        oktGepland += item.aantal_gepland;
      }
      else if (item.datum.includes("-11-")) {
        novMedisch += item.aantal_medisch;
        novSpoed += item.aantal_spoed;
        novGepland += item.aantal_gepland;
      }
      else {
        decMedisch += item.aantal_medisch;
        decSpoed += item.aantal_spoed;
        decGepland += item.aantal_gepland;
      }
    });

    // Hier worden alle waardes in correcte volgorde aan de juiste arrays toegevoegd
    referentieMedischArray.push(janMedisch / 2, febMedisch / 2, marMedisch / 2, aprMedisch / 2, meiMedisch / 2, junMedisch / 2, julMedisch / 2, augMedisch / 2, sepMedisch / 2, oktMedisch / 2, novMedisch / 2, decMedisch / 2);

    referentieSpoedArray.push(janSpoed / 2, febSpoed / 2, marSpoed / 2, aprSpoed / 2, meiSpoed / 2, junSpoed / 2, julSpoed / 2, augSpoed / 2, sepSpoed / 2, oktSpoed / 2, novSpoed / 2, decSpoed / 2);

    referentieGeplandArray.push(janGepland / 2, febGepland / 2, marGepland / 2, aprGepland / 2, meiGepland / 2, junGepland / 2, julGepland / 2, augGepland / 2, sepGepland / 2, oktGepland / 2, novGepland / 2, decGepland / 2);

  };

  // Als laatste wordt de data van de arrays doorgegeven aan deze functie om hier een grafiek van te maken
  maakJaarGrafiekOpnametypes(medischArray, spoedArray, geplandArray, referentieMedischArray, referentieSpoedArray, referentieGeplandArray);
};

// DATA LEEFTIJDSCATEGORIEN
// Deze functie ...
leeftijdscategorienMaand = function(){
  


  
};




// --------------------------------JAAROVERZICHT GRAFIEKEN-------------------//

//GRAFIEK Aantal opnames per maand in 2023
maakJaarGrafiekOpnames = function(data, referentiedata) {
  var jaarChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal opnames',
      data: data
    }, {
      type: 'line',
      label: 'Gemiddelde aantal van vorige jaren',
      data: referentiedata
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarChartOptions = {};
  var jaarChartCtx = document.getElementById('jaarChart').getContext('2d');
  const jaarChart = new Chart(jaarChartCtx, {
    data: jaarChartData,
    type: 'mixed',
    options: jaarChartOptions
  });
  return jaarChart;
};

//GRAFIEK Aantal opnames per maand gebaseerd op opnametype 
maakJaarGrafiekOpnametypes = function(medischData, spoedData, geplandData, referentieMedischData, referentieSpoedData, referentieGeplandData) {
  var jaarOpnametypesChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal Medische opnames',
      data: medischData
    }, {
      type: 'bar',
      label: 'Aantal Spoed opnames',
      data: spoedData
    }, {
      type: 'bar',
      label: 'Aantal Geplande opnames',
      data: geplandData
    }, {
      type: 'line',
      label: 'Aantal Medische opnames in vorige jaren',
      data: referentieMedischData,
    }, {
      type: 'line',
      label: 'Aantal Spoed opnames in vorige jaren',
      data: referentieSpoedData
    }, {
      type: 'line',
      label: 'Aantal Geplande opnames in vorige jaren',
      data: referentieGeplandData
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarOpnametypesChartOptions = {};
  var jaarOpnametypesChartCtx = document.getElementById('jaarOpnametypesChart').getContext('2d');
  const jaarOpnametypesChart = new Chart(jaarOpnametypesChartCtx, {
    data: jaarOpnametypesChartData,
    type: 'mixed',
    options: jaarOpnametypesChartOptions
  });
  return jaarOpnametypesChart;
};


maakJaarGrafiekDiagnose = function() {
  var jaarDiagnoseChartData = {
    datasets: [{
      type: 'bar',
      label: 'CAP',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40]
    }, {
      type: 'bar',
      label: 'OHCA',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40]
    }, {
      type: 'bar',
      label: 'Sespsis',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40]
    }, {
      type: 'line',
      label: 'CAP vorige jaren',
      data: [30, 40, 30, 33, 35, 43, 22, 23, 43, 23, 43, 35]
    }, {
      type: 'line',
      label: 'OHCA vorige jaren',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40]
    }, {
      type: 'line',
      label: 'Sespsis vorige jaren',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40]
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarDiagnoseChartOptions = {};
  var jaarDiagnoseChartCtx = document.getElementById('jaarDiagnoseChart').getContext('2d');
  const jaarDiagnoseChart = new Chart(jaarDiagnoseChartCtx, {
    data: jaarDiagnoseChartData,
    type: 'mixed',
    options: jaarDiagnoseChartOptions
  });
  return jaarDiagnoseChart;
};

maakJaarGrafiekOpnamesLeeftijd = function() {
  var jaarGrafiekOpnamesLeeftijd = {
    datasets: [{
      type: 'line',
      label: 'gem. 18-40 Jaar',
      data: [2, 3, 3, 2, 2, 3, 3, 1, 4, 2, 1, 1],
      backgroundColor: '#E6B0AA',
      borderColor: '#E6B0AA'
    }, {
      type: 'line',
      label: 'gem. 40-60 Jaar',
      data: [10, 11, 12, 11, 12, 11, 11, 1, 4, 5, 2, 3],
      backgroundColor: '#AED6F1',
      borderColor: '#AED6F1'
    }, {
      type: 'line',
      label: 'gem. 60-65 Jaar',
      data: [15, 15, 16, 17, 17, 16, 16, 10, 9, 10, 13, 8],
      backgroundColor: '#D5DBDB',
      borderColor: '#D5DBDB'
    }, {
      type: 'line',
      label: 'gem. 65-70 Jaar',
      data: [16, 15, 15, 17, 17, 16, 16, 13, 11, 8, 14, 6],
      backgroundColor: '#FAD7A0',
      borderColor: '#FAD7A0'
    }, {
      type: 'line',
      label: 'gem. 70-75 Jaar',
      data: [20, 20, 20, 20, 20, 21, 21, 19, 18, 20, 21, 19],
      backgroundColor: '#D7BDE2',
      borderColor: '#D7BDE2'
    }, {
      type: 'line',
      label: 'gem. 75-80 Jaar',
      data: [23, 23, 24, 25, 24, 24, 26, 23, 25, 26, 21, 24],
      backgroundColor: '#ABEBC6',
      borderColor: '#ABEBC6'
    }, {
      type: 'line',
      label: 'gem. 80-85 Jaar',
      data: [22, 21, 20, 21, 22, 20, 21, 19, 20, 23, 18, 19],
      backgroundColor: '#F5CBA7',
      borderColor: '#F5CBA7'
    }, {
      type: 'line',
      label: 'gem. 85-90 Jaar',
      data: [12, 12, 13, 13, 12, 12, 12, 13, 11, 12, 13, 12],
      backgroundColor: '#F0B27A',
      borderColor: '#F0B27A'
    }, {
      type: 'line',
      label: 'gem. 90+ Jaar',
      data: [10, 9, 8, 9, 9, 9, 9, 8, 9, 9, 10, 8],
      backgroundColor: '#85C1E9',
      borderColor: '#85C1E9'
    }, {
      type: 'bar',
      label: '18-40 Jaar',
      data: [2, 3, 3, 2, 2, 3, 3, 3, 2, 2, 4, 3],
      backgroundColor: '#E6B0AA'
    }, {
      type: 'bar',
      label: '40-60 Jaar',
      data: [10, 11, 12, 11, 12, 11, 11, 12, 11, 12, 10, 11],
      backgroundColor: '#AED6F1'
    }, {
      type: 'bar',
      label: '60-65 Jaar',
      data: [15, 15, 16, 17, 17, 16, 16, 14, 16, 15, 17, 15],
      backgroundColor: '#D5DBDB'
    }, {
      type: 'bar',
      label: '65-70 Jaar',
      data: [16, 15, 15, 17, 17, 16, 16, 17, 18, 17, 16, 16],
      backgroundColor: '#FAD7A0'
    }, {
      type: 'bar',
      label: '70-75 Jaar',
      data: [20, 20, 20, 20, 20, 21, 21, 19, 20, 20, 21, 21],
      backgroundColor: '#D7BDE2'
    }, {
      type: 'bar',
      label: '75-80 Jaar',
      data: [23, 23, 24, 25, 24, 24, 26, 25, 25, 23, 24, 24],
      backgroundColor: '#ABEBC6'
    }, {
      type: 'bar',
      label: '80-85 Jaar',
      data: [22, 21, 20, 21, 22, 20, 21, 20, 19, 21, 20, 22],
      backgroundColor: '#F5CBA7'
    }, {
      type: 'bar',
      label: '85-90 Jaar',
      data: [12, 12, 13, 13, 12, 12, 12, 11, 11, 12, 13, 12],
      backgroundColor: '#F0B27A'
    }, {
      type: 'bar',
      label: '90+ Jaar',
      data: [10, 9, 8, 9, 9, 9, 9, 7, 8, 7, 8],
      backgroundColor: '#85C1E9'
    }],
    labels: ['Week 01', 'Week 02', 'Week 03', 'Week 04']
  };

  var jaarGrafiekOpnamesLeeftijdOptions = {}
  var jaarLeeftijdChartCtx = document.getElementById('jaarLeeftijdOpnames').getContext('2d');
  const jaarLeeftijdChart = new Chart(jaarLeeftijdChartCtx, {
    data: jaarGrafiekOpnamesLeeftijd,
    type: 'mixed',
    options: jaarGrafiekOpnamesLeeftijdOptions,
  });
  return jaarLeeftijdChart;
};

maakICGrafiek = function() {
  var jaarICChartData = {
    datasets: [{
      type: 'line',
      label: '2023',
      data: [2.3, 3.3, 3.3, 2.3, 2.3, 3.3, 3.3, 2.3, 4.3, 2.3, 2.3, 2.3]
    }, {
      type: 'line',
      label: '2022',
      data: [3.2, 1.5, 2.4, 3.2, 2.4, 3.2, 3.2, 1.2, 2.0, 1.8, 1.9, 2.0]
    }, {
      type: 'line',
      label: '2021',
      data: [1.2, 2.5, 3.0, 1.2, 2.5, 3.0, 3.0, 1.2, 2.5, 1.9, 2.0, 1.8]
    }, {
      type: 'line',
      label: '2020',
      data: [4.2, 3.4, 4.4, 4.2, 3.4, 4.4, 4.4, 3.4, 3.9, 4.9, 4.8, 4.9]
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarICChartOptions = {};
  var jaarICChartCtx = document.getElementById('jaarICChart').getContext('2d');
  const jaarICChart = new Chart(jaarICChartCtx, {
    data: jaarICChartData,
    type: 'line',
    options: jaarICChartOptions
  });
  return jaarICChart;
};