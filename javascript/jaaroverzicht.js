// Deze functie wordt gestart wanneer de jaaroverzicht pagina wordt geladen. Het zorgt ervoor dat alle grafieken worden geladen.
function Jaar() {
  // Grafiek voor opnames per maand in 2023
  opnamesMaand();

  // Grafiek voor opnames per maand per opnametype 
  opnametypesMaand();

  // Grafiek voor opnames per maad per diagnosecategorie
  maakJaarGrafiekDiagnose();

  // Grafieken voor opnames per maand per leeftijdscategorie
  OpnamesLeeftijdMaand();

  // Grafieken voor opnames per maand van de leeftijdsverdeling per opnametype
  leeftijdsverdelingsOpnametypesMaand();

  // Grafiek IC-behandelduur per maand 
  maakICGrafiek();
};

//--------------------FUNCTIES VOOR DATAVERWERKING-----------//
// Deze functie maakt een XMLHttpRequest aan naar onze hasura database en verzend een query. Deze query wordt opgehaald en het antwoord wordt geparsed naar een JSON object en teruggestuurd
databaseOpvrager = function(query){
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
    request.setRequestHeader('content-type', 'application/json');
    request.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
    request.send(query);
    request.onload = function() {
      const antwoord = JSON.parse(request.response);
      resolve(antwoord);
    } 
  });
};

// Deze functie halveert de waarde van elk van de waardes in de array. Dit wordt gebruikt om gemiddelde aantallen te berekenen in de referentie arrays (map zorgt ervoor dat index 0 door 2 gedeeld kan worden, etc)
function halveer(array) {
  return array.map(x => x / 2);
};

//---------------------QUERIES-----------------------------//
// Deze query haalt alle aantallen opnames van elk soort opname op in 2023 en wordt op datum gesorteerd
const opnametypes2023 = JSON.stringify({
  query: `{
    nvic_data(where: {datum: {_regex: "^2023"}}, order_by: {datum: asc}) {
      datum
      aantal_gepland
      aantal_medisch
      aantal_spoed
    }
  }`
});

// Deze query haalt alle aantallen opnames van elk soort opname op in 2021 en 2022 en wordt op datum gesorteerd
const opnametypes20212022 = JSON.stringify({
  query: `{
    nvic_data(where: { datum: { _lte: "2022-12-31" } }, order_by: { datum: asc }) {
      datum
      aantal_gepland
      aantal_medisch
      aantal_spoed
    }
  }`
});

//Deze query haalt alle leeftijdscategorien in elk opnametype op uit de database voor het jaar 2023. De data wordt op datum gesorteerd
const leeftijdPerOpnametypes2023 = JSON.stringify({
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

//Deze query haalt alle leeftijdscategorien in elk opnametype op uit de database voor de jaren 2021 en 2022. De data wordt op datum gesorteerd
const leeftijdPerOpnametypes20212022 = JSON.stringify({
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

// --------------FUNCTIES OM DATA OP TE VRAGEN --------------------------//
// DATA AANTAL OPNAMES
// Deze functie haalt data over het totale aantal IC opnames uit 2021-2023 op uit de database en maakt een grafiek van deze data.
opnamesMaand = function() {
  // Specificatie van arrays
  let maandelijkseOpnames = Array(12).fill(0);
  let referentieMaandelijkseOpnames = Array(12).fill(0);

  // De data wordt per maand opgeteld in een array (2023)
  databaseOpvrager(opnametypes2023).then(opnameData => {
    opnameData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();
      maandelijkseOpnames[maandIndex] += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
    });
  });

  // De data wordt per maand opgeteld in een array (2021/2022)
  databaseOpvrager(opnametypes20212022).then(referentieOpnameData => {
    referentieOpnameData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();
      referentieMaandelijkseOpnames[maandIndex] += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
    });
    
    // Hier worden de gemiddeldes van de referentiewaardes berekend
    referentieMaandelijkseOpnames = halveer(referentieMaandelijkseOpnames);
    
    //En wordt een functie aangeroepen om de grafiek te maken
    maakJaarGrafiekOpnames(maandelijkseOpnames, referentieMaandelijkseOpnames);
  });
};

