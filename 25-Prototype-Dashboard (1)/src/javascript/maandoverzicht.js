//Bij elke grafiek in de opties ervoor zorgen dat de kleuren van lijnen overeenkomen  met de lijnen van de bars zodat duidelijk is wat bij wat hoort!!!

//grafieken voor de opnames in mei
function Maand(){
  //Grafiek voor opnames per dag in de maand mei
  maakMaandGrafiekOpnames();
  //Grafiek voor opnames per dag in de maand mei per opnametype
  maakMaandGrafiekOpnametypes();
  //Grafiek voor opnames per dag in de maand mei per diagnosecategorie
  maakMaandGrafiekDiagnose();
  //Grafiek voor opnames per dag in de maand mei per leeftijdscategorie
  maakMaandGrafiekOpnamesLeeftijd();

  //hier komt nog een functie voor gemiddelde IC-behandelduren in mei vs mei andere jaren. Komt wanneer we de database krijgen

  
  //Gebruikt data uit de database
  //leeftijdopvragen();
};

// --------------OPVRAGEN UIT DATABASE-----------------------------
function leeftijdopvragen(){
  const request = new XMLHttpRequest();
  let leeftijdenArray = [];

  // Dit is de query die we gaan opvragen
  const query = JSON.stringify({
    query: `{
      TEST {
        leeftijd
      }
    }`,
  });

  // Hier wordt de query ge-request en data van de query opgeslagen in leeftijdData
  request.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request.setRequestHeader('content-type', 'application/json');
  request.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request.send(query);

  request.onload = function() {
    const leeftijdData = JSON.parse(request.response);
    console.log(leeftijdData);

    // Haal de leeftijden op uit de GraphQL-response en sla ze op in de array
    leeftijdData.data.TEST.forEach(item => {
      leeftijdenArray.push(item.leeftijd);
    });

    // Maak de pie chart met de leeftijdenArray
    maakPieChart(leeftijdenArray);
  };
};

function maakPieChart(data)	{
  var pieChartData = {
      labels: data,
      datasets: [{
          data: data,
          backgroundColor: [
              "red",
              "blue",
              "yellow",
              "green",
              "purple",
              "orange"
          ]
      }]
  };

  var pieChartOptions = {};

  var pieCtx = document.getElementById('pieChart').getContext('2d');
  var pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: pieChartData,
      options: pieChartOptions
  });

  return pieChart;  
};

// -------------------------MAANDOVERZICHT------------------------------

//GRAFIEK opnames per dag voor een maand
maakMaandGrafiekOpnames = function (){
  var maandChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'line',
      label: 'Gemiddeld aantal opnames van vorige jaren',
      data: [30,40,30,33,35,43,22,23,43,23,43,35,23,34,43,33,34,24,14,30,40,30,33,35,43,22,23,43,23,43,35],
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23','24','25','26','27', '28','29','30','31' ]
  };
  var maandChartOptions = {};
  var maandChartCtx = document.getElementById('maandChart').getContext('2d');

const maandChart = new Chart(maandChartCtx, {
    data: maandChartData,
  type: 'mixed',
    options: maandChartOptions
});
  return maandChart;
};

//GRAFIEK opnames per dag voor een maand per opnametype
maakMaandGrafiekOpnametypes = function (){
  var maandOpnametypesChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal Medische opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'bar',
      label: 'Aantal Spoed chirurgische opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'bar',
      label: 'Aantal Gepland chirurgische opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'bar',
      label: 'Aantal Overleden voor IC-opname',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'line',
      label: 'Aantal Medische opnames in vorige jaren',
      data: [30,40,30,33,35,43,22,23,43,23,43,35,23,34,43,33,34,24,14,30,40,30,33,35,43,22,23,43,23,43,35],
    },{
      type:'line',
      label: 'Aantal Spoed chirurgische opnames in vorige jaren',
      data:[10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'line',
      label: 'Aantal Gepland chirurgische opnames in vorige jaren',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'line',
      label: 'Aantal overleden voor IC-opnames in vorige jaren',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23','24','25','26','27', '28','29','30','31' ]
  };
  var maandOpnametypesChartOptions = {};
  var maandOpnametypesChartCtx = document.getElementById('maandOpnametypesChart').getContext('2d');

const maandOpnametypesChart = new Chart(maandOpnametypesChartCtx, {
  data: maandOpnametypesChartData,
  type: 'mixed',
  options: maandOpnametypesChartOptions
});
  return maandOpnametypesChart;
};

