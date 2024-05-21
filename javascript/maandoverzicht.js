//-------------- OPMERKINGEN -----------------//
//Bij elke grafiek in de opties ervoor zorgen dat de kleuren van lijnen overeenkomen  met de lijnen van de bars zodat duidelijk is wat bij wat hoort!!!
// kleur van de bar iets lichter dan de kleur van de lijn. Helpt met zichtbaarheid.
// Kijken naar de functie OpnamesDag, want we houden geen rekening met het feit dat het wekelijkse data moet zijn. Misschien kunnen we de strategie uit jaaroverzicht gebruiken samen met slicen om de gemiddeldes te berekenen.
//----------------------------------------------------

// Grafieken voor de opnames in mei
function Maand() {
  //Grafiek voor opnames per dag in de maand mei met echte data
  OpnamesDag();

  //Grafiek voor opnames per dag in de maand mei per opnametype
  OpnamesDagType();

  //Grafiek voor opnames per dag in de maand mei per diagnose
  maakMaandGrafiekDiagnose();

  //Grafiek voor opnames per dag in de maand mei per leeftijdscategorie
  OpnamesLeeftijd();

  //
  leeftijdsverdelingPerOpnametype();
  
};

//------- FUNCTIES OM DATA OP TE VRAGEN  ------------------//
// DATA AANTALLEN OPNAMES
// Deze functie haalt data over het totale aantal IC opnames uit mei 2021 t/m 2023 op uit de database en maakt een grafiek van deze data.
function OpnamesDag() {
  // Specificatie van arrays
  let opnamesArray = [];
  let referentieOpnamesArray = [];

  //Queries. Query1 vraagt het aantal medische, geplande en spoed opnames op de IC op om het totale aantal opnames in mei 2023 te berekenen. Query2 vraagt dezelfde data op, maar dan in 2021 en 2022
  const query1 = JSON.stringify({
    query: `{
      nvic_data(where: {datum: {_regex: "^2023-05"}}, order_by: {datum: asc}) {
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

  // Eerste request wordt geopend, query1 wordt verstuurd 
  const request1 = new XMLHttpRequest();
  request1.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request1.setRequestHeader('content-type', 'application/json');
  request1.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request1.send(query1);

  // Hier wordt het totale aantal opnames per dag berekend en in een array gezet
  request1.onload = function() {
    const opnameData = JSON.parse(request1.response);
    opnameData.data.nvic_data.forEach(item => {
      const dagelijkseOpnames = item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
      opnamesArray.push(dagelijkseOpnames);
    });

    // Tweede request wordt geopend, query2 wordt verstuurd
    const request2 = new XMLHttpRequest();
    request2.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
    request2.setRequestHeader('content-type', 'application/json');
    request2.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
    request2.send(query2);

    //Hier wordt het totale aantal opnames per dag berekend en in een array gezet
    request2.onload = function() {
      const referentieOpnameData = JSON.parse(request2.response);
      referentieOpnameData.data.nvic_data.forEach(item => {
        const referentieOpnames = item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
        referentieOpnamesArray.push(referentieOpnames);
      });

      // Dan wordt hier de data gesplitst in 2021 en 2022
      const array2021 = referentieOpnamesArray.slice(0, 31);
      const array2022 = referentieOpnamesArray.slice(31, 62);

      // En wordt hier het gemiddelde aantal opnames per dag berekend en in een array gezet
      for (let i = 0; i < array2021.length; i++) {
        referentieOpnamesArray[i] = (array2021[i] + array2022[i]) / 2;
      };

      // Hier wordt het maken van de grafiek opgeroepen met een array van aantallen opnames in mei 2023, en een array met gemiddelde aantallen opnames in mei 2021 en 2022
      maakMaandGrafiekOpnames(opnamesArray, referentieOpnamesArray);
    };
  };
};

// DATA SOORTEN OPNAMETYPES 
// Deze functie haalt data over de verschillende opnametypes op uit de database en maakt hier een grafiek van
function OpnamesDagType() {
  // Specificatie van de arrays
  let MedischArray = [];
  let SpoedArray = [];
  let GeplandArray = [];
  let MedischGemiddeldArray = [];
  let SpoedGemiddeldArray = [];
  let GeplandGemiddeldArray = [];

  // Queries. Query3 vraagt het aantal medische, geplande en spoed opnames op de IC in mei 2023 om een inzicht te geven van de soorten opnames per dag. Hier Query4 vraagt dezelfde data op, maar dan in 2021 en 2022 
  const query3 = JSON.stringify({
    query: `{
      nvic_data(where: {datum: {_regex: "^2023-05"}}, order_by: {datum: asc}) {
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

  // Eerste request wordt geopend, query3 wordt verstuurd 
  const request3 = new XMLHttpRequest();
  request3.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request3.setRequestHeader('content-type', 'application/json');
  request3.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request3.send(query3);

  //Hier worden per dag alle type opnames in hun eigen array gezet
  request3.onload = function() {
    const opnametypesData = JSON.parse(request3.response);
    opnametypesData.data.nvic_data.forEach(item => {
      MedischArray.push(item.aantal_medisch);
      SpoedArray.push(item.aantal_spoed);
      GeplandArray.push(item.aantal_gepland);
    });


    // Tweede request wordt geopend, query4 wordt verstuurd
    const request4 = new XMLHttpRequest();
    request4.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
    request4.setRequestHeader('content-type', 'application/json');
    request4.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
    request4.send(query4);

    // Alle type opnames worden in hun eigen array gezet
    request4.onload = function() {
      const referentieGemiddeldeOpnametypesData = JSON.parse(request4.response);
      referentieGemiddeldeOpnametypesData.data.nvic_data.forEach(item => {
        MedischGemiddeldArray.push(item.aantal_medisch);
        SpoedGemiddeldArray.push(item.aantal_spoed);
        GeplandGemiddeldArray.push(item.aantal_gepland);
      });

      // Dan worden ze hier opgesplitst in 2021 en 2022
      const MedischArray2021 = MedischGemiddeldArray.slice(0, 31);
      const MedischArray2022 = MedischGemiddeldArray.slice(31, 62);
      const SpoedArray2021 = SpoedGemiddeldArray.slice(0, 31);
      const SpoedArray2022 = SpoedGemiddeldArray.slice(31, 62);
      const GeplandArray2021 = GeplandGemiddeldArray.slice(0, 31);
      const GeplandArray2022 = GeplandGemiddeldArray.slice(31, 62);

      // En worden hier de gemiddelde aantallen van de opnames met dat type berekend en in hun eigen array gezet
      for (let i = 0; i < MedischArray2021.length; i++) {
        MedischGemiddeldArray[i] = (MedischArray2021[i] + MedischArray2022[i]) / 2;
        SpoedGemiddeldArray[i] = (SpoedArray2021[i] + SpoedArray2022[i]) / 2;
        GeplandGemiddeldArray[i] = (GeplandArray2021[i] + GeplandArray2022[i]) / 2;
      };

      // Roept de functie aan om de grafiek te maken. Meegegeven zijn de arrays met aantallen opnames van elk type per dag in 2023 en de gecombineerde referentie aantallen uit 2021/2022 
      maakMaandGrafiekOpnametypes(MedischArray, SpoedArray, GeplandArray, MedischGemiddeldArray, SpoedGemiddeldArray, GeplandGemiddeldArray);
    };
  };
};

// DATA LEEFTIJDSCATEGORIEN 
function OpnamesLeeftijd() {
  // Specificatie van de arrays
  let data40Min = [];
  let data4050 = [];
  let data5060 = [];
  let data6070 = [];
  let data7080 = [];
  let data80Plus = [];
  let referentieData40Min = [];
  let referentieData4050 = [];
  let referentieData5060 = [];
  let referentieData6070 = [];
  let referentieData7080 = [];
  let referentieData80Plus = [];

  // Queries. Query5 de 
  const query5 = JSON.stringify({
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

  const query6 = JSON.stringify({
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

  // Eerste request wordt geopend, query5 wordt verstuurd
  const request5 = new XMLHttpRequest();
  request5.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request5.setRequestHeader('content-type', 'application/json');
  request5.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request5.send(query5);

  // Hier wordt het aantal opnames per leeftijdscategorie per dag opgeteld en in een aparte array gezet voor 2023
  request5.onload = function() {
    const leeftijdData = JSON.parse(request5.response);
    leeftijdData.data.nvic_data.forEach(item => {
      const jaar40 = item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
      data40Min.push(jaar40);
      const jaar4050 = item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
      data4050.push(jaar4050);
      const jaar5060 = item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
      data5060.push(jaar5060);
      const jaar6070 = item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
      data6070.push(jaar6070);
      const jaar7080 = item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
      data7080.push(jaar7080);
      const jaar80 = item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
      data80Plus.push(jaar80);
    });

    // Tweede request wordt geopend, query6 wordt verstuurd
    const request6 = new XMLHttpRequest();
    request6.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
    request6.setRequestHeader('content-type', 'application/json');
    request6.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
    request6.send(query6);

    // Hier wordt het aantal opnames per leeftijdscategorie per dag opgeteld en in een aparte array gezet voor 2021/2022
    request6.onload = function() {
      const referentieGemiddeldeLeeftijdData = JSON.parse(request6.response);
      referentieGemiddeldeLeeftijdData.data.nvic_data.forEach(item => {
        const jaar40 = item.aantal_gepland_40min + item.aantal_medisch_40min + item.aantal_spoed_40min;
        referentieData40Min.push(jaar40);
        const jaar4050 = item.aantal_gepland_40_50 + item.aantal_medisch_40_50 + item.aantal_spoed_40_50;
        referentieData4050.push(jaar4050);
        const jaar5060 = item.aantal_gepland_50_60 + item.aantal_medisch_50_60 + item.aantal_spoed_50_60;
        referentieData5060.push(jaar5060);
        const jaar6070 = item.aantal_gepland_60_70 + item.aantal_medisch_60_70 + item.aantal_spoed_60_70;
        referentieData6070.push(jaar6070);
        const jaar7080 = item.aantal_gepland_70_80 + item.aantal_medisch_70_80 + item.aantal_spoed_70_80;
        referentieData7080.push(jaar7080);
        const jaar80 = item.aantal_gepland_80plus + item.aantal_medisch_80plus + item.aantal_spoed_80plus;
        referentieData80Plus.push(jaar80);
      });

      // Ik heb het weer teruggezet maar ik had ipv jaar40.slice etc referentieData40Min.slice. Want eigenlijk is jaar40 etc geen array. Ik weet niet waarom we dat een array hebben gemaakt
      // Daarna worden de aantallen opgesplitst in 2021 en 2022
      const data40Min2021 = referentieData40Min.slice(0, 31);
      const data40Min2022 = referentieData40Min.slice(31, 62);
      const data40502021 = referentieData4050.slice(0, 31);
      const data40502022 = referentieData4050.slice(31, 62);
      const data50602021 = referentieData5060.slice(0, 31);
      const data50602022 = referentieData5060.slice(31, 62);
      const data60702021 = referentieData6070.slice(0, 31);
      const data60702022 = referentieData6070.slice(31, 62);
      const data70802021 = referentieData7080.slice(0, 31);
      const data70802022 = referentieData7080.slice(31, 62);
      const data80Plus2021 = referentieData80Plus.slice(0, 31);
      const data80Plus2022 = referentieData80Plus.slice(31, 62);

      // En worden de gemiddeldes berekend per leeftijdscategorie
      for (let i = 0; i < data40Min2021.length; i++) {
        referentieData40Min[i] = (data40Min2021[i] + data40Min2022[i]) / 2;
        referentieData4050[i] = (data40502021[i] + data40502022[i]) / 2;
        referentieData5060[i] = (data50602021[i] + data50602022[i]) / 2;
        referentieData6070[i] = (data60702021[i] + data60702022[i]) / 2;
        referentieData7080[i] = (data70802021[i] + data70802022[i]) / 2;
        referentieData80Plus[i] = (data80Plus2021[i] + data80Plus2022[i]) / 2;
      };

      // En hier wordt de functie opgeroepen om de grafiek te maken
      maakMaandGrafiekOpnamesLeeftijd(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, data40Min, data4050, data5060, data6070, data7080, data80Plus);
    }
  };
};

leeftijdsverdelingPerOpnametype = function(){
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

  // Queries. Query7 en query8 zoeken alle leeftijdscategorien op binnen alle opnametypes in mei. Query7 doet dit voor 2023 en query8 doet dit voor 2021 en 2022
  const query7 = JSON.stringify({
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

  const query8 = JSON.stringify({
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


// -------------------------MAANDOVERZICHT GRAFIEKEN--------------------------//

//GRAFIEK opnames per dag voor een maand
maakMaandGrafiekOpnames = function(data, referentieData) {
  var maandChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal opnames',
      data: data
    }, {
      type: 'line',
      label: 'Gemiddeld aantal opnames van vorige jaren',
      data: referentieData,
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
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
maakMaandGrafiekOpnametypes = function(dataMedisch, dataSpoed, dataGepland, referentieDataMedisch, referentieDataSpoed, referentieDataGepland) {
  var maandOpnametypesChartData = {
    datasets: [{
      type: 'bar',
      label: 'Aantal Medische opnames',
      data: dataMedisch,
      backgroundColor: 'rgba(174, 214, 241, 0.8)',
      borderColor: 'rgba(174, 214, 241, 0.8)'
    }, {
      type: 'bar',
      label: 'Aantal Spoed chirurgische opnames',
      data: dataSpoed,
      backgroundColor: 'rgba(171, 235, 198, 0.5)',
      borderColor: 'rgba(171, 235, 198, 0.5)'
    }, {
      type: 'bar',
      label: 'Aantal Gepland chirurgische opnames',
      data: dataGepland,
      backgroundColor: 'rgba(215, 189, 226, 0.5)',
      borderColor: 'rgba(215, 189, 226, 0.5)'
    }, {
      type: 'line',
      label: 'Aantal Medische opnames in vorige jaren',
      data: referentieDataMedisch,
      backgroundColor: 'rgba(174, 214, 241)',
      borderColor: 'rgba(174, 214, 241)'
    }, {
      type: 'line',
      label: 'Aantal Spoed chirurgische opnames in vorige jaren',
      data: referentieDataSpoed,
      backgroundColor: 'rgba(171, 235, 198)',
      borderColor: 'rgba(171, 235, 198)'
    }, {
      type: 'line',
      label: 'Aantal Gepland chirurgische opnames in vorige jaren',
      data: referentieDataGepland,
      backgroundColor: 'rgba(215, 189, 226)',
      borderColor: 'rgba(215, 189, 226)'
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
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
maakMaandGrafiekDiagnose = function() {
  var maandDiagnoseChartData = {
    datasets: [{
      type: 'bar',
      label: 'CAP',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30]
    }, {
      type: 'bar',
      label: 'OHCA',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30]
    }, {
      type: 'bar',
      label: 'Sespsis',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30]
    }, {
      type: 'line',
      label: 'CAP vorige jaren',
      data: [30, 40, 30, 33, 35, 43, 22, 23, 43, 23, 43, 35, 23, 34, 43, 33, 34, 24, 14, 30, 40, 30, 33, 35, 43, 22, 23, 43, 23, 43, 35],
    }, {
      type: 'line',
      label: 'OHCA vorige jaren',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30]
    }, {
      type: 'line',
      label: 'Sespsis vorige jaren',
      data: [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30]
    }],
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
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
maakMaandGrafiekOpnamesLeeftijd = function(referentieData40Min, referentieData4050, referentieData5060, referentieData6070, referentieData7080, referentieData80Plus, data40Min, data4050, data5060, data6070, data7080, data80Plus) {
  var maandGrafiekOpnamesLeeftijd = {
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
      data: data40Min,
      backgroundColor: 'rgba(230, 176, 170, 0.5)'
    }, {
      type: 'bar',
      label: '40-50 Jaar',
      data: data4050,
      backgroundColor: 'rgba(174, 214, 241, 0.5)'
    }, {
      type: 'bar',
      label: '50-60 Jaar',
      data: data5060,
      backgroundColor: 'rgba(213, 219, 219, 0.5)'
    }, {
      type: 'bar',
      label: '60-70 Jaar',
      data: data6070,
      backgroundColor: 'rgba(250, 215, 160, 0.5)'
    }, {
      type: 'bar',
      label: '70-80 Jaar',
      data: data7080,
      backgroundColor: 'rgba(215, 189, 226, 0.5)'
    }, {
      type: 'bar',
      label: '80+ Jaar',
      data: data80Plus,
      backgroundColor: 'rgba(171, 235, 198, 0.5)'
    }],
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  };
  var maandGrafiekOpnamesLeeftijdOptions = {}
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
    labels: ['18-40 jaar', '40-50 jaar', '50-60 jaar', '60-70 jaar', '70-80 jaar', '80+ jaar'],
    datasets: [{
      label: ['mei 2023'],
      data: medischeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }, {
      label: ['gem. mei 2021/2022'],
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

//GRAFIEK leeftijdsverdeling van spoed opnames
maakGrafiekSpoedLeeftijd = function(spoedeLeeftijdData, referentieSpoedeLeeftijdData){
  var spoedLeeftijdData = {
    labels: ['18-40 jaar', '40-50 jaar', '50-60 jaar', '60-70 jaar', '70-80 jaar', '80+ jaar'],
    datasets: [{
      label: ['mei 2023'],
      data: spoedeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }, {
      label: ['gem. mei 2021/2022'],
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

//GRAFIEK leeftijdsverdeling van geplande opnames
maakGrafiekGeplandeLeeftijd = function(geplandeLeeftijdData, referentieGeplandeLeeftijdData){
  var geplandLeeftijdData = {
    labels: ['18-40 jaar', '40-50 jaar', '50-60 jaar', '60-70 jaar', '70-80 jaar', '80+ jaar'],
    datasets: [{
      label: ['mei 2023'],
      data: geplandeLeeftijdData,
      backgroundColor: ['#36a2eb', '#ff6384', 'orange', '#ffce56', '#39e598', '#cc65fe']
    }, {
      label: ['gem. mei 2021/2022'],
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