// DATA OPNAMETYPES 
// Deze functie maakt een overzicht van alle opnames per opnametype per maand in 2023, ten opzichte van de opnames per maand in 2021 en 2022.
opnametypesMaand = function() {
  // Specificatie van arrays
  let medischArray = Array(12).fill(0);
  let spoedArray = Array(12).fill(0);
  let geplandArray = Array(12).fill(0);
  let referentieMedischArray = Array(12).fill(0);
  let referentieSpoedArray = Array(12).fill(0);
  let referentieGeplandArray = Array(12).fill(0);

  // Er wordt voor elke maand bijgehouden hoeveel van elk type opname er zijn (2023)
  databaseOpvrager(opnametypes2023).then(opnametypesData => {
    opnametypesData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();

      medischArray[maandIndex] += item.aantal_medisch;
      spoedArray[maandIndex] += item.aantal_spoed;
      geplandArray[maandIndex] += item.aantal_gepland;
    });
  });

  // Er wordt voor elke maand bijgehouden hoeveel van elk type opname er zijn (2021/2022)
  databaseOpvrager(opnametypes20212022).then(referentieOpnametypeData => {
    referentieOpnametypeData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();

      referentieMedischArray[maandIndex] += item.aantal_medisch;
      referentieSpoedArray[maandIndex] += item.aantal_spoed;
      referentieGeplandArray[maandIndex] += item.aantal_gepland;
    });
    
    // Hier worden de gemiddeldes van de referentiewaardes berekend
    referentieMedischArray = halveer(referentieMedischArray);
    referentieSpoedArray = halveer(referentieSpoedArray);
    referentieGeplandArray = halveer(referentieGeplandArray);
    
    // Als laatste wordt de data doorgegeven aan deze functie om een grafiek te maken
    maakJaarGrafiekOpnametypes(medischArray, spoedArray, geplandArray, referentieMedischArray, referentieSpoedArray, referentieGeplandArray);
  });
};

// DATA LEEFTIJDSCATEGORIEN
// Deze functie maakt een grafiek van de data per leeftijdscategorie per maand over heel 2023. Met een gemiddelde aantal opnames per maand per leeftijdscategorie van 2021 en 2022.
function OpnamesLeeftijdMaand() {
  // Specificatie van arrays
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

  // De aantallen opnames van elke leeftijdscategorie worden per maand opgeslagen in de array voor die leeftijdscategorie (2023)
  databaseOpvrager(leeftijdPerOpnametypes2023).then(leeftijdData => {
    leeftijdData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth();

      maandelijkseTotalen40Min[maandIndex] += item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
      maandelijkseTotalen4050[maandIndex] += item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
      maandelijkseTotalen5060[maandIndex] += item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
      maandelijkseTotalen6070[maandIndex] += item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
      maandelijkseTotalen7080[maandIndex] += item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
      maandelijkseTotalen80Plus[maandIndex] += item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
    });
  });

  // De aantallen opnames van elke leeftijdscategorie worden per maand opgeslagen in de array voor die leeftijdscategorie (2021/2022)
  databaseOpvrager(leeftijdPerOpnametypes20212022).then(leeftijdDataGem => {
    leeftijdDataGem.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const maandIndex = datum.getMonth(); //getMonth() is zero-based, en geeft een getal tussen 0 en 11 terug voor de maand.
      // Voeg de totalen toe aan de juiste maand in de juiste leeftijdscategorie
      referentieData40Min[maandIndex] += item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
      referentieData4050[maandIndex] += item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
      referentieData5060[maandIndex] += item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
      referentieData6070[maandIndex] += item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
      referentieData7080[maandIndex] += item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
      referentieData80Plus[maandIndex] += item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
    });
    
    // Daarna worden de gemiddeldes van de referentiewaarden berekend
    referentieData40Min = halveer(referentieData40Min);
    referentieData4050 = halveer(referentieData4050);
    referentieData5060 = halveer(referentieData5060);
    referentieData6070 = halveer(referentieData6070);
    referentieData7080 = halveer(referentieData7080);
    referentieData80Plus = halveer(referentieData80Plus);

    // En wordt als laatste de data doorgegeven aan de functie die de grafiek maakt
    maakJaarGrafiekOpnamesLeeftijd(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, maandelijkseTotalen40Min, maandelijkseTotalen4050, maandelijkseTotalen5060, maandelijkseTotalen6070, maandelijkseTotalen7080, maandelijkseTotalen80Plus); 
  });
}; 

