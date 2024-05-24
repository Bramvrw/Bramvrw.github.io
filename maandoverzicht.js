// Deze functie wordt gestart wanneer de gebruiker naar het mei overzicht gaat. Deze functie laadt alle grafieken op de pagina.
function Maand() {
  //Grafiek voor opnames per dag in de maand mei
  OpnamesDag();

  //Grafiek voor opnames per dag in de maand mei per opnametype
  OpnamesDagType();

  //Grafiek voor opnames per dag in de maand mei per diagnose
  maakMaandGrafiekDiagnose();

  //Grafiek voor opnames per dag in de maand mei per leeftijdscategorie
  OpnamesLeeftijd();

  //Grafieken voor opnames in mei per leeftijdscategorie per opnametype
  leeftijdsverdelingPerOpnametype();
};

//----------FUNCTIES VOOR DATAVERWERKING---------------//
// Deze functie halveert de waarde van elk van de waardes in de array. Dit wordt gebruikt om gemiddelde aantallen te berekenen in de referentie arrays
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

function halveer(array) {
  return array.map(x => x / 2);
};

// Deze functie zorgt ervoor dat een array van dagen naar weken omgezet kan worden.
function groepeerPerWeek(data) {
  let wekelijkseData = [];
  for (let i = 0; i < data.length; i += 7) {
    // Bereken de som van de waarden voor een week (7 dagen)
    let weekTotaal = 0;
    for (let j = i; j < i + 7 && j < data.length; j++) {
      weekTotaal += data[j];
    }
    wekelijkseData.push(weekTotaal);
  }
  return wekelijkseData;
};

//------------------------QUERIES------------------------//
//Queries. Query1 vraagt het aantal medische, geplande en spoed opnames op de IC op om het totale aantal opnames in mei 2023 te berekenen. Query2 vraagt dezelfde data op, maar dan in 2021 en 2022
const opnametypesMei2023 = JSON.stringify({
  query: `{
    nvic_data(where: {datum: {_regex: "^2023-05"}}, order_by: {datum: asc}) {
      datum
      aantal_gepland
      aantal_medisch
      aantal_spoed
    }
  }`
});

