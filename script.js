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

  return list;
};

window.onload = () => {
  fetchAPI();
}

// POST new expenese
document.getElementById('add').addEventListener('click', async function addNewExpense() {
  const shopValue = document.getElementById('shop-input').value;
  const priceValue = document.getElementById('amount-input').value;
  try {
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
      fetchAPI();
      document.getElementById('shop-input').value = null;
      document.getElementById('amount-input').value = null;

    } else alert(res.answer);
  } catch (res) { /* catch error */ }
});