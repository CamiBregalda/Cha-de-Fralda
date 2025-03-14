function openModal(name, price, imageId, link) {
    document.getElementById('modalProductName').innerText = name;
    document.getElementById('modalProductPrice').innerText = price;
    document.getElementById("productImage").src = "img/Produtos/" + imageId + ".jpg";
    document.getElementById('qrcode').src = "img/Qr Codes/" + imageId + ".jpeg";
    document.getElementById('modal').style.display = 'flex';

    const productLink = document.getElementById('productLink');
    productLink.innerText = 'Link do Pix';

    productLink.setAttribute('data-link', link);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function copyLink() {
    const productLink = document.getElementById('productLink');
    const linkToCopy = productLink.getAttribute('data-link');

    if (linkToCopy) {
        navigator.clipboard.writeText(linkToCopy).then(() => {
            alert('Link copiado com sucesso!');
        }).catch(err => {
            console.error('Erro ao copiar o link:', err);
        });
    } else {
        alert('Nenhum link disponível para copiar.');
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

async function loadProducts() {
    try {
        const response = await fetch('data.json');
        const products = await response.json();

        const productList = document.querySelector('.product-list');

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="img/Produtos/${product.id}.jpg" alt="${product.name}">
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                    <button class="buy-button" onclick="openModal('${product.name}', '${product.price}', '${product.id}', '${product.link}')">
                    Presentear
                    </button>
                </div>
            `;

            productList.appendChild(card);

            updateItemsPerPage()
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

let currentPage = 0;
let itemsPerPage = 1;
let showingAll = false;

function updateItemsPerPage() {
    const allCards = Array.from(document.querySelectorAll('.product-list .card'));

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
    const allCards = Array.from(document.querySelectorAll('.product-list .card'));

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
    const allCards = Array.from(document.querySelectorAll('.product-list .card'));
    
    const totalPages = Math.ceil(allCards.length / itemsPerPage);
    currentPage = (currentPage + 1) % totalPages;
    updateDisplay();
}

function prevPage() {
    const allCards = Array.from(document.querySelectorAll('.product-list .card'));

    const totalPages = Math.ceil(allCards.length / itemsPerPage);
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    updateDisplay();
}

function showAll() {
    const allCards = Array.from(document.querySelectorAll('.product-list .card'));

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

document.getElementById('recadoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;

    // Trocar pelo FORM ID correspondente
    const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSc4msnOjGADiouDC_UbY3V1x8Ife0MqdOf62z9UaWUfIanYEg/formResponse?usp=dialog';

    // Trocar os entry IDs do forms
    const formData = new FormData();
    formData.append('entry.748575701', nome);       
    formData.append('entry.1499394857', mensagem);   

    fetch(formURL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(() => {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('recadoForm').reset();
    })
    .catch((error) => {
        alert('Houve um erro ao enviar seu recado.');
        console.error('Erro:', error);
    });
});

// Inicializa a exibição
loadProducts();
window.addEventListener('resize', updateItemsPerPage);