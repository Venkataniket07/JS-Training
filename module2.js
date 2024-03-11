document.addEventListener('DOMContentLoaded', async () => {
    fetchProducts();

    const count = document.getElementById('items-count');
    count.textContent = '0';
    displayCartItems();    
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

const cartItems = [];

async function addToCart(productId) {
  const existingProductIndex = cartItems.findIndex(
    (item) => item.productId === productId
  );

  if (existingProductIndex !== -1) {
    // If the product already exists in the cart, increment its quantity
    cartItems[existingProductIndex].quantity++;
  } else {
    // If the product doesn't exist in the cart, fetch its data and add it to the cart
    const response = await fetch(
      `https://ui-training-c9af3-default-rtdb.firebaseio.com/product/${productId}.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }

    const data = await response.json();
    data['productId'] = productId;
    data['quantity'] = 1; // Initialize quantity to 1
    cartItems.push(data);
  }

  const count = document.getElementById("items-count");
  count.textContent = cartItems.length.toString(); // Update cart count
}


async function displayCartItems() {
    document.getElementById('cart-items').addEventListener('click', async () => {
        console.log(cartItems);
    });

}