document.addEventListener('DOMContentLoaded', async () => {
    fetchProducts();

    const count = document.getElementById('items-count');
    count.textContent = '0';
    document.getElementById('cart-items').addEventListener('click', () => {
      displayCartItems();
    });

    closeCart();
    clearCartItems();
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
  const cartItemsList = document.querySelector(".cartItemsList");
  const totalCartPriceElement = document.getElementById("totalPrice");
  const cartItemsDisplay = document.getElementById('cartItemsDisplay');

  cartItemsList.innerHTML = "";
  let totalCartPrice = 0; // Initialize total cart price outside the if block

  if (cartItems && cartItems.length > 0) {
    cartItemsDisplay.style.display = 'block';
    cartItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("cart-item");

      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const imageDiv = document.createElement("div");
      imageDiv.classList.add("product-image-div");

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.name;
      image.classList.add("product-image");

      imageDiv.appendChild(image);

      const productDetails = document.createElement("div");
      productDetails.classList.add("product-details");

      const productName = document.createElement("h3");
      productName.textContent = item.name;

      const productDescription = document.createElement("p");
      productDescription.textContent = item.description;

      const productPrice = document.createElement("p");
      productPrice.textContent = `Price: $${item.price}`;

      const productQuantity = document.createElement("p");
      productQuantity.textContent = `Quantity: ${item.quantity}`;

      productDetails.appendChild(productName);
      productDetails.appendChild(productDescription);
      productDetails.appendChild(productPrice);
      productDetails.appendChild(productQuantity);

      productItem.appendChild(imageDiv);
      productItem.appendChild(productDetails);

      listItem.appendChild(productItem);

      cartItemsList.appendChild(listItem);

      totalCartPrice += item.price * item.quantity;
    });

    document.getElementById("cartValueDiv").style.display = "block";
    document.getElementById("clear").style.display = "inline-block";
  } else {
    const emptyCartMessage = document.createElement("li");
    emptyCartMessage.classList.add("empty-cart-message");
    emptyCartMessage.textContent = "Your cart is empty.";
    cartItemsList.appendChild(emptyCartMessage);
    cartItemsDisplay.style.display = "block";
    document.getElementById('clear').style.display = 'none';
    document.getElementById("cartValueDiv").style.display = "none";
  }

  // Update the total cart price
  totalCartPriceElement.textContent = "$ " + totalCartPrice.toFixed(2) + "/-";
}

async function closeCart() {
  const closeCartButton = document.getElementById('close');
  closeCartButton.addEventListener('click', () => {
    document.getElementById("cartItemsDisplay").style.display = 'none';
  });
}

async function clearCartItems() {
    document.getElementById("clear").addEventListener('click', async () => {
      cartItems.length = 0;
      console.log(cartItems);
      document.getElementById("cartItemsDisplay").style.display = "none";
      document.getElementById("items-count").textContent = 0;
    });
}