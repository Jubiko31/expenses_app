/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
const expansesContainer = document.querySelector('.expenses-container');
async function fetchAPI() {
  const url = await fetch('http://localhost:3000/api/list');
  const res = await url.json();
  res.forEach((element) => {
    getAllExpenses(element);
  });
}
fetchAPI();
// GET all data
const getAllExpenses = (data) => {
  expansesContainer.innerHTML += `<div class="list">
    <p class="shop">Shop "${data.name}"</p>
    <p class="date">${data.updatedAt}</p>
    <p class="amount">$ ${data.price}</p>
    <img id="${data.id}" class="edit" src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png"/>
    <img id="${data.id}" class="delete" src="https://img.icons8.com/external-kosonicon-solid-kosonicon/48/000000/external-bin-cleaning-kosonicon-solid-kosonicon.png"/> 
    </div>`;
};

// POST new expenese
document.getElementById('add').addEventListener('click', async function addNewExpense() {
  const shopValue = document.getElementById('shop-input').value;
  const priceValue = document.getElementById('amount-input').value;
  try {
    const fetchResponse = await fetch('http://localhost:3000/api/list/', {
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
      expansesContainer.innerHTML = '';
      res.forEach((element) => {
        getAllExpenses(element);
      });
      document.getElementById('shop-input').value = null;
      document.getElementById('amount-input').value = null;

    } else alert(res.answer);
  } catch (res) { /* catch error */ }
});
