/* ============================================
   SPH EQUIPMENT SHOP - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. EQUIPMENT CATALOG DATA
    const EQUIPMENT = [
        {
            id: "eq-dron-1",
            name: "Leg Press Machine",
            series: "Dronacharya Series",
            price: 45000,
            iconClass: "fas fa-weight-hanging"
        },
        {
            id: "eq-dron-2",
            name: "Hack Squat",
            series: "Dronacharya Series",
            price: 48000,
            iconClass: "fas fa-person-walking-luggage"
        },
        {
            id: "eq-dron-3",
            name: "Smith Machine",
            series: "Dronacharya Series",
            price: 55000,
            iconClass: "fas fa-shield-halved"
        },
        {
            id: "eq-sph-1",
            name: "Pec Fly Machine",
            series: "SPH Series",
            price: 35000,
            iconClass: "fas fa-arrows-up-down-left-right"
        },
        {
            id: "eq-sph-2",
            name: "Lat Pulldown Machine",
            series: "SPH Series",
            price: 28000,
            iconClass: "fas fa-angles-down"
        },
        {
            id: "eq-sph-3",
            name: "Seated Cable Row",
            series: "SPH Series",
            price: 32000,
            iconClass: "fas fa-arrows-left-right"
        },
        {
            id: "eq-imp-1",
            name: "Premium Dual Cable Cross",
            series: "Imported Series",
            price: 120000,
            iconClass: "fas fa-circle-nodes"
        },
        {
            id: "eq-imp-2",
            name: "Plate Loaded Incline Chest Press",
            series: "Imported Series",
            price: 65000,
            iconClass: "fas fa-weight-scale"
        },
        {
            id: "eq-imp-3",
            name: "Multi-Adjustable Bench",
            series: "Imported Series",
            price: 15000,
            iconClass: "fas fa-dumbbell"
        }
    ];

    // 2. DOM ELEMENTS
    const eqGrid = document.getElementById('eqGrid');
    const eqFilterButtons = document.querySelectorAll('.eq-filter-btn');
    const equipmentSearch = document.getElementById('equipmentSearch');
    const clearEquipmentSearch = document.getElementById('clearEquipmentSearch');
    const viewMoreEquipmentContainer = document.getElementById('viewMoreEquipmentContainer');
    const viewMoreEquipmentBtn = document.getElementById('viewMoreEquipment');

    // 2.1 SEARCH & VIEW STATE
    let searchQuery = '';
    let showAllEquipment = false;

    // 3. RENDER FUNCTION
    function renderEquipment() {
        if (!eqGrid) return;

        // Find active category
        const activeFilterBtn = document.querySelector('.eq-filter-btn.active');
        const filterSeries = activeFilterBtn ? activeFilterBtn.getAttribute('data-category') : 'All';

        eqGrid.innerHTML = '';
        
        // 1. Filter by category
        let filtered = filterSeries === 'All'
            ? EQUIPMENT
            : EQUIPMENT.filter(e => e.series.toLowerCase() === filterSeries.toLowerCase());

        // 2. Filter by search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(e => e.name.toLowerCase().includes(query));
        }

        // Toggle search clear button visibility
        if (clearEquipmentSearch) {
            clearEquipmentSearch.style.display = searchQuery ? 'flex' : 'none';
        }

        if (filtered.length === 0) {
            eqGrid.innerHTML = `
                <div class="eq-empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No equipment found</h3>
                    <p>No products found matching your search.</p>
                </div>
            `;
            if (viewMoreEquipmentContainer) {
                viewMoreEquipmentContainer.style.display = 'none';
            }
            return;
        }

        // 3. Handle limit / pagination
        const itemsLimit = 6;
        const totalMatchingItems = filtered.length;
        
        let itemsToRender = filtered;
        if (totalMatchingItems > itemsLimit && !showAllEquipment) {
            itemsToRender = filtered.slice(0, itemsLimit);
        }

        // Update View More button container visibility and label
        if (viewMoreEquipmentContainer && viewMoreEquipmentBtn) {
            if (totalMatchingItems > itemsLimit) {
                viewMoreEquipmentContainer.style.display = 'flex';
                if (showAllEquipment) {
                    viewMoreEquipmentBtn.querySelector('span').textContent = 'View Less';
                    viewMoreEquipmentBtn.querySelector('i').className = 'fas fa-chevron-up';
                } else {
                    viewMoreEquipmentBtn.querySelector('span').textContent = 'View More';
                    viewMoreEquipmentBtn.querySelector('i').className = 'fas fa-chevron-down';
                }
            } else {
                viewMoreEquipmentContainer.style.display = 'none';
            }
        } else if (viewMoreEquipmentContainer) {
            viewMoreEquipmentContainer.style.display = 'none';
        }

        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'eq-card section-hidden'; // works with original script intersection observer
            
            const formattedPrice = "₹" + item.price.toLocaleString('en-IN');
            
            // Construct prefilled message exactly as required
            const rawMessage = `Hello, I am interested in buying the ${item.name} listed for ${formattedPrice}. Is it available?`;
            const encodedMessage = encodeURIComponent(rawMessage);
            const whatsappUrl = `https://wa.me/916290941903?text=${encodedMessage}`;

            card.innerHTML = `
                <span class="eq-card-badge">${item.series}</span>
                <div class="eq-img-wrapper">
                    <div class="eq-img-placeholder">
                        <i class="${item.iconClass}"></i>
                        <span>Photo Coming Soon</span>
                    </div>
                </div>
                <div class="eq-details">
                    <h3 class="eq-title">${item.name}</h3>
                    <div class="eq-bottom-row">
                        <div class="eq-price-row">
                            <span class="eq-price-label">Price Range</span>
                            <span class="eq-price-value">${formattedPrice}</span>
                        </div>
                        <a href="${whatsappUrl}" target="_blank" class="eq-whatsapp-btn">
                            <i class="fab fa-whatsapp"></i>
                            <span>Inquire on WhatsApp</span>
                        </a>
                    </div>
                </div>
            `;
            eqGrid.appendChild(card);

            // Add class for fade-in transition
            setTimeout(() => {
                card.classList.add('section-visible');
            }, 50);
        });
    }

    // 4. FILTER TAB CLICKS
    eqFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            eqFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            showAllEquipment = false;
            renderEquipment();
        });
    });

    // 4.1 SEARCH AND CLEAR BINDINGS
    if (equipmentSearch) {
        equipmentSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            showAllEquipment = false;
            renderEquipment();
        });
    }

    if (clearEquipmentSearch) {
        clearEquipmentSearch.addEventListener('click', () => {
            if (equipmentSearch) {
                equipmentSearch.value = '';
                searchQuery = '';
                showAllEquipment = false;
                renderEquipment();
            }
        });
    }

    // 4.2 VIEW MORE BUTTON BINDINGS
    if (viewMoreEquipmentBtn) {
        viewMoreEquipmentBtn.addEventListener('click', () => {
            showAllEquipment = !showAllEquipment;
            renderEquipment();
        });
    }

    // 5. INITIALIZE
    renderEquipment();
});
