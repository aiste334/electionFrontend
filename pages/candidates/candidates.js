const backendURI = "http://localhost:9090";
let partyDropdown;
let table;

function initParties() {
  partyDropdown = document.querySelector(".party-dropdown");

  //Get all the parties
  fetch(backendURI + "/parties")
    .then((response) => response.json())
    .then((parties) => {
      //Reset parties
      while (partyDropdown.children.length > 0)
        partyDropdown.removeChild(partyDropdown.firstChild);
      //Add parties
      let partyElement = document.createElement("option");
      partyElement.classList.add("dropdown-item");
      partyElement.innerHTML = "All parties";
      partyElement.value = 0;
      partyDropdown.appendChild(partyElement);
      parties.forEach((party) => {
        let partyElement = document.createElement("option");
        partyElement.classList.add("dropdown-item");
        partyElement.innerHTML = party.partyName;
        partyElement.value = party.partyId;
        partyDropdown.appendChild(partyElement);
      });
    });
}

const getCandidates = () => {
  const selectedParty = partyDropdown.value;
  console.log(selectedParty);
  if (selectedParty == 0) {
    fetch(backendURI + "/candidates")
      .then((response) => response.json())
      .then((candidates) => {
        console.log(candidates);
        createTable(candidates);
      });
  } else {
    fetch(backendURI + "/candidates/" + selectedParty)
      .then((response) => response.json())
      .then((candidates) => {
        createTable(candidates);
      });
  }
};

function createTable(candidateData) {
  let table = document.querySelector(".candidate-table");
  while (table.firstElementChild.children.length > 1) {
    table.firstElementChild.removeChild(table.firstElementChild.lastChild);
  }

  candidateData.forEach((candidate) => {
    let row = table.insertRow(-1);

    // Insert new cells:
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);

    // Add text to the new cells:
    cell1.innerHTML = candidate.candidateId;
    cell2.innerHTML = candidate.firstName;
    cell3.innerHTML = candidate.lastName;
    cell4.innerHTML = candidate.party.partyId;
    cell5.innerHTML = candidate.personalVotes;

    // Create the Edit button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "EDIT";
    editBtn.classList.add("cta");
    cell6.appendChild(editBtn);

    editBtn.addEventListener("click", () => {
      const inputParty = prompt("Enter a new Party ID", "1");
      const body = {
        partyId: inputParty,
      };
      fetch(backendURI + "/candidate/" + candidate.candidateId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.text())
        .then((candidate) => {
          console.log(inputParty);
          console.log("edited candidate: ", candidate);
          cell4.innerHTML = inputParty;
        });
      location.reload();
    });

    // Create the Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "DELETE";
    deleteBtn.classList.add("cta");
    cell7.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      fetch(backendURI + "/candidate/" + candidate.candidateId, {
        method: "DELETE",
      })
        .then((response) => response.text())
        .then(() => {
          table.querySelector("tbody").removeChild(row);
        });
    });
  });
}

initParties();
getCandidates();
partyDropdown.addEventListener("change", getCandidates);
//getCandidates();
