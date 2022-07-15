/* eslint-disable no-use-before-define */
/* eslint-disable no-return-assign */
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

  const editBtn = list.querySelector('.edit');
  editBtn.addEventListener('click', () => {
    const nameField = list.querySelector('.shop')
    const name = nameField.innerText.substr(6).slice(0,-1);
    const priceField = list.querySelector('.amount')
    const price = priceField.innerText.substring(2);
    updateInstanceById(id, name, price, nameField, priceField, editBtn)
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

const deleteExpenseById = async (id) => {
  try {
  const URL = `${API}/${id}`;
  expensesContainer.innerHTML = '';
  const fetchedData = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
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

const updateInstanceById = async (id, name, price, nameField, priceField, editBtn) => {
  const errorValue = document.getElementById('error-display');
  const successValue = document.getElementById('success');
  const shopInputField = document.createElement('input');
  const priceInputField = document.createElement('input');
  const checkBtn = document.createElement('img');
  nameField.parentNode.replaceChild(shopInputField, nameField);
  priceField.parentNode.replaceChild(priceInputField, priceField);
  editBtn.parentNode.replaceChild(checkBtn, editBtn)
  checkBtn.src = 'https://img.icons8.com/color/48/000000/checked--v1.png';
  shopInputField.value = name;
  priceInputField.value = price;
  shopInputField.classList.add('edit-input-name');
  priceInputField.classList.add('edit-input-price');
  let editedShopValue = shopInputField.value;
  let editedPriceValue = priceInputField.value;
  shopInputField.addEventListener('change', (e) => {
    editedShopValue = e.target.value.trim();
  });
  priceInputField.addEventListener('change', (e) => {
    editedPriceValue = e.target.value;
  });
  const update = async () => {
  try {
    if (!editedShopValue && !editedPriceValue) {
      errorValue.style.display = 'block';
      return errorValue.innerHTML = 'At least one input should be changed';
    } 
    if(editedPriceValue < 0 || isNaN(editedPriceValue)) {
      errorValue.style.display = 'block';
      return errorValue.innerHTML = 'Edited price must be a positive number.';
    }
    const URL = `${API}/${id}`;
    expensesContainer.innerHTML = '';
    const fetchedData = await fetch(URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: editedShopValue,
        price: editedPriceValue
      })
    });
    const response = await fetchedData.json();
    if (response) {
      response.forEach((element) => {
        const listElement = renderExpense(element);
        expensesContainer.append(listElement);
        errorValue.style.display = 'none';
        successValue.style.display = 'block';
        successValue.innerText = 'One expense has been changed.';
        setTimeout(() => {       
          successValue.style.display = 'none';
        }, 2000);
      });
    }
   }
   catch(error) {
    errorValue.style.display = 'block';
    return errorValue.innerHTML = error;
   }
  }
  checkBtn.addEventListener('click', update);
}