//Bij elke grafiek in de opties ervoor zorgen dat de kleuren van lijnen overeenkomen  met de lijnen van de bars zodat duidelijk is wat bij wat hoort!!!

//grafieken voor de opnames in 2023
function Jaar(){
  //grafiek voor opnames per maand in 2023
  maakJaarGrafiekOpnames();
  //grafiek voor opnames per maand in 2023 per opnametype
  maakJaarGrafiekOpnametypes();
  //grafiek voor opnames per maand in 2023 per diagnosecategorie
  maakJaarGrafiekDiagnose();
  //grafiek voor opnames per maand in 2023 per leeftijdscategorie
  maakJaarGrafiekOpnamesLeeftijd();
  //grafiek voor gemiddelde IC-behandelduur per maand in 2023
  maakICGrafiek();

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
// --------------------------------JAAROVERZICHT-------------------------------

//GRAFIEK Aantal opnames per maand in 2023
maakJaarGrafiekOpnames = function (){
  var jaarChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'line',
      label: 'Gemiddelde aantal van vorige jaren',
      data: [30,40,30,33,35,43,22,23,43,23,43,35],
    }],
    labels: ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
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

//GRAFIEK opnames per dag voor een maand per opnametype
maakJaarGrafiekOpnametypes = function (){
  var jaarOpnametypesChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal Medische opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'bar',
      label: 'Aantal Spoed chirurgische opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'bar',
      label: 'Aantal Gepland chirurgische opnames',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'bar',
      label: 'Aantal Overleden voor IC-opname',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'line',
      label: 'Aantal Medische opnames in vorige jaren',
      data: [30,40,30,33,35,43,22,23,43,23,43,35],
    },{
      type:'line',
      label: 'Aantal Spoed chirurgische opnames in vorige jaren',
      data:[11,40,32,20,29,37,11,33,24,33,21,40]
    },{
      type: 'line',
      label: 'Aantal Gepland chirurgische opnames in vorige jaren',
      data: [39,17,14,27,33,40,12,23,34,23,43,35]
    },{
      type: 'line',
      label: 'Aantal overleden voor IC-opnames in vorige jaren',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    }],
    labels: ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
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


