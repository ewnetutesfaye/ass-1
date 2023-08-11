document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
});

async function fetchBooks() {
    const response = await fetch('books.json');
    const books = await response.json();
    displayBooks(books);
}

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('col-md-4');
        bookDiv.innerHTML = `
            <div class="card mb-4">
                <img src="path_to_default_image.jpg" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text"><small class="text-muted">${book.author}</small></p>
                    <button onclick="toggleDescription('${book.title}')" class="btn btn-sm btn-primary">Description +/-</button>
                    <p id="desc-${book.title}" class="card-text mt-2" style="display: none;">${book.description}</p>
                    <p class="card-text">$${book.price}</p>
                    <button onclick="addToCart('${book.title}', ${book.price})" class="btn btn-primary">Add to Cart</button>
                </div>
            </div>
        `;
        bookList.appendChild(bookDiv);
    });
}

function toggleDescription(title) {
    const descElem = document.getElementById(`desc-${title}`);
    
    if (descElem.style.display === 'none' || descElem.style.display === '') {
        descElem.style.display = 'block';
    } else {
        descElem.style.display = 'none';
    }
}

function addToCart(title, price) {
    const cartList = document.getElementById('cart-list');
    let itemInCart = document.getElementById(`cart-${title}`);

    if (itemInCart) {
        let qtyElem = itemInCart.querySelector('.quantity');
        qtyElem.textContent = parseInt(qtyElem.textContent) + 1;
    } else {
        let cartItem = document.createElement('li');
        cartItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        cartItem.id = `cart-${title}`;
        cartItem.innerHTML = `
            ${title} - $${price}
            <div>
                <button onclick="adjustQuantity('${title}', ${price}, -1)" class="btn btn-sm btn-secondary">-</button>
                <span class="quantity mx-2">1</span>
                <button onclick="adjustQuantity('${title}', ${price}, 1)" class="btn btn-sm btn-secondary">+</button>
                <button onclick="removeFromCart('${title}', ${price})" class="btn btn-sm btn-danger ml-2">Remove</button>
            </div>
        `;
        cartList.appendChild(cartItem);
    }

    updateTotal(price);
}
function adjustQuantity(title, price, adjustment) {
    const itemInCart = document.getElementById(`cart-${title}`);
    let qtyElem = itemInCart.querySelector('.quantity');
    let newQty = parseInt(qtyElem.textContent) + adjustment;
    
    if (newQty <= 0) {
        removeFromCart(title, price * parseInt(qtyElem.textContent));
    } else {
        qtyElem.textContent = newQty;
        updateTotal(price * adjustment);
    }
}

function removeFromCart(title) {
    const itemInCart = document.getElementById(`cart-${title}`);
    let qtyElem = itemInCart.querySelector('.quantity');
    let quantity = parseInt(qtyElem.textContent);
    let bookPriceElem = itemInCart.innerText.match(/-\s\$(\d+)/);
    let bookPrice = parseFloat(bookPriceElem[1]);
    let totalPrice = quantity * bookPrice;
    
    itemInCart.remove();
    updateTotal(-totalPrice);
}


function updateTotal(amount) {
    const cartTotal = document.getElementById('cart-total');
    cartTotal.textContent = parseFloat(cartTotal.textContent) + amount;
}
