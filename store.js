/* ═══════════════════════════════════════════════════════════════════════════
   Store — Firestore CRUD, State Management & Data Layer
   ═══════════════════════════════════════════════════════════════════════════ */

const Store = (() => {
  // ── In-memory state ──────────────────────────────────────────────────
  let _products = [];
  let _admins = [];
  let _currentAdmin = null;
  let _listeners = [];
  let _unsubProducts = null;

  // ── Dummy / Seed Data ────────────────────────────────────────────────
  const SEED_PRODUCTS = [
    {
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      price: 29990.00,
      currency: "INR",
      category: "Electronics",
      badge: "Editor's Choice",
      imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B0BX2L8PBT?tag=shopvault-20",
      clicks: 142,
      createdAt: new Date('2026-09-15')
    },
    {
      title: "Apple MacBook Air 15\" M3 Chip – Starlight",
      price: 134900.00,
      currency: "INR",
      category: "Computers",
      badge: "Trending",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B0CX23V2ZK?tag=shopvault-20",
      clicks: 287,
      createdAt: new Date('2026-10-01')
    },
    {
      title: "Kindle Paperwhite Signature Edition – 32 GB",
      price: 17999.00,
      currency: "INR",
      category: "Electronics",
      badge: "Best Value",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B0CFXQ7YF5?tag=shopvault-20",
      clicks: 198,
      createdAt: new Date('2026-09-22')
    },
    {
      title: "Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker",
      price: 7999.00,
      currency: "INR",
      category: "Home & Kitchen",
      badge: "",
      imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B01NBKTPTS?tag=shopvault-20",
      clicks: 76,
      createdAt: new Date('2026-08-10')
    },
    {
      title: "Anker 737 Power Bank (PowerCore 24K) – USB-C",
      price: 12999.00,
      currency: "INR",
      category: "Electronics",
      badge: "Trending",
      imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B09VPHSVGV?tag=shopvault-20",
      clicks: 163,
      createdAt: new Date('2026-09-05')
    },
    {
      title: "Dyson V15 Detect Absolute Cordless Vacuum Cleaner",
      price: 65900.00,
      currency: "INR",
      category: "Home & Kitchen",
      badge: "Editor's Choice",
      imageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B0B5BRGYNV?tag=shopvault-20",
      clicks: 95,
      createdAt: new Date('2026-10-10')
    },
    {
      title: "LEGO Icons Orchid Building Kit – Botanical Collection",
      price: 4999.00,
      currency: "INR",
      category: "Toys & Games",
      badge: "Best Seller",
      imageUrl: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B09R34Q2TN?tag=shopvault-20",
      clicks: 54,
      createdAt: new Date('2026-07-20')
    },
    {
      title: "Samsung Galaxy Watch Ultra – Titanium Gray",
      price: 59999.00,
      currency: "INR",
      category: "Electronics",
      badge: "New Arrival",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      affiliateUrl: "https://www.amazon.com/dp/B0D7BJ5LRG?tag=shopvault-20",
      clicks: 211,
      createdAt: new Date('2026-10-18')
    }
  ];

  const DEFAULT_ADMINS = [
    { username: 'ravivarman', password: 'ravivarman24to28' },
    { username: 'praveen',    password: 'praveen24to28' }
  ];

  let _isFirestoreActive = false;

  const STORAGE_KEYS = {
    PRODUCTS: 'sv_products_data_v3',
    ADMINS: 'sv_admins_data_v3'
  };

  function _isFirebaseConfigured() {
    return typeof firebaseConfig !== 'undefined' &&
           firebaseConfig.projectId &&
           firebaseConfig.projectId !== 'YOUR_PROJECT_ID' &&
           firebaseConfig.apiKey &&
           firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE' &&
           typeof productsRef !== 'undefined' &&
           productsRef !== null;
  }

  function _loadLocalProducts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        _products = JSON.parse(saved);
        return;
      }
    } catch (e) {
      console.warn('Could not read products from localStorage:', e);
    }
    _products = SEED_PRODUCTS.map((p, i) => ({ id: `prod_${i + 1}`, ...p }));
    _saveLocalProducts();
  }

  function _saveLocalProducts() {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(_products));
    } catch (e) {
      console.warn('Could not save products to localStorage:', e);
    }
  }

  function _loadLocalAdmins() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMINS);
      if (saved) {
        _admins = JSON.parse(saved);
        return;
      }
    } catch (e) {
      console.warn('Could not read admins from localStorage:', e);
    }
    _admins = [...DEFAULT_ADMINS];
    _saveLocalAdmins();
  }

  function _saveLocalAdmins() {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(_admins));
    } catch (e) {
      console.warn('Could not save admins to localStorage:', e);
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  function _notify() {
    _listeners.forEach(fn => fn([..._products]));
  }

  function _formatCurrency(amount, currency = 'INR') {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$' };
    const sym = symbols[currency] || (currency ? currency + ' ' : '₹');
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return sym + Number(amount || 0).toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  // ── Initialize ───────────────────────────────────────────────────────
  async function init() {
    _restoreSession();

    if (!_isFirebaseConfigured()) {
      console.log('%cℹ Running in demo/local mode (Set actual credentials in firebase-config.js for Firestore cloud sync)', 'color: #38bdf8; font-weight: bold;');
      _isFirestoreActive = false;
      _loadLocalProducts();
      _loadLocalAdmins();
      _notify();
      return;
    }

    // Attempt connecting to Firestore with a 3-second timeout race
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore connection timed out')), 3000)
    );

    try {
      await Promise.race([_initFirestore(), timeoutPromise]);
      _isFirestoreActive = true;
      console.log('%c✓ Connected to live Firebase Firestore', 'color: #34d399; font-weight: bold;');
    } catch (err) {
      console.warn('Firestore initialization failed/timed out, falling back to local storage:', err);
      _isFirestoreActive = false;
      _loadLocalProducts();
      _loadLocalAdmins();
      _notify();
    }
  }

  async function _initFirestore() {
    // 1. Seed admins if collection is empty
    const adminSnap = await adminsRef.get();
    if (adminSnap.empty) {
      console.log('Seeding default admins…');
      for (const admin of DEFAULT_ADMINS) {
        await adminsRef.doc(admin.username).set(admin);
      }
    }

    // 2. Seed products if collection is empty
    const prodSnap = await productsRef.get();
    if (prodSnap.empty) {
      console.log('Seeding dummy products…');
      for (const product of SEED_PRODUCTS) {
        await productsRef.add({
          ...product,
          createdAt: firebase.firestore.Timestamp.fromDate(product.createdAt)
        });
      }
    }

    // 3. Start real-time listener
    _startRealtimeSync();

    // 4. Load admins into memory
    await _loadAdmins();

    // 5. Restore session
    _restoreSession();
  }

  function _startRealtimeSync() {
    _unsubProducts = productsRef.orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      _products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      _notify();
    }, err => {
      console.error('Realtime sync error:', err);
    });
  }

  async function _loadAdmins() {
    if (!_isFirestoreActive) {
      _loadLocalAdmins();
      return;
    }
    try {
      const snap = await adminsRef.get();
      _admins = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.warn('Could not load admins from Firestore, using local:', err);
      _loadLocalAdmins();
    }
  }

  function _restoreSession() {
    const saved = sessionStorage.getItem('sv_admin');
    if (saved) {
      try {
        _currentAdmin = JSON.parse(saved);
      } catch { _currentAdmin = null; }
    }
  }

  // ── Auth ─────────────────────────────────────────────────────────────
  async function login(username, password) {
    await _loadAdmins();
    const match = _admins.find(a => a.username === username && a.password === password);
    if (!match) {
      const hc = DEFAULT_ADMINS.find(a => a.username === username && a.password === password);
      if (!hc) return false;
      _currentAdmin = { username: hc.username };
    } else {
      _currentAdmin = { username: match.username };
    }
    sessionStorage.setItem('sv_admin', JSON.stringify(_currentAdmin));
    return true;
  }

  function logout() {
    _currentAdmin = null;
    sessionStorage.removeItem('sv_admin');
  }

  function isLoggedIn() {
    return _currentAdmin !== null;
  }

  function currentAdmin() {
    return _currentAdmin;
  }

  // ── Products CRUD ────────────────────────────────────────────────────
  async function addProduct(data) {
    const doc = {
      title:        data.title || '',
      price:        parseFloat(data.price) || 0,
      currency:     data.currency || 'INR',
      category:     data.category || 'Uncategorized',
      badge:        data.badge || '',
      imageUrl:     data.imageUrl || '',
      affiliateUrl: data.affiliateUrl || '',
      clicks:       0,
      createdAt:    new Date()
    };

    if (_isFirestoreActive) {
      await productsRef.add({
        ...doc,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      const newProduct = { id: `prod_${Date.now()}`, ...doc };
      _products.unshift(newProduct);
      _saveLocalProducts();
      _notify();
    }
  }

  async function updateProduct(id, data) {
    const updates = {};
    if (data.title !== undefined)        updates.title = data.title;
    if (data.price !== undefined)        updates.price = parseFloat(data.price) || 0;
    if (data.currency !== undefined)     updates.currency = data.currency;
    if (data.category !== undefined)     updates.category = data.category;
    if (data.badge !== undefined)        updates.badge = data.badge;
    if (data.imageUrl !== undefined)     updates.imageUrl = data.imageUrl;
    if (data.affiliateUrl !== undefined) updates.affiliateUrl = data.affiliateUrl;

    if (_isFirestoreActive) {
      await productsRef.doc(id).update(updates);
    } else {
      const idx = _products.findIndex(p => p.id === id);
      if (idx !== -1) {
        _products[idx] = { ..._products[idx], ...updates };
        _saveLocalProducts();
        _notify();
      }
    }
  }

  async function deleteProduct(id) {
    if (_isFirestoreActive) {
      await productsRef.doc(id).delete();
    } else {
      _products = _products.filter(p => p.id !== id);
      _saveLocalProducts();
      _notify();
    }
  }

  async function incrementClicks(id) {
    if (_isFirestoreActive) {
      try {
        await productsRef.doc(id).update({
          clicks: firebase.firestore.FieldValue.increment(1)
        });
      } catch (err) {
        console.warn('Click increment failed in Firestore:', err);
      }
    } else {
      const prod = _products.find(p => p.id === id);
      if (prod) {
        prod.clicks = (prod.clicks || 0) + 1;
        _saveLocalProducts();
        _notify();
      }
    }
  }

  // ── Admin Management ─────────────────────────────────────────────────
  async function addAdmin(username, password) {
    if (!username || !password) throw new Error('Username and password required');
    if (_admins.some(a => a.username.toLowerCase() === username.toLowerCase())) {
      throw new Error(`Admin "${username}" already exists.`);
    }

    if (_isFirestoreActive) {
      await adminsRef.doc(username).set({ username, password });
      await _loadAdmins();
    } else {
      _admins.push({ username, password });
      _saveLocalAdmins();
    }
  }

  async function deleteAdmin(username) {
    if (_isFirestoreActive) {
      await adminsRef.doc(username).delete();
      await _loadAdmins();
    } else {
      _admins = _admins.filter(a => a.username !== username);
      _saveLocalAdmins();
    }
  }

  async function getAdmins() {
    await _loadAdmins();
    return [..._admins];
  }

  // ── Subscriptions ────────────────────────────────────────────────────
  function subscribe(fn) {
    _listeners.push(fn);
    if (_products.length) fn([..._products]);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  }

  function getProducts() {
    return [..._products];
  }

  function getCategories() {
    const cats = new Set(_products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }

  function getAnalytics() {
    const totalProducts = _products.length;
    const totalClicks = _products.reduce((sum, p) => sum + (p.clicks || 0), 0);
    const topProduct = _products.reduce((top, p) => (p.clicks || 0) > (top?.clicks || 0) ? p : top, null);
    
    // Total catalog inventory value
    const totalCatalogValue = _products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
    const avgProductPrice = totalProducts ? (totalCatalogValue / totalProducts) : 0;
    
    // Estimated Affiliate Economics:
    // Avg Amazon conversion rate ~ 3.5%, Average Amazon Associates commission ~ 4.5%
    const estConversionRate = 0.035;
    const estCommissionRate = 0.045;
    const estOrders = Math.round(totalClicks * estConversionRate);
    const estSalesVolume = _products.reduce((sum, p) => {
      const pOrders = (p.clicks || 0) * estConversionRate;
      return sum + (pOrders * (parseFloat(p.price) || 0));
    }, 0);
    const estEarnings = estSalesVolume * estCommissionRate;

    // Breakdown by Category
    const categoryStats = {};
    _products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, clicks: 0, totalValue: 0 };
      }
      categoryStats[cat].count += 1;
      categoryStats[cat].clicks += (p.clicks || 0);
      categoryStats[cat].totalValue += (parseFloat(p.price) || 0);
    });

    // Breakdown by Badge
    const badgeStats = {};
    _products.forEach(p => {
      const badge = p.badge || 'Standard';
      if (!badgeStats[badge]) {
        badgeStats[badge] = { count: 0, clicks: 0 };
      }
      badgeStats[badge].count += 1;
      badgeStats[badge].clicks += (p.clicks || 0);
    });

    return {
      totalProducts,
      totalClicks,
      topProduct,
      totalCatalogValue,
      avgProductPrice,
      estOrders,
      estSalesVolume,
      estEarnings,
      categoryStats,
      badgeStats
    };
  }

  return {
    init,
    login,
    logout,
    isLoggedIn,
    currentAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementClicks,
    addAdmin,
    deleteAdmin,
    getAdmins,
    subscribe,
    getProducts,
    getCategories,
    getAnalytics,
    formatCurrency: _formatCurrency
  };
})();
