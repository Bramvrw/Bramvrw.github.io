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
  let maandelijkseOpnames = Array(12).fill(0);
  let referentieMaandelijkseOpnames = Array(12).fill(0);

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
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();
      
      maandelijkseOpnames[maandIndex] += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
    });
    
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
        const datum = new Date(item.datum);
        const maandIndex = datum.getMonth();
        referentieMaandelijkseOpnames[maandIndex] += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
      });

      // Hier worden de opgetelde waardes op volgorde aan de array toegevoegd nadat ze door 2 zijn gedeeld vanwege de twee jaar aan data die we als referentie gebruiken
      referentieMaandelijkseOpnames = referentieMaandelijkseOpnames.map(x => x / 2);
      maakJaarGrafiekOpnames(maandelijkseOpnames, referentieMaandelijkseOpnames);
    };
  };
};

// DATA OPNAMETYPES 
// Deze functie maakt een overzicht van alle opnames per opnametype per maand in 2023, ten opzichte van de opnames per maand in 2021 en 2022.
opnametypesMaand = function() {
  // Specificatie van arrays en variabelen
  let medischArray = Array(12).fill(0);
  let spoedArray = Array(12).fill(0);
  let geplandArray = Array(12).fill(0);
  let referentieMedischArray = Array(12).fill(0);
  let referentieSpoedArray = Array(12).fill(0);
  let referentieGeplandArray = Array(12).fill(0);

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
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();
      
      medischArray[maandIndex] += item.aantal_medisch;
      spoedArray[maandIndex] += item.aantal_spoed;
      geplandArray[maandIndex] += item.aantal_gepland;
    });
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
 
    referentieOpnametypeData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();
      
      referentieMedischArray[maandIndex] += item.aantal_medisch;
      referentieSpoedArray[maandIndex] += item.aantal_spoed;
      referentieGeplandArray[maandIndex] += item.aantal_gepland;
    });

    // Hier worden alle waardes in correcte volgorde aan de juiste arrays toegevoegd
      referentieMedischArray = referentieMedischArray.map(x => x / 2);
      referentieSpoedArray = referentieSpoedArray.map(x => x / 2);
      referentieGeplandArray = referentieGeplandArray.map(x => x / 2);
    // Als laatste wordt de data van de arrays doorgegeven aan deze functie om hier een grafiek van te maken
    maakJaarGrafiekOpnametypes(medischArray, spoedArray, geplandArray, referentieMedischArray, referentieSpoedArray, referentieGeplandArray);
  };
};