// DATA LEEFTIJDSVERDELING OVER OPNAMETYPES
// Deze functie maakt drie grafieken om de leeftijdsverdeling per opnametype te berekenen voor 2023 en het gemiddelde van 2021 en 2022
leeftijdsverdelingsOpnametypesMaand = function() {
  // Specificatie van arrays
  let medischLeeftijd = Array(6).fill(0);
  let spoedLeeftijd = Array(6).fill(0);
  let geplandLeeftijd = Array(6).fill(0);
  let referentieMedischLeeftijd = Array(6).fill(0);
  let referentieSpoedLeeftijd = Array(6).fill(0);
  let referentieGeplandLeeftijd = Array(6).fill(0);

  // Hier worden de aantallen opnames per leeftijdscategorien per opnametype bij elkaar opgeteld (2023)
  databaseOpvrager(leeftijdPerOpnametypes2023).then(opnametypesPerLeeftijd => {
    opnametypesPerLeeftijd.data.nvic_data.forEach(item => {
      medischLeeftijd[0] += item.aantal_medisch_40min;
      medischLeeftijd[1] += item.aantal_medisch_40_50;
      medischLeeftijd[2] += item.aantal_medisch_50_60;
      medischLeeftijd[3] += item.aantal_medisch_60_70;
      medischLeeftijd[4] += item.aantal_medisch_70_80;
      medischLeeftijd[5] += item.aantal_medisch_80plus;
      spoedLeeftijd[0] += item.aantal_spoed_40min;
      spoedLeeftijd[1] += item.aantal_spoed_40_50;
      spoedLeeftijd[2] += item.aantal_spoed_50_60;
      spoedLeeftijd[3] += item.aantal_spoed_60_70;
      spoedLeeftijd[4] += item.aantal_spoed_70_80;
      spoedLeeftijd[5] += item.aantal_spoed_80plus;
      geplandLeeftijd[0] += item.aantal_gepland_40min;
      geplandLeeftijd[1] += item.aantal_gepland_40_50;
      geplandLeeftijd[2] += item.aantal_gepland_50_60;
      geplandLeeftijd[3] += item.aantal_gepland_60_70;
      geplandLeeftijd[4] += item.aantal_gepland_70_80;
      geplandLeeftijd[5] += item.aantal_gepland_80plus;
    });
  });

  // Hier worden de aantallen opnames per leeftijdscategorie per opnametype bij elkaar opgeteld (2021/2022)
  databaseOpvrager(leeftijdPerOpnametypes20212022).then(referentieOpnametypesPerLeeftijd => {
    referentieOpnametypesPerLeeftijd.data.nvic_data.forEach(item => {
      referentieMedischLeeftijd[0] += item.aantal_medisch_40min;
      referentieMedischLeeftijd[1] += item.aantal_medisch_40_50;
      referentieMedischLeeftijd[2] += item.aantal_medisch_50_60;
      referentieMedischLeeftijd[3] += item.aantal_medisch_60_70;
      referentieMedischLeeftijd[4] += item.aantal_medisch_70_80;
      referentieMedischLeeftijd[5] += item.aantal_medisch_80plus;
      referentieSpoedLeeftijd[0] += item.aantal_spoed_40min;
      referentieSpoedLeeftijd[1] += item.aantal_spoed_40_50;  
      referentieSpoedLeeftijd[2] += item.aantal_spoed_50_60;
      referentieSpoedLeeftijd[3] += item.aantal_spoed_60_70;
      referentieSpoedLeeftijd[4] += item.aantal_spoed_70_80;
      referentieSpoedLeeftijd[5] += item.aantal_spoed_80plus;
      referentieGeplandLeeftijd[0] += item.aantal_gepland_40min;
      referentieGeplandLeeftijd[1] += item.aantal_gepland_40_50;
      referentieGeplandLeeftijd[2] += item.aantal_gepland_50_60;
      referentieGeplandLeeftijd[3] += item.aantal_gepland_60_70;
      referentieGeplandLeeftijd[4] += item.aantal_gepland_70_80;
      referentieGeplandLeeftijd[5] += item.aantal_gepland_80plus;
    });
    // Dan worden hier de gemiddeldes van de referentiewaarden berekend
    referentieMedischLeeftijd = halveer(referentieMedischLeeftijd);
    referentieSpoedLeeftijd = halveer(referentieSpoedLeeftijd);
    referentieGeplandLeeftijd = halveer(referentieGeplandLeeftijd);

    // Hier wordt de data doorgegeven aan deze drie functies om per opnametype een grafiek te maken
    maakGrafiekMedischeLeeftijd(medischLeeftijd, referentieMedischLeeftijd);
    maakGrafiekSpoedLeeftijd(spoedLeeftijd, referentieSpoedLeeftijd);
    maakGrafiekGeplandeLeeftijd(geplandLeeftijd, referentieGeplandLeeftijd);
  }); 
}; 