const opnametypesMei20212022 = JSON.stringify({
  query: `{
    nvic_data(where: {
      _and: [
        { datum: { _regex: "-05-" } }
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

// Queries. De queries vragen van elk opnametype ook elke leeftijdscategorie uit. Query5 doet dit voor mei 2023. Query6 voor mei 2021 en 2022 
const leeftijdPerOpnametypesMei2023 = JSON.stringify({
  query: `{
    nvic_data(where: {datum: {_regex: "^2023-05"}}, order_by: {datum: asc}) {
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

const leeftijdPerOpnametypesMei20212022 = JSON.stringify({
  query: `{
    nvic_data(where: {_and: [{datum: {_regex: "-05-"}}, {datum: {_lte: "2022-12-31"}}]}, order_by: {datum: asc}) {
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

//------- FUNCTIES OM DATA OP TE VRAGEN  ------------------//
// DATA AANTALLEN OPNAMES
// Deze functie haalt data over het totale aantal IC opnames uit mei 2021 t/m 2023 op uit de database en maakt een grafiek van deze data.
function OpnamesDag() {
  // Specificatie van arrays
  let opnamesArray = [];
  let referentieOpnamesArray = Array(31).fill(0);

  // Hier wordt het totale aantal opnames per dag berekend en in een array gezet
  databaseOpvrager(opnametypesMei2023).then(opnameData => {
    opnameData.data.nvic_data.forEach(item => {
      const dagelijkseOpnames = item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
      opnamesArray.push(dagelijkseOpnames);
    });
  });

    // Tweede request wordt geopend, query2 wordt verstuurd
  databaseOpvrager(opnametypesMei20212022).then(referentieOpnameData =>{
    referentieOpnameData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const dagIndex = datum.getDate() - 1;
      referentieOpnamesArray[dagIndex] += item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
    });     
    // En wordt hier het gemiddelde aantal opnames per dag berekend 
    referentieOpnamesArray = halveer(referentieOpnamesArray);

      // Hier wordt het maken van de grafiek opgeroepen
     maakMaandGrafiekOpnames(opnamesArray, referentieOpnamesArray);
  }); 
};

// DATA OPNAMETYPES 
// Deze functie haalt data over de verschillende opnametypes op uit de database in mei en maakt hier een grafiek van
function OpnamesDagType() {
  // Specificatie van de arrays
  let MedischArray = [];
  let SpoedArray = [];
  let GeplandArray = [];
  let MedischGemiddeldArray = Array(31).fill(0);
  let SpoedGemiddeldArray = Array(31).fill(0);
  let GeplandGemiddeldArray = Array(31).fill(0);

  databaseOpvrager(opnametypesMei2023).then(opnametypesData => {
    opnametypesData.data.nvic_data.forEach(item => {
      MedischArray.push(item.aantal_medisch);
      SpoedArray.push(item.aantal_spoed);
      GeplandArray.push(item.aantal_gepland);
    });
  });

  databaseOpvrager(opnametypesMei20212022).then(referentieGemiddeldeOpnametypesData => {
    referentieGemiddeldeOpnametypesData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const dagIndex = datum.getDate() - 1;
      MedischGemiddeldArray[dagIndex] += item.aantal_medisch;
      SpoedGemiddeldArray[dagIndex] += item.aantal_spoed;
      GeplandGemiddeldArray[dagIndex] += item.aantal_gepland;
    });
          // En worden hier de gemiddelde aantallen van de opnames met dat type berekend
      MedischGemiddeldArray = halveer(MedischGemiddeldArray);
      SpoedGemiddeldArray = halveer(SpoedGemiddeldArray);
      GeplandGemiddeldArray = halveer(GeplandGemiddeldArray);

      // Roept de functie aan om de grafiek te maken
      maakMaandGrafiekOpnametypes(MedischArray, SpoedArray, GeplandArray, MedischGemiddeldArray, SpoedGemiddeldArray, GeplandGemiddeldArray);
  });
};

// DATA LEEFTIJDSCATEGORIEN 
// Deze functie maakt een grafiek van de data per leeftijdscategorie in mei 2023 met een gemiddelde aantal opnames per leeftijdscategorie van 2021 en 2022.
function OpnamesLeeftijd() {
  // Specificatie van de arrays
  let data40Min = Array(31).fill(0);
  let data4050 = Array(31).fill(0);
  let data5060 = Array(31).fill(0);
  let data6070 = Array(31).fill(0);
  let data7080 = Array(31).fill(0);
  let data80Plus = Array(31).fill(0);
  let referentieData40Min = Array(31).fill(0);
  let referentieData4050 = Array(31).fill(0);
  let referentieData5060 = Array(31).fill(0);
  let referentieData6070 = Array(31).fill(0);
  let referentieData7080 = Array(31).fill(0);
  let referentieData80Plus = Array(31).fill(0);

  databaseOpvrager(leeftijdPerOpnametypesMei2023).then(leeftijdData => {
    leeftijdData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const dagIndex = datum.getDate() - 1; 

      data40Min[dagIndex] += item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
      data4050[dagIndex] += item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
      data5060[dagIndex] += item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
      data6070[dagIndex] += item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
      data7080[dagIndex] += item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
      data80Plus[dagIndex] += item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
    });
  });

databaseOpvrager(leeftijdPerOpnametypesMei20212022).then(referentieGemiddeldeLeeftijdData => {
    referentieGemiddeldeLeeftijdData.data.nvic_data.forEach(item => {
      const datum = new Date(item.datum);
      const dagIndex = datum.getDate() - 1; 
        //getDate() geeft een getal tussen 1 en 31, maar omdat je naar index moet doe je -1 om het juiste getal te krijgen.
      referentieData40Min[dagIndex] += item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
      referentieData4050[dagIndex] += item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
      referentieData5060[dagIndex] += item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
      referentieData6070[dagIndex] += item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
      referentieData7080[dagIndex] += item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
      referentieData80Plus[dagIndex] += item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
    });
  // En worden de gemiddeldes berekend per leeftijdscategorie
  referentieData40Min = halveer(referentieData40Min);
  referentieData4050 = halveer(referentieData4050);
  referentieData5060 = halveer(referentieData5060);
  referentieData6070 = halveer(referentieData6070);
  referentieData7080 = halveer(referentieData7080);
  referentieData80Plus = halveer(referentieData80Plus);
    // Daarna worden alle arrays gegroepeerd per week om een week-weergave te kunnen creeeren 
    data40Min = groepeerPerWeek(data40Min);
    data4050 = groepeerPerWeek(data4050);
    data5060 = groepeerPerWeek(data5060);
    data6070 = groepeerPerWeek(data6070);
    data7080 = groepeerPerWeek(data7080);
    data80Plus = groepeerPerWeek(data80Plus);

    referentieData40Min = groepeerPerWeek(referentieData40Min);
    referentieData4050 = groepeerPerWeek(referentieData4050);
    referentieData5060 = groepeerPerWeek(referentieData5060);
    referentieData6070 = groepeerPerWeek(referentieData6070);
    referentieData7080 = groepeerPerWeek(referentieData7080);
    referentieData80Plus = groepeerPerWeek(referentieData80Plus);

    // En hier wordt de functie opgeroepen om de grafiek te maken
    maakMaandGrafiekOpnamesLeeftijd(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, data40Min, data4050, data5060, data6070, data7080, data80Plus);
  });
};


// DATA LEEFTIJDSVERDELING OVER OPNAMETYPES
//// Deze functie gebruikt de data van alle opnametypes en leeftijdscategorien hierbinnen om de leeftijdsverdeling per opnametype te berekenen voor mei 2023 en het gemiddelde van mei 2021 en 2022
leeftijdsverdelingPerOpnametype = function(){
  // Specificatie van arrays
  let medischLeeftijd = Array(6).fill(0);
  let spoedLeeftijd = Array(6).fill(0);
  let geplandLeeftijd = Array(6).fill(0);
  let referentieMedischLeeftijd = Array(6).fill(0);
  let referentieSpoedLeeftijd = Array(6).fill(0);
  let referentieGeplandLeeftijd = Array(6).fill(0);

  databaseOpvrager(leeftijdPerOpnametypesMei2023).then(opnametypesPerLeeftijd => {
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

  databaseOpvrager(leeftijdPerOpnametypesMei20212022).then(referentieOpnametypesPerLeeftijd => {
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
    
    // Hier worden de referentie arrays gehalveerd om het gemiddelde te berekenen 
    referentieMedischLeeftijd = halveer(referentieMedischLeeftijd);
    referentieSpoedLeeftijd = halveer(referentieSpoedLeeftijd);
    referentieGeplandLeeftijd = halveer(referentieGeplandLeeftijd);
    
    // Hier wordt de data doorgegeven aan deze drie functies om per opnametype een grafiek te maken
    maakGrafiekMedischeLeeftijd(medischLeeftijd, referentieMedischLeeftijd);
    maakGrafiekSpoedLeeftijd(spoedLeeftijd, referentieSpoedLeeftijd);
    maakGrafiekGeplandeLeeftijd(geplandLeeftijd, referentieGeplandLeeftijd);
  });
};


// -------------------------MAANDOVERZICHT GRAFIEKEN--------------------------//

//GRAFIEK opnames per dag voor een maand
maakMaandGrafiekOpnames = function(data, referentieData) {
  var maandChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal opnames',
      backgroundColor: 'rgba(54,162,235, 0.5)',
      borderColor: 'rgb(54,162,235)',
      data: data,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'line',
      label: 'Gem. aantal opnames in 2021/2022',
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)',
      data: referentieData,
      pointStyle: 'circle',
      order: 1
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
    
  };
  var maandChartOptions = {
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (dagen)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
      },
    },
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
                pointStyle: i === 0 ? 'rect' : 'line'
              };
            });
          }
        }
      }
    }
  };
  var maandChartCtx = document.getElementById('maandChart').getContext('2d');

  const maandChart = new Chart(maandChartCtx, {
    data: maandChartData,
    type: 'mixed',
    options: maandChartOptions
  });
  return maandChart;
};

//GRAFIEK opnames per dag voor een maand per opnametype
maakMaandGrafiekOpnametypes = function(dataMedisch, dataSpoed, dataGepland, referentieDataMedisch, referentieDataSpoed, referentieDataGepland) {
  var maandOpnametypesChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal Medische opnames',
      data: dataMedisch,
      backgroundColor: 'rgba(54,162,235, 0.5)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal Spoed opnames',
      data: dataSpoed,
      backgroundColor: 'rgba(255,99,132, 0.5)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal Geplande opnames',
      data: dataGepland,
      backgroundColor: 'rgba(75,192,192, 0.5)',
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'line',
      label: 'Gem. aantal Medische opnames in 2021/2022',
      data: referentieDataMedisch,
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal Spoed opnames in 2021/2022',
      data: referentieDataSpoed,
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal Geplande opnames in 2021/2022',
      data: referentieDataGepland,
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  };

  var maandOpnametypesChartOptions = {
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
                pointStyle: i < 3 ? 'rect' : 'line' 
              };
            });
          }
        }
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (dagen)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
      },
    },
  };
  var maandOpnametypesChartCtx = document.getElementById('maandOpnametypesChart').getContext('2d');
  const maandOpnametypesChart = new Chart(maandOpnametypesChartCtx, {
    data: maandOpnametypesChartData,
    type: 'mixed',
    options: maandOpnametypesChartOptions
  });
  return maandOpnametypesChart;
};

//GRAFIEK opnames per dag in de maand mei per diagnosecategorie
maakMaandGrafiekDiagnose = function() {
  var maandDiagnoseChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal Community Acquired Pneumonie (CAP)',
      data: [68, 69, 68, 70, 65, 67, 73, 71, 72, 69, 64, 65, 68, 75, 70, 73, 72, 66, 63, 74, 76, 71, 69, 70, 79, 68, 76, 69, 79, 76, 63],
      backgroundColor: 'rgba(54,162,235, 0.5)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal Out of Hospital Cardiac Arrests (OHCA)',
      data: [10, 9, 12, 11, 13, 7, 8, 8, 12, 13, 11, 9, 14, 7, 10, 12, 9, 13, 14, 11, 10, 7, 13, 12, 10, 15, 11, 14, 12, 12, 9],
      backgroundColor: 'rgba(255,99,132, 0.5)',
      borderColor: 'rgb(255,99,132)' ,
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: 'Aantal sepsis',
      data: [6, 8, 10, 7, 8 ,11, 6, 9, 10, 7, 8, 8, 12, 10, 9, 9, 11, 8, 10, 9, 7, 10, 9, 12, 13, 10, 8, 9, 9],
      backgroundColor: 'rgba(75,192,192, 0.5)' ,
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'line',
      label: 'Gem. aantal CAP in 2021/2022',
      data: [84, 70, 73, 73, 72, 74, 77, 71, 70, 76, 67, 69, 73, 75, 70, 75, 73, 72, 68, 73, 79, 70, 75, 73, 82, 72, 79, 69, 71, 78, 70],
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal OHCA in 2021/2022',
      data: [20, 15, 18, 19, 16, 19, 15, 19, 16, 12, 20, 19, 17, 18, 16, 17, 22, 19, 15, 20, 17, 21, 18, 19, 19, 23, 21, 17, 14, 24, 13],
      backgroundColor:'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. aantal sepsis in 2021/2022',
      data: [15, 16, 17, 12, 18, 15, 12, 16, 13, 15, 12, 14, 17, 16, 13, 15, 13, 18, 17, 15, 13, 16, 14, 19, 16, 15, 10, 17, 15, 19, 18],
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  };

  var maandDiagnoseChartOptions = {
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
                pointStyle: i < 3 ? 'rect' : 'line' 
              };
            });
          }
        }
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (dagen)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
      },
    },
  };
  var maandDiagnoseChartCtx = document.getElementById('maandDiagnoseChart').getContext('2d');
  const maandDiagnoseChart = new Chart(maandDiagnoseChartCtx, {
    data: maandDiagnoseChartData,
    type: 'mixed',
    options: maandDiagnoseChartOptions
  });
  return maandDiagnoseChart;
};

//GRAFIEK opnames per dag voor een maand per leeftijdscategorie
maakMaandGrafiekOpnamesLeeftijd = function(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, data40Min, data4050, data5060, data6070, data7080, data80Plus) {
  var maandGrafiekOpnamesLeeftijd = {
    datasets: [{
      type: 'bar',
      label: '18 tot 40 Jaar',
      data: data40Min,
      backgroundColor: 'rgba(54,162,235, 0.5)',
      bordercolor: 'rgb(54,162,235)',
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: '40 tot 50 Jaar',
      data: data4050,
      backgroundColor: 'rgba(255,99,132, 0.5)',
      bordercolor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: '50 tot 60 Jaar',
      data: data5060,
      backgroundColor: 'rgba(75,192,192, 0.5)',
      bordercolor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: '60 tot 70 Jaar',
      data: data6070,
      backgroundColor: 'rgba(255,159,64, 0.5)',
      bordercolor: 'rgb(255,159,64)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: '70 tot 80 Jaar',
      data: data7080,
      backgroundColor: 'rgba(153,102,255, 0.5)',
      bordercolor: 'rgb(153,102,255)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'bar',
      label: '80+ Jaar',
      data: data80Plus,
      backgroundColor: 'rgba(255,205,86, 0.5)',
      bordercolor: 'rgb(255,205,86)',
      hidden: true,
      pointStyle: 'rect',
      order: 2
    }, {
      type: 'line',
      label: 'Gem. 18 tot 40 Jaar',
      data: referentieData40Min,
      backgroundColor: 'rgb(54,162,235)',
      borderColor: 'rgb(54,162,235)',
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. 40 tot 50 Jaar',
      data: referentieData4050,
      backgroundColor: 'rgb(255,99,132)',
      borderColor: 'rgb(255,99,132)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. 50 tot 60 Jaar',
      data: referentieData5060,
      backgroundColor: 'rgb(75,192,192)',
      borderColor: 'rgb(75,192,192)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. 60 tot 70 Jaar',
      data: referentieData6070,
      backgroundColor: 'rgb(255,159,64)',
      borderColor: 'rgb(255,159,64)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. 70 tot 80 Jaar',
      data: referentieData7080,
      backgroundColor: 'rgb(153,102,255)',
      borderColor: 'rgb(153,102,255)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }, {
      type: 'line',
      label: 'Gem. 80+ Jaar',
      data: referentieData80Plus,
      backgroundColor: 'rgb(255,205,86)',
      borderColor: 'rgb(255,205,86)',
      hidden: true,
      pointStyle: 'circle',
      order: 1
    }],
    labels: ["Week 18", "Week 19" , "Week 20", "Week 21"]
  };
  var maandGrafiekOpnamesLeeftijdOptions = {
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
                pointStyle: i < 6 ? 'rect' : 'line'
              };
            });
          }
        }
      }
    },
    scales: {
      x: {
        title:{color:'black', display: true, text: "DATUM (weeknummer)"},
      },
      y: {
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES"}
      },
    },
  }
  var maandChartCtx = document.getElementById('leeftijdOpnames').getContext('2d');
  const leeftijdOpnames = new Chart(maandChartCtx, {
    data: maandGrafiekOpnamesLeeftijd,
    type: 'mixed',
    options: maandGrafiekOpnamesLeeftijdOptions,
  });
  return leeftijdOpnames;
};

//GRAFIEK leeftijdsverdeling van medische opnames
maakGrafiekMedischeLeeftijd = function(medischeLeeftijdData, referentieMedischeLeeftijdData){
  var medischLeeftijdData = {
    labels: ['18 tot 40 jaar', '40 tot 50 jaar', '50 tot 60 jaar', '60 tot 70 jaar', '70 tot 80 jaar', '80+ jaar'],
    datasets: [{
      label: 'Mei 2023',
      data: medischeLeeftijdData,
      backgroundColor: 'rgba(54,162,235,0.5)', 
      borderColor: 'rgb(54,162,235)', 
      type: 'bar',
      pointStyle: 'rect',
      order: 2
    }, {
      label: 'Gem. mei 2021/2022',
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
                pointStyle: i === 0 ? 'rect' : 'line' 
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
  var medischeLeeftijdChartCtx = document.getElementById('medischeLeeftijd').getContext('2d');
  const medischeLeeftijdChart = new Chart(medischeLeeftijdChartCtx, {
    type: 'bar',
    data: medischLeeftijdData,
    options: medischeLeeftijdOptions
  });
  return medischeLeeftijdChart;
};

//GRAFIEK leeftijdsverdeling van spoed opnames
maakGrafiekSpoedLeeftijd = function(spoedeLeeftijdData, referentieSpoedeLeeftijdData){
  var spoedLeeftijdData = {
    labels: ['18 tot 40 jaar', '40 tot 50 jaar', '50 tot 60 jaar', '60 tot 70 jaar', '70 tot 80 jaar', '80+ jaar'],
    datasets: [{
      label: ['Mei 2023'],
      data: spoedeLeeftijdData,
      backgroundColor: 'rgba(54,162,235,0.5)', 
      borderColor: 'rgb(54,162,235)', 
      type: 'bar',
      pointStyle: 'rect',
      order: 2
    }, {
      label: ['Gem. mei 2021/2022'],
      data: referentieSpoedeLeeftijdData,
      fill: false, 
      borderColor: 'rgb(255,99,132)',
      backgroundColor:  'rgb(255,99,132)',
      type: 'line', 
      pointStyle: 'circle',
      order: 1
    }]
  };
  var spoedLeeftijdOptions = {
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
                pointStyle: i === 0 ? 'rect' : 'line'
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
  var spoedLeeftijdChartCtx = document.getElementById('spoedLeeftijd').getContext('2d');

  const spoedLeeftijdChart = new Chart(spoedLeeftijdChartCtx, {
    data: spoedLeeftijdData,
    options: spoedLeeftijdOptions
  });
  return spoedLeeftijdChart;
};

//GRAFIEK leeftijdsverdeling van geplande opnames
maakGrafiekGeplandeLeeftijd = function(geplandeLeeftijdData, referentieGeplandeLeeftijdData){
  var geplandLeeftijdData = {
    labels: ['18 tot 40 jaar', '40 tot 50 jaar', '50 tot 60 jaar', '60 tot 70 jaar', '70 tot 80 jaar', '80+ jaar'],
    datasets: [{
      label: ['Mei 2023'],
      data: geplandeLeeftijdData,
      backgroundColor: 'rgba(54,162,235,0.5)', 
      borderColor: 'rgb(54,162,235)',
      type: 'bar',
      pointStyle: 'rect',
      order: 2
    }, {
      label: ['Gem. mei 2021/2022'],
      data: referentieGeplandeLeeftijdData,
      fill: false, 
      borderColor: 'rgb(255,99,132)', 
      backgroundColor: 'rgb(255,99,132)',	
      type: 'line',
      pointStyle: 'circle',
      order: 1
    }, ]
  };
  var geplandLeeftijdOptions = {
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
                pointStyle: i === 0 ? 'rect' : 'line'
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
        title:{color:'black', display: true, text: "AANTAL IC-OPNAMES (Gepland)"},
      },
    },
  };
  var geplandLeeftijdChartCtx = document.getElementById('geplandLeeftijd').getContext('2d');

  const geplandLeeftijdChart = new Chart(geplandLeeftijdChartCtx, {
    data: geplandLeeftijdData,
    options: geplandLeeftijdOptions
  });
  return geplandLeeftijdChart;
};