// DATA LEEFTIJDSCATEGORIEN
// Deze functie maakt een grafiek van de data per leeftijdscategorie per maand over heel 2023. Met een gemiddelde aantal opnames per maand per leeftijdscategorie van 2o21 en 2022.
function OpnamesLeeftijdMaand() {
   // op deze manier maak je een array met precies 12 elementen, allemaal ingesteld op 0. Hierdoor kun je direct waarden optellen bij specifieke indexen  waardoor je maandelijkseTotalen40Min[maandIndex] kan gebruiken om per maand het op te tellen en hoef je niet iedere maand los te coderen.
  
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
    };

      const request6 = new XMLHttpRequest();
      request6.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
      request6.setRequestHeader('content-type', 'application/json');
      request6.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
      request6.send(query6);

      request6.onload = function() {
          const leeftijdDataGem = JSON.parse(request6.response);
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
//voor berekenen gemiddelde (map zorgt ervoor dat index 0 door 2 gedeeld kan worden, etc)
            referentieData40Min = referentieData40Min.map(x => x / 2);
            referentieData4050 = referentieData4050.map(x => x / 2);
            referentieData5060 = referentieData5060.map(x => x / 2);
            referentieData6070 = referentieData6070.map(x => x / 2);
            referentieData7080 = referentieData7080.map(x => x / 2);
            referentieData80Plus = referentieData80Plus.map(x => x / 2);
        
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

  var jaarChartOptions = {
    scales: {
      x: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR X-AS TITEL"},
      },
      y: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR Y-AS TITEL"}
      },
    },
  };
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
      backgroundColor: 'rgb(54,162,235,0.5)',
      borderColor: 'rgb(54,162,235)'
    }, {
      type: 'bar',
      label: 'Aantal Spoed opnames',
      data: spoedData,
      backgroundColor: 'rgb(255,99,132,0.5)',
      borderColor: 'rgb(255,99,132)'
    }, {
      type: 'bar',
      label: 'Aantal Geplande opnames',
      data: geplandData,
      backgroundColor: 'rgb(255,159,64,0.5)',
      borderColor: 'rgb(255,159,64)'
    }, {
      type: 'line',
      label: 'Aantal Medische opnames in vorige jaren',
      data: referentieMedischData,
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)'
    }, {
      type: 'line',
      label: 'Aantal Spoed opnames in vorige jaren',
      data: referentieSpoedData,
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)'
    }, {
      type: 'line',
      label: 'Aantal Geplande opnames in vorige jaren',
      data: referentieGeplandData,
      backgroundColor: 'rgb(255,159,64)',
      borderColor: 'rgb(255,159,64)'
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarOpnametypesChartOptions = {
    scales: {
      x: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR X-AS TITEL"},
      },
      y: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR Y-AS TITEL"}
      },
    },
  };
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
      data: [2389, 2275, 2265, 2198, 2178, 2128, 2015, 2149, 2189, 2238, 2245, 2303],
      backgroundColor: 'rgb(54,162,235,0.5)',
      borderColor: 'rgb(54,162,235)'
    }, {
      type: 'bar',
      label: 'OHCA',
      data: [328, 356, 375, 345, 338, 321, 339, 348, 350, 347, 341, 343],
      backgroundColor: 'rgb(255,99,132,0.5)',
      borderColor: 'rgb(255,99,132)'
    }, {
      type: 'bar',
      label: 'Sepsis',
      data: [304, 287, 259, 253, 284, 299, 306, 289, 283, 291, 312, 319],
      backgroundColor: 'rgb(255,159,64,0.5)',
      borderColor: 'rgb(255,159,64)'
    }, {
      type: 'line',
      label: 'CAP vorige jaren',
      data: [2460, 2421, 2356, 2301, 2273, 2226, 2150, 2235, 2289, 2340, 2360, 2395],
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)'
    }, {
      type: 'line',
      label: 'OHCA vorige jaren',
      data: [548, 562, 553, 567, 558, 550, 547, 555, 558, 560, 552, 550],
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)'
    }, {
      type: 'line',
      label: 'Sepsis vorige jaren',
      data: [480, 473, 458, 452, 471, 476, 481, 470, 468, 474, 478, 482],
      backgroundColor: 'rgb(255,159,64)',
      borderColor: 'rgb(255,159,64)'
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarDiagnoseChartOptions = {
    scales: {
      x: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR X-AS TITEL"},
      },
      y: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR Y-AS TITEL"}
      },
    },
  };
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
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)'
    }, {
      type: 'line',
      label: 'gem. 40-50 Jaar',
      data: referentieData4050,
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)'
    }, {
      type: 'line',
      label: 'gem. 50-60 Jaar',
      data: referentieData5060,
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgb(75,192,192)'
    }, {
      type: 'line',
      label: 'gem. 60-70 Jaar',
      data: referentieData6070,
      backgroundColor: 'rgb(255,159,64)',
      borderColor: 'rgb(255,159,64)'
    }, {
      type: 'line',
      label: 'gem. 70-80 Jaar',
      data: referentieData7080,
      backgroundColor: 'rgb(153,102,255)',
      borderColor: 'rgb(153,102,255)'
    }, {
      type: 'line',
      label: 'gem. 80+ Jaar',
      data: referentieData80Plus,
      backgroundColor: 'rgb(255,205,86)',
      borderColor: 'rgb(255,205,86)'
    }, {
      type: 'bar',
      label: '18-40 Jaar',
      data: maandelijkseTotalen40Min,
      backgroundColor: 'rgb(54,162,235, 0.5)',
      borderColor: 'rgb(54,162,235)'
    }, {
      type: 'bar',
      label: '40-50 Jaar',
      data: maandelijkseTotalen4050,
      backgroundColor: 'rgb(255,99,132, 0.5)',
      borderColor: 'rgb(255,99,132)'
    }, {
      type: 'bar',
      label: '50-60 Jaar',
      data: maandelijkseTotalen5060,
      backgroundColor: 'rgb(75,192,192, 0.8)',
      bordeColor: 'rgb(75,192,192)'
    }, {
      type: 'bar',
      label: '60-70 Jaar',
      data: maandelijkseTotalen6070,
      backgroundColor: 'rgb(255,159,64,0.5)',
      borderColor: 'rgb(255,159,64)'
    }, {
      type: 'bar',
      label: '70-80 Jaar',
      data: maandelijkseTotalen7080,
      backgroundColor: 'rgb(153,102,255, 0.5)',
      borderColor: 'rgb(153,102,255)'
    }, {
      type: 'bar',
      label: '80+ Jaar',
      data: maandelijkseTotalen80Plus,
      backgroundColor: 'rgb(255,205,86,0.5)',
      borderColor: 'rgb(255,205,86)'
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarGrafiekOpnamesLeeftijdOptions = {
    scales: {
      x: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR X-AS TITEL"},
      },
      y: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR Y-AS TITEL"}
      },
    },
  };
  var jaarLeeftijdChartCtx = document.getElementById('jaarLeeftijdChart').getContext('2d');
  const jaarLeeftijdChart = new Chart(jaarLeeftijdChartCtx, {
    data: jaarGrafiekOpnamesLeeftijd,
    type: 'bar',
    options: jaarGrafiekOpnamesLeeftijdOptions,
  });
  return jaarLeeftijdChart;
};


