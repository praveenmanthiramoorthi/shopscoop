/* ═══════════════════════════════════════════════════════════════════════════
   Admin Portal — Login, Dashboard, CRUD, Admin Management
   ═══════════════════════════════════════════════════════════════════════════ */

const Admin = (() => {
  let _activeTab = 'dashboard';
  let _editingProductId = null;

  // ── Login View ───────────────────────────────────────────────────────
  function loginView() {
    return `
      <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div class="relative w-full max-w-md">
          <!-- Background glow -->
          <div class="absolute -inset-8 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-violet-500/10 rounded-3xl blur-3xl"></div>

          <div class="relative bg-[#1a1d24]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl fade-up">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                <i data-lucide="shield-check" class="w-7 h-7 text-gray-900"></i>
              </div>
              <h2 class="text-2xl font-bold text-gray-100">Admin Portal</h2>
              <p class="text-sm text-gray-500 mt-1">Sign in to manage your products</p>
            </div>

            <!-- Login Form -->
            <form id="admin-login-form" class="space-y-5" onsubmit="Admin.handleLogin(event)">
              <div>
                <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Username</label>
                <div class="relative">
                  <i data-lucide="user" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"></i>
                  <input
                    type="text"
                    id="login-username"
                    required
                    autocomplete="username"
                    placeholder="Enter your username"
                    class="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Password</label>
                <div class="relative">
                  <i data-lucide="lock" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"></i>
                  <input
                    type="password"
                    id="login-password"
                    required
                    autocomplete="current-password"
                    placeholder="Enter your password"
                    class="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>
              <div id="login-error" class="hidden text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"></div>
              <button
                type="submit"
                id="login-submit-btn"
                class="cta-btn w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <i data-lucide="log-in" class="w-4 h-4"></i>
                Sign In
              </button>
            </form>

            <div class="mt-6 text-center">
              <a href="#/" class="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-1">
                <i data-lucide="arrow-left" class="w-3 h-3"></i>
                Back to Store
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Handle Login ─────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit-btn');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Signing in…';
    lucide.createIcons({ nodes: [submitBtn] });

    try {
      const success = await Store.login(username, password);
      if (success) {
        Components.showToast(`Welcome back, ${username}!`, 'success');
        window.location.hash = '#/admin';
        App.render();
      } else {
        errorEl.textContent = 'Invalid username or password. Please try again.';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i> Sign In';
        lucide.createIcons({ nodes: [submitBtn] });
      }
    } catch (err) {
      errorEl.textContent = 'Connection error. Please check your internet and try again.';
      errorEl.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i> Sign In';
      lucide.createIcons({ nodes: [submitBtn] });
    }
  }

  // ── Dashboard View ───────────────────────────────────────────────────
  function dashboardView() {
    const admin = Store.currentAdmin();
    _activeTab = _activeTab || 'dashboard';

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-8 fade-up">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <i data-lucide="layout-dashboard" class="w-5 h-5 text-gray-900"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-100">Admin Dashboard</h1>
              <p class="text-xs text-gray-500">Welcome, <span class="text-amber-400">${admin?.username || 'admin'}</span></p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a href="#/" class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-all flex items-center gap-2">
              <i data-lucide="store" class="w-4 h-4"></i>
              <span class="hidden sm:inline">View Store</span>
            </a>
            <button onclick="Admin.handleLogout()" class="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2">
              <i data-lucide="log-out" class="w-4 h-4"></i>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-2 mb-8 overflow-x-auto pb-2 fade-up stagger-1">
          <button onclick="Admin.switchTab('dashboard')" class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${_activeTab === 'dashboard' ? 'admin-tab-active' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}">
            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            Dashboard
          </button>
          <button onclick="Admin.switchTab('analytics')" class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${_activeTab === 'analytics' ? 'admin-tab-active' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}">
            <i data-lucide="line-chart" class="w-4 h-4 text-amber-400"></i>
            Analytics &amp; Revenue
          </button>
          <button onclick="Admin.switchTab('add')" class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${_activeTab === 'add' ? 'admin-tab-active' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            Add Product
          </button>
          <button onclick="Admin.switchTab('manage')" class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${_activeTab === 'manage' ? 'admin-tab-active' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}">
            <i data-lucide="package" class="w-4 h-4"></i>
            Manage Products
          </button>
          <button onclick="Admin.switchTab('admins')" class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 shrink-0 ${_activeTab === 'admins' ? 'admin-tab-active' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}">
            <i data-lucide="users" class="w-4 h-4"></i>
            Admins
          </button>
        </div>

        <!-- Tab Content -->
        <div id="admin-tab-content" class="fade-up stagger-2">
          ${_renderTabContent()}
        </div>
      </div>
    `;
  }

  function _renderTabContent() {
    switch (_activeTab) {
      case 'dashboard': return _dashboardTab();
      case 'analytics': return _analyticsTab();
      case 'add':       return _addProductTab();
      case 'manage':    return _manageProductsTab();
      case 'admins':    return _adminsTab();
      default:          return _dashboardTab();
    }
  }

  // ── Dashboard Tab ────────────────────────────────────────────────────
  function _dashboardTab() {
    const analytics = Store.getAnalytics();

    return `
      <div class="space-y-6">
        <!-- Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Products -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <i data-lucide="package" class="w-5 h-5 text-amber-400"></i>
              </div>
              <span class="text-xs text-gray-600 uppercase font-semibold tracking-wider">Products</span>
            </div>
            <div class="text-3xl font-black text-gray-100 count-up">${analytics.totalProducts}</div>
            <p class="text-xs text-gray-500 mt-1">Total items in catalog</p>
          </div>

          <!-- Total Clicks -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <i data-lucide="mouse-pointer-click" class="w-5 h-5 text-orange-400"></i>
              </div>
              <span class="text-xs text-gray-600 uppercase font-semibold tracking-wider">Clicks</span>
            </div>
            <div class="text-3xl font-black text-gray-100 count-up">${analytics.totalClicks.toLocaleString()}</div>
            <p class="text-xs text-gray-500 mt-1">Total click-throughs</p>
          </div>

          <!-- Est. Earnings in INR -->
          <div class="bg-gradient-to-br from-emerald-500/10 via-[#1a1d24]/80 to-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-6">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <i data-lucide="sparkles" class="w-5 h-5 text-emerald-400"></i>
              </div>
              <span class="text-xs text-emerald-400 uppercase font-semibold tracking-wider">Est. Earnings</span>
            </div>
            <div class="text-3xl font-black text-emerald-300 count-up">${Store.formatCurrency(analytics.estEarnings, 'INR')}</div>
            <p class="text-xs text-gray-500 mt-1">Projected commission in ₹</p>
          </div>

          <!-- Top Performing -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <i data-lucide="trophy" class="w-5 h-5 text-rose-400"></i>
              </div>
              <span class="text-xs text-gray-600 uppercase font-semibold tracking-wider">Top Item</span>
            </div>
            <div class="text-sm font-semibold text-gray-200 line-clamp-1">${analytics.topProduct?.title || 'N/A'}</div>
            <p class="text-xs text-amber-400 mt-1">${analytics.topProduct ? analytics.topProduct.clicks + ' clicks' : ''}</p>
          </div>
        </div>

        <!-- Analytics Quick Banner -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <i data-lucide="line-chart" class="w-5 h-5 text-amber-400"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-200">Detailed Traffic &amp; Revenue Analytics Available</h4>
              <p class="text-xs text-gray-400">Track conversion rates, category market share, badge matrices, and export reports in CSV.</p>
            </div>
          </div>
          <button onclick="Admin.switchTab('analytics')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold text-xs shrink-0 transition-all shadow-md shadow-amber-500/20">
            Open Analytics Portal →
          </button>
        </div>

        <!-- Top Products Chart (simple bar) -->
        <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
          <h3 class="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <i data-lucide="trending-up" class="w-4 h-4 text-amber-400"></i>
            Top Products by Clicks
          </h3>
          <div class="space-y-3">
            ${_topProductsBars()}
          </div>
        </div>
      </div>
    `;
  }

  function _topProductsBars() {
    const products = Store.getProducts().sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 6);
    if (!products.length) return '<p class="text-sm text-gray-600">No products yet.</p>';
    const maxClicks = Math.max(...products.map(p => p.clicks || 0), 1);

    return products.map(p => {
      const width = Math.max(((p.clicks || 0) / maxClicks) * 100, 2);
      return `
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 rounded-lg overflow-hidden bg-white/5 shrink-0">
            <img src="${p.imageUrl}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs text-gray-400 truncate mb-1">${p.title}</div>
            <div class="h-2 rounded-full bg-white/5 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700" style="width: ${width}%"></div>
            </div>
          </div>
          <span class="text-xs text-gray-500 font-medium shrink-0 w-12 text-right">${p.clicks || 0}</span>
        </div>
      `;
    }).join('');
  }

  // ── Add Product Tab ──────────────────────────────────────────────────
  function _addProductTab() {
    return `
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Form -->
        <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
          <h3 class="text-sm font-semibold text-gray-300 mb-5 flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4 text-amber-400"></i>
            Add New Product
          </h3>

          <form id="add-product-form" class="space-y-4" onsubmit="Admin.handleAddProduct(event)">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Affiliate / Amazon URL *</label>
              <input type="url" id="ap-url" required placeholder="https://www.amazon.com/dp/..." oninput="Admin.validateUrl(this); Admin.updatePreview();"
                     class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              <p id="url-tag-status" class="text-xs mt-1 hidden"></p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Product Title *</label>
              <input type="text" id="ap-title" required placeholder="e.g. Sony WH-1000XM5 Headphones" oninput="Admin.updatePreview()"
                     class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Price *</label>
                <input type="number" id="ap-price" required step="0.01" min="0" placeholder="0.00" oninput="Admin.updatePreview()"
                       class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Currency</label>
                <select id="ap-currency" oninput="Admin.updatePreview()"
                        class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50 cursor-pointer">
                  <option value="INR" selected>INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Image URL</label>
              <input type="url" id="ap-image" placeholder="https://images.unsplash.com/..." oninput="Admin.updatePreview()"
                     class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
                <input type="text" id="ap-category" placeholder="e.g. Electronics" oninput="Admin.updatePreview()"
                       class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Badge</label>
                <select id="ap-badge" oninput="Admin.updatePreview()"
                        class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50 cursor-pointer">
                  <option value="">None</option>
                  <option value="Trending">Trending</option>
                  <option value="Editor's Choice">Editor's Choice</option>
                  <option value="Best Value">Best Value</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Hot Deal">Hot Deal</option>
                </select>
              </div>
            </div>

            <button type="submit" id="add-product-btn"
                    class="cta-btn w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all mt-2">
              <i data-lucide="plus" class="w-4 h-4"></i>
              Publish Product
            </button>
          </form>
        </div>

        <!-- Live Preview -->
        <div>
          <h3 class="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <i data-lucide="eye" class="w-4 h-4 text-gray-600"></i>
            Live Preview
          </h3>
          <div id="live-preview-container" class="preview-card max-w-sm">
            ${Components.productCard({
              id: 'preview',
              title: 'Product Title',
              price: 0,
              currency: 'INR',
              category: 'Category',
              badge: '',
              imageUrl: '',
              affiliateUrl: '#',
              clicks: 0
            }, 0)}
          </div>
        </div>
      </div>
    `;
  }

  // ── Manage Products Tab ──────────────────────────────────────────────
  function _manageProductsTab() {
    const products = Store.getProducts();

    return `
      <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        <div class="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <i data-lucide="package" class="w-4 h-4 text-amber-400"></i>
            All Products (${products.length})
          </h3>
        </div>

        ${products.length ? `
          <div class="divide-y divide-white/5">
            ${products.map(p => _productRow(p)).join('')}
          </div>
        ` : `
          <div class="p-12 text-center">
            <i data-lucide="inbox" class="w-12 h-12 text-gray-700 mx-auto mb-3"></i>
            <p class="text-sm text-gray-500">No products yet. Add your first product!</p>
          </div>
        `}
      </div>
    `;
  }

  function _productRow(product) {
    const isEditing = _editingProductId === product.id;

    if (isEditing) {
      return `
        <div class="admin-table-row p-4 bg-amber-500/5" data-row-id="${product.id}">
          <div class="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-4 items-start">
            <!-- Thumb -->
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0">
              <img src="${product.imageUrl}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'" />
            </div>

            <!-- Editable Fields -->
            <div class="space-y-2 flex-1 min-w-0">
              <input type="text" id="edit-title-${product.id}" value="${product.title}" class="edit-input w-full" placeholder="Title" />
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <input type="number" id="edit-price-${product.id}" value="${product.price}" step="0.01" class="edit-input" placeholder="Price" />
                <input type="text" id="edit-category-${product.id}" value="${product.category || ''}" class="edit-input" placeholder="Category" />
                <select id="edit-badge-${product.id}" class="edit-input">
                  <option value="" ${!product.badge ? 'selected' : ''}>No Badge</option>
                  <option value="Trending" ${product.badge === 'Trending' ? 'selected' : ''}>Trending</option>
                  <option value="Editor's Choice" ${product.badge === "Editor's Choice" ? 'selected' : ''}>Editor's Choice</option>
                  <option value="Best Value" ${product.badge === 'Best Value' ? 'selected' : ''}>Best Value</option>
                  <option value="New Arrival" ${product.badge === 'New Arrival' ? 'selected' : ''}>New Arrival</option>
                  <option value="Hot Deal" ${product.badge === 'Hot Deal' ? 'selected' : ''}>Hot Deal</option>
                </select>
              </div>
              <input type="url" id="edit-url-${product.id}" value="${product.affiliateUrl}" class="edit-input w-full" placeholder="Affiliate URL" />
              <input type="url" id="edit-image-${product.id}" value="${product.imageUrl}" class="edit-input w-full" placeholder="Image URL" />
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 shrink-0">
              <button onclick="Admin.saveEdit('${product.id}')" class="px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-all flex items-center gap-1">
                <i data-lucide="check" class="w-3.5 h-3.5"></i> Save
              </button>
              <button onclick="Admin.cancelEdit()" class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:bg-white/10 transition-all flex items-center gap-1">
                <i data-lucide="x" class="w-3.5 h-3.5"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="admin-table-row p-4" data-row-id="${product.id}">
        <div class="flex items-center gap-4">
          <!-- Thumb -->
          <div class="w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0">
            <img src="${product.imageUrl}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-200 truncate">${product.title}</h4>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-sm font-bold text-amber-400">${Store.formatCurrency(product.price, product.currency)}</span>
              <span class="text-xs text-gray-600">•</span>
              <span class="text-xs text-gray-500">${product.category || 'Uncategorized'}</span>
              <span class="text-xs text-gray-600">•</span>
              <span class="text-xs text-gray-500">${product.clicks || 0} clicks</span>
              ${product.badge ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">${product.badge}</span>` : ''}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="Admin.startEdit('${product.id}')" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group" title="Edit">
              <i data-lucide="pencil" class="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-400"></i>
            </button>
            <button onclick="Admin.confirmDelete('${product.id}', '${product.title.replace(/'/g, "\\'")}')" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-all group" title="Delete">
              <i data-lucide="trash-2" class="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Admins Tab ───────────────────────────────────────────────────────
  function _adminsTab() {
    return `
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Add Admin -->
        <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
          <h3 class="text-sm font-semibold text-gray-300 mb-5 flex items-center gap-2">
            <i data-lucide="user-plus" class="w-4 h-4 text-amber-400"></i>
            Create New Admin
          </h3>
          <form id="add-admin-form" class="space-y-4" onsubmit="Admin.handleAddAdmin(event)">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Username</label>
              <input type="text" id="new-admin-user" required placeholder="Enter username"
                     class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" id="new-admin-pass" required placeholder="Enter password"
                     class="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
            </div>
            <button type="submit"
                    class="cta-btn w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              Create Admin
            </button>
          </form>
        </div>

        <!-- Admin List -->
        <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
          <div class="p-5 border-b border-white/5">
            <h3 class="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <i data-lucide="users" class="w-4 h-4 text-amber-400"></i>
              Authorized Admins
            </h3>
          </div>
          <div id="admin-list-container" class="p-4">
            <div class="flex items-center justify-center py-6">
              <i data-lucide="loader-2" class="w-5 h-5 text-gray-600 animate-spin"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function _loadAdminList() {
    const container = document.getElementById('admin-list-container');
    if (!container) return;

    try {
      const admins = await Store.getAdmins();
      if (!admins.length) {
        container.innerHTML = '<p class="text-sm text-gray-600 text-center py-4">No admins found.</p>';
        return;
      }

      container.innerHTML = `
        <div class="space-y-2">
          ${admins.map(a => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <i data-lucide="user" class="w-4 h-4 text-amber-400"></i>
                </div>
                <span class="text-sm font-medium text-gray-300">${a.username}</span>
              </div>
              <button onclick="Admin.confirmDeleteAdmin('${a.username}')" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/10 transition-all group" title="Remove">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 text-gray-600 group-hover:text-red-400"></i>
              </button>
            </div>
          `).join('')}
        </div>
      `;
      lucide.createIcons({ nodes: [container] });
    } catch (err) {
      container.innerHTML = '<p class="text-sm text-red-400 text-center py-4">Failed to load admins.</p>';
    }
  }

  // ── URL Validator ────────────────────────────────────────────────────
  function validateUrl(input) {
    const statusEl = document.getElementById('url-tag-status');
    const url = input.value.trim();

    if (!url) {
      statusEl.classList.add('hidden');
      return;
    }

    const isAmazon = /amazon\.(com|co\.uk|de|fr|in|co\.jp|ca|com\.au|es|it)/i.test(url);
    const hasTag = /[?&]tag=/i.test(url);

    statusEl.classList.remove('hidden');

    if (isAmazon && hasTag) {
      statusEl.textContent = '✓ Amazon URL with affiliate tag detected';
      statusEl.className = 'text-xs mt-1 text-emerald-400';
    } else if (isAmazon && !hasTag) {
      statusEl.textContent = '⚠ Amazon URL detected but no affiliate tag found. Add ?tag=YOUR_TAG to track commissions.';
      statusEl.className = 'text-xs mt-1 text-amber-400';
    } else {
      statusEl.textContent = 'ℹ Non-Amazon URL — ensure it\'s a valid affiliate link.';
      statusEl.className = 'text-xs mt-1 text-gray-500';
    }
  }

  // ── Live Preview ─────────────────────────────────────────────────────
  function updatePreview() {
    const container = document.getElementById('live-preview-container');
    if (!container) return;

    const title    = document.getElementById('ap-title')?.value || 'Product Title';
    const price    = document.getElementById('ap-price')?.value || 0;
    const currency = document.getElementById('ap-currency')?.value || 'INR';
    const imageUrl = document.getElementById('ap-image')?.value || '';
    const category = document.getElementById('ap-category')?.value || 'Category';
    const badge    = document.getElementById('ap-badge')?.value || '';
    const url      = document.getElementById('ap-url')?.value || '#';

    container.innerHTML = Components.productCard({
      id: 'preview',
      title, price, currency, imageUrl, category, badge,
      affiliateUrl: url,
      clicks: 0
    }, 0);

    lucide.createIcons({ nodes: [container] });
  }

  // ── Handlers ─────────────────────────────────────────────────────────
  async function handleAddProduct(e) {
    e.preventDefault();
    const btn = document.getElementById('add-product-btn');
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Publishing…';
    lucide.createIcons({ nodes: [btn] });

    try {
      await Store.addProduct({
        affiliateUrl: document.getElementById('ap-url').value.trim(),
        title:        document.getElementById('ap-title').value.trim(),
        price:        document.getElementById('ap-price').value,
        currency:     document.getElementById('ap-currency').value,
        imageUrl:     document.getElementById('ap-image').value.trim(),
        category:     document.getElementById('ap-category').value.trim(),
        badge:        document.getElementById('ap-badge').value
      });

      Components.showToast('Product published successfully!', 'success');
      document.getElementById('add-product-form').reset();
      updatePreview();
    } catch (err) {
      Components.showToast('Failed to add product: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="plus" class="w-4 h-4"></i> Publish Product';
      lucide.createIcons({ nodes: [btn] });
    }
  }

  function startEdit(id) {
    _editingProductId = id;
    _refreshTabContent();
  }

  function cancelEdit() {
    _editingProductId = null;
    _refreshTabContent();
  }

  async function saveEdit(id) {
    try {
      await Store.updateProduct(id, {
        title:        document.getElementById(`edit-title-${id}`).value.trim(),
        price:        document.getElementById(`edit-price-${id}`).value,
        category:     document.getElementById(`edit-category-${id}`).value.trim(),
        badge:        document.getElementById(`edit-badge-${id}`).value,
        affiliateUrl: document.getElementById(`edit-url-${id}`).value.trim(),
        imageUrl:     document.getElementById(`edit-image-${id}`).value.trim()
      });
      _editingProductId = null;
      Components.showToast('Product updated successfully!', 'success');
    } catch (err) {
      Components.showToast('Failed to update: ' + err.message, 'error');
    }
  }

  function confirmDelete(id, title) {
    Components.showConfirm(
      'Delete Product',
      `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      async () => {
        try {
          await Store.deleteProduct(id);
          Components.showToast('Product deleted.', 'warning');
        } catch (err) {
          Components.showToast('Delete failed: ' + err.message, 'error');
        }
      }
    );
  }

  async function handleAddAdmin(e) {
    e.preventDefault();
    const user = document.getElementById('new-admin-user').value.trim();
    const pass = document.getElementById('new-admin-pass').value;

    try {
      await Store.addAdmin(user, pass);
      Components.showToast(`Admin "${user}" created successfully!`, 'success');
      document.getElementById('add-admin-form').reset();
      await _loadAdminList();
    } catch (err) {
      Components.showToast('Failed to create admin: ' + err.message, 'error');
    }
  }

  function confirmDeleteAdmin(username) {
    const current = Store.currentAdmin();
    if (current && current.username.toLowerCase() === username.toLowerCase()) {
      Components.showToast('You cannot delete your own admin account while logged in.', 'warning');
      return;
    }

    Components.showConfirm(
      'Remove Admin',
      `Are you sure you want to remove "${username}" as an admin?`,
      async () => {
        try {
          await Store.deleteAdmin(username);
          Components.showToast(`Admin "${username}" removed.`, 'warning');
          await _loadAdminList();
        } catch (err) {
          Components.showToast('Failed to remove admin: ' + err.message, 'error');
        }
      }
    );
  }

  // ── Analytics Tab ────────────────────────────────────────────────────
  function _analyticsTab() {
    const analytics = Store.getAnalytics();
    const products = Store.getProducts().sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    const totalClicks = analytics.totalClicks || 0;

    return `
      <div class="space-y-8">
        <!-- Analytics Header & Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#1a1d24]/90 border border-white/5">
          <div>
            <h2 class="text-xl font-bold text-gray-100 flex items-center gap-2">
              <i data-lucide="line-chart" class="w-5 h-5 text-amber-400"></i>
              Affiliate Traffic &amp; Earnings Analytics
            </h2>
            <p class="text-xs text-gray-400 mt-1">Real-time performance metrics, commission projections, and conversion insights</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="Admin.exportAnalyticsCsv()" class="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all flex items-center gap-2">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              Export CSV Report
            </button>
          </div>
        </div>

        <!-- KPI Financial Cards (Grid of 4) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Clicks -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:border-amber-500/30 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Traffic</span>
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <i data-lucide="mouse-pointer-click" class="w-4 h-4 text-amber-400"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-gray-100 count-up">${analytics.totalClicks.toLocaleString()}</div>
            <div class="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
              <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
              <span>High shopper intent</span>
            </div>
          </div>

          <!-- Est. Orders -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:border-orange-500/30 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Est. Conversions</span>
              <div class="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <i data-lucide="shopping-cart" class="w-4 h-4 text-orange-400"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-gray-100 count-up">${analytics.estOrders.toLocaleString()} <span class="text-xs font-normal text-gray-500">orders</span></div>
            <p class="text-xs text-gray-500 mt-2">Based on ~3.5% Amazon benchmark</p>
          </div>

          <!-- Est. Sales Volume (GMV) -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:border-rose-500/30 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Est. Sales (GMV)</span>
              <div class="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <i data-lucide="badge-dollar-sign" class="w-4 h-4 text-rose-400"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-gray-100 count-up">${Store.formatCurrency(analytics.estSalesVolume, 'INR')}</div>
            <p class="text-xs text-gray-500 mt-2">Gross affiliate transaction volume</p>
          </div>

          <!-- Est. Affiliate Commission -->
          <div class="bg-gradient-to-br from-emerald-500/15 via-[#1a1d24]/90 to-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 shadow-lg shadow-emerald-500/5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-emerald-400 uppercase font-bold tracking-wider">Est. Earnings</span>
              <div class="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-emerald-300 count-up">${Store.formatCurrency(analytics.estEarnings, 'INR')}</div>
            <p class="text-xs text-emerald-400/80 mt-2">Projected commission (~4.5% avg tier)</p>
          </div>
        </div>

        <!-- Inventory Metrics Banner -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
          <div>
            <div class="text-xs text-gray-500 font-medium">Catalog Inventory Value</div>
            <div class="text-lg font-bold text-gray-200 mt-1">${Store.formatCurrency(analytics.totalCatalogValue, 'INR')}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 font-medium">Average Product Price</div>
            <div class="text-lg font-bold text-gray-200 mt-1">${Store.formatCurrency(analytics.avgProductPrice, 'INR')}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 font-medium">Active Products Monitored</div>
            <div class="text-lg font-bold text-gray-200 mt-1">${analytics.totalProducts} items</div>
          </div>
        </div>

        <!-- Two Column: Category Share & Badge Matrix -->
        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Category Traffic Share -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <i data-lucide="pie-chart" class="w-4 h-4 text-amber-400"></i>
                Category Traffic Distribution
              </h3>
              <span class="text-xs text-gray-500 font-medium">${Object.keys(analytics.categoryStats).length} Categories</span>
            </div>
            <div class="space-y-4">
              ${_renderCategoryAnalytics(analytics.categoryStats, totalClicks)}
            </div>
          </div>

          <!-- Badge Performance Matrix -->
          <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <i data-lucide="tag" class="w-4 h-4 text-orange-400"></i>
                Badge Click Engagement
              </h3>
              <span class="text-xs text-gray-500 font-medium">Social Proof Impact</span>
            </div>
            <div class="space-y-4">
              ${_renderBadgeAnalytics(analytics.badgeStats, totalClicks)}
            </div>
          </div>
        </div>

        <!-- Detailed Product Performance Table -->
        <div class="bg-[#1a1d24]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
          <div class="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <i data-lucide="arrow-down-up" class="w-4 h-4 text-amber-400"></i>
                Product Performance Breakdown
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">Ranked by traffic volume and projected earnings</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-white/[0.02] text-gray-400 uppercase tracking-wider font-semibold border-b border-white/5">
                <tr>
                  <th class="px-5 py-3.5">Rank &amp; Product</th>
                  <th class="px-5 py-3.5">Category</th>
                  <th class="px-5 py-3.5">Price</th>
                  <th class="px-5 py-3.5">Clicks</th>
                  <th class="px-5 py-3.5">Share</th>
                  <th class="px-5 py-3.5">Est. Orders</th>
                  <th class="px-5 py-3.5">Est. Commission</th>
                  <th class="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-gray-300">
                ${products.map((p, idx) => {
                  const pClicks = p.clicks || 0;
                  const share = totalClicks > 0 ? ((pClicks / totalClicks) * 100).toFixed(1) : 0;
                  const orders = (pClicks * 0.035).toFixed(1);
                  const comm = (pClicks * 0.035 * (parseFloat(p.price) || 0) * 0.045);
                  return `
                    <tr class="hover:bg-white/[0.02] transition-colors">
                      <td class="px-5 py-4">
                        <div class="flex items-center gap-3">
                          <span class="w-5 text-gray-500 font-bold">${idx + 1}</span>
                          <div class="w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                            <img src="${p.imageUrl}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                          </div>
                          <div class="min-w-0 max-w-xs">
                            <div class="font-medium text-gray-200 truncate">${p.title}</div>
                            ${p.badge ? `<span class="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">${p.badge}</span>` : ''}
                          </div>
                        </div>
                      </td>
                      <td class="px-5 py-4 text-gray-400">${p.category || 'General'}</td>
                      <td class="px-5 py-4 font-semibold text-gray-200">${Store.formatCurrency(p.price, p.currency || 'INR')}</td>
                      <td class="px-5 py-4 font-bold text-amber-400">${pClicks.toLocaleString()}</td>
                      <td class="px-5 py-4">
                        <div class="flex items-center gap-2">
                          <div class="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style="width: ${share}%"></div>
                          </div>
                          <span class="text-[11px] text-gray-400">${share}%</span>
                        </div>
                      </td>
                      <td class="px-5 py-4 text-gray-300">${orders}</td>
                      <td class="px-5 py-4 font-semibold text-emerald-400">${Store.formatCurrency(comm, 'INR')}</td>
                      <td class="px-5 py-4 text-right">
                        <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer"
                           class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-amber-400 transition-colors text-xs font-medium"
                           title="Test Affiliate Link">
                          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                          <span>Test</span>
                        </a>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function _renderCategoryAnalytics(categoryStats, totalClicks) {
    const entries = Object.entries(categoryStats).sort((a, b) => b[1].clicks - a[1].clicks);
    if (!entries.length) return '<p class="text-xs text-gray-500">No category data available.</p>';

    return entries.map(([category, stat]) => {
      const share = totalClicks > 0 ? Math.round((stat.clicks / totalClicks) * 100) : 0;
      return `
        <div>
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="font-medium text-gray-300">${category} (${stat.count} items)</span>
            <span class="text-gray-400 font-semibold">${stat.clicks.toLocaleString()} clicks (${share}%)</span>
          </div>
          <div class="h-2 rounded-full bg-white/5 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-700" style="width: ${Math.max(share, 2)}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function _renderBadgeAnalytics(badgeStats, totalClicks) {
    const entries = Object.entries(badgeStats).sort((a, b) => b[1].clicks - a[1].clicks);
    if (!entries.length) return '<p class="text-xs text-gray-500">No badge data available.</p>';

    return entries.map(([badge, stat]) => {
      const share = totalClicks > 0 ? Math.round((stat.clicks / totalClicks) * 100) : 0;
      return `
        <div>
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="font-medium text-gray-300">${badge} (${stat.count} items)</span>
            <span class="text-gray-400 font-semibold">${stat.clicks.toLocaleString()} clicks (${share}%)</span>
          </div>
          <div class="h-2 rounded-full bg-white/5 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700" style="width: ${Math.max(share, 2)}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function exportAnalyticsCsv() {
    const products = Store.getProducts();
    const rows = [
      ['Product Title', 'Category', 'Badge', 'Price', 'Currency', 'Clicks', 'Est. Orders', 'Est. Commission (INR)', 'Affiliate URL']
    ];

    products.forEach(p => {
      const pClicks = p.clicks || 0;
      const orders = (pClicks * 0.035).toFixed(1);
      const comm = (pClicks * 0.035 * (parseFloat(p.price) || 0) * 0.045).toFixed(2);
      rows.push([
        `"${(p.title || '').replace(/"/g, '""')}"`,
        `"${p.category || ''}"`,
        `"${p.badge || ''}"`,
        p.price || 0,
        p.currency || 'INR',
        pClicks,
        orders,
        comm,
        `"${p.affiliateUrl || ''}"`
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopvault_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Components.showToast('Analytics CSV exported successfully!', 'success');
  }

  function handleLogout() {
    Store.logout();
    Components.showToast('Logged out successfully.', 'info');
    window.location.hash = '#/';
    App.render();
  }

  function switchTab(tab) {
    _activeTab = tab;
    _refreshTabContent();
  }

  function _refreshTabContent() {
    const container = document.getElementById('admin-tab-content');
    if (container) {
      container.innerHTML = _renderTabContent();
      lucide.createIcons({ nodes: [container] });
      if (_activeTab === 'admins') {
        setTimeout(() => _loadAdminList(), 100);
      }
    }
  }

  return {
    loginView,
    dashboardView,
    handleLogin,
    handleLogout,
    handleAddProduct,
    handleAddAdmin,
    switchTab,
    startEdit,
    cancelEdit,
    saveEdit,
    confirmDelete,
    confirmDeleteAdmin,
    validateUrl,
    updatePreview,
    loadAdminList: _loadAdminList,
    exportAnalyticsCsv
  };
})();
