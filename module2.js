document.addEventListener('DOMContentLoaded', async () => {
    fetchProducts();
});


const baseUrl = `https://ui-training-c9af3-default-rtdb.firebaseio.com/product.json`;

async function fetchProducts() {
  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const products = await response.json();

  let productList = '';

  // Check if products is not empty and is an object
  if (products && typeof products === 'object') {
    for (let [key, product] of Object.entries(products)) {
      productList += `
        <li >
          <div class="product-item">
          <div class = "product-image-div"><img src="${product.image}" alt="${product.name}" class="product-image"></div>
          <div class="product-details">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart-button" data-product-id="${key}">Add to Cart</button>
          </div>
          </div>
        </li>
      `;
    }
  }

  document.getElementById('productsList').innerHTML = productList;

  // Add event listeners to the "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      // Call a function to add the product to the cart using the productId
      addToCart(productId);
    });
  });
}