maakJaarGrafiekDiagnose = function (){
  var jaarDiagnoseChartData = {
    datasets: [{
      type: 'bar',
      label: 'CAP',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'bar',
      label: 'OHCA',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'bar',
      label: 'Sespsis',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type: 'line',
      label: 'CAP vorige jaren',
      data: [30,40,30,33,35,43,22,23,43,23,43,35]
    },{
      type: 'line',
      label: 'OHCA vorige jaren',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    },{
      type:'line',
      label: 'Sespsis vorige jaren',
      data: [10,20,30,40,10,20,30,40,10,20,30,40]
    }],
    labels: ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
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

maakJaarGrafiekOpnamesLeeftijd = function(){
  var jaarGrafiekOpnamesLeeftijd = {
    datasets: [{
         type: 'line',
         label: 'gem. 18-40 Jaar',
         data: [2,3,3,2,2,3,3,1,4,2,1,1],
         backgroundColor: '#E6B0AA',
         borderColor: '#E6B0AA'
       },{
         type: 'line',
         label: 'gem. 40-60 Jaar',
         data:  [10,11,12,11,12,11,11,1,4,5,2,3],
         backgroundColor: '#AED6F1',
         borderColor: '#AED6F1'
       },{
         type: 'line',
         label: 'gem. 60-65 Jaar',
         data: [15,15,16,17,17,16,16,10,9,10,13,8],
         backgroundColor: '#D5DBDB',
         borderColor: '#D5DBDB'
       },{
         type: 'line',
         label: 'gem. 65-70 Jaar',
         data: [16,15,15,17,17,16,16,13,11,8,14,6],
         backgroundColor: '#FAD7A0',
         borderColor: '#FAD7A0'
       },{
         type: 'line',
         label: 'gem. 70-75 Jaar',
         data: [20,20,20,20,20,21,21,19,18,20,21,19],
         backgroundColor: '#D7BDE2',
         borderColor: '#D7BDE2'
       },{
         type: 'line',
         label: 'gem. 75-80 Jaar',
         data: [23,23,24,25,24,24,26,23,25,26,21,24],
         backgroundColor: '#ABEBC6',
         borderColor: '#ABEBC6'
       },{
         type: 'line',
         label: 'gem. 80-85 Jaar',
         data: [22,21,20,21,22,20,21,19,20,23,18,19],
         backgroundColor: '#F5CBA7',
         borderColor: '#F5CBA7'
       },{
         type: 'line',
         label: 'gem. 85-90 Jaar',
         data: [12,12,13,13,12,12,12,13,11,12,13,12],
         backgroundColor: '#F0B27A',
         borderColor: '#F0B27A'
       },{
         type: 'line',
         label: 'gem. 90+ Jaar',
         data: [10,9,8,9,9,9,9,8,9,9,10,8],
         backgroundColor: '#85C1E9',
         borderColor: '#85C1E9'
       },{
        type: 'bar',
        label: '18-40 Jaar',
        data: [2,3,3,2,2,3,3,3,2,2,4,3],
        backgroundColor: '#E6B0AA'
      },{
        type: 'bar',
        label: '40-60 Jaar',
        data:  [10,11,12,11,12,11,11,12,11,12,10,11],
        backgroundColor: '#AED6F1'
      },{
        type: 'bar',
        label: '60-65 Jaar',
        data: [15,15,16,17,17,16,16,14,16,15,17,15],
        backgroundColor: '#D5DBDB'
      },{
        type: 'bar',
        label: '65-70 Jaar',
        data: [16,15,15,17,17,16,16,17,18,17,16,16],
        backgroundColor: '#FAD7A0'
      },{
        type: 'bar',
        label: '70-75 Jaar',
        data: [20,20,20,20,20,21,21,19,20,20,21,21],
        backgroundColor: '#D7BDE2'
      },{
        type: 'bar',
        label: '75-80 Jaar',
        data: [23,23,24,25,24,24,26,25,25,23,24,24],
        backgroundColor: '#ABEBC6'
      },{
        type: 'bar',
        label: '80-85 Jaar',
        data: [22,21,20,21,22,20,21,20,19,21,20,22],
        backgroundColor: '#F5CBA7'
      },{
        type: 'bar',
        label: '85-90 Jaar',
        data: [12,12,13,13,12,12,12,11,11,12,13,12],
        backgroundColor: '#F0B27A'
      },{
        type: 'bar',
        label: '90+ Jaar',
        data: [10,9,8,9,9,9,9,7,8,7,8],
       backgroundColor: '#85C1E9'
      }],
    labels: ['Week 01', 'Week 02', 'Week 03', 'Week 04']
  };
  var jaarGrafiekOpnamesLeeftijdOptions = {
    // scales: {
    //   x: {
    //     stacked: true,
    //   },
    //   y: {
    //     stacked: true
    //   }}
  }
  var jaarLeeftijdChartCtx = document.getElementById('jaarLeeftijdOpnames').getContext('2d');
  const jaarLeeftijdChart = new Chart(jaarLeeftijdChartCtx, {
    data: jaarGrafiekOpnamesLeeftijd,
    type: 'mixed',
    options: jaarGrafiekOpnamesLeeftijdOptions,
  });
  return jaarLeeftijdChart;
};

maakICGrafiek = function (){
  var jaarICChartData = {
      datasets: [{
        type: 'line',
        label: '2023',
        data: [2.3,3.3,3.3,2.3,2.3,3.3,3.3,2.3,4.3,2.3,2.3,2.3]
      },{
        type: 'line',
        label: '2022',
        data: [3.2,1.5,2.4,3.2,2.4,3.2,3.2,1.2,2.0,1.8,1.9,2.0]
      },{
        type: 'line',
        label: '2021',
        data: [1.2,2.5,3.0,1.2,2.5,3.0,3.0,1.2,2.5,1.9,2.0,1.8]
      },{
        type: 'line',
        label: '2020',
        data: [4.2,3.4,4.4,4.2,3.4,4.4,4.4,3.4,3.9,4.9,4.8,4.9]
      }],
      labels: ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
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