// -----------------------------JAAROVERZICHT GRAFIEKEN---------------------------//

//GRAFIEK Aantal opnames per maand in 2023
maakJaarGrafiekOpnames = function(data, referentiedata) {
  var jaarChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal opnames 2023',
      data: data,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'line',
      label: 'Gem. aantal opnames in 2021/2022',
      data: referentiedata,
      pointStyle: 'circle',
      order: 1
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarChartOptions = {
    plugins: {
      legend: {
        onHover: function(event) {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: function(event){
          event.native.target.style.cursor = 'default';
        },
        labels: {
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            return data.datasets.map((dataset, i) => {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i, 
                pointStyle: i === 0 ? 'rect' : 'line' //Eerste dataset krijgt in de legenda een rechthoekje, de andere een lijn
              };
            });
          }
        }
      },
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (maanden)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
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
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal Spoed opnames',
      data: spoedData,
      backgroundColor: 'rgb(255,99,132,0.5)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal Geplande opnames',
      data: geplandData,
      backgroundColor: 'rgb(75,192,192, 0.5)',
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'line',
      label: 'Gem. aantal Medische opnames in 2021/2022',
      data: referentieMedischData,
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal Spoed opnames in 2021/2022',
      data: referentieSpoedData,
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal Geplande opnames in 2021/2022',
      data: referentieGeplandData,
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarOpnametypesChartOptions = {
    plugins: {
      legend: {
        onHover: function(event) {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: function(event){
          event.native.target.style.cursor = 'default';
        },
        labels: {
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            return data.datasets.map((dataset, i) => {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i,
                pointStyle: i < 3 ? 'rect' : 'line' // De eerste drie datasets krijgen in de legenda een rechthoekje, de rest een lijntje
              };
            });
          }
        }
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (maanden)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
      },
    },
  };
  setTimeout(function(){
  var jaarOpnametypesChartCtx = document.getElementById('jaarOpnametypesChart').getContext('2d');
  const jaarOpnametypesChart = new Chart(jaarOpnametypesChartCtx, {
    data: jaarOpnametypesChartData,
    type: 'mixed',
    options: jaarOpnametypesChartOptions
  });
  return jaarOpnametypesChart;
  },250);
};

//GRAFIEK Aantal opnames per maand gebaseerd op opnametype
maakJaarGrafiekDiagnose = function() {
  var jaarDiagnoseChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal Community Acquired Pneumonie (CAP)',
      data: [2389, 2275, 2265, 2198, 2178, 2128, 2015, 2149, 2189, 2238, 2245, 2303],
      backgroundColor: 'rgb(54,162,235, 0.5)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal Out of Hospital Cardiac Arrests (OHCA)',
      data: [328, 356, 375, 345, 338, 321, 339, 348, 350, 347, 341, 343],
      backgroundColor: 'rgba(255,99,132, 0.5)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal sepsis',
      data: [304, 287, 259, 253, 284, 299, 306, 289, 283, 291, 312, 319],
      backgroundColor: 'rgba(75,192,192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'line',
      label: 'Gem. aantal CAP in 2021/2022',
      data: [2460, 2421, 2356, 2301, 2273, 2226, 2150, 2235, 2289, 2340, 2360, 2395],
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal OHCA in 2021/2022 ',
      data: [548, 562, 553, 567, 558, 550, 547, 555, 558, 560, 552, 550],
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal Sepsis in 2021/2022',
      data: [480, 473, 458, 452, 471, 476, 481, 470, 468, 474, 478, 482],
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgb(75, 192, 192)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarDiagnoseChartOptions = {
    plugins: {
      legend: {
        onHover: function(event) {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: function(event){
          event.native.target.style.cursor = 'default';
        },
        labels: {
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            return data.datasets.map((dataset, i) => {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i,
                pointStyle: i < 3 ? 'rect' : 'line' // De eerste drie datasets krijgen in de legenda een rechthoekje, de rest een lijntje
              };
            });
          }
        }
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (maanden)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
      },
    },
  };
  setTimeout(function(){
  var jaarDiagnoseChartCtx = document.getElementById('jaarDiagnoseChart').getContext('2d');
  const jaarDiagnoseChart = new Chart(jaarDiagnoseChartCtx, {
    data: jaarDiagnoseChartData,
    type: 'mixed',
    options: jaarDiagnoseChartOptions
  });
  return jaarDiagnoseChart;
  },250);
};

