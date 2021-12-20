const backendURI = "http://localhost:9090";

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

  if (document.querySelector(".addBtn") === null) {
    // Create an ADD button
    const candidates = document.querySelector(".candidates");
    const addBtn = document.createElement("button");
    addBtn.innerHTML = "Add a Candidate";
    addBtn.classList.add("cta");
    addBtn.classList.add("addBtn");

    candidates.appendChild(addBtn);
    addBtn.addEventListener("click", addCandidateRow);
  }
}

function addCandidateRow() {
  let table = document.querySelector(".candidate-table");

  let row = table.insertRow(-1);

  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);

  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("class", "submitBtn");
  submitBtn.innerHTML = "Submit";
  submitBtn.classList.add("cta");
  cell1.appendChild(submitBtn);

  const firstNameInput = document.createElement("input");
  firstNameInput.setAttribute("type", "text");
  firstNameInput.setAttribute("value", "");
  firstNameInput.setAttribute("class", "first-name-input");
  cell2.appendChild(firstNameInput);
  console.log(firstNameInput.value);

  const lastNameInput = document.createElement("input");
  lastNameInput.setAttribute("type", "text");
  lastNameInput.setAttribute("value", "");
  lastNameInput.setAttribute("class", "last-name-input");
  cell3.appendChild(lastNameInput);
  console.log(lastNameInput.value);

  const partyInput = document.createElement("input");
  partyInput.setAttribute("type", "text");
  partyInput.setAttribute("value", "");
  partyInput.setAttribute("class", "party-input");
  cell4.appendChild(partyInput);
  console.log(partyInput.value);

  const personalVotesInput = document.createElement("input");
  personalVotesInput.setAttribute("type", "text");
  personalVotesInput.setAttribute("value", "");
  personalVotesInput.setAttribute("class", "personal-votes-input");
  cell5.appendChild(personalVotesInput);

  submitBtn.addEventListener("click", addToArray);

  function addToArray() {
    const body = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      partyId: partyInput.value,
      personalVotes: personalVotesInput.value,
    };


    fetch(backendURI + "/candidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((candidateData) => {
        console.log(candidateData);
      });
    location.reload();
  }
}
initParties();
getCandidates();
partyDropdown.addEventListener("change", getCandidates);

