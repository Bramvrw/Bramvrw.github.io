<h2>Dashboard prototype voor de NICE-registratie</h2>
<h3>Beschrijving</h3>
<p>Dit dashboard is een prototype waarin de informatie over de opnames op IC's in heel Nederland inzichtelijk wordt gemaakt. 
Deze informatie betreft het aantal IC opnames en verdere verdeling van deze opnames in opnametype, diagnosecategorie en leeftijdscategorie. Daarnaast wordt ook de IC-behandelduur inzichtelijk gemaakt.
In het prototype wordt een maandoverzicht van mei 2023 en een jaaroverzicht van 2023 weergegeven met daarbij referentiewaarden uit 2021 en 2022. </p>

<h3>Data</h3>
<p>Dit prototype is grotendeels gemaakt met echte data uit de NICE-registratie. Deze data hebben we als een csv-bestand ontvangen en hebben we in een database gestopt met behulp van Hasura. Om de data op te vragen maken we een connectie met Hasura via een XMLHttpRequest en versturen we een query in de vorm van een GraphiQL-query. </p>
<p>Er zijn ook grafieken die niet met echte data zijn gemaakt. Dit komt door het gebrek aan tijd om alle grafieken met echte data te maken. Er is voor gekozen om deze grafieken alsnog in het prototype te tonen omdat, zoals de naam al zegt, dit een prototype is waarbij het er vooral om gaat dat we laten zien hoe zo'n dashboard er mogelijk uit kan gaan zien als het echt wordt ontwikkeld. </p>

<h3>Stap voor stap data opvragen uit de database</h3>
<p>Dit is een query die van elke dag in mei 2023 de datum, het aantal geplande opnames, het aantal medische opnames en het aantal spoed opnames opvraagt en sorteert op oplopende datum.</p>

```
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
```

<p>Om een query op te sturen hebben wij een functie gemaakt die dit gestandaardiseerd voor elke query kan doen. Deze functie heet databaseOpvrager en returnt de data die is opgevraagd. Nadat deze functie is aangeroepen wordt de data verwerkt. Hier zien we dat voor elke dag alle opnametypes worden opgeteld om zo het aantal dagelijkse opnames te berekenen. Dit wordt meteen opgeslagen in een array. </p>

```
  databaseOpvrager(opnametypesMei2023).then(opnameData => {
    opnameData.data.nvic_data.forEach(item => {
      const dagelijkseOpnames = item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
      opnamesArray.push(dagelijkseOpnames);
    });
  });

```

<p>Hieronder staat onze functie databaseOpvrager. De parameter voor deze functie is een query. Er wordt een XMLHttpRequest geopend (request.open) met een link naar onze Hasura database en de query wordt doorgestuurd (request.send). Daarna wordt het antwoord daaruit opgeslagen in een variabele (antwoord)</p>
<p>Er wordt ook een Promise gemaakt aan het begin van deze functie. Dit zorgt ervoor dat de uitkomst van het opvragen van de data volledig is afgerond voordat het wordt teruggestuurd naar de functie waar deze functie gebruikt wordt.</p>

```
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
```

<p>Als laatste wordt er een functie aangeroepen die ervoor zorgt dat de data in een mooie grafiek komt te staan.</p>

```
  maakMaandGrafiekOpnames(opnamesArray, referentieOpnamesArray);
```