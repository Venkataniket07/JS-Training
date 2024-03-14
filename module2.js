document.addEventListener("DOMContentLoaded", async () => {
  fetchProducts();

  const count = document.getElementById("items-count");
  count.textContent = "0";
  document.getElementById("cart-items").addEventListener("click", () => {
    displayCartItems();
  });

  closeCart();
  clearCartItems();
  searchProducts();
});

const baseUrl = `https://ui-training-c9af3-default-rtdb.firebaseio.com/product.json`;

async function fetchProducts() {
  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const products = await response.json();

  let productList = "";

  if (products && typeof products === "object") {
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

  document.getElementById("productsList").innerHTML = productList;

  // Adding product to cart
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      addToCart(productId);
    });
  });
}

var cartItems = [];

function existingProductIndex(productId) {
  return cartItems.findIndex((item) => item.productId === productId);
}

async function addToCart(productId) {
  if (existingProductIndex(productId) !== -1) {
    cartItems[existingProductIndex(productId)].quantity++;
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
    data["productId"] = productId;
    data["quantity"] = 1;
    cartItems.push(data);
  }

  cartCount();
}

async function displayCartItems() {
  const cartItemsList = document.querySelector(".cartItemsList");
  const totalCartPriceElement = document.getElementById("totalPrice");
  const cartItemsDisplay = document.getElementById("cartItemsDisplay");

  cartItemsList.innerHTML = "";
  if (cartItems && cartItems.length > 0) {
    cartItemsDisplay.style.display = "block";
    cartItems.forEach((item) => {
      const listItemHtml = `
        <li class="cart-item">
          <div class="product-item">
            <div class="product-image-div">
              <img src="${item.image}" alt="${item.name}" class="product-image">
            </div>
            <div class="product-details">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <p>Price: $${item.price}</p>
              <div class="quantity-controls">
                <button class="quantity-button minus" data-product-id="${item.productId}">-</button>
                <p class="quantity">${item.quantity}</p>
                <button class="quantity-button plus" data-product-id="${item.productId}">+</button>
              </div>
              <button class="remove-cart-item" data-product-id="${item.productId}">Remove</button>
            </div>
          </div>
        </li>
      `;
      cartItemsList.innerHTML += listItemHtml;
    });

    document.getElementById("cartValueDiv").style.display = "block";
    document.getElementById("clear").style.display = "inline-block";

    // Attach event listeners to plus and minus buttons
    const plusButtons = document.querySelectorAll(".plus");
    const minusButtons = document.querySelectorAll(".minus");
    const removeButtons = document.querySelectorAll(".remove-cart-item");

    plusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-product-id");
        const cartItem = cartItems[existingProductIndex(productId)];
        if (cartItem) {
          cartItem.quantity++;
          displayCartItems();
        }
      });
    });

    minusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-product-id");
        const cartItem = cartItems[existingProductIndex(productId)];
        if (cartItem && cartItem.quantity > 1) {
          cartItem.quantity--;
          displayCartItems();
        }
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-product-id");
        cartItems = cartItems.filter((item) => item.productId !== productId);
        displayCartItems(); // Re-render the cart items after removing
        cartCount();
      });
    });
  } else {
    const emptyCartMessageHtml = `
      <li class="empty-cart-message">Your cart is empty.</li>
    `;
    cartItemsList.innerHTML += emptyCartMessageHtml;
    cartItemsDisplay.style.display = "block";
    document.getElementById("clear").style.display = "none";
    document.getElementById("cartValueDiv").style.display = "none";
  }

  function calculateTotalPrice() {
    let totalCartPrice = 0;
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach((item) => {
        totalCartPrice += item.price * item.quantity;
      });
    }
    return totalCartPrice.toFixed(2);
  }
  totalCartPriceElement.textContent = "$ " + calculateTotalPrice() + "/-";
}

async function closeCart() {
  const closeCartButton = document.getElementById("close");
  closeCartButton.addEventListener("click", () => {
    document.getElementById("cartItemsDisplay").style.display = "none";
  });
}

function cartCount() {
  const count = document.getElementById("items-count");
  count.textContent = cartItems.length.toString();
}

async function clearCartItems() {
  document.getElementById("clear").addEventListener("click", async () => {
    cartItems.length = 0;
    document.getElementById("cartItemsDisplay").style.display = "none";
    document.getElementById("items-count").textContent = 0;
  });
}

async function searchProducts() {
  document
    .querySelector(".search-product-form")
    .addEventListener("keyup", (e) => {
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
