const postItem = (item) => {
  fetch('api/v1/garageItems', {
    method: 'POST',
    body: JSON.stringify( item ),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => console.log(res))
  .catch(error => console.error(error))
}

const resetInputs = () => {
  $('#item-name').val('')
  $('#item-reason').val('')
  $('#item-cleanliness').val($('#item-cleanliness option:first').val())
}

const createNewItem = (event) => {
  event.preventDefault();
  const newItem = {
    name: $('#item-name').val(),
    reason: $('#item-reason').val(),
    cleanliness: $('#item-cleanliness option:selected').text()
  }
  postItem(newItem);
  resetInputs();
}

const selectOption = (cleanliness) => {
  let cleanlinessOptions = ['Sparkling', 'Dusty', 'Rancid']
  cleanlinessOptions = cleanlinessOptions.filter(option => option !== cleanliness);

  return cleanlinessOptions.unshift(cleanliness);
}

const sortItems = (items) => {
  const sortedItems = items.sort((a, b) => {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
  })
  appendItems(sortedItems);
}

const appendItems = (item) => {
  
    $(`#item-list`).append(`
      <div id="item-${item.id}" class="item">
        <h2 class="name">${item.name}</h2>
        <p class="reason">${item.reason}</p>
        <select class="single-item-cleanliness" name="cleanliness">
          <option value="Sparkling">${item.cleanliness}</option>
          <option value="Dusty">${selectOption(item.cleanliness)[1]}</option>
          <option value="Rancid">${selectOption(item.cleanliness)[2]}</option>
        </select>
      </div>
    `)
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
      parsedItems.forEach(item => appendItems(item));
      sortItems(parsedItems);
      appendCount(parsedItems);
    })
    .catch(error => console.error(error))
}


const toggleDoor = () => {
  $('#garage-door').slideToggle(3000, () => {
    const text = $('#garage-button').text();
    text === 'Open Garage' ?
      $('#garage-button').text('Close Garage') :
      $('#garage-button').text('Open Garage')
  });
}

const toggleAlpha = () => {

}

fetchItems();

$('#submit-item').on('click', (event) => createNewItem(event))
$('#garage-button').on('click', toggleDoor)
$('#sort-alpha').on('click', toggleAlpha)
