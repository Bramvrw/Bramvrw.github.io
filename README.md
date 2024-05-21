<h2>Dashboard prototype voor de NICE-registratie</h2>
<h3>Beschrijving</h3>
Dit dashboard is een prototype waarin de informatie over de opnames op IC's in heel Nederland inzichtelijk wordt gemaakt. 
Deze informatie betreft het aantal IC opnames en verdere verdeling van deze opnames in opnametype, diagnosecategorie en leeftijdscategorie. Daarnaast wordt ook de IC-behandelduur inzichtelijk gemaakt.
In het prototype wordt een maandoverzicht van mei 2023 en een jaaroverzicht van 2023 weergegeven met daarbij referentiewaarden van eerdere jaren. 

<h3>Data</h3>
Dit prototype is grotendeels gemaakt met echte data uit de Nice-registratie. Deze data hebben we als een csv-bestand ontvangen en hebben we in een database gestopt met behulp van hasura. Om de data op te vragen maken een connectie met de api hasura en versturen we een query in de vorm van een GraphiQL-query. Hieronder staat een voorbeeld:

Dit is de query.
<code>
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
</code>

Er wordt een XMLHttpRequest geopend met een link naar onze hasura database en de query wordt doorgestuurd.
<code>
  const request1 = new XMLHttpRequest();
  request1.open('POST', 'https://clean-garfish-69.hasura.app/v1/graphql');
  request1.setRequestHeader('content-type', 'application/json');
  request1.setRequestHeader('x-hasura-admin-secret', 'JL0Fh28uE4BqS09O0EhdnQnPQ6SJSyB0LwEXd6eNpktZpR9D0qMEDd7EtOgObty4');
  request1.send(query1);
</code>

Wanneer de request wordt geladen wordt het antwoord van de query opgeslagen in een variabele (opnameData). Daarna wordt de data verder verwerkt.
<code>
  request1.onload = function() {
  const opnameData = JSON.parse(request1.response);
  opnameData.data.nvic_data.forEach(item => {
    const dagelijkseOpnames = item.aantal_gepland + item.aantal_medisch + item.aantal_spoed;
    opnamesArray.push(dagelijkseOpnames);
  });
</code>

Als laatste wordt er een functie aangeroepen die ervoor zorgt dat de data in een mooie grafiek komt te staan.
<code>
  maakMaandGrafiekOpnames(opnamesArray, referentieOpnamesArray);
</code>

Er zijn ook grafieken die niet met echte data zijn gemaakt. Dit komt door het gebrek aan tijd om alle grafieken met echte data te maken. Er is voor gekozen om deze grafieken alsnog in het prototype te tonen omdat, zoals de naam al zegt, het een prototype is waarbij het er vooral om gaat dat we laten zien hoe zo'n dashboard er mogelijk uit kan gaan zien als het echt wordt ontwikkeld.