//GRAFIEK Aantal opnames per maand gebaseerd op leeftijdsgroep
maakJaarGrafiekOpnamesLeeftijd = function(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, maandelijkseTotalen40Min, maandelijkseTotalen4050, maandelijkseTotalen5060, maandelijkseTotalen6070, maandelijkseTotalen7080, maandelijkseTotalen80Plus) {
  var jaarGrafiekOpnamesLeeftijd = {
    datasets: [{
      type: 'bar',
      label: '18 tot 40 Jaar',
      data: maandelijkseTotalen40Min,
      backgroundColor: 'rgb(54,162,235, 0.5)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'rect',
      order:2
    }, {
      type: 'bar',
      label: '40 tot 50 Jaar',
      data: maandelijkseTotalen4050,
      backgroundColor: 'rgb(255,99,132, 0.5)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'rect',
      order:2
    }, {
      type: 'bar',
      label: '50 tot 60 Jaar',
      data: maandelijkseTotalen5060,
      backgroundColor: 'rgb(75,192,192, 0.5)',
      bordeColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'rect',
      order:2
    }, {
      type: 'bar',
      label: '60 tot 70 Jaar',
      data: maandelijkseTotalen6070,
      backgroundColor: 'rgb(255,159,64,0.5)',
      borderColor: 'rgb(255,159,64)',
      hidden: true,
      pointStyle: 'rect',
      order:2
    }, {
      type: 'bar',
      label: '70 tot 80 Jaar',
      data: maandelijkseTotalen7080,
      backgroundColor: 'rgb(153,102,255, 0.5)',
      borderColor: 'rgb(153,102,255)',
      hidden: true,
      pointStyle: 'rect',
      order:2
    }, {
      type: 'bar',
      label: '80+ Jaar',
      data: maandelijkseTotalen80Plus,
      backgroundColor: 'rgb(255,205,86,0.5)',
      borderColor: 'rgb(255,205,86)',
      hidden: true,
      pointStyle: 'rect',
      order:2
    }, {
      type: 'line',
      label: 'Gem. 18 tot 40 Jaar',
      data: referentieData40Min,
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'circle',
      order:1
    }, {
      type: 'line',
      label: 'Gem. 40 tot 50 Jaar',
      data: referentieData4050,
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'circle',
      order:1
    }, {
      type: 'line',
      label: 'Gem. 50 tot 60 Jaar',
      data: referentieData5060,
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'circle',
      order:1
    }, {
      type: 'line',
      label: 'Gem. 60 tot 70 Jaar',
      data: referentieData6070,
      backgroundColor: 'rgb(255,159,64)',
      borderColor: 'rgb(255,159,64)',
      hidden: true,
      pointStyle: 'circle',
      order:1
    }, {
      type: 'line',
      label: 'Gem. 70 tot 80 Jaar',
      data: referentieData7080,
      backgroundColor: 'rgb(153,102,255)',
      borderColor: 'rgb(153,102,255)',
      hidden: true,
      pointStyle: 'circle',
      order:1
    }, {
      type: 'line',
      label: 'Gem. 80+ Jaar',
      data: referentieData80Plus,
      backgroundColor: 'rgb(255,205,86)',
      borderColor: 'rgb(255,205,86)',
      hidden: true,
      pointStyle: 'circle',
      order:1
    },],
    labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  };

  var jaarGrafiekOpnamesLeeftijdOptions = {
    plugins: {
      legend: {
        onHover: function(event) {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: function(event){
          event.native.target.style.cursor = 'default';
        },
        labels: {
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            return data.datasets.map((dataset, i) => {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i,
                pointStyle: i < 6 ? 'rect' : 'line' // De eerste zes datasets krijgen in de legenda een rechthoekje, de rest een lijntje
              };
            });
          }
        }
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (maanden)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
      },
    },
  };
  setTimeout(function(){
  var jaarLeeftijdChartCtx = document.getElementById('jaarLeeftijdChart').getContext('2d');
  const jaarLeeftijdChart = new Chart(jaarLeeftijdChartCtx, {
    data: jaarGrafiekOpnamesLeeftijd,
    type: 'bar',
    options: jaarGrafiekOpnamesLeeftijdOptions,
  });
  return jaarLeeftijdChart;
  },250);
};

