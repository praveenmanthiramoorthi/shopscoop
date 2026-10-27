/* ═══════════════════════════════════════════════════════════════════════════
   App — Router, Init & Main Controller
   ═══════════════════════════════════════════════════════════════════════════ */

const App = (() => {
  let _searchTerm = '';
  let _selectedCategory = 'all';
  let _isInitialized = false;

  // ── Initialize ───────────────────────────────────────────────────────
  async function init() {
    // Show skeleton loader immediately
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="mb-8">
          <div class="skeleton" style="height: 280px; border-radius: 16px;"></div>
        </div>
        ${Components.skeletonGrid(8)}
      </div>
    `;

    // Init Lucide Icons
    lucide.createIcons();

    // Bind search & filter events
    _bindEvents();

    // Initialize store (Firebase)
    await Store.init();
    _isInitialized = true;

    // Subscribe to product updates
    Store.subscribe(products => {
      _updateCategories(products);
      render();
    });

    // Listen for hash changes
    window.addEventListener('hashchange', render);

    // Initial render
    render();
  }

  // ── Event Bindings ───────────────────────────────────────────────────
  function _bindEvents() {
    // Desktop search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          _searchTerm = e.target.value.trim();
          render();
        }, 300);
      });
    }

    // Mobile search toggle
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const mobileSearch = document.getElementById('mobile-search');
    if (mobileSearchBtn && mobileSearch) {
      mobileSearchBtn.addEventListener('click', () => {
        mobileSearch.classList.toggle('hidden');
        if (!mobileSearch.classList.contains('hidden')) {
          document.getElementById('mobile-search-input')?.focus();
        }
      });
    }

    // Mobile search input
    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) {
      let debounceTimer;
      mobileSearchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          _searchTerm = e.target.value.trim();
          // Sync desktop search
          if (searchInput) searchInput.value = _searchTerm;
          render();
        }, 300);
      });
    }

    // Category filter (desktop)
    const catFilter = document.getElementById('category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        _selectedCategory = e.target.value;
        // Sync mobile
        const mobileCat = document.getElementById('mobile-category-filter');
        if (mobileCat) mobileCat.value = _selectedCategory;
        render();
      });
    }

    // Category filter (mobile)
    const mobileCatFilter = document.getElementById('mobile-category-filter');
    if (mobileCatFilter) {
      mobileCatFilter.addEventListener('change', (e) => {
        _selectedCategory = e.target.value;
        // Sync desktop
        if (catFilter) catFilter.value = _selectedCategory;
        render();
      });
    }
  }

  // ── Update Category Dropdowns ────────────────────────────────────────
  function _updateCategories(products) {
    const categories = Store.getCategories();
    const selects = [
      document.getElementById('category-filter'),
      document.getElementById('mobile-category-filter')
    ];

    selects.forEach(select => {
      if (!select) return;
      const currentVal = select.value;
      select.innerHTML = categories.map(c =>
        `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c === 'all' ? 'All Categories' : c}</option>`
      ).join('');
    });
  }

  // ── Router / Render ──────────────────────────────────────────────────
  function render() {
    if (!_isInitialized) return;

    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    const nav = document.getElementById('main-nav');
    const footer = document.getElementById('main-footer');

    if (hash.startsWith('#/admin')) {
      // Admin route
      if (Store.isLoggedIn()) {
        root.innerHTML = Admin.dashboardView();
        // Show nav & footer minimally
        nav.style.display = '';
        footer.style.display = '';
      } else {
        root.innerHTML = Admin.loginView();
        nav.style.display = '';
        footer.style.display = 'none';
      }
    } else {
      // Landing page
      const products = Store.getProducts();
      root.innerHTML = Components.landingPage(products, _searchTerm, _selectedCategory);
      nav.style.display = '';
      footer.style.display = '';
    }

    // Re-init icons
    lucide.createIcons();

    // If on admins tab, load the list
    if (hash.startsWith('#/admin') && Store.isLoggedIn()) {
      const tabContent = document.getElementById('admin-tab-content');
      if (tabContent && tabContent.querySelector('#admin-list-container')) {
        setTimeout(() => Admin.loadAdminList(), 100);
      }
    }
  }

  return { init, render };
})();

// ── Bootstrap ────────────────────────────────────────────────────────
function bootApp() {
  App.init().catch(err => {
    console.error('App init failed:', err);
    document.getElementById('app-root').innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <i data-lucide="alert-triangle" class="w-8 h-8 text-red-400"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-200 mb-2">Connection Error</h2>
        <p class="text-sm text-gray-500 max-w-md">Could not connect to the database. Please check your Firebase configuration in <code class="text-amber-400">firebase-config.js</code> and ensure your project is set up correctly.</p>
        <button onclick="location.reload()" class="mt-6 px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-all">
          Try Again
        </button>
      </div>
    `;
    lucide.createIcons();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}
