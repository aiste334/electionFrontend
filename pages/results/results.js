function createTable(partyData) {
    let table = document.querySelector(".result-table");
    while (table.firstElementChild.children.length > 1) {
      table.firstElementChild.removeChild(table.firstElementChild.lastChild);
    }
  
    partyData.forEach((party) => {
      let row = table.insertRow(-1);
  
      // Insert new cells:
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
  
      // Add text to the new cells:
      cell1.innerHTML = party.partyId;
      cell2.innerHTML = party.partyName;
      cell3.innerHTML = party.partyVotes;

    })}