//GRAFIEK leeftijdsverdeling van medische opnames
maakGrafiekMedischeLeeftijd = function(medischeLeeftijdData, referentieMedischeLeeftijdData){
  var medischLeeftijdData = {
    labels: ['18 tot 40 jaar', '40 tot 50 jaar', '50 tot 60 jaar', '60 tot 70 jaar', '70 tot 80 jaar', '80+ jaar'],
    datasets: [{
      label: '2023',
      data: medischeLeeftijdData,
      backgroundColor: 'rgba(54,162,235,0.5)', 
      borderColor: 'rgba(54,162,235,1)', 
      type: 'bar',
      pointStyle: 'rect',
      order: 2
    }, {
     label: 'Gem. 2021/2022',
      data: referentieMedischeLeeftijdData,
      fill: false, 
      borderColor: 'rgb(255,99,132)', 
      backgroundColor: 'rgb(255,99,132)',
      type: 'line', 
      pointStyle: 'circle',
      order: 1
    }]
  };
  var medischeLeeftijdOptions = {
    plugins: {
      legend:{
        onHover: function(event) {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: function(event){
          event.native.target.style.cursor = 'default';
        },
        labels: {
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            return data.datasets.map((dataset, i) => {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i, 
                pointStyle: i === 0 ? 'rect' : 'line' //Eerste dataset krijgt in de legenda een rechthoekje, de andere een lijn
              };
            });
          }
        }
      },
      title: {
        display: true,
        text: 'Leeftijdsverdeling van medische opnames'
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "LEEFTIJDSGROEP"}
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES (Medisch)"}
      },
    },
  };
  setTimeout(function(){
  var medischeLeeftijdChartCtx = document.getElementById('medischeLeeftijd').getContext('2d');
  const medischeLeeftijdChart = new Chart(medischeLeeftijdChartCtx, {
    type: 'bar',
    data: medischLeeftijdData,
    options: medischeLeeftijdOptions
  });
  return medischeLeeftijdChart;
  },250);
};

//GRAFIEK leeftijdsverdeling van spoed opnames
maakGrafiekSpoedLeeftijd = function(spoedeLeeftijdData, referentieSpoedeLeeftijdData){
  var spoedLeeftijdData = {
    labels: ['18 tot 40 jaar', '40 tot 50 jaar', '50 tot 60 jaar', '60 tot 0 jaar', '70 tot 80 jaar', '80+ jaar'],
    datasets: [{
      label: ['2023'],
      data: spoedeLeeftijdData,
      backgroundColor: 'rgba(54,162,235,0.5)', 
      borderColor: 'rgba(54,162,235,1)', 
      type: 'bar',
      pointStyle: 'rect',
      order: 2
    }, {
      label: ['Gem. 2021/2022'],
      data: referentieSpoedeLeeftijdData,
      fill: false, 
      borderColor: 'rgb(255,99,132)', 
      backgroundColor: 'rgb(255,99,132)',
      type: 'line',
      pointStyle: 'circle',
      order: 1
    }]
  };
  var spoedLeeftijdOptions = {
    plugins: {
        legend: {
          onHover: function(event) {
            event.native.target.style.cursor = 'pointer';
          },
          onLeave: function(event){
            event.native.target.style.cursor = 'default';
          },
          labels: {
            usePointStyle: true,
            generateLabels: function(chart) {
              const data = chart.data;
              return data.datasets.map((dataset, i) => {
                return {
                  text: dataset.label,
                  fillStyle: dataset.backgroundColor,
                  strokeStyle: dataset.borderColor,
                  hidden: !chart.isDatasetVisible(i),
                  datasetIndex: i, 
                  pointStyle: i === 0 ? 'rect' : 'line' //Eerste dataset krijgt in de legenda een rechthoekje, de andere een lijn
                };
              });
            }
          }
        },
      title: {
        display: true,
        text: 'Leeftijdsverdeling van spoed opnames'
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "LEEFTIJDSGROEP"}
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES (Spoed)"}
      },
    },
  };
  setTimeout(function(){
  var spoedLeeftijdChartCtx = document.getElementById('spoedLeeftijd').getContext('2d');

  const spoedLeeftijdChart = new Chart(spoedLeeftijdChartCtx, {
    data: spoedLeeftijdData,
    options: spoedLeeftijdOptions
  });
  return spoedLeeftijdChart;
  },250);
};

