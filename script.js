const productContainer = document.getElementById("productContainer");
const cartItems = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");
const darkModeBtn = document.getElementById("btn");
const searchInput = document.getElementById("input"); 
const loader = document.getElementById("loader");
const priceFilter = document.getElementById("price-filter");

let total = 0;
let cartData = {};
let products = [];


async function fetchProducts() {
    try {
        loader.classList.remove("hidden"); 
        const response = await fetch('https://fakestoreapi.com/products?limit=10');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    } finally {
        loader.classList.add("hidden"); 
    }
}


async function displayProducts(products) {
    productContainer.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3>${product.title}</h3>
            <p>${product.description.slice(0, 100)}...</p>
            <p><strong>💲 ${product.price}</strong></p>
            <button onclick="addToCart('${product.id}', '${product.title}', ${product.price})">Add to Cart</button>
        `;
        productContainer.appendChild(card);
    });
}


async function addToCart(id, title, price) {
    if (!cartData[id]) {
        cartData[id] = { title, price, quantity: 1 };
    } else {
        cartData[id].quantity++;
    }
    updateCart();
}


async function updateCart() {
    cartItems.innerHTML = '';
    total = 0;
    for (let id in cartData) {
        const item = cartData[id];
        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
            ${item.title} - 💲${(item.price * item.quantity).toFixed(2)}
            (<button onclick="increaseQuantity('${id}')">+</button>
            ${item.quantity}
            <button onclick="decreaseQuantity('${id}')">-</button>)
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    }
    totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
}


async function increaseQuantity(id) {
    cartData[id].quantity++;
    updateCart();
}


// async function decreaseQuantity(id) {
//     if (cartData[id].quantity > 1) {
//         cartData[id].quantity--;
//     } else {
//         delete cartData[id];
//     }
//     updateCart();
// }


searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
});



function applyTheme() {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    document.body.classList.toggle("dark-mode", isDarkMode);
    darkModeBtn.textContent = isDarkMode ? "Light mode" : "Dark mode";
}


darkModeBtn.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    darkModeBtn.textContent = isDarkMode ? "Light mode" : "Dark mode";
});


applyTheme();

const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "all") {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === selectedCategory);
        displayProducts(filteredProducts);
    }
});

priceFilter.addEventListener("change", (e) => {
    const selectedPrice = e.target.value;
    let filteredProducts = products;
    if (selectedPrice !== "all") {
        const [min, max] = selectedPrice.split("-").map(Number);
        filteredProducts = products.filter(product =>
            max ? product.price >= min && product.price <= max : product.price >= min
        );
    }
    displayProducts(filteredProducts);
});

fetchProducts();