const createNewItem = (event) => {
  event.preventDefault();
  const newItem = {
    name: $('#item-name').val(),
    reason: $('#item-reason').val(),
    cleanliness: $('#item-cleanliness option:selected').text()
  }

  console.log(newItem);
}

$('#submit-item').on('click', (event) => createNewItem(event))
