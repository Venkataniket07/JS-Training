document.addEventListener("DOMContentLoaded", async () => {
  addNewProduct();
  fetchProducts();
  searchProducts();
});

const baseUrl = `https://ui-training-c9af3-default-rtdb.firebaseio.com/product.json`;

async function addNewProduct() {
  document.getElementById("addProductButton").addEventListener("click", () => {
    document.getElementById("container").style.display = "none";
    document.querySelector(".addFormDiv").style.display = "block";
  });

  document
    .getElementById("addButton")
    .addEventListener("click", async (event) => {
      event.preventDefault();

      const productName = document.querySelector(
        'input[type="text"][placeholder="Name"]'
      ).value;
      const productDescription = document.querySelector(
        'input[type="text"][placeholder="Description"]'
      ).value;
      const productPrice = document.querySelector(
        'input[type="number"][placeholder="Price"]'
      ).value;
      const productUrl = document.querySelector(
        'input[type="url"][placeholder="url"]'
      ).value;

      const postData = {
        name: productName,
        description: productDescription,
        image: productUrl,
        price: parseInt(productPrice),
      };

      try {
        const response = await fetch(
          `https://ui-training-c9af3-default-rtdb.firebaseio.com/product.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Product added successfully:", data);

        document.getElementById("addNewProduct").reset();
      } catch (error) {
        console.error("Error adding product:", error);
      }

      document.querySelector(".addFormDiv").style.display = "none";
      document.getElementById("container").style.display = "block";
      fetchProducts();
    });
}

const tablebodyElement = document.querySelector("#productList tbody");

async function fetchProducts() {
  const headers = new Headers();
  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const products = await response.json();

  let tableRows = "";

  if (products && typeof products === "object") {
    for (let [key, product] of Object.entries(products)) {
      tableRows += `<tr>
                  <td>${key}</td>
                  <td>${product.name}</td>
                  <td>${product.description}</td>
                  <td>${product.price}</td>
                  <td>${product.image}</td>
                  <td class = "buttonRow">
                      <button class="update_button" product-id = "${key}">Update</button>
                      <button class="delete_button" product-id = "${key}">Delete</button>
                  </td>
              </tr>`;
    }
  }

  tablebodyElement.innerHTML = tableRows;

  // Update functionality
  document.querySelectorAll(".update_button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("product-id");
      if (productId !== null) {
        updateProduct(productId);
      }
    });
  });

  // Delete functionality
  document.querySelectorAll(".delete_button").forEach((button) => {
    button.addEventListener("click", () => {
      var productId = button.getAttribute("product-id");
      deleteProduct(productId);
    });
  });
}

async function deleteProduct(productId) {
  console.log(productId);
  const response = await fetch(
    `https://ui-training-c9af3-default-rtdb.firebaseio.com/product/${productId}.json`,
    {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  if (response.ok) {
    console.log("Successfuly deleted: ", response);
  }
  fetchProducts();
}

async function closeDiv(div) {
  document.getElementById("cancel").addEventListener("click", () => {
    div.style.display = "none";
  });
}

async function updateProduct(productId) {
  const container = document.getElementById("container");
  const updateFormDiv = document.querySelector(".updateFormDiv");
  const updateButton = document.getElementById("updateButton");
  const updateProductForm = document.getElementById("updateProduct");

  var productName = updateProductForm.querySelector('input[placeholder="Name"');
  var productDescription = updateProductForm.querySelector(
    'input[placeholder="Description"]'
  );
  var productPrice = updateProductForm.querySelector(
    'input[placeholder="Price"]'
  );
  var productImageUrl = updateProductForm.querySelector(
    'input[placeholder="url"]'
  );

  try {
    const response = await fetch(
      `https://ui-training-c9af3-default-rtdb.firebaseio.com/product/${productId}.json`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    var productData = await response.json();
    console.log("Product fetched successfully:", productData);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  container.style.display = "none";
  updateFormDiv.style.display = "block";

  productName.value = productData.name;
  productDescription.value = productData.description;
  productPrice.value = productData.price;
  productImageUrl.value = productData.image;

  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: productName.value,
      description: productDescription.value,
      image: productImageUrl.value,
      price: parseInt(productPrice.value),
    };

    try {
      const response = await fetch(
        `https://ui-training-c9af3-default-rtdb.firebaseio.com/product/${productId}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Product updated successfully:", data);
    } catch (error) {
      console.error("Error updating product:", error);
    }

    updateFormDiv.style.display = "none";
    container.style.display = "block";
    fetchProducts();
    location.reload(); // to Destroy the EventListener.
  });
}

async function searchProducts() {
  document
    .querySelector(".search-product-form")
    .addEventListener("keyup", (e) => {
      e.preventDefault();
      let searchText = document
        .getElementById("search-product-input")
        .value.toLowerCase();

      const itemList = document.querySelector("#productList tbody");

      let items = itemList.getElementsByTagName("tr");
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
