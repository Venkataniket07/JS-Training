document.addEventListener('DOMContentLoaded', async () => {
    addNewProduct();
    fetchProducts();
    deleteProduct();
    update();
    searchProducts();
});

const baseUrl = `https://ui-training-c9af3-default-rtdb.firebaseio.com/product.json`;

async function addNewProduct() {
    document.getElementById('addProductButton').addEventListener('click', () => {
        document.getElementById('container').style.display = 'none';
        document.querySelector('.addFormDiv').style.display = 'block';
    });

    document.getElementById('addButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const productName = document.querySelector('input[type="text"][placeholder="Name"]').value;
    const productDescription = document.querySelector('input[type="text"][placeholder="Description"]').value;
    const productPrice = document.querySelector('input[type="number"][placeholder="Price"]').value;
    const productUrl = document.querySelector('input[type="url"][placeholder="url"]').value;

    const postData = {
        name: productName,
        description: productDescription,
        image: productUrl,
        price: parseInt(productPrice)
    };

    try {
        const response = await fetch(`https://ui-training-c9af3-default-rtdb.firebaseio.com/product.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Product added successfully:', data);

        document.getElementById('addNewProduct').reset();
    } catch (error) {
        console.error('Error adding product:', error);
    }

    document.querySelector('.addFormDiv').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    fetchProducts();
});
}

const tablebodyElement=document.querySelector('#productList tbody');
 
async function fetchProducts() {
  const headers = new Headers();
  const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
  });
 
  const products = await response.json();
 
  let tableRows = '';
 
  if (products && typeof products === 'object') {
      for (let [key, product] of Object.entries(products)) {
          tableRows +=
              `<tr>
                  <td class = "productId">${key}</td>
                  <td>${product.name}</td>
                  <td>${product.description}</td>
                  <td>${product.price}</td>
                  <td>${product.image}</td>
                  <td class = "buttonRow">
                      <button class="update_button">Update</button>
                      <button class="delete_button">Delete</button>
                  </td>
              </tr>`;
      }
  }
 
  tablebodyElement.innerHTML = tableRows;
}

async function deleteProduct() {
    document.getElementById('productList').addEventListener('click', async (e) => {
    let target = e.target;

    if( target.classList.contains('delete_button')) {
        const productId = target.parentElement.parentElement.querySelector('.productId').textContent;
        const product = target.parentElement.parentElement;
        console.log(productId);
        const response = await fetch(`https://ui-training-c9af3-default-rtdb.firebaseio.com/product/${productId}.json`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        if (response.ok) {
            console.log('Successfuly deleted: ', response);
            product.remove();
        }
    }
    fetchProducts();
});
}

async function closeDiv(div) {
    document.getElementById('cancel').addEventListener('click', () => {
        div.style.display = 'none';
    });
}

async function update() {
    document.getElementById('productList').addEventListener('click', async (e) => {
        let target = e.target;
        if (target.classList.contains('update_button')) {
            document.getElementById('container').style.display = 'none';
            document.querySelector('.updateFormDiv').style.display = 'block';
            
            const productId = target.closest('tr').querySelector('.productId').textContent;

            const updateButton = document.getElementById('updateButton');
            updateButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const productName = document.querySelector('.updateFormDiv input[type="text"][placeholder="Name"]').value;
                const productDescription = document.querySelector('.updateFormDiv input[type="text"][placeholder="Description"]').value;
                const productPrice = document.querySelector('.updateFormDiv input[type="number"][placeholder="Price"]').value;
                const productUrl = document.querySelector('.updateFormDiv input[type="url"][placeholder="url"]').value;

                const updatedData = {
                    name: productName,
                    description: productDescription,
                    image: productUrl,
                    price: parseInt(productPrice)
                };

                try {
                    const response = await fetch(`https://ui-training-c9af3-default-rtdb.firebaseio.com/product/${productId}.json`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData)
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log('Product updated successfully:', data);
                } catch (error) {
                    console.error('Error updating product:', error);
                }

                document.querySelector('.updateFormDiv').style.display = 'none';
                document.getElementById('container').style.display = 'block';
                fetchProducts();
            });
        }
    });
}

async function searchProducts() {
    document.querySelector('.search-product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let searchText = document.getElementById('search-product-input').value.toLowerCase();

        const itemList = document.querySelector('#productList tbody');
        
        let items = itemList.getElementsByTagName('tr');
        items = Array.from(items);

        items.forEach((trItem) => {
          let productName = trItem.children[1].textContent.toLowerCase();
          let productDescription = trItem.children[2].textContent.toLowerCase();

          if (
            productName.includes(searchText) ||
            productDescription.includes(searchText)
          ) {
            trItem.style.display = "table-row";
          } else {
            trItem.style.display = "none";
          }
        });
    });
}