//GRAFIEK leeftijdsverdeling van geplande opnames
maakGrafiekGeplandeLeeftijd = function(geplandeLeeftijdData, referentieGeplandeLeeftijdData){
  var geplandLeeftijdData = {
    labels: ['18 tot 40 jaar', '40 tot 50 jaar', '50 tot 60 jaar', '60 tot 70 jaar', '70 tot 80 jaar', '80+ jaar'],
    datasets: [{
      label: ['2023'],
      data: geplandeLeeftijdData,
      backgroundColor: 'rgba(54,162,235,0.5)', 
      borderColor: 'rgba(54,162,235,1)',
      type: 'bar',
      pointStyle: 'rect',
      order: 2
    }, {
  label: ['Gem. 2021/2022'],
      data: referentieGeplandeLeeftijdData,
      fill: false, 
      borderColor: 'rgb(255,99,132)',
      backgroundColor:'rgb(255,99,132)',
      type: 'line',
      pointStyle: 'circle',
      order: 1
    }]
  };
  var geplandLeeftijdOptions = {
    plugins: {
      legend: {
        onHover: function(event) {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: function(event){
          event.native.target.style.cursor = 'default';
        },
        labels: {
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            return data.datasets.map((dataset, i) => {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i,
                pointStyle: i === 0 ? 'rect' : 'line' //Eerste dataset krijgt in de legenda een rechthoekje, de andere een lijn
              };
            });
          }
        }
      },
      title: {
        display: true,
        text: 'Leeftijdsverdeling van geplande opnames'
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "LEEFTIJDSGROEP"}
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES (Gepland)"}
      },
    },
  };
  setTimeout(function(){
  var geplandLeeftijdChartCtx = document.getElementById('geplandLeeftijd').getContext('2d');

  const geplandLeeftijdChart = new Chart(geplandLeeftijdChartCtx, {
    data: geplandLeeftijdData,
    options: geplandLeeftijdOptions
  });
  return geplandLeeftijdChart;
  },250);
};

//GRAFIEK IC-behandelduur
maakICGrafiek = function() {
    var jaarICChartData = {
      datasets: [{
        type: 'line',
        label: '2023',
        data: [1.6, 1.6, 1.5, 1.4, 1.3, 1.2, 1.2, 1.3, 1.5, 1.5, 1.4, 1.6],
        backgroundColor: 'rgb(54,162,235)',
        borderColor: 'rgb(54,162,235)',
        pointStyle: 'circle'
      }, {
        type: 'line',
        label: '2022',
        data: [1.7, 1.6, 1.5, 1.5, 1.4, 1.3, 1.2, 1.2, 1.4, 1.4, 1.5, 1.5],
        backgroundColor: 'rgb(255,99,132)',
        borderColor: 'rgb(255,99,132)',
        pointStyle: 'circle'
      }, {
        type: 'line',
        label: '2021',
        data: [1.9, 1.8, 1.8, 1.7, 1.7, 1.6, 1.5, 1.6, 1.7, 1.8, 1.9, 1.8],
        backgroundColor: 'rgb(75,192,192)',
        borderColor: 'rgb(75,192,192)',
        pointStyle: 'circle'
      }],
      labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
    };

    var jaarICChartOptions = {
      plugins: {
        legend: {
          onHover: function(event) {
            event.native.target.style.cursor = 'pointer';
          },
          onLeave: function(event){
            event.native.target.style.cursor = 'default';
          },
          labels: {
            usePointStyle: true,
            pointStyle: 'line'
          }
        }
      },
      scales: {
        x: {
          title:{color:'black', display: true, text: "DATUM (maanden)"},
        },
        y: {
          title:{color:'black', display: true, text: "GEMIDDELDE LIGDUUR (DAGEN)"}
        },
      },
    };
  setTimeout(function(){
    var jaarICChartCtx = document.getElementById('jaarICChart').getContext('2d');
    const jaarICChart = new Chart(jaarICChartCtx, {
      data: jaarICChartData,
      type: 'line',
      options: jaarICChartOptions
    });
    return jaarICChart;
  },250);
  };