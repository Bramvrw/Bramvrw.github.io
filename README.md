<h2>Dashboard prototype voor de NICE-registratie</h2>
<h3>Beschrijving</h3>
<p>Dit dashboard is een prototype waarin de informatie over de opnames op IC's in heel Nederland inzichtelijk wordt gemaakt. 
Deze informatie betreft het aantal IC opnames en verdere verdeling van deze opnames in opnametype, diagnosecategorie en leeftijdscategorie. Daarnaast wordt ook de IC-behandelduur inzichtelijk gemaakt.
In het prototype wordt een maandoverzicht van mei 2023 en een jaaroverzicht van 2023 weergegeven met daarbij referentiewaarden uit 2021 en 2022. </p>

<h3>Data</h3>
<p>Dit prototype is grotendeels gemaakt met echte data uit de Nice-registratie. Deze data hebben we als een csv-bestand ontvangen en hebben we in een database gestopt met behulp van Hasura. Om de data op te vragen maken een connectie met de Hasura-api en versturen we een query in de vorm van een GraphiQL-query. </p>
<p>Er zijn ook grafieken die niet met echte data zijn gemaakt. Dit komt door het gebrek aan tijd om alle grafieken met echte data te maken. Er is voor gekozen om deze grafieken alsnog in het prototype te tonen omdat, zoals de naam al zegt, dit een prototype is waarbij het er vooral om gaat dat we laten zien hoe zo'n dashboard er mogelijk uit kan gaan zien als het echt wordt ontwikkeld. </p>

<h3>Stap voor stap data opvragen met de Hasura-api</h3>
<p>Dit is een query die van elke dag in mei 2023 de datum, het aantal geplande opnames, het aantal medische opnames en het aantal spoed opnames opvraagt en sorteert op oplopende datum. </p> 

```
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
```

<p>Er wordt een XMLHttpRequest geopend (request1.open) met een link naar onze Hasura database en de query wordt doorgestuurd (request1.send).</p>
```
  const request1 = new XMLHttpRequest();
  request1.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request1.setRequestHeader('content-type', 'application/json');
  request1.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request1.send(query1);
```

<p>Wanneer de request wordt geladen (request1.onload) wordt het antwoord van de query (request1.response) opgeslagen in een variabele (opnameData). Daarna wordt de data verder verwerkt. We zien hier dat er voor elke dag in mei 2023 een waarde wordt berekend door het optellen van alle soorten opnametypen. Daarna wordt die waarde opgeslagen in een array.</p>

```
  request1.onload = function() {
  const opnameData = JSON.parse(request1.response);
  opnameData.data.nvic_data.forEach(item => {
    const dagelijkseOpnames = item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
    opnamesArray.push(dagelijkseOpnames);
  });
```

<p>Als laatste wordt er een functie aangeroepen die ervoor zorgt dat de data in een mooie grafiek komt te staan.</p>

```
  maakMaandGrafiekOpnames(opnamesArray, referentieOpnamesArray);
```
