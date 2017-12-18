const createNewItem = (event) => {
  event.preventDefault();
  const newItem = {
    name: $('#item-name').val(),
    reason: $('#item-reason').val(),
    cleanliness: $('#item-cleanliness option:selected').text()
  }

  console.log(newItem);
}

const appendItems = (items) => {
  console.log(items);
}

const fetchItems = () => {
  fetch(`/api/v1/garageItems`)
    .then(response => response.json())
    .then(parsedItems => appendItems(parsedItems))
    .catch(error => console.error(error))
}

const pageLoad = () => {
  fetchItems();
}

$(document).ready(pageLoad);
$('#submit-item').on('click', (event) => createNewItem(event))
