document.addEventListener('DOMContentLoaded', async () => {
    fetchProducts();

    const count = document.getElementById('items-count');
    count.textContent = '0';
    document.getElementById('cart-items').addEventListener('click', () => {
      displayCartItems();
    });

    closeCart();
    clearCartItems();
    searchProducts();
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

  if (products && typeof products === 'object') {
    for (let [key, product] of Object.entries(products)) {
      productList += `
        <li>
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


  document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
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
    
    cartItems[existingProductIndex].quantity++;
  } else {

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
    data['quantity'] = 1;
    cartItems.push(data);
  }

  const count = document.getElementById("items-count");
  count.textContent = cartItems.length.toString();
}

async function displayCartItems() {
  const cartItemsList = document.querySelector(".cartItemsList");
  const totalCartPriceElement = document.getElementById("totalPrice");
  const cartItemsDisplay = document.getElementById('cartItemsDisplay');

  cartItemsList.innerHTML = "";
  let totalCartPrice = 0;
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

async function searchProducts() {
  document
    .querySelector(".search-product-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      let searchText = document
        .getElementById("search-product-input2")
        .value.toLowerCase();

      const productList = document.querySelector("#productsList");

      let products = productList.getElementsByTagName("li");
      products = Array.from(products);

      products.forEach((liItem) => {
        let productName = liItem.querySelector("h3").textContent.toLowerCase();
        let productDescription = liItem
          .querySelector("p")
          .textContent.toLowerCase();

        if (
          productName.includes(searchText) ||
          productDescription.includes(searchText)
        ) {
          liItem.style.display = "block";
        } else {
          liItem.style.display = "none";
        }
      });
    });
}