maakICGrafiek = function() {
  var jaarICChartData = {
    datasets: [{
      type: 'line',
      label: '2023',
      data: [1.6, 1.6, 1.5, 1.4, 1.3, 1.2, 1.2, 1.3, 1.5, 1.5, 1.4, 1.6],
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)'
    }, {
      type: 'line',
      label: '2022',
      data: [1.7, 1.6, 1.5, 1.5, 1.4, 1.3, 1.2, 1.2, 1.4, 1.4, 1.5, 1.5],
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)'
    }, {
      type: 'line',
      label: '2021',
      data: [1.9, 1.8, 1.8, 1.7, 1.7, 1.6, 1.5, 1.6, 1.7, 1.8, 1.9, 1.8],
    backgroundColor: 'rgb(75,192,192)',
    borderColor: 'rgb(75,192,192)'
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarICChartOptions = {
    scales: {
      x: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR X-AS TITEL"},
      },
      y: {
        title:{color:'red', display: true, text: "VUL HIER TEXT IN VOOR Y-AS TITEL"}
      },
    },
  };
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
      backgroundColor: ['rgb(54,162,235)',
                        'rgb(255,99,132)',
                        'rgb(75,192,192)',
                        'rgb(255,159,64)',
                        'rgb(153,102,255)',
                        'rgb(255,205,86)',
                        'rgb(201,203,207)']
    }, {
      label: ['gem. 2021/2022'],
      data: referentieMedischeLeeftijdData,
      backgroundColor: ['rgb(54,162,235)',
                       'rgb(255,99,132)',
                       'rgb(75,192,192)',
                       'rgb(255,159,64)',
                       'rgb(153,102,255)',
                       'rgb(255,205,86)',
                       'rgb(201,203,207)']
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
      backgroundColor: ['rgb(54,162,235)',
                        'rgb(255,99,132)',
                        'rgb(75,192,192)',
                        'rgb(255,159,64)',
                        'rgb(153,102,255)',
                        'rgb(255,205,86)',
                        'rgb(201,203,207)']
    }, {
      label: ['gem. 2021/2022'],
      data: referentieSpoedeLeeftijdData,
      backgroundColor: ['rgb(54,162,235)',
                        'rgb(255,99,132)',
                        'rgb(75,192,192)',
                        'rgb(255,159,64)',
                        'rgb(153,102,255)',
                        'rgb(255,205,86)',
                        'rgb(201,203,207)']
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
      backgroundColor: ['rgb(54,162,235)',
                        'rgb(255,99,132)',
                        'rgb(75,192,192)',
                        'rgb(255,159,64)',
                        'rgb(153,102,255)',
                        'rgb(255,205,86)',
                        'rgb(201,203,207)']
    }, {
      label: ['gem. 2021/2022'],
      data: referentieGeplandeLeeftijdData,
      backgroundColor: ['rgb(54,162,235)',
                        'rgb(255,99,132)',
                        'rgb(75,192,192)',
                        'rgb(255,159,64)',
                        'rgb(153,102,255)',
                        'rgb(255,205,86)',
                        'rgb(201,203,207)']
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