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
  OpnamesLeeftijdMaand();
  leeftijdsverdelingsOpnametypesMaand();
  
  //deze grafieken gebruiken neppe data
  maakJaarGrafiekDiagnose();
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
function OpnamesLeeftijdMaand() {
  let maandelijkseTotalen40Min = Array(12).fill(0);
  let maandelijkseTotalen4050 = Array(12).fill(0);
  let maandelijkseTotalen5060 = Array(12).fill(0);
  let maandelijkseTotalen6070 = Array(12).fill(0);
  let maandelijkseTotalen7080 = Array(12).fill(0);
  let maandelijkseTotalen80Plus = Array(12).fill(0);
  let referentieData40Min = Array(12).fill(0);
  let referentieData4050 = Array(12).fill(0);
  let referentieData5060 = Array(12).fill(0);
  let referentieData6070 = Array(12).fill(0);
  let referentieData7080 = Array(12).fill(0);
  let referentieData80Plus = Array(12).fill(0);

  const query5 = JSON.stringify({
    query: `{
      nvic_data(where: {datum: {_regex: "2023"}}, order_by: {datum: asc}) {
        datum
        aantal_gepland_40_50
        aantal_gepland_40min
        aantal_gepland_50_60
        aantal_gepland_60_70
        aantal_gepland_70_80
        aantal_gepland_80plus
        aantal_medisch_40_50
        aantal_medisch_40min
        aantal_medisch_50_60
        aantal_medisch_60_70
        aantal_medisch_70_80
        aantal_medisch_80plus
        aantal_spoed_40_50
        aantal_spoed_40min
        aantal_spoed_50_60
        aantal_spoed_60_70
        aantal_spoed_70_80
        aantal_spoed_80plus
      }
    }`
  });

  const query6 = JSON.stringify({
    query: `{
      nvic_data(where: {datum: {_lte: "2022-12-31"}}, order_by: {datum: asc}) {
        datum
        aantal_gepland_40_50
        aantal_gepland_40min
        aantal_gepland_50_60
        aantal_gepland_60_70
        aantal_gepland_70_80
        aantal_gepland_80plus
        aantal_medisch_40_50
        aantal_medisch_40min
        aantal_medisch_50_60
        aantal_medisch_60_70
        aantal_medisch_70_80
        aantal_medisch_80plus
        aantal_spoed_40_50
        aantal_spoed_40min
        aantal_spoed_50_60
        aantal_spoed_60_70
        aantal_spoed_70_80
        aantal_spoed_80plus
      }
    }`
  });

  const request5 = new XMLHttpRequest();
  request5.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request5.setRequestHeader('content-type', 'application/json');
  request5.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request5.send(query5);

    request5.onload = function() {
        const leeftijdData = JSON.parse(request5.response);
        // Maak arrays voor elke leeftijdscategorie met 12 elementen voor elke maand
        leeftijdData.data.nvic_data.forEach(item => {
          const datum = new Date(item.datum);
          const maandIndex = datum.getMonth(); // 0 voor januari, 1 voor februari, etc.
          // Voeg de totalen toe aan de juiste maand in de juiste leeftijdscategorie
          maandelijkseTotalen40Min[maandIndex] += item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
          maandelijkseTotalen4050[maandIndex] += item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
          maandelijkseTotalen5060[maandIndex] += item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
          maandelijkseTotalen6070[maandIndex] += item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
          maandelijkseTotalen7080[maandIndex] += item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
          maandelijkseTotalen80Plus[maandIndex] += item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
        });

        // Log de maandelijkse totalen voor elke leeftijdscategorie
        console.log('Onder 40:', maandelijkseTotalen40Min);
        console.log('40-50:', maandelijkseTotalen4050);
        console.log('50-60:', maandelijkseTotalen5060);
        console.log('60-70:', maandelijkseTotalen6070);
        console.log('70-80:', maandelijkseTotalen7080);
        console.log('80+:', maandelijkseTotalen80Plus);
      
    };

      const request6 = new XMLHttpRequest();
      request6.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
      request6.setRequestHeader('content-type', 'application/json');
      request6.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
      request6.send(query6);

      request6.onload = function() {
          const leeftijdDataGem = JSON.parse(request6.response);
          // Maak arrays voor elke leeftijdscategorie met 12 elementen voor elke maand
            leeftijdDataGem.data.nvic_data.forEach(item => {
            const datum = new Date(item.datum);
            const maandIndex = datum.getMonth(); // 0 voor januari, 1 voor februari, etc.
            // Voeg de totalen toe aan de juiste maand in de juiste leeftijdscategorie
              referentieData40Min[maandIndex] += item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
              referentieData4050[maandIndex] += item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
              referentieData5060[maandIndex] += item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
              referentieData6070[maandIndex] += item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
              referentieData7080[maandIndex] += item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
              referentieData80Plus[maandIndex] += item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
          });
        console.log('Onder 40:', referentieData40Min);
        console.log('40-50:', referentieData4050);
        console.log('50-60:', referentieData5060);
        console.log('60-70:', referentieData6070);
        console.log('70-80:', referentieData7080);
        console.log('80+:', referentieData80Plus);
        
            referentieData40Min = referentieData40Min.map(x => x / 2);
            referentieData4050 = referentieData4050.map(x => x / 2);
            referentieData5060 = referentieData5060.map(x => x / 2);
            referentieData6070 = referentieData6070.map(x => x / 2);
            referentieData7080 = referentieData7080.map(x => x / 2);
            referentieData80Plus = referentieData80Plus.map(x => x / 2);
        
          console.log('Onder 40:', referentieData40Min);
          console.log('40-50:', referentieData4050);
          console.log('50-60:', referentieData5060);
          console.log('60-70:', referentieData6070);
          console.log('70-80:', referentieData7080);
          console.log('80+:', referentieData80Plus);



          maakJaarGrafiekOpnamesLeeftijd(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, maandelijkseTotalen40Min, maandelijkseTotalen4050, maandelijkseTotalen5060, maandelijkseTotalen6070, maandelijkseTotalen7080, maandelijkseTotalen80Plus);
        
      };
    } 









































