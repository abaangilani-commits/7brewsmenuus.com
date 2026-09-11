/**
 * 7 BREW MENU INTERACTIVE CONTROLLER (USA 2026)
 * Real-time filter engine, custom drink builder & order script generator
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let activeCategory = 'all';
  let activeDietaryFilter = null;
  let searchQuery = new URLSearchParams(window.location.search).get('q')?.trim().toLowerCase() || '';

  // Builder State
  const builderState = {
    baseCategory: 'originals',
    temperature: 'Iced',
    size: 'medium',
    milk: 'breve',
    sweetness: 'regular',
    selectedSyrups: ['caramel', 'vanilla'],
    selectedExtras: []
  };

  // DOM Elements
  const drinksGrid = document.getElementById('drinksGrid');
  const searchInput = document.getElementById('menuSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const categoryTabs = document.querySelectorAll('.cat-tab-btn');
  const dietChips = document.querySelectorAll('.diet-chip');
  const resultsCountSpan = document.getElementById('resultsCount');
  const faqListContainer = document.getElementById('faqListContainer');

  // Builder Elements
  const builderBaseSelect = document.getElementById('builderBaseSelect');
  const tempPills = document.querySelectorAll('[data-temp]');
  const sizePills = document.querySelectorAll('[data-size]');
  const milkSelect = document.getElementById('builderMilkSelect');
  const sweetnessSelect = document.getElementById('builderSweetnessSelect');
  const syrupCheckboxContainer = document.getElementById('syrupCheckboxContainer');
  const extrasCheckboxContainer = document.getElementById('extrasCheckboxContainer');
  const builderEstPrice = document.getElementById('builderEstPrice');
  const builderEstCalories = document.getElementById('builderEstCalories');
  const builderEstCaffeine = document.getElementById('builderEstCaffeine');
  const builderScriptText = document.getElementById('builderScriptText');
  const copyScriptBtn = document.getElementById('copyScriptBtn');
  const builderIngredientsList = document.getElementById('builderIngredientsList');
  const ingredientsCountBadge = document.getElementById('ingredientsCountBadge');
  const builderDietaryTags = document.getElementById('builderDietaryTags');
  const toastNotification = document.getElementById('toastNotification');

  if (searchInput) searchInput.value = searchQuery;
  // Initialize
  initSyrupCheckboxes();
  initFlavorCombos();
  initExtrasCheckboxes();
  initFaqs();
  renderDrinks();
  updateBuilderOutput();

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
      }
      renderDrinks();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderDrinks();
    });
  }

  // Category Tabs
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      renderDrinks();
      // Scroll to drinks grid so filtered results are visible
      if (drinksGrid) {
        drinksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Dietary Chips
  dietChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.classList.contains('active')) {
        chip.classList.remove('active');
        activeDietaryFilter = null;
      } else {
        dietChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeDietaryFilter = chip.dataset.diet;
      }
      renderDrinks();
    });
  });

  // Render Drinks
  function renderDrinks() {
    if (!drinksGrid) return;

    let filtered = MENU_DATA.items.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (activeDietaryFilter) {
        if (activeDietaryFilter === 'sugar-free' && !item.tags.includes('sugar-free-available')) return false;
        if (activeDietaryFilter === 'dairy-free' && !item.tags.includes('dairy-free-available') && !item.tags.includes('dairy-free')) return false;
        if (activeDietaryFilter === 'bestseller' && !item.tags.includes('bestseller')) return false;
      }

      // Search Query
      if (searchQuery) {
        const titleMatch = item.name.toLowerCase().includes(searchQuery);
        const taglineMatch = item.tagline.toLowerCase().includes(searchQuery);
        const descMatch = item.desc.toLowerCase().includes(searchQuery);
        const flavorMatch = item.flavors.some(f => f.toLowerCase().includes(searchQuery));
        return titleMatch || taglineMatch || descMatch || flavorMatch;
      }

      return true;
    });

    if (resultsCountSpan) {
      resultsCountSpan.textContent = `${filtered.length} drinks found`;
    }

    if (filtered.length === 0) {
      drinksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: #fff; border-radius: 14px; border: 1.5px dashed var(--brew-border);">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🔍</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--brew-crimson-dark);">No exact matches found</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-top: 6px;">Try clearing your filters or searching for "caramel", "energy", "sugar-free", or "blondie".</p>
          <button id="resetSearchBtn" class="btn btn-gold" style="margin-top: 16px;">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          activeCategory = 'all';
          activeDietaryFilter = null;
          categoryTabs.forEach(t => t.classList.toggle('active', t.dataset.category === 'all'));
          dietChips.forEach(c => c.classList.remove('active'));
          renderDrinks();
        });
      }
      return;
    }

    drinksGrid.innerHTML = filtered.map(item => {
      const isSecret = item.category === 'secret-menu';
      const categoryObj = MENU_DATA.categories.find(c => c.id === item.category);
      const categoryLabel = categoryObj?.name || item.category;
      const categoryIcon = categoryObj?.icon || '☕';

      return `
        <article class="drink-card" id="card-${item.id}">
          ${item.image ? `
            <div class="drink-card-img-wrap">
              <img src="${item.image}" 
                   alt="${item.imageAlt || item.name}"
                   srcset="${item.image.replace('.webp', '-320.webp')} 320w, ${item.image} 640w"
                   sizes="(max-width: 600px) 90vw, 400px" 
                   title="${item.name} - 7 Brew Coffee Menu"
                   width="640" 
                   height="640" 
                   loading="lazy" 
                   decoding="async" 
                   class="drink-card-img">
              <span class="image-credit">${item.imageCaption}</span>
            </div>
          ` : '<div class="product-photo-unavailable">Exact product photo unavailable</div>'}
          <div class="drink-card-top">
            <span class="drink-category-badge cat-badge-${item.category}" data-category="${item.category}">
              <span class="cat-badge-icon">${categoryIcon}</span> ${categoryLabel}
            </span>
            <span class="drink-card-badge">${item.badge}</span>
          </div>

          <h3 class="drink-card-title">${item.name}</h3>
          <div class="drink-tagline">${item.tagline}</div>
          <p class="drink-desc">${item.desc}</p>

          ${isSecret && item.orderHow ? `
            <div class="secret-how-to-order">
              <strong>🗣️ How to Order:</strong> ${item.orderHow}
            </div>
          ` : ''}

          <p class="image-credit">Estimated prices · confirm with your stand</p><table class="drink-prices-table" aria-label="Estimated prices for ${item.name}"><thead><tr><th>Small</th><th>Medium</th><th>Large</th></tr></thead><tbody><tr><td>$${item.pricing.small.toFixed(2)}</td><td>$${item.pricing.medium.toFixed(2)}</td><td>$${item.pricing.large.toFixed(2)}</td></tr></tbody></table>

          <div class="drink-card-meta">
            <span>${item.nutritionSource.startsWith('Official') ? '' : '~'}${item.calories.medium} kcal · medium</span><span>${item.caffeineMg.medium} mg caffeine</span><small>${item.nutritionSource}</small><a href="nutrition-calories">Customize nutrition →</a>
            
          </div>

          <div class="drink-card-actions">
            <button class="btn btn-outline btn-sm load-to-builder-btn" data-item-id="${item.id}">
              ✨ Customize In Drink Builder
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach load to builder events
    document.querySelectorAll('.load-to-builder-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        loadItemIntoBuilder(itemId);
      });
    });
  }

  // Suggested Flavor Combos Quick-Loader
  function initFlavorCombos() {
    const flavorComboPresetSelect = document.getElementById('flavorComboPresetSelect');
    if (!flavorComboPresetSelect || !MENU_DATA.flavorCombos) return;

    let optionsHtml = '<option value="">-- Or Pick a Suggested Flavor Combo --</option>';

    const coffeeCombos = MENU_DATA.flavorCombos.filter(c => c.category === 'coffee');
    const energyCombos = MENU_DATA.flavorCombos.filter(c => c.category === 'energy');

    optionsHtml += '<optgroup label="☕ Coffee, Breve & Mocha Pairings">';
    coffeeCombos.forEach(c => {
      optionsHtml += `<option value="${c.id}">${c.name} (${c.formula})${c.sfAvailable ? ' [SF ✓]' : ''}</option>`;
    });
    optionsHtml += '</optgroup>';

    optionsHtml += '<optgroup label="⚡ 7 Energy & 7 Fizz Pairings">';
    energyCombos.forEach(c => {
      optionsHtml += `<option value="${c.id}">${c.name} (${c.formula})${c.sfAvailable ? ' [SF ✓]' : ''}</option>`;
    });
    optionsHtml += '</optgroup>';

    flavorComboPresetSelect.innerHTML = optionsHtml;

    function applyFlavorCombo(comboId) {
      if (comboId === 'clear') {
        builderState.selectedSyrups = [];
        if (flavorComboPresetSelect) flavorComboPresetSelect.value = '';
      } else {
        const combo = MENU_DATA.flavorCombos.find(c => c.id === comboId);
        if (combo) {
          builderState.selectedSyrups = [...combo.syrupIds];
          if (flavorComboPresetSelect) flavorComboPresetSelect.value = combo.id;
        }
      }

      if (syrupCheckboxContainer) {
        syrupCheckboxContainer.querySelectorAll('.syrup-checkbox').forEach(cb => {
          cb.checked = builderState.selectedSyrups.includes(cb.value);
        });
      }
      updateBuilderOutput();
    }

    flavorComboPresetSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        applyFlavorCombo(e.target.value);
      }
    });

    document.querySelectorAll('.combo-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const comboId = btn.getAttribute('data-combo');
        if (comboId) {
          applyFlavorCombo(comboId);
        }
      });
    });
  }

  // Syrups Checkboxes
  function initSyrupCheckboxes() {
    if (!syrupCheckboxContainer) return;

    syrupCheckboxContainer.innerHTML = MENU_DATA.syrupFlavors.map(syrup => {
      const isChecked = builderState.selectedSyrups.includes(syrup.id);
      return `
        <label class="syrup-check-item">
          <input type="checkbox" value="${syrup.id}" ${isChecked ? 'checked' : ''} class="syrup-checkbox">
          <span>${syrup.name}</span>
          ${syrup.isSf ? '<span class="sf-tag">SF</span>' : ''}
        </label>
      `;
    }).join('');

    syrupCheckboxContainer.querySelectorAll('.syrup-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const val = cb.value;
        if (cb.checked) {
          if (!builderState.selectedSyrups.includes(val)) {
            builderState.selectedSyrups.push(val);
          }
        } else {
          builderState.selectedSyrups = builderState.selectedSyrups.filter(s => s !== val);
        }
        updateBuilderOutput();
      });
    });
  }

  // Extras Checkboxes
  function initExtrasCheckboxes() {
    if (!extrasCheckboxContainer) return;

    extrasCheckboxContainer.innerHTML = MENU_DATA.toppingsExtras.map(extra => {
      return `
        <label class="syrup-check-item">
          <input type="checkbox" value="${extra.id}" class="extra-checkbox">
          <span>${extra.name}</span>
        </label>
      `;
    }).join('');

    extrasCheckboxContainer.querySelectorAll('.extra-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const val = cb.value;
        if (cb.checked) {
          if (!builderState.selectedExtras.includes(val)) {
            builderState.selectedExtras.push(val);
          }
        } else {
          builderState.selectedExtras = builderState.selectedExtras.filter(e => e !== val);
        }
        updateBuilderOutput();
      });
    });
  }

  // Builder Controls Event Handlers
  if (builderBaseSelect) {
    builderBaseSelect.addEventListener('change', (e) => {
      builderState.baseCategory = e.target.value;
      updateBuilderOutput();
    });
  }

  tempPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tempPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      builderState.temperature = pill.dataset.temp;
      updateBuilderOutput();
    });
  });

  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      builderState.size = pill.dataset.size;
      updateBuilderOutput();
    });
  });

  if (milkSelect) {
    milkSelect.addEventListener('change', (e) => {
      builderState.milk = e.target.value;
      updateBuilderOutput();
    });
  }

  if (sweetnessSelect) {
    sweetnessSelect.addEventListener('change', (e) => {
      builderState.sweetness = e.target.value;
      updateBuilderOutput();
    });
  }

  // Calculate & Update Builder Output
  function updateBuilderOutput() {
    const milkObj = MENU_DATA.milkOptions.find(m => m.id === builderState.milk);

    // Update DOM meters
    if (builderEstPrice) builderEstPrice.textContent = 'Confirm at stand';
    if (builderEstCalories) builderEstCalories.textContent = 'Recipe dependent';
    if (builderEstCaffeine) builderEstCaffeine.textContent = 'Recipe dependent';

    // 4. Drive-thru order script text
    const sizeName = builderState.size.charAt(0).toUpperCase() + builderState.size.slice(1);
    const tempName = builderState.temperature;
    
    // Syrups text
    const syrupNames = builderState.selectedSyrups.map(sId => {
      return MENU_DATA.syrupFlavors.find(s => s.id === sId)?.name || sId;
    });
    const syrupString = syrupNames.length ? syrupNames.join(' and ') : 'Unsweetened';

    // Milk text
    const milkName = milkObj ? milkObj.name.split(' (')[0] : 'Breve';

    // Extras text
    const extraNames = builderState.selectedExtras.map(eId => {
      return MENU_DATA.toppingsExtras.find(e => e.id === eId)?.name || eId;
    });
    const extrasString = extraNames.length ? `, topped with ${extraNames.join(' and ')}` : '';

    const sweetnessNote = builderState.sweetness !== 'regular' ? ` (${builderState.sweetness} sweetness)` : '';

    const baseNames = {originals:'breve',classics:'coffee',energy:'7 Energy',fizz:'7 Fizz',tea:'tea',lemonade:'lemonade',smoothie:'smoothie',shake:'shake'};
    const milkPhrase = ['originals','classics','tea','shake'].includes(builderState.baseCategory) ? ` with ${milkName}` : '';
    const script = `Can I please get a ${sizeName} ${tempName} ${baseNames[builderState.baseCategory] || 'drink'}${milkPhrase}, ${syrupString}${sweetnessNote}${extrasString}?`;

    if (builderScriptText) {
      builderScriptText.textContent = `"${script}"`;
    }

    // Summarize choices without inventing ingredient quantities or dietary results.
    if (builderIngredientsList) {
      builderIngredientsList.replaceChildren();
      const choices = [sizeName + ' ' + tempName + ' ' + (baseNames[builderState.baseCategory] || 'drink'), 'Flavors: ' + syrupString, 'Sweetness: ' + builderState.sweetness, ...(milkPhrase ? ['Milk choice: ' + milkName] : []), ...extraNames.map(n => 'Requested topping: ' + n)];
      choices.forEach(choice => { const li = document.createElement('li'); li.className = 'ingredient-item'; li.textContent = choice; builderIngredientsList.appendChild(li); });
      if (ingredientsCountBadge) ingredientsCountBadge.textContent = 'Order choices';
    }
    if (builderDietaryTags) builderDietaryTags.textContent = 'Confirm availability, ingredients and the final price with your stand.';
  }

  // Copy Script Function
  if (copyScriptBtn) {
    copyScriptBtn.addEventListener('click', () => {
      const textToCopy = builderScriptText.textContent.replace(/^"|"$/g, '');
      (navigator.clipboard ? navigator.clipboard.writeText(textToCopy) : Promise.reject()).then(() => {
        showToast('📋 Order script copied! Read it at the drive-thru window.');
      }).catch(() => {
        showToast('Copy unavailable. Select and copy the order text manually.');
      });
    });
  }

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3500);
  }

  // Load an existing item into the builder
  function loadItemIntoBuilder(itemId) {
    const item = MENU_DATA.items.find(i => i.id === itemId);
    if (!item) return;

    const baseMap = {'originals':'originals','classics':'classics','energy':'energy','fizz':'fizz','teas-matcha':'tea','lemonades':'lemonade','smoothies':'smoothie','shakes':'shake','secret-menu':item.name.includes('Energy') ? 'energy' : 'originals'};
    builderState.baseCategory = baseMap[item.category] || 'originals';
    if (builderBaseSelect) builderBaseSelect.value = builderState.baseCategory;
    builderState.selectedExtras = [];
    builderState.temperature = item.availableAs?.[0] || 'Iced';
    tempPills.forEach(p => p.classList.toggle('active', p.dataset.temp === builderState.temperature));
    initExtrasCheckboxes();
    builderState.size = 'medium';
    sizePills.forEach(p => p.classList.toggle('active', p.dataset.size === 'medium'));

    // Set matching syrups
    builderState.selectedSyrups = [];
    item.flavors.forEach(f => {
      const match = MENU_DATA.syrupFlavors.find(s => s.name.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(s.name.toLowerCase()));
      if (match && !builderState.selectedSyrups.includes(match.id)) {
        builderState.selectedSyrups.push(match.id);
      }
    });

    // Refresh checkboxes
    initSyrupCheckboxes();
    updateBuilderOutput();

    // Scroll smoothly to builder
    const customizerEl = document.getElementById('drinkBuilderSection');
    if (customizerEl) {
      customizerEl.scrollIntoView({ behavior: 'smooth' });
    }

    showToast(`✨ Loaded ${item.name} into custom builder!`);
  }

  // Initialize FAQs
  function initFaqs() {
    if (!faqListContainer) return;

    faqListContainer.innerHTML = MENU_DATA.faqs.map((faq, index) => {
      const isOpen = index === 0 ? 'open' : '';
      return `
        <details class="faq-item" ${isOpen}>
          <summary class="faq-question">${faq.q}</summary>
          <div class="faq-answer">${faq.a}</div>
        </details>
      `;
    }).join('');
  }

});
