const backendURI = "http://localhost:9090";

function getParties() {
  fetch(backendURI + "/parties")
    .then((response) => response.json())
    .then((partiesData) => {
      console.log(partiesData);
      createTable(partiesData);
    });
}
async function createTable(partyData) {
  let table = document.querySelector(".result-table");
  while (table.firstElementChild.children.length > 1) {
    table.firstElementChild.removeChild(table.firstElementChild.lastChild);
  }
  const partyVotes = await getPersonalVotes();
  partyData.forEach((party) => {
    addVotes(partyVotes, party.partyId, party.partyVotes);

    let row = table.insertRow(-1);

    // Insert new cells:
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);


    // Add text to the new cells:
    cell1.innerHTML = party.partyId;
    cell2.innerHTML = party.partyName;
    cell3.innerHTML = party.partyVotes;
    cell4.innerHTML = partyVotes[party.partyId];
  });
}

function getPersonalVotes() {
  return fetch(backendURI + "/candidates")
    .then((response) => response.json())
    .then((candidateData) => {

        const results = {};
      candidateData.forEach((candidate) => {
        addVotes(results, candidate.party.partyId, candidate.personalVotes);
      });
      return results;
    });
}

function addVotes(results, partyId, numVotes) {
  if (results[partyId] === undefined) {
    results[partyId] = numVotes;
  }
  else {
    results[partyId] += numVotes;
  }
}

// export default () => {
//   const content = document.querySelector(".content");
//   fetch("./pages/results/results.html")
//     .then((response) => response.text())
//     .then((html) => {
//       content.innerHTML = html;
//     });
// };

getParties();
