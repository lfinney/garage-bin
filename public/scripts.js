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
      <div class="item">
        <h2 class="name">${item.name}</h2>
      </div>
    `)
  })
}

const appendCount = (parsedItems) => {
  $('#item-count').text(parsedItems.length);
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