//GRAFIEK opnames per dag in de maand mei per diagnosecategorie
maakMaandGrafiekDiagnose = function (){
  var maandDiagnoseChartData = {
    datasets: [{
      type: 'bar',
      label: 'CAP',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'bar',
      label: 'OHCA',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'bar',
      label: 'Sespsis',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type: 'line',
      label: 'CAP vorige jaren',
      data: [30,40,30,33,35,43,22,23,43,23,43,35,23,34,43,33,34,24,14,30,40,30,33,35,43,22,23,43,23,43,35],
    },{
      type: 'line',
      label: 'OHCA vorige jaren',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    },{
      type:'line',
      label: 'Sespsis vorige jaren',
      data: [10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30,40,10,20,30]
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07','08', '09', '10', '11', '12', '13','14','15','16','17','18','19','20','21','22','23','24','25','26','27', '28','29','30','31' ]
  };
  var maandDiagnoseChartOptions = {};
  var maandDiagnoseChartCtx = document.getElementById('maandDiagnoseChart').getContext('2d');

const maandDiagnoseChart = new Chart(maandDiagnoseChartCtx, {
  data: maandDiagnoseChartData,
  type: 'mixed',
  options: maandDiagnoseChartOptions
});
  return maandDiagnoseChart;
};


//GRAFIEK opnames per dag voor een maand per leeftijdscategorie
maakMaandGrafiekOpnamesLeeftijd = function (){
  var maandGrafiekOpnamesLeeftijd = {
    datasets: [{
         type: 'line',
         label: 'gem. 18-40 Jaar',
         data: [2,3,3,2,2,3,3],
         backgroundColor: '#E6B0AA',
         borderColor: '#E6B0AA'
       },{
         type: 'line',
         label: 'gem. 40-60 Jaar',
         data:  [10,11,12,11,12,11,11],
         backgroundColor: '#AED6F1',
         borderColor: '#AED6F1'
       },{
         type: 'line',
         label: 'gem. 60-65 Jaar',
         data: [15,15,16,17,17,16,16],
         backgroundColor: '#D5DBDB',
         borderColor: '#D5DBDB'
       },{
         type: 'line',
         label: 'gem. 65-70 Jaar',
         data: [16,15,15,17,17,16,16],
         backgroundColor: '#FAD7A0',
         borderColor: '#FAD7A0'
       },{
         type: 'line',
         label: 'gem. 70-75 Jaar',
         data: [20,20,20,20,20,21,21],
         backgroundColor: '#D7BDE2',
         borderColor: '#D7BDE2'
       },{
         type: 'line',
         label: 'gem. 75-80 Jaar',
         data: [23,23,24,25,24,24,26],
         backgroundColor: '#ABEBC6',
         borderColor: '#ABEBC6'
       },{
         type: 'line',
         label: 'gem. 80-85 Jaar',
         data: [22,21,20,21,22,20,21],
         backgroundColor: '#F5CBA7',
         borderColor: '#F5CBA7'
       },{
         type: 'line',
         label: 'gem. 85-90 Jaar',
         data: [12,12,13,13,12,12,12],
         backgroundColor: '#F0B27A',
         borderColor: '#F0B27A'
       },{
         type: 'line',
         label: 'gem. 90+ Jaar',
         data: [10,9,8,9,9,9,9],
         backgroundColor: '#85C1E9',
         borderColor: '#85C1E9'
       },{
        type: 'bar',
        label: '18-40 Jaar',
        data: [2,3,3,2,2,3,3],
        backgroundColor: '#E6B0AA'
      },{
        type: 'bar',
        label: '40-60 Jaar',
        data:  [10,11,12,11,12,11,11],
        backgroundColor: '#AED6F1'
      },{
        type: 'bar',
        label: '60-65 Jaar',
        data: [15,15,16,17,17,16,16],
        backgroundColor: '#D5DBDB'
      },{
        type: 'bar',
        label: '65-70 Jaar',
        data: [16,15,15,17,17,16,16],
        backgroundColor: '#FAD7A0'
      },{
        type: 'bar',
        label: '70-75 Jaar',
        data: [20,20,20,20,20,21,21],
        backgroundColor: '#D7BDE2'
      },{
        type: 'bar',
        label: '75-80 Jaar',
        data: [23,23,24,25,24,24,26],
        backgroundColor: '#ABEBC6'
      },{
        type: 'bar',
        label: '80-85 Jaar',
        data: [22,21,20,21,22,20,21],
        backgroundColor: '#F5CBA7'
      },{
        type: 'bar',
        label: '85-90 Jaar',
        data: [12,12,13,13,12,12,12],
        backgroundColor: '#F0B27A'
      },{
        type: 'bar',
        label: '90+ Jaar',
        data: [10,9,8,9,9,9,9],
       backgroundColor: '#85C1E9'
      }],
    labels: ['Week 01', 'Week 02', 'Week 03', 'Week 04']
  };
  var maandGrafiekOpnamesLeeftijdOptions = {
    // scales: {
    //   x: {
    //     stacked: true,
    //   },
    //   y: {
    //     stacked: true
    //   }}
  }
  var maandChartCtx = document.getElementById('LeeftijdOpnames').getContext('2d');
const LeeftijdOpnames = new Chart(maandChartCtx, {
    data: maandGrafiekOpnamesLeeftijd,
    type: 'mixed',
    options: maandGrafiekOpnamesLeeftijdOptions,
});
  return LeeftijdOpnames;
};
