function openModal(name, price, imageId) {
    document.getElementById('modalProductName').innerText = name;
    document.getElementById('modalProductPrice').innerText = price;
    document.getElementById("productImage").src = "img/Produtos/" + imageId + ".jpg";
    document.getElementById('qrcode').src = "img/Qr Codes/" + imageId + ".png";
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function copyLink() {
    const link = document.getElementById('productLink').innerText;
    navigator.clipboard.writeText(link) 
        .then(() => {
            alert('Link copiado!');
        })
        .catch(err => {
            console.error('Erro ao copiar o link: ', err);
        });
}


window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}



let currentPage = 0;
let itemsPerPage = 1;
const productList = document.querySelector('.product-list');
const allCards = Array.from(document.querySelectorAll('.product-list .card'));
let showingAll = false;

function updateItemsPerPage() {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1200) {
        itemsPerPage = 4; 
    } else if (screenWidth >= 768) {
        itemsPerPage = 2; 
    } else {
        itemsPerPage = 1; 
    }

    const totalPages = Math.ceil(allCards.length / itemsPerPage);
    if (currentPage >= totalPages) {
        currentPage = totalPages - 1;
    }

    updateDisplay();
}

function updateDisplay() {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;

    allCards.forEach((card, index) => {
        if (index >= start && index < end) {
        card.style.display = 'flex';
        } else {
        card.style.display = 'none';
        }
    });
}

function nextPage() {
    const totalPages = Math.ceil(allCards.length / itemsPerPage);
    currentPage = (currentPage + 1) % totalPages;
    updateDisplay();
}

function prevPage() {
    const totalPages = Math.ceil(allCards.length / itemsPerPage);
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    updateDisplay();
}

function showAll() {
    showingAll = !showingAll;

    if (showingAll) {
        const screenWidth = window.innerWidth;
        let itemsPerRow;

        if (screenWidth >= 1200) {
            itemsPerRow = 4;
        } else if (screenWidth >= 768) {
            itemsPerRow = 2;
        } else {
            itemsPerRow = 1;
        }

        const container = document.querySelector('.product-list');
        container.style.display = 'grid'; 
        container.style.gridTemplateColumns = `repeat(${itemsPerRow}, 1fr)`; 

        allCards.forEach((card) => {
            card.style.display = 'flex';
        });

        document.querySelector('.arrow.left').style.display = 'none';
        document.querySelector('.arrow.right').style.display = 'none';
        document.querySelector('.show-all-button').innerText = 'Mostrar de forma paginada';
    } else {
        document.querySelector('.arrow.left').style.display = 'block';
        document.querySelector('.arrow.right').style.display = 'block';
        document.querySelector('.show-all-button').innerText = 'Exibir todos os presentes';
        updateDisplay();
    }
}

// Inicializa a exibição
updateDisplay();
updateItemsPerPage();
window.addEventListener('resize', updateItemsPerPage);