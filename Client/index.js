document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:5000/getAll')
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener
('click', (event) => {
  if (event.target.className === "delete-row-btn") {
    deleteRowById(event.target.dataset.id);
  }
  else if (event.target.className === "edit-row-btn") {
    handleEditRow(event.target.dataset.id);
  }
});

const addBtn = document.getElementById('add-name-btn');
const updateBtn = document.getElementById('update-row-btn');
const searchBtn = document.getElementById('search-btn');

searchBtn.onclick = () => {
  const searchValue = document.getElementById('search-input').value;

  fetch('http://localhost:5000/search/' + searchValue)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
}

function deleteRowById(id) {
  fetch('http://localhost:5000/delete/' + id, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      location.reload();
    }
  });
}

function handleEditRow(id) {
  const updateSection = document.getElementById('update-row');
  updateSection.hidden = false;
  document.getElementById('update-name-input').dataset.id = id;
}

updateBtn.onclick = () => {
  const updateNameInput = document.getElementById('update-name-input');

  fetch('http://localhost:5000/update', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id: updateNameInput.dataset.id,
      name: updateNameInput.value
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      location.reload();
    }
  })
}


addBtn.onclick = () => {
  const nameInput = document.getElementById('name-input');
  const name = nameInput.value;
  nameInput.value = "";

  fetch('http://localhost:5000/insert', {
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name : name})
  })
  .then(response => response.json())
  .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
  const table = document.querySelector('tbody');
  const isThereTableData = table.querySelector('.no-data');

  let tableHtml = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === 'dateAdded') {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHtml += `<td>${data[key]}</td>`;
    }
  }

  tableHtml += `<td><button 
                      class="delete-row-btn"
                      data-id=${data.id}>
                Delete</td>`;
  tableHtml += `<td><button 
                      class="edit-row-btn"
                      data-id=${data.id}>
                Edit</td>`;

  tableHtml += "</tr>";

  if (isThereTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
}

function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    return;
  }

  let tableHtml = "";

  data.forEach(({id, name, date_added}) => {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${name}</td>`;
    tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
    tableHtml += `<td><button 
                        class="delete-row-btn"
                        data-id=${id}>
                  Delete</td>`;
    tableHtml += `<td><button 
                        class="edit-row-btn"
                        data-id=${id}>
                  Edit</td>`;
    tableHtml += "</tr>";
  });
  table.innerHTML = tableHtml;
}
