const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const spinner = document.getElementById('spinner');
const filterOptions = document.querySelectorAll('.filter-label');

// Datos de ejemplo (reemplaza esto con tus propios datos)
const data = [
    { name: 'Delimosnter', description: 'Ingeniero', image: 'https://via.placeholder.com/50', tags: ['Option1', 'opción3'] },
    { name: 'Las hamburguesas del pueblo', description: 'Diseñadora', image: '../img/bocados-logo.webp', tags: ['filterOption3'] },
    { name: 'El barril del troy', description: 'Desarrollador', image: '../img/carlos.png', tags: ['opción3'] },
    { name: 'Delicias el sarko viral', description: 'Gerente', image: '../img/ana.jpg', tags: [] },
];

openModalBtn.addEventListener('click', () => {
    searchModal.classList.remove('hidden');
    searchModal.classList.add('flex');
    setTimeout(() => searchInput.focus(), 100);
});

closeModalBtn.addEventListener('click', () => {
    searchModal.classList.add('hidden');
    searchModal.classList.remove('flex');
    searchInput.value = '';
    searchResults.innerHTML = '';
    resetFilters();
});

let debounceTimer;
searchInput.addEventListener('input', () => {
    spinner.classList.remove('hidden');
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performSearch, 300);
});

filterOptions.forEach(label => {
    label.addEventListener('click', () => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }

        performSearch();
    });
});

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedFilters = Array.from(filterOptions)
        .filter(label => label.querySelector('input[type="checkbox"]').checked)
        .map(label => label.querySelector('span').textContent.toLowerCase());

    const filteredResults = data.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchTerm);
        const descriptionMatch = item.description.toLowerCase().includes(searchTerm);

        // Verifica si el item cumple con todos los filtros seleccionados
        const filterMatches = selectedFilters.length === 0 || selectedFilters.every(filter => item.tags.includes(filter));

        return (nameMatch || descriptionMatch) && filterMatches;
    });

    displayResults(filteredResults);
    spinner.classList.add('hidden');
}

function displayResults(results) {
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.innerHTML = '<li class="p-3 text-gray-500">No se encontraron resultados</li>';
        return;
    }
    results.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'flex items-center p-3 hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out animate-slide-down';
        li.style.animationDelay = `${index * 50}ms`;
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-full mr-4 border-2 border-gray-200" onerror="this.onerror=null; this.src='https://via.placeholder.com/50';">
            <div>
                <a href="/profile/${item.name.toLowerCase().replace(' ', '-')}" class="font-medium text-gray-800 block">${item.name}</a>
                <span class="text-gray-500 text-sm">${item.description}</span>
            </div>
        `;
        li.addEventListener('click', () => {
            window.location.href = `/profile/${item.name.toLowerCase().replace(' ', '-')}`;
        });
        searchResults.appendChild(li);
    });
}

function resetFilters() {
    filterOptions.forEach(filter => {
        const checkbox = filter.querySelector('input[type="checkbox"]');
        checkbox.checked = false;
        filter.classList.remove('selected');
    });
}

searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeModalBtn.click();
    }
});

searchModal.querySelector('div').addEventListener('click', (e) => {
    e.stopPropagation();
});
