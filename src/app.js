let cart = [];

function showLargeImage(src) {
  let modalImg = document.createElement('img');
  modalImg.src = src;
  modalImg.classList.add('modal-img');
  
  // Append to modal
  let modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '';  // Clear modal content
  modalContent.appendChild(modalImg);
  
  // Show modal
  $('#modal').modal('show');
}

function updateCartCount() {
  document.getElementById('cart-count').innerText = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
}

// Function to show derivatives
// Function to show derivatives
function showDerivatives(derivatives) {
  const derivativesDiv = document.getElementById('derivatives');

  // Clear the previous content
  derivativesDiv.innerHTML = '';

  // Create and append the new content
  derivatives.forEach(derivative => {
    const derivativeDiv = document.createElement('div');
    derivativeDiv.className = 'derivative';

    if (derivative.image) {
      const derivativeImage = document.createElement('img');
      derivativeImage.src = derivative.image;
      derivativeImage.className = 'derivative-img';
      derivativeDiv.appendChild(derivativeImage);
    }

    const derivativeName = document.createElement('h3');
    derivativeName.innerText = derivative.name;
    derivativeDiv.appendChild(derivativeName);

    const derivativePrice = document.createElement('p');
    derivativePrice.innerText = `$${derivative.price}`;
    derivativeDiv.appendChild(derivativePrice);

    const addToCartButton = document.createElement('button');
    addToCartButton.innerText = 'Add';
    addToCartButton.onclick = function() {
      let foundItem = cart.find(cartItem => cartItem.item.name === derivative.name);
      if (foundItem) {
        foundItem.quantity += 1;
      } else {
        cart.push({item: derivative, quantity: 1});
      }
      updateCartCount();
      document.getElementById('cart-icon').classList.add('cart-icon-animation');
      setTimeout(() => {
        document.getElementById('cart-icon').classList.remove('cart-icon-animation');
      }, 500);
    };
    derivativeDiv.appendChild(addToCartButton);

    derivativesDiv.appendChild(derivativeDiv);
  });

  // Show the modal
  $('#derivativesModal').modal('show');
}



// Load menu data from JSON file
function hideLoadingScreen() {
  document.getElementById('loading').style.display = 'none';
}

fetch('your deployed data')
  .then(response => response.json())
  .then(menu => {


    hideLoadingScreen();

    // Determine the current page
    const currentPage = window.location.pathname;
    let relevantCategories = []; // This will hold the categories we want to display

    if (currentPage.includes("iceCof.html")) {
        relevantCategories.push(menu.find(section => section.section === "iced Coffees"));
    } else if (currentPage.includes("cof.html")) {
        relevantCategories.push(menu.find(section => section.section === "Coffees"));
    }
    else if (currentPage.includes("ice.html")) {
      relevantCategories.push(menu.find(section => section.section === "iced Drinks"));
    }
    else if (currentPage.includes("tea.html")) {
      relevantCategories.push(menu.find(section => section.section === "Tea"));
    }
    else if (currentPage.includes("snacks.html")) {
      relevantCategories.push(menu.find(section => section.section === "Snacks"));
    }
    else if (currentPage.includes("cold.html")) {
      relevantCategories.push(menu.find(section => section.section === "Cold Drinks"));
    }

    const menuDiv = document.getElementById('menu');
    const searchInput = document.getElementById('search');
    const allSections = [];

    // Loop only through the relevantCategories, instead of the entire menu
    for (let section of relevantCategories) {
      const sectionDiv = document.createElement('div');
      sectionDiv.id = section.section.replace(/\s+/g, '').toLowerCase();
      sectionDiv.className = 'section';
      sectionDiv.innerHTML = `<h2>${section.section}</h2>`;

      for (let item of section.items) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        // Create a circular image
        if(item.image){
          const itemImage = document.createElement('img');
          itemImage.src = item.image;
          itemImage.style.borderRadius = '50%';
          itemImage.className = 'item-img';
          itemImage.onclick = function() {
            showLargeImage(item.image);
          };
          itemDiv.appendChild(itemImage);
        }

        const itemName = `<h3>${item.name}</h3>`;
        const itemDescription = item.description ? `<p>${item.description}</p>` : '';
        const itemPrice = `<p>$${item.price}</p>`;
        itemDiv.innerHTML += itemName + itemDescription + itemPrice;

        if (item.derivatives && item.derivatives.length > 0) {
          const btnDerivatives = document.createElement('div');
          btnDerivatives.className = 'btn-derivatives special-button';
          btnDerivatives.onclick = function() {
            showDerivatives(item.derivatives);
          };
        
          const img = document.createElement('img');
          img.src = 'img/Untitled.png';  // Put the URL of your image here
          img.alt = 'Related Products';
          btnDerivatives.appendChild(img);
        
          itemDiv.appendChild(btnDerivatives);
        }
        
        const addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add';
        addToCartButton.onclick = function() {
          let foundItem = cart.find(cartItem => cartItem.item === item);
          if (foundItem) {
            foundItem.quantity += 1;
          } else {
            cart.push({item, quantity: 1});
          }
          updateCartCount();
          document.getElementById('cart-icon').classList.add('cart-icon-animation');
          setTimeout(() => {
            document.getElementById('cart-icon').classList.remove('cart-icon-animation');
          }, 500);
        };
        itemDiv.appendChild(addToCartButton);
        
        sectionDiv.appendChild(itemDiv);
      }

      allSections.push(sectionDiv);
      menuDiv.appendChild(sectionDiv);
    }

    
  
    
    // Function to update the total amount
    function updateTotalAmount() {
      let totalAmount = cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
      $('#totalAmount').text(`Total: $${totalAmount.toFixed(2)}`);
    }

    // Handle showing the cart modal
    $('#cart-icon').click(function() {
      $('#cartItems').empty();
      
      for (let cartItem of cart) {
        let itemDiv = $(`<div><p id="item-name-quantity">${cartItem.item.name} (${cartItem.quantity}) - $${cartItem.item.price}</p><p id="item-total-${cartItem.item.name}">$${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p></div>`);
        let removeButton = $('<button>Remove</button>');
        removeButton.click(function() {
          cart = cart.filter(item => item !== cartItem);
          updateCartCount();
          updateTotalAmount();
          itemDiv.remove();
        });
        let quantitySelect = $(`<select id="item-quantity-select-${cartItem.item.name}"></select>`);
        for (let i = 1; i <= 10; i++) {
          quantitySelect.append(`<option value="${i}" ${i === cartItem.quantity ? 'selected' : ''}>${i}</option>`);
        }
        quantitySelect.change(function() {
          cartItem.quantity = parseInt(this.value);
          updateCartCount();
          updateTotalAmount();
          document.getElementById(`item-name-quantity`).innerText = `${cartItem.item.name} (${cartItem.quantity}) - $${cartItem.item.price}`;
          document.getElementById(`item-total-${cartItem.item.name}`).innerText = `$${(cartItem.item.price * cartItem.quantity).toFixed(2)}`;
        });
        itemDiv.append(removeButton, quantitySelect);
        $('#cartItems').append(itemDiv);
      }

      updateTotalAmount();
      $('#cartModal').modal('show');
    });
  });

  $(document).ready(function() {
    $("#onboardingModal").modal('show');
    
  });

  function showOnboarding() {
    document.getElementById('onboarding').style.display = 'block';
  }
  
  function hideOnboarding() {
    document.getElementById('onboarding').style.display = 'none';
  }
  window.onload = showOnboarding;

  