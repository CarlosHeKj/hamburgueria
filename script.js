const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart-modal");
const menu = document.querySelector("#menu")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.querySelector("#checkout-btn")
const closeModalBtn = document.querySelector("#close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")



let cart = [];

cartBtn.addEventListener("click", () => {
    updateCartModal()
    cartModal.style.display = "flex";
});
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal || event.target === closeModalBtn) {
        cartModal.style.display = "none"
    }
});
menu.addEventListener("click", (event) => {

    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {

        const nome = parentButton.getAttribute('data-name')
        const preço = parseFloat(parentButton.getAttribute('data-price'))
        const src = parentButton.getAttribute('data-src')
        addToCart(nome, preço, src)
    }
})


function addToCart(name, preço, src) {

    const existingItem = cart.find(item => item.name === name);
    if (!existingItem) {
        cart.push({
            name,
            preço,
            quantity: 1,
            src
        })
    }
    else {
        existingItem.quantity += 1;
    }
    updateCartModal()
}
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">

            <div class="flex flex-row gap-5">
            <img class="w-28 h-28 rounded-md" src="${item.src}"/>
            <div class="flex flex-col justify-between">
            <p class="font-medium"> ${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.preço.toFixed(2)}</p>
            </div>
            </div>

           
            <button class="remove-from-cart-btn" data-name="${item.name}" >
            Remover
            </button>
            
            </div>
        
        
        `
        total += item.preço * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    })
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener("click", function(event)  {
    if(event.target.classList.contains("remove-from-cart-btn")){
        
        const nome = event.target.getAttribute('data-name')
        removeItemCart(nome);
    }
})

function removeItemCart(nome){
    const index = cart.findIndex(item => item.name === nome);
    if( index !== -1){
        const item = cart[index];
        console.log(item);
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }else{
            cart.splice(index,1);
            updateCartModal();
        }
    }
    
}


addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
   
})

checkoutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({text: "Restaurante fechado no momento!, faça seu pedido amanhã entre as 18:00 e 23:00",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#af4444",
            },}).showToast();
       
        return;
    }
    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.preço} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone ="5521994552680"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    cart = [];
    updateCartModal();
})


function checkRestaurantOpen(){
    const date = new Date();
    const hora = date.getHours();
    return hora >= 18 && hora <= 23;
}
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
}