const expensesContainer = document.querySelector('.expenses-container');
const API = 'http://localhost:3000/api/list';

const fetchAPI = async () => {
  const url = await fetch(API);
  const res = await url.json();
  res.forEach((element) => {
    const listEl = renderExpense(element);
    expensesContainer.append(listEl);
  });
}

const renderExpense = (data) => {
  const { id, name, price, createdAt } = data;
  const list = document.createElement('div');
  list.setAttribute("class", "list");
  list.innerHTML = `
    <p class="shop">Shop "${name}"</p>
    <p class="date">${createdAt}</p>
    <p class="amount">$ ${price}</p>
    <img class="edit" src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png"/>
    <img class="delete" src="https://img.icons8.com/external-kosonicon-solid-kosonicon/48/000000/external-bin-cleaning-kosonicon-solid-kosonicon.png"/> 
    `;

  list.querySelector('.delete').addEventListener('click', () => {
    deleteExpenseById(id)
  })

  return list;
};

window.onload = () => {
  fetchAPI();
}

const addNewExpense = async () => {
  const shopValue = document.getElementById('shop-input').value;
  const priceValue = document.getElementById('amount-input').value;
  const errorValue = document.getElementById('error-display');
  const successValue = document.getElementById('success');
  
  try {
    if(!shopValue || !priceValue) {
      successValue.style.display = 'none';
      errorValue.style.display = 'block';
      return errorValue.innerHTML = 'Name or price is not defined';
    }
    if(priceValue < 0 || isNaN(priceValue)) {
      successValue.style.display = 'none';
      errorValue.style.display = 'block';
      return errorValue.innerHTML = 'Price should be a positive number';
    }
    const fetchResponse = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: shopValue,
        price: priceValue,
      }),
    });
    const res = await fetchResponse.json();
    if (Array.isArray(res)) {
      expensesContainer.innerHTML = '';
      res.forEach(element => {
        const listElement = renderExpense(element);
        expensesContainer.append(listElement);
      })
      errorValue.style.display = 'none';
      successValue.style.display = 'block';
      successValue.innerText = 'New instance has been added.';
      setTimeout(() => {       
        successValue.style.display = 'none';
      }, 2000);
      document.getElementById('shop-input').value = null;
      document.getElementById('amount-input').value = null;
    }
  } catch (res) { /* catch error */ }
}

const addBtn = document.getElementById('add');
addBtn.addEventListener('click', addNewExpense);

const deleteMethod = {
  method: 'DELETE',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
};

const deleteExpenseById = async (id) => {
  try {
  const URL = `${API}/${id}`;
  expensesContainer.innerHTML = '';
  const fetchedData = await fetch(URL, deleteMethod);
  const response = await fetchedData.json();

  if (response) {
    response.forEach((element) => {
      const listElement = renderExpense(element);
      expensesContainer.append(listElement);
    });
  }
 }
 catch(error) {
  errorValue.style.display = 'block';
  return errorValue.innerHTML = error;
 }
};
