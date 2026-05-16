// ============================================
// V SHINE MAKEUP STUDIO - Main JavaScript
// ============================================

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMobileNav();
  initSearch();
  initScrollAnimations();
  initFAQ();
  initTestimonialSlider();
  initCart();
  initProductPage();
  initTabs();
  initContactForm();
  initCounters();
});

// Header Scroll Effect
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile Navigation
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  
  if (!toggle || !mobileNav) return;
  
  toggle.addEventListener('click', function() {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Scroll Reveal Animations
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (!reveals.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);
  
  reveals.forEach(function(el) {
    observer.observe(el);
  });
}

// FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Close other items
      faqItems.forEach(function(otherItem) {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// Testimonial Slider
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;
  
  const cards = slider.querySelectorAll('.testimonial-card');
  const dots = slider.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  
  function showSlide(index) {
    cards.forEach(function(card, i) {
      card.style.display = i === index ? 'block' : 'none';
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }
  
  // Initialize first slide
  showSlide(0);
  
  // Dot click handlers
  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });
  
  // Auto slide every 5 seconds
  setInterval(function() {
    currentSlide = (currentSlide + 1) % cards.length;
    showSlide(currentSlide);
  }, 5000);
}

// Shopping Cart Functionality
let cartItems = JSON.parse(localStorage.getItem('vshineCart') || '[]');

function initCart() {
  updateCartCount();
  renderCartPage();
  renderCheckoutSummary();
}

function addToCart(product) {
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      ...product,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartCount();
  showNotification('Product added to cart!');
}

function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCartPage();
  renderCheckoutSummary();
}

function updateQuantity(productId, change) {
  const item = cartItems.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveCart();
  updateCartCount();
  renderCartPage();
  renderCheckoutSummary();
}

function saveCart() {
  localStorage.setItem('vshineCart', JSON.stringify(cartItems));
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  countElements.forEach(function(el) {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

function getCartTotal() {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderCartPage() {
  const cartContainer = document.querySelector('.cart-items-container');
  if (!cartContainer) return;
  
  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart" style="text-align: center; padding: 60px 20px;">
        <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--primary-light); margin-bottom: 20px;"></i>
        <h3>Your cart is empty</h3>
        <p style="margin: 15px 0 25px;">Looks like you haven't added any products yet.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }
  
  let html = '<table class="cart-table"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th></tr></thead><tbody>';
  
  cartItems.forEach(function(item) {
    html += `
      <tr>
        <td>
          <div class="cart-product">
            <img src="${item.image}" alt="${item.name}" class="cart-product-img">
            <div>
              <h4>${item.name}</h4>
              <p style="font-size: 0.85rem; color: var(--text-light);">${item.category || 'Beauty'}</p>
            </div>
          </div>
        </td>
        <td><strong>₹${item.price.toLocaleString()}</strong></td>
        <td>
          <div class="quantity-selector">
            <button onclick="updateQuantity('${item.id}', -1)"><i class="fas fa-minus"></i></button>
            <input type="number" value="${item.quantity}" readonly>
            <button onclick="updateQuantity('${item.id}', 1)"><i class="fas fa-plus"></i></button>
          </div>
        </td>
        <td><strong>₹${(item.price * item.quantity).toLocaleString()}</strong></td>
        <td><button class="remove-btn" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button></td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  
  // Summary
  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  
  html += `
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<strong style="color: #25D366;">FREE</strong>' : '₹' + shipping}</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString()}</span></div>
      <a href="checkout.html" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Proceed to Checkout</a>
      <a href="shop.html" class="btn btn-secondary" style="width: 100%; margin-top: 10px;">Continue Shopping</a>
    </div>
  `;
  
  cartContainer.innerHTML = html;
}

function renderCheckoutSummary() {
  const summaryContainer = document.querySelector('.order-summary-items');
  if (!summaryContainer) return;
  
  if (cartItems.length === 0) {
    summaryContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty.</p>';
    return;
  }
  
  let html = '';
  cartItems.forEach(function(item) {
    html += `
      <div class="order-item">
        <img src="${item.image}" alt="${item.name}" class="order-item-img">
        <div class="order-item-details">
          <h4>${item.name}</h4>
          <p>₹${item.price.toLocaleString()} × ${item.quantity}</p>
        </div>
      </div>
    `;
  });
  
  summaryContainer.innerHTML = html;
  
  // Update totals
  const subtotalEl = document.querySelector('.checkout-subtotal');
  const shippingEl = document.querySelector('.checkout-shipping');
  const totalEl = document.querySelector('.checkout-total');
  
  if (subtotalEl && shippingEl && totalEl) {
    const subtotal = getCartTotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;
    
    subtotalEl.textContent = '₹' + subtotal.toLocaleString();
    shippingEl.textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
    totalEl.textContent = '₹' + total.toLocaleString();
  }
}

// Product Page Functions
function initProductPage() {
  // Thumbnail gallery
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.querySelector('.main-product-image img');
  
  if (thumbnails.length && mainImage) {
    thumbnails.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImage.src = this.querySelector('img').src;
      });
    });
  }
  
  // Add to cart from product page
  const addToCartBtn = document.querySelector('.add-to-cart-main');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const product = {
        id: document.querySelector('.product-id')?.value || Date.now().toString(),
        name: document.querySelector('.product-name-main')?.textContent || 'Product',
        price: parseInt(document.querySelector('.product-price-value')?.textContent?.replace(/[^0-9]/g, '') || 0),
        image: mainImage?.src || '',
        category: document.querySelector('.product-category-main')?.textContent || ''
      };
      addToCart(product);
    });
  }
  
  // Buy now button
  const buyNowBtn = document.querySelector('.buy-now-main');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function() {
      const product = {
        id: document.querySelector('.product-id')?.value || Date.now().toString(),
        name: document.querySelector('.product-name-main')?.textContent || 'Product',
        price: parseInt(document.querySelector('.product-price-value')?.textContent?.replace(/[^0-9]/g, '') || 0),
        image: mainImage?.src || '',
        category: document.querySelector('.product-category-main')?.textContent || ''
      };
      addToCart(product);
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 500);
    });
  }
  
  // Wishlist toggle
  const wishlistBtns = document.querySelectorAll('.product-wishlist');
  wishlistBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('active');
      const icon = this.querySelector('i');
      if (this.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        showNotification('Added to wishlist!');
      } else {
        icon.className = 'far fa-heart';
      }
    });
  });
}

// Tab functionality
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Remove active from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Activate clicked tab
      this.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// Contact Form
function initContactForm() {
  const form = document.querySelector('.contact-form form, .inquiry-form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.phone) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    // Simulate submission
    showNotification('Thank you! Your message has been sent successfully.');
    form.reset();
  });
}

// Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  if (!counters.length) return;
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.dataset.count);
        animateCounter(target, countTo);
        observer.unobserve(target);
      }
    });
  }, observerOptions);
  
  counters.forEach(function(counter) {
    observer.observe(counter);
  });
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const duration = 2000;
  const stepTime = duration / 50;
  
  const timer = setInterval(function() {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current).toLocaleString() + (element.dataset.suffix || '');
  }, stepTime);
}

// Notification System
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    padding: '15px 25px',
    background: type === 'success' ? '#25D366' : '#ff6b6b',
    color: 'white',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    zIndex: '9999',
    fontSize: '0.95rem',
    fontWeight: '500',
    animation: 'slideIn 0.3s ease-out'
  });
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(function() {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations to head
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Newsletter Form
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]');
    if (email && email.value) {
      showNotification('Thank you for subscribing to our newsletter!');
      email.value = '';
    }
  });
});
// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
  const searchBtn = document.querySelector('.search-btn');
  if (!searchBtn) return;

  // Create search overlay
  const searchOverlay = document.createElement('div');
  searchOverlay.id = 'search-overlay';
  searchOverlay.innerHTML = `
    <div id="search-box">
      <div id="search-input-wrapper">
        <i class="fas fa-search"></i>
        <input type="text" id="search-input" placeholder="Search services, blog, pages...">
        <button id="search-close"><i class="fas fa-times"></i></button>
      </div>
      <div id="search-results"></div>
    </div>
  `;
  document.body.appendChild(searchOverlay);

  // Search overlay styles
  const searchStyle = document.createElement('style');
  searchStyle.textContent = `
    #search-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(45, 27, 78, 0.85);
      backdrop-filter: blur(10px);
      z-index: 99999;
      align-items: flex-start;
      justify-content: center;
      padding-top: 100px;
    }
    #search-overlay.active {
      display: flex;
    }
    #search-box {
      width: 100%;
      max-width: 700px;
      padding: 0 20px;
    }
    #search-input-wrapper {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 50px;
      padding: 15px 25px;
      gap: 15px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    #search-input-wrapper i {
      color: #9b7ed9;
      font-size: 1.2rem;
    }
    #search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1.1rem;
      font-family: Poppins, sans-serif;
      color: #2d1b4e;
      background: transparent;
    }
    #search-close {
      background: #f0e8ff;
      border: none;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      color: #7c5fc0;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #search-results {
      margin-top: 15px;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      max-height: 60vh;
      overflow-y: auto;
    }
    .search-result-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 18px 25px;
      border-bottom: 1px solid #f0e8ff;
      cursor: pointer;
      transition: background 0.2s;
      text-decoration: none;
      color: #2d1b4e;
    }
    .search-result-item:hover {
      background: #f5eeff;
    }
    .search-result-icon {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, #9b7ed9, #c4aef5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .search-result-text h4 {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .search-result-text p {
      font-size: 0.82rem;
      color: #8b7aa8;
    }
    .search-no-result {
      padding: 40px;
      text-align: center;
      color: #8b7aa8;
    }
    .search-no-result i {
      font-size: 2.5rem;
      color: #c4aef5;
      margin-bottom: 10px;
    }
  `;
  document.head.appendChild(searchStyle);

  // Search data
  const searchData = [
    { title: 'Home', desc: 'Welcome to V Shine Makeup Studio', url: 'index.html', icon: 'fa-home' },
    { title: 'About Us', desc: 'Meet Vishakha Bangare and our team', url: 'about.html', icon: 'fa-user' },
    { title: 'Services', desc: 'All beauty services we offer', url: 'services.html', icon: 'fa-list' },
    { title: 'Bridal Makeup', desc: 'Luxury bridal makeup packages starting ₹15,000', url: 'bridal-makeup.html', icon: 'fa-crown' },
    { title: 'Party Makeup', desc: 'Glamorous party looks starting ₹2,500', url: 'party-makeup.html', icon: 'fa-glass-cheers' },
    { title: 'Hair Styling', desc: 'Professional hair styling and treatments', url: 'hair-styling.html', icon: 'fa-cut' },
    { title: 'Nail Art', desc: 'Nail art and extensions starting ₹500', url: 'nail-art.html', icon: 'fa-hand-sparkles' },
    { title: 'Skin Care', desc: 'Luxury facials and skincare treatments', url: 'skin-care.html', icon: 'fa-spa' },
    { title: 'Beauty Academy', desc: 'Professional makeup courses starting ₹15,000', url: 'beauty-academy.html', icon: 'fa-graduation-cap' },
    { title: 'Gallery', desc: 'View our portfolio and work', url: 'gallery.html', icon: 'fa-images' },
    { title: 'Blog', desc: 'Beauty tips and trends', url: 'blog.html', icon: 'fa-pen' },
    { title: 'Contact Us', desc: 'Book appointment or get in touch', url: 'contact.html', icon: 'fa-phone' },
    { title: 'Testimonials', desc: 'What our clients say about us', url: 'testimonials.html', icon: 'fa-star' },
    { title: 'Privacy Policy', desc: 'Our privacy policy', url: 'privacy-policy.html', icon: 'fa-shield-alt' },
    { title: 'Terms & Conditions', desc: 'Terms and conditions', url: 'terms-conditions.html', icon: 'fa-file-alt' },
    { title: 'Book Appointment', desc: 'Book your beauty appointment today', url: 'contact.html', icon: 'fa-calendar-check' },
    { title: 'Bridal Package - Silver ₹15,000', desc: 'HD Makeup, Basic Hairstyle, Touch-up Kit', url: 'bridal-makeup.html', icon: 'fa-gem' },
    { title: 'Bridal Package - Gold ₹25,000', desc: 'Airbrush Makeup, Premium Hairstyle, Draping', url: 'bridal-makeup.html', icon: 'fa-gem' },
    { title: 'Bridal Package - Diamond ₹45,000', desc: 'Complete bridal package with trial sessions', url: 'bridal-makeup.html', icon: 'fa-gem' },
    { title: 'Basic Makeup Course ₹15,000', desc: '1 Month professional makeup course', url: 'beauty-academy.html', icon: 'fa-palette' },
    { title: 'Advanced Makeup Course ₹35,000', desc: '3 Month advanced makeup artistry course', url: 'beauty-academy.html', icon: 'fa-magic' },
    { title: 'Complete Beauty Pro ₹55,000', desc: '6 Month complete beauty professional course', url: 'beauty-academy.html', icon: 'fa-certificate' },
    { title: 'Gold Facial ₹2,500', desc: 'Luxurious gold-infused facial treatment', url: 'skin-care.html', icon: 'fa-spa' },
    { title: 'Diamond Facial ₹3,500', desc: 'Premium microdermabrasion facial', url: 'skin-care.html', icon: 'fa-spa' },
    { title: 'Keratin Smoothing ₹5,000', desc: 'Professional keratin hair treatment', url: 'hair-styling.html', icon: 'fa-cut' },
    { title: 'Gel Extensions ₹2,500', desc: 'Full set gel nail extensions', url: 'nail-art.html', icon: 'fa-hand-sparkles' },
    { title: 'WhatsApp Us', desc: 'Chat with us on WhatsApp', url: 'https://wa.me/919987936131', icon: 'fa-whatsapp' },
    { title: 'Call Us - 9987936131', desc: 'Call for appointments and enquiries', url: 'tel:9987936131', icon: 'fa-phone' },
  ];

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const closeBtn = document.getElementById('search-close');

  // Open search
  searchBtn.addEventListener('click', function() {
    searchOverlay.classList.add('active');
    setTimeout(() => input.focus(), 100);
  });

  // Close search
  closeBtn.addEventListener('click', closeSearch);
  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearch();
  });

  function closeSearch() {
    searchOverlay.classList.remove('active');
    input.value = '';
    results.innerHTML = '';
  }

  // Search logic
  input.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();

    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      results.innerHTML = `
        <div class="search-no-result">
          <i class="fas fa-search"></i>
          <p>No results found for "<strong>${query}</strong>"</p>
        </div>
      `;
      return;
    }

    results.innerHTML = filtered.map(item => `
      <a href="${item.url}" class="search-result-item">
        <div class="search-result-icon">
          <i class="fas ${item.icon}"></i>
        </div>
        <div class="search-result-text">
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </div>
      </a>
    `).join('');
  });
}