// DATA LEEFTIJDSVERDELING OVER OPNAMETYPES
// Deze functie ...
leeftijdsverdelingsOpnametypesMaand = function() {
  // Specificatie van arrays en variabelen
  let medischLeeftijd = [];
  let spoedLeeftijd = [];
  let geplandLeeftijd = [];
  let referentieMedischLeeftijd = [];
  let referentieSpoedLeeftijd = [];
  let referentieGeplandLeeftijd = [];
  
  medisch40min = 0;
  medisch4050 = 0;
  medisch5060 = 0;
  medisch6070 = 0;
  medisch7080 = 0;
  medisch80plus = 0;
  spoed40min = 0;
  spoed4050 = 0;
  spoed5060 = 0;
  spoed6070 = 0;
  spoed7080 = 0;
  spoed80plus = 0;
  gepland40min = 0;
  gepland4050 = 0;
  gepland5060 = 0;
  gepland6070 = 0;
  gepland7080 = 0;
  gepland80plus = 0; 

  // Queries. Query7 en query8 zoeken alle leeftijdscategorien op binnen alle opnametypes. Query7 doet dit voor heel 2023 en query8 doet dit voor 2021 en 2022
  const query7 = JSON.stringify({
    query: `{
      nvic_data(where: {datum: {_regex: "^2023"}}, order_by: {datum: asc}) {
        datum
        aantal_gepland_40_50
        aantal_gepland_40min
        aantal_gepland_50_60
        aantal_gepland_60_70
        aantal_gepland_70_80
        aantal_gepland_80plus
        aantal_medisch_40_50
        aantal_medisch_40min
        aantal_medisch_50_60
        aantal_medisch_60_70
        aantal_medisch_70_80
        aantal_medisch_80plus
        aantal_spoed_40_50
        aantal_spoed_40min
        aantal_spoed_50_60
        aantal_spoed_60_70
        aantal_spoed_70_80
        aantal_spoed_80plus
      }
    }`
  });

  const query8 = JSON.stringify({
    query: `{
      nvic_data(where: {
          _and: [
            { datum: { _lte: "2022-12-31" } }
          ]
        }, order_by: { datum: asc }) {
    datum
    aantal_gepland_40_50
    aantal_gepland_40min
    aantal_gepland_50_60
    aantal_gepland_60_70
    aantal_gepland_70_80
    aantal_gepland_80plus
    aantal_medisch_40_50
    aantal_medisch_40min
    aantal_medisch_50_60
    aantal_medisch_60_70
    aantal_medisch_70_80
    aantal_medisch_80plus
    aantal_spoed_40_50
    aantal_spoed_40min
    aantal_spoed_50_60
    aantal_spoed_60_70
    aantal_spoed_70_80
    aantal_spoed_80plus
  }
    }`
  });

  // Eerste request wordt geopend, query7 wordt verstuurd 
  const request7 = new XMLHttpRequest();
  request7.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request7.setRequestHeader('content-type', 'application/json');
  request7.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request7.send(query7);

  // Hier worden de aantallen opnames per leeftijdscategorien per opnametype bij elkaar opgeteld
  request7.onload = function(){
    const opnametypesPerLeeftijd = JSON.parse(request7.response);
    opnametypesPerLeeftijd.data.nvic_data.forEach(item => {
      medisch40min += item.aantal_medisch_40min;
      medisch4050 += item.aantal_medisch_40_50;
      medisch5060 += item.aantal_medisch_50_60;
      medisch6070 += item.aantal_medisch_60_70;
      medisch7080 += item.aantal_medisch_70_80;
      medisch80plus += item.aantal_medisch_80plus;
      spoed40min += item.aantal_spoed_40min;
      spoed4050 += item.aantal_spoed_40_50;
      spoed5060 += item.aantal_spoed_50_60;
      spoed6070 += item.aantal_spoed_60_70;
      spoed7080 += item.aantal_spoed_70_80;
      spoed80plus += item.aantal_spoed_80plus;
      gepland40min += item.aantal_gepland_40min;
      gepland4050 += item.aantal_gepland_40_50;
      gepland5060 += item.aantal_gepland_50_60;
      gepland6070 += item.aantal_gepland_60_70;
      gepland7080 += item.aantal_gepland_70_80;
      gepland80plus += item.aantal_gepland_80plus;
    });

    // Daarna werden deze waarden opgeslagen in de juiste arrays
    medischLeeftijd.push(medisch40min, medisch4050, medisch5060, medisch6070, medisch7080, medisch80plus);
    spoedLeeftijd.push(spoed40min, spoed4050, spoed5060, spoed6070, spoed7080, spoed80plus);
    geplandLeeftijd.push(gepland40min, gepland4050, gepland5060, gepland6070, gepland7080, gepland80plus);

    // Tweede request wordt geopend, query4 wordt verstuurd
    const request8 = new XMLHttpRequest();
    request8.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
    request8.setRequestHeader('content-type', 'application/json');
    request8.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
    request8.send(query8);

    
    request8.onload = function(){
      const referentieOpnametypesPerLeeftijd = JSON.parse(request8.response);

      // Variabelen resetten om te hergebruiken
      medisch40min = 0;
      medisch4050 = 0;
      medisch5060 = 0;
      medisch6070 = 0;
      medisch7080 = 0;
      medisch80plus = 0;
      spoed40min = 0;
      spoed4050 = 0;
      spoed5060 = 0;
      spoed6070 = 0;
      spoed7080 = 0;
      spoed80plus = 0;
      gepland40min = 0;
      gepland4050 = 0;
      gepland5060 = 0;
      gepland6070 = 0;
      gepland7080 = 0;
      gepland80plus = 0;

      // Hier worden de aantallen opnames per leeftijdscategorie per opnametype bij elkaar opgeteld
      referentieOpnametypesPerLeeftijd.data.nvic_data.forEach(item =>{
        medisch40min += item.aantal_medisch_40min;
        medisch4050 += item.aantal_medisch_40_50;
        medisch5060 += item.aantal_medisch_50_60;
        medisch6070 += item.aantal_medisch_60_70;
        medisch7080 += item.aantal_medisch_70_80;
        medisch80plus += item.aantal_medisch_80plus;
        spoed40min += item.aantal_spoed_40min;
        spoed4050 += item.aantal_spoed_40_50;
        spoed5060 += item.aantal_spoed_50_60;
        spoed6070 += item.aantal_spoed_60_70;
        spoed7080 += item.aantal_spoed_70_80;
        spoed80plus += item.aantal_spoed_80plus;
        gepland40min += item.aantal_gepland_40min;
        gepland4050 += item.aantal_gepland_40_50;
        gepland5060 += item.aantal_gepland_50_60;
        gepland6070 += item.aantal_gepland_60_70;
        gepland7080 += item.aantal_gepland_70_80;
        gepland80plus += item.aantal_gepland_80plus;
      });

      // En weer in de juiste arrays gezet
      referentieMedischLeeftijd.push(medisch40min / 2, medisch4050 / 2, medisch5060 / 2, medisch6070 / 2, medisch7080 / 2, medisch80plus / 2);
      referentieSpoedLeeftijd.push(spoed40min / 2, spoed4050 / 2, spoed5060 / 2, spoed6070 / 2, spoed7080 / 2, spoed80plus / 2);
      referentieGeplandLeeftijd.push(gepland40min / 2, gepland4050 / 2, gepland5060 / 2, gepland6070 / 2, gepland7080 / 2, gepland80plus / 2);

      // Hier wordt de data doorgegeven aan deze drie functies om per opnametype een grafiek te maken
      maakGrafiekMedischeLeeftijd(medischLeeftijd, referentieMedischLeeftijd);
      maakGrafiekSpoedLeeftijd(spoedLeeftijd, referentieSpoedLeeftijd);
      maakGrafiekGeplandeLeeftijd(geplandLeeftijd, referentieGeplandLeeftijd);
    }; 
  }; 
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
      data: medischData,
      backgroundColor: 'rgba(174, 214, 241, 0.8)',
      borderColor: 'rgba(174, 214, 241, 0.8)'
    }, {
      type: 'bar',
      label: 'Aantal Spoed opnames',
      data: spoedData,
      backgroundColor: 'rgba(171, 235, 198, 0.8)',
      borderColor: 'rgba(171, 235, 198, 0.8)'
    }, {
      type: 'bar',
      label: 'Aantal Geplande opnames',
      data: geplandData,
      backgroundColor: 'rgba(215, 189, 226, 0.5)',
      borderColor: 'rgba(215, 189, 226, 0.5)'
    }, {
      type: 'line',
      label: 'Aantal Medische opnames in vorige jaren',
      data: referentieMedischData,
      backgroundColor: 'rgba(174, 214, 241)',
      borderColor: 'rgba(174, 214, 241)'
    }, {
      type: 'line',
      label: 'Aantal Spoed opnames in vorige jaren',
      data: referentieSpoedData,
      backgroundColor: 'rgba(171, 235, 198)',
      borderColor: 'rgba(171, 235, 198)'
    }, {
      type: 'line',
      label: 'Aantal Geplande opnames in vorige jaren',
      data: referentieGeplandData,
      backgroundColor: 'rgba(215, 189, 226)',
      borderColor: 'rgba(215, 189, 226)'
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
      data: [2389, 2275, 2265, 2198, 2178, 2128, 2015, 2149, 2189, 2238, 2245, 2303]
    }, {
      type: 'bar',
      label: 'OHCA',
      data: [328, 356, 375, 345, 338, 321, 339, 348, 350, 347, 341, 343]
    }, {
      type: 'bar',
      label: 'Sepsis',
      data: [304, 287, 259, 253, 284, 299, 306, 289, 283, 291, 312, 319]
    }, {
      type: 'line',
      label: 'CAP vorige jaren',
      data: [2460, 2421, 2356, 2301, 2273, 2226, 2150, 2235, 2289, 2340, 2360, 2395]
    }, {
      type: 'line',
      label: 'OHCA vorige jaren',
      data: [548, 562, 553, 567, 558, 550, 547, 555, 558, 560, 552, 550]
    }, {
      type: 'line',
      label: 'Sepsis vorige jaren',
      data: [480, 473, 458, 452, 471, 476, 481, 470, 468, 474, 478, 482]
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












































maakJaarGrafiekOpnamesLeeftijd = function(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, maandelijkseTotalen40Min, maandelijkseTotalen4050, maandelijkseTotalen5060, maandelijkseTotalen6070, maandelijkseTotalen7080, maandelijkseTotalen80Plus) {
  var jaarGrafiekOpnamesLeeftijd = {
    datasets: [{
      type: 'line',
      label: 'gem. 18-40 Jaar',
      data: referentieData40Min,
      backgroundColor: '#E6B0AA',
      borderColor: '#E6B0AA'
    }, {
      type: 'line',
      label: 'gem. 40-50 Jaar',
      data: referentieData4050,
      backgroundColor: '#AED6F1',
      borderColor: '#AED6F1'
    }, {
      type: 'line',
      label: 'gem. 50-60 Jaar',
      data: referentieData5060,
      backgroundColor: '#D5DBDB',
      borderColor: '#D5DBDB'
    }, {
      type: 'line',
      label: 'gem. 60-70 Jaar',
      data: referentieData6070,
      backgroundColor: '#FAD7A0',
      borderColor: '#FAD7A0'
    }, {
      type: 'line',
      label: 'gem. 70-80 Jaar',
      data: referentieData7080,
      backgroundColor: '#D7BDE2',
      borderColor: '#D7BDE2'
    }, {
      type: 'line',
      label: 'gem. 80+ Jaar',
      data: referentieData80Plus,
      backgroundColor: '#ABEBC6',
      borderColor: '#ABEBC6'
    }, {
      type: 'bar',
      label: '18-40 Jaar',
      data: maandelijkseTotalen40Min,
      backgroundColor: 'rgba(230, 176, 170, 0.5)'
    }, {
      type: 'bar',
      label: '40-50 Jaar',
      data: maandelijkseTotalen4050,
      backgroundColor: 'rgba(174, 214, 241, 0.5)'
    }, {
      type: 'bar',
      label: '50-60 Jaar',
      data: maandelijkseTotalen5060,
      backgroundColor: 'rgba(213, 219, 219, 0.5)'
    }, {
      type: 'bar',
      label: '60-70 Jaar',
      data: maandelijkseTotalen6070,
      backgroundColor: 'rgba(250, 215, 160, 0.5)'
    }, {
      type: 'bar',
      label: '70-80 Jaar',
      data: maandelijkseTotalen7080,
      backgroundColor: 'rgba(215, 189, 226, 0.5)'
    }, {
      type: 'bar',
      label: '80+ Jaar',
      data: maandelijkseTotalen80Plus,
      backgroundColor: 'rgba(171, 235, 198, 0.5)'
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarGrafiekOpnamesLeeftijdOptions = {};
  var jaarLeeftijdChartCtx = document.getElementById('jaarLeeftijdChart').getContext('2d');
  const jaarLeeftijdChart = new Chart(jaarLeeftijdChartCtx, {
    data: jaarGrafiekOpnamesLeeftijd,
    type: 'bar', // Corrected type to bar for mixed chart
    options: jaarGrafiekOpnamesLeeftijdOptions,
  });
  return jaarLeeftijdChart;
};












































maakICGrafiek = function() {
  var jaarICChartData = {
    datasets: [{
      type: 'line',
      label: '2023',
      data: [1.6, 1.6, 1.5, 1.4, 1.3, 1.2, 1.2, 1.3, 1.5, 1.5, 1.4, 1.6]
    }, {
      type: 'line',
      label: '2022',
      data: [1.7, 1.6, 1.5, 1.5, 1.4, 1.3, 1.2, 1.2, 1.4, 1.4, 1.5, 1.5]
    }, {
      type: 'line',
      label: '2021',
      data: [1.9, 1.8, 1.8, 1.7, 1.7, 1.6, 1.5, 1.6, 1.7, 1.8, 1.9, 1.8]
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


maakGrafiekMedischeLeeftijd = function(medischeLeeftijdData, referentieMedischeLeeftijdData){
  var medischLeeftijdData = {
    labels: ['18-40 jaar', '40-50 jaar', '50-60 jaar', '60-70 jaar', '70-80 jaar', '80+ jaar'],
    datasets: [{
      label: ['2023'],
      data: medischeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }, {
      label: ['gem. 2021/2022'],
      data: referentieMedischeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }]
  };
  var medischeLeeftijdOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Leeftijdsverdeling van medische opnames'
      }
    }
  };
  var medischeLeeftijdChartCtx = document.getElementById('medischeLeeftijd').getContext('2d');

  const medischeLeeftijdChart = new Chart(medischeLeeftijdChartCtx, {
    data: medischLeeftijdData,
    type: 'pie',
    options: medischeLeeftijdOptions
  });
  return medischeLeeftijdChart;
};

maakGrafiekSpoedLeeftijd = function(spoedeLeeftijdData, referentieSpoedeLeeftijdData){
  var spoedLeeftijdData = {
    labels: ['18-40 jaar', '40-50 jaar', '50-60 jaar', '60-70 jaar', '70-80 jaar', '80+ jaar'],
    datasets: [{
      label: ['2023'],
      data: spoedeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }, {
      label: ['gem. 2021/2022'],
      data: referentieSpoedeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }]
  };
  var spoedLeeftijdOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Leeftijdsverdeling van spoed opnames'
      }
    }
  };
  var spoedLeeftijdChartCtx = document.getElementById('spoedLeeftijd').getContext('2d');

  const spoedLeeftijdChart = new Chart(spoedLeeftijdChartCtx, {
    data: spoedLeeftijdData,
    type: 'pie',
    options: spoedLeeftijdOptions
  });
  return spoedLeeftijdChart;
};

maakGrafiekGeplandeLeeftijd = function(geplandeLeeftijdData, referentieGeplandeLeeftijdData){
  var geplandLeeftijdData = {
    labels: ['18-40 jaar', '40-50 jaar', '50-60 jaar', '60-70 jaar', '70-80 jaar', '80+ jaar'],
    datasets: [{
      label: ['2023'],
      data: geplandeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }, {
      label: ['gem. 2021/2022'],
      data: referentieGeplandeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }]
  };
  var geplandLeeftijdOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Leeftijdsverdeling van geplande opnames'
      }
    }
  };
  var geplandLeeftijdChartCtx = document.getElementById('geplandLeeftijd').getContext('2d');

  const geplandLeeftijdChart = new Chart(geplandLeeftijdChartCtx, {
    data: geplandLeeftijdData,
    type: 'pie',
    options: geplandLeeftijdOptions
  });
  return geplandLeeftijdChart;
};