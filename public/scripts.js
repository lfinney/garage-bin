const postItem = (item) => {
  fetch('api/v1/garageItems', {
    method: 'POST',
    body: JSON.stringify( item ),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => {
    response.json();
    fetchItems('alpha');
  })
  .catch(error => console.error(error));
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
  return cleanlinessOptions.filter(option => option !== cleanliness);
}

const sortItems = (items, sort) => {
  if (sort === 'alpha') {
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
    sortedItems.forEach(item => appendItems(item));
  }
  if (sort === 'reverse') {
    const sortedItems = items.sort((a, b) => {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
    })
    sortedItems.forEach(item => appendItems(item));
  }
}

const appendItems = (item) => {
  const itemToAppend =
    `<div id="item-${item.id}" class="item">
        <h2 class="name">${item.name}</h2>
        <div class="item-info hidden">
          <p class="reason">${item.reason}</p>
          <select class="single-item-cleanliness" name="cleanliness">
            <option value="${item.cleanliness}">${item.cleanliness}</option>
            <option value="${selectOption(item.cleanliness)[0]}">${selectOption(item.cleanliness)[0]}</option>
            <option value="${selectOption(item.cleanliness)[1]}">${selectOption(item.cleanliness)[1]}</option>
          </select>
        </div>
      </div>`
  $(`#items`).append(itemToAppend);
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

const fetchItems = (sort) => {
  fetch(`/api/v1/garageItems`)
    .then(response => response.json())
    .then(parsedItems => {
      clearList();
      sortItems(parsedItems, sort);
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

const toggleListView = (target) => {
  $(event.target).next('.item-info').toggleClass('hidden');
}

const patchCondition = (id, condition) => {
  fetch(`api/v1/garageItems/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ cleanliness: condition }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(res => console.log(res))
  .catch(error => console.error(error))
}

const updateCondition = (event) => {
  const itemId = $(event.target).closest('.item').attr('id').split('-')[1];
  const itemCleanliness = $(event.target).val();

  patchCondition(itemId, itemCleanliness);
}

const clearList = () => {
  $('#items').html('')
}

fetchItems('alpha');

$('#submit-item').on('click', (event) => createNewItem(event));
$('#garage-button').on('click', toggleDoor);
$('#sort-alpha').on('click', () => fetchItems('alpha'));
$('#sort-reverse-alpha').on('click', () => fetchItems('reverse'));
$('#item-list').on('click', 'h2', (event) => toggleListView(event));
$('#item-list').on('change', 'select', (event) => updateCondition(event));
