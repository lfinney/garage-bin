const createNewItem = (event) => {
  event.preventDefault();
  const newItem = {
    name: $('#item-name').val(),
    reason: $('#item-reason').val(),
    cleanliness: $('#item-cleanliness option:selected').text()
  }

  console.log(newItem);
}

// const selectOption = (cleanliness) => {
//   let cleanlinessOptions = ['Sparkling', 'Dusty', 'Rancid']
//   cleanlinessOptions = cleanlinessOptions.filter(option => option !== cleanliness);
//   console.log(cleanlinessOptions);
//   return cleanlinessOptions.unshift(cleanliness);
// }

const appendItems = (items) => {
  items.forEach((item) => {
    // cleanlinessSelection = selectOption(item.cleanliness);
    $(`#item-list`).append(`
      <div id="item-${item.id}" class="item">
        <h2 class="name">${item.name}</h2>
      </div>
    `)
  })
}

const filterType = (items, type) => {
  const filteredItems = items.filter(item => item.cleanliness === type);
  return filteredItems.length;
}

const appendCount = (parsedItems) => {
  $('#total-items').text(`${parsedItems.length} - Total Items`);
  $('#total-sparkling').text(`${filterType(parsedItems, 'Sparkling')} - Sparkling`)
  $('#total-dusty').text(`${filterType(parsedItems, 'Dusty')} - Dusty`)
  $('#total-rancid').text(`${filterType(parsedItems, 'Rancid')} - Rancid`)
}

const fetchItems = () => {
  fetch(`/api/v1/garageItems`)
    .then(response => response.json())
    .then(parsedItems => {
      appendCount(parsedItems)
      appendItems(parsedItems)
    })
    .catch(error => console.error(error))
}

const pageLoad = () => {
  fetchItems();
}

$(document).ready(pageLoad);
$('#submit-item').on('click', (event) => createNewItem(event))
