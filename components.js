/* ═══════════════════════════════════════════════════════════════════════════
   Components — Reusable UI Builders (Public Views)
   ═══════════════════════════════════════════════════════════════════════════ */

const Components = (() => {

  // ── Toast Notification ───────────────────────────────────────────────
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const colors = {
      success: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
      error:   'from-red-500/20 to-red-600/10 border-red-500/30',
      info:    'from-blue-500/20 to-blue-600/10 border-blue-500/30',
      warning: 'from-amber-500/20 to-amber-600/10 border-amber-500/30'
    };
    const icons = {
      success: 'check-circle',
      error:   'x-circle',
      info:    'info',
      warning: 'alert-triangle'
    };
    const textColors = {
      success: 'text-emerald-300',
      error:   'text-red-300',
      info:    'text-blue-300',
      warning: 'text-amber-300'
    };

    const el = document.createElement('div');
    el.className = `toast-enter pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${colors[type]} border backdrop-blur-xl shadow-2xl min-w-[280px]`;
    el.innerHTML = `
      <i data-lucide="${icons[type]}" class="w-5 h-5 ${textColors[type]} shrink-0"></i>
      <span class="text-sm font-medium text-gray-200 flex-1">${message}</span>
    `;
    container.appendChild(el);
    lucide.createIcons({ nodes: [el] });

    setTimeout(() => {
      el.classList.remove('toast-enter');
      el.classList.add('toast-exit');
      el.addEventListener('animationend', () => el.remove());
    }, 3500);
  }

  // ── Confirm Modal ────────────────────────────────────────────────────
  function showConfirm(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    modal.classList.remove('hidden');

    const okBtn = document.getElementById('confirm-ok-btn');
    const cancelBtn = document.getElementById('confirm-cancel-btn');
    const backdrop = document.getElementById('confirm-backdrop');

    function close() {
      modal.classList.add('hidden');
      okBtn.removeEventListener('click', handleOk);
      cancelBtn.removeEventListener('click', close);
      backdrop.removeEventListener('click', close);
    }
    function handleOk() {
      onConfirm();
      close();
    }

    okBtn.addEventListener('click', handleOk);
    cancelBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
  }

  // ── Skeleton Card ────────────────────────────────────────────────────
  function skeletonCard() {
    return `
      <div class="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden">
        <div class="skeleton skeleton-img"></div>
        <div class="p-5 space-y-3">
          <div class="skeleton skeleton-badge"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text w-full"></div>
          <div class="skeleton skeleton-price mt-2"></div>
          <div class="skeleton skeleton-btn mt-4"></div>
        </div>
      </div>
    `;
  }

  function skeletonGrid(count = 8) {
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${Array(count).fill(skeletonCard()).join('')}
      </div>
    `;
  }

  // ── Product Card ─────────────────────────────────────────────────────
  function productCard(product, index = 0) {
    const badgeColors = {
      'Trending':       'bg-rose-500/15 text-rose-300 border-rose-500/20',
      "Editor's Choice": 'bg-violet-500/15 text-violet-300 border-violet-500/20',
      'Best Value':     'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
      'New Arrival':    'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
      'Hot Deal':       'bg-amber-500/15 text-amber-300 border-amber-500/20'
    };
    const badgeClass = badgeColors[product.badge] || 'bg-gray-500/15 text-gray-300 border-gray-500/20';
    const stagger = Math.min(index, 8);

    return `
      <div class="product-card fade-up stagger-${stagger} bg-[#1a1d24]/80 rounded-2xl border border-white/5 overflow-hidden group cursor-pointer backdrop-blur-sm"
           data-product-id="${product.id}"
           onclick="Components.handleProductClick('${product.id}', '${encodeURIComponent(product.affiliateUrl)}')">
        <!-- Image Container -->
        <div class="relative overflow-hidden aspect-[4/3] bg-[#12141a]">
          <img
            src="${product.imageUrl}"
            alt="${product.title}"
            loading="lazy"
            class="card-image w-full h-full object-cover"
            onerror="this.parentElement.innerHTML='<div class=\\'img-fallback w-full h-full\\'><svg xmlns=\\'http://www.w3.org/2000/svg\\' class=\\'w-12 h-12 opacity-30\\' fill=\\'none\\' viewBox=\\'0 0 24 24\\' stroke=\\'currentColor\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'/></svg></div>'"
          />
          ${product.badge ? `
            <div class="absolute top-3 left-3">
              <span class="badge-pulse inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeClass} backdrop-blur-sm">
                ${product.badge}
              </span>
            </div>
          ` : ''}
          <!-- Overlay gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#1a1d24] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        </div>

        <!-- Content -->
        <div class="p-5 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-gray-200 line-clamp-2 leading-snug flex-1">${product.title}</h3>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-500 border border-white/5">${product.category || 'General'}</span>
          </div>

          <div class="flex items-end justify-between pt-1">
            <div>
              <span class="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                ${Store.formatCurrency(product.price, product.currency)}
              </span>
            </div>
            <span class="text-[11px] text-gray-600">${product.clicks || 0} clicks</span>
          </div>

          <button
            class="cta-btn w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 mt-2"
            onclick="event.stopPropagation(); Components.handleProductClick('${product.id}', '${encodeURIComponent(product.affiliateUrl)}')"
          >
            <i data-lucide="external-link" class="w-4 h-4"></i>
            View on Amazon
          </button>
        </div>
      </div>
    `;
  }

  // ── Product Click Handler ────────────────────────────────────────────
  function handleProductClick(productId, encodedUrl) {
    const url = decodeURIComponent(encodedUrl);
    Store.incrementClicks(productId);
    if (typeof analytics !== 'undefined' && analytics && typeof analytics.logEvent === 'function') {
      try {
        analytics.logEvent('select_item', {
          item_id: productId,
          content_type: 'amazon_affiliate_link'
        });
      } catch (e) {
        console.warn('Analytics event log error:', e);
      }
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // ── Hero Section ─────────────────────────────────────────────────────
  function heroSection(products) {
    const topProduct = products.reduce((top, p) => (p.clicks || 0) > (top?.clicks || 0) ? p : top, products[0]);

    return `
      <section class="relative overflow-hidden">
        <!-- Glow Orbs -->
        <div class="glow-orb w-96 h-96 bg-amber-500 -top-48 -left-48" style="animation-delay: 0s;"></div>
        <div class="glow-orb w-72 h-72 bg-orange-500 top-20 right-10" style="animation-delay: 4s;"></div>
        <div class="glow-orb w-64 h-64 bg-violet-500 bottom-0 left-1/3" style="animation-delay: 8s;"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Left: Text -->
            <div class="space-y-6 fade-up">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                CURATED DEALS — UPDATED DAILY
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Discover the
                <span class="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent"> Best Deals </span>
                on&nbsp;Amazon
              </h1>
              <p class="text-lg text-gray-400 max-w-lg leading-relaxed">
                Hand-picked products, expert reviews, and exclusive recommendations. Save time finding the perfect items at the best prices.
              </p>
              <div class="flex items-center gap-4 pt-2">
                <a href="#catalog-section"
                   class="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
                  <i data-lucide="compass" class="w-4 h-4"></i>
                  Browse Deals
                </a>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i>
                  Verified Links
                </div>
              </div>
            </div>

            <!-- Right: Deal of the Day Card -->
            ${topProduct ? `
              <div class="fade-up stagger-3 relative">
                <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 blur-2xl"></div>
                <div class="relative bg-[#1a1d24]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <div class="absolute top-4 left-4 z-10">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-gray-900 text-xs font-bold shadow-lg">
                      <i data-lucide="flame" class="w-3.5 h-3.5"></i>
                      DEAL OF THE DAY
                    </span>
                  </div>
                  <div class="aspect-[16/10] overflow-hidden bg-[#12141a]">
                    <img src="${topProduct.imageUrl}" alt="${topProduct.title}" class="w-full h-full object-cover opacity-90" loading="lazy"
                         onerror="this.style.display='none'" />
                  </div>
                  <div class="p-6 space-y-3">
                    <h3 class="text-lg font-bold text-gray-100 line-clamp-2">${topProduct.title}</h3>
                    <div class="flex items-end justify-between">
                      <span class="text-3xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                        ${Store.formatCurrency(topProduct.price, topProduct.currency)}
                      </span>
                      <span class="text-xs text-gray-500">${topProduct.clicks || 0} people viewed</span>
                    </div>
                    <button
                      class="cta-btn w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all mt-2"
                      onclick="Components.handleProductClick('${topProduct.id}', '${encodeURIComponent(topProduct.affiliateUrl)}')"
                    >
                      <i data-lucide="external-link" class="w-4 h-4"></i>
                      View Deal on Amazon
                    </button>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </section>
    `;
  }

  // ── Stats Bar ────────────────────────────────────────────────────────
  function statsBar(products) {
    const totalProducts = products.length;
    const totalClicks = products.reduce((s, p) => s + (p.clicks || 0), 0);
    const categories = new Set(products.map(p => p.category).filter(Boolean)).size;

    return `
      <div class="bg-[#1a1d24]/50 border-y border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-amber-400 count-up">${totalProducts}</div>
              <div class="text-xs text-gray-500 mt-0.5">Products</div>
            </div>
            <div class="text-center border-x border-white/5">
              <div class="text-2xl font-bold text-orange-400 count-up">${totalClicks.toLocaleString()}</div>
              <div class="text-xs text-gray-500 mt-0.5">Total Clicks</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-rose-400 count-up">${categories}</div>
              <div class="text-xs text-gray-500 mt-0.5">Categories</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Full Landing Page ────────────────────────────────────────────────
  function landingPage(products, searchTerm = '', category = 'all') {
    let filtered = [...products];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.badge || '').toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    const hasResults = filtered.length > 0;

    return `
      ${heroSection(products)}
      ${statsBar(products)}

      <!-- Catalog -->
      <section id="catalog-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-100">All Products</h2>
            <p class="text-sm text-gray-500 mt-1">
              ${filtered.length} item${filtered.length !== 1 ? 's' : ''}
              ${searchTerm ? ` matching "${searchTerm}"` : ''}
              ${category !== 'all' ? ` in ${category}` : ''}
            </p>
          </div>
        </div>

        ${hasResults ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${filtered.map((p, i) => productCard(p, i)).join('')}
          </div>
        ` : `
          <div class="flex flex-col items-center justify-center py-20 text-center fade-up">
            <div class="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <i data-lucide="search-x" class="w-10 h-10 text-gray-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-400">No products found</h3>
            <p class="text-sm text-gray-600 mt-1">Try a different search term or category.</p>
          </div>
        `}
      </section>
    `;
  }

  return {
    showToast,
    showConfirm,
    skeletonGrid,
    productCard,
    heroSection,
    statsBar,
    landingPage,
    handleProductClick
  };
})();
