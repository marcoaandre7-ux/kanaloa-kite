const products = window.KANALOA_PRODUCTS || [];
const money = amount => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(amount);
const findProduct = id => products.find(product => product.id === id);
const cartKey = 'kanaloaDemoCart';
const readCartRaw = () => {
  try { return localStorage.getItem(cartKey); }
  catch { return decodeURIComponent(document.cookie.split('; ').find(part => part.startsWith(`${cartKey}=`))?.split('=').slice(1).join('=') || ''); }
};
const writeCartRaw = value => {
  try { localStorage.setItem(cartKey,value); }
  catch { document.cookie = `${cartKey}=${encodeURIComponent(value)};path=/;max-age=2592000;samesite=lax`; }
};
const loadCart = () => {
  try {
    const raw = JSON.parse(readCartRaw() || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter(item => findProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99 && (item.size === '' || findProduct(item.id).sizes.includes(item.size)));
  } catch { return []; }
};
const saveCart = cart => { writeCartRaw(JSON.stringify(cart)); updateCartCount(); };
const updateCartCount = () => {
  const count = loadCart().reduce((sum,item) => sum + item.quantity,0);
  document.querySelectorAll('#cartCount,#cartCountSecondary').forEach(el => { el.textContent = count; });
};
const addToCart = (id,size='',quantity=1) => {
  const product = findProduct(id);
  if (!product) return;
  const cart = loadCart();
  const item = cart.find(entry => entry.id === id && entry.size === size);
  if (item) item.quantity = Math.min(99,item.quantity + quantity);
  else cart.push({id,size,quantity});
  saveCart(cart);
};

function renderCatalog(filter='todos') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const visible = products.filter(product => filter === 'todos' || product.category === filter);
  grid.innerHTML = visible.map(product => `<article class="product-card"><a href="produto.html?id=${product.id}" aria-label="Ver ${product.name}"><div class="product-card__image"><img src="${product.images[0]}" alt="Imagem demonstrativa de ${product.name}" loading="lazy"></div><div class="product-card__body"><span>${product.categoryLabel}</span><h2>${product.name}</h2><strong>${money(product.price)}</strong><small>Preço ilustrativo</small></div></a><button class="quick-add" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">Adicionar ao carrinho +</button></article>`).join('');
}
const filters = document.getElementById('catalogFilters');
if (filters) {
  renderCatalog();
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filters.querySelectorAll('button').forEach(el => el.classList.toggle('active',el === button));
    renderCatalog(button.dataset.filter);
  });
  document.getElementById('productGrid').addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    const product = findProduct(button.dataset.add);
    if (product.sizes.length) { window.location.href = `produto.html?id=${product.id}`; return; }
    addToCart(product.id);
    button.textContent = 'Adicionado ✓';
    window.setTimeout(() => button.textContent = 'Adicionar ao carrinho +',1600);
  });
}

const detail = document.getElementById('productDetail');
if (detail) {
  const id = new URLSearchParams(location.search).get('id');
  const product = findProduct(id);
  if (!product) detail.innerHTML = '<div class="empty-state"><h1>Produto não encontrado.</h1><a class="button button--blue" href="loja.html">Voltar à loja</a></div>';
  else {
    document.title = `${product.name} | Kanaloa Kite`;
    detail.innerHTML = `<div class="detail-grid"><div class="gallery"><div class="gallery__main"><img id="galleryMain" src="${product.images[0]}" alt="Imagem demonstrativa de ${product.name}"></div><div class="gallery__thumbs">${product.images.map((image,index) => `<button type="button" class="${index===0?'active':''}" data-gallery="${index}" aria-label="Ver foto ${index+1} de ${product.name}"><img src="${image}" alt=""></button>`).join('')}</div></div><div class="detail-copy"><span class="detail-category">${product.categoryLabel}</span><h1>${product.name}</h1><div class="detail-price">${money(product.price)} <small>Preço ilustrativo</small></div><p>${product.description}</p>${product.sizes.length ? `<label class="detail-size">Tamanho<select id="productSize" required><option value="">Selecione</option>${product.sizes.map(size=>`<option>${size}</option>`).join('')}</select></label>`:''}<label class="detail-quantity">Quantidade<input id="productQuantity" type="number" min="1" max="99" value="1" inputmode="numeric"></label><button id="detailAdd" class="button button--blue" type="button">Adicionar ao carrinho +</button><a id="detailWhatsApp" class="text-link" href="#" target="_blank" rel="noopener noreferrer">Tenho interesse neste produto</a><p class="detail-note">A equipe confirmará o produto real, o preço e a disponibilidade antes de qualquer compra.</p></div></div>`;
    detail.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click',() => {
      detail.querySelector('#galleryMain').src = product.images[Number(button.dataset.gallery)];
      detail.querySelectorAll('[data-gallery]').forEach(el => el.classList.toggle('active',el === button));
    }));
    detail.querySelector('#detailAdd').addEventListener('click',() => {
      const button = detail.querySelector('#detailAdd');
      button.textContent = 'Adicionando...';
      const size = detail.querySelector('#productSize')?.value || '';
      if (product.sizes.length && !size) { detail.querySelector('#productSize').reportValidity(); return; }
      const qty = Number(detail.querySelector('#productQuantity').value);
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) { detail.querySelector('#productQuantity').reportValidity(); return; }
      try { addToCart(product.id,size,qty); }
      catch (error) { button.textContent = 'Erro ao adicionar. Tente novamente.'; button.title = error.message; return; }
      button.textContent = 'Adicionado ao carrinho ✓';
      window.setTimeout(()=>button.textContent='Adicionar ao carrinho +',1800);
    });
    const wa = detail.querySelector('#detailWhatsApp');
    wa.addEventListener('click',event => {
      const size = detail.querySelector('#productSize')?.value || '';
      if (product.sizes.length && !size) { event.preventDefault(); detail.querySelector('#productSize').reportValidity(); return; }
      const message = `Olá, Kanaloa! Tenho interesse em ${product.name}${size?` (tamanho ${size})`:''}, visto no catálogo demonstrativo do site. Podem me enviar as opções reais, preço e disponibilidade?`;
      wa.href = `https://wa.me/5598988404040?text=${encodeURIComponent(message)}`;
    });
  }
}

function renderCart() {
  const container = document.getElementById('cartContent');
  if (!container) return;
  const cart = loadCart();
  if (!cart.length) { container.innerHTML = '<div class="empty-state"><h2>Seu carrinho está vazio.</h2><p>Explore os exemplos do catálogo e adicione os itens que deseja consultar.</p><a class="button button--blue" href="loja.html">Ver catálogo</a></div>'; return; }
  const subtotal = cart.reduce((sum,item)=>sum + findProduct(item.id).price*item.quantity,0);
  container.innerHTML = `<div class="cart-layout"><div class="cart-items">${cart.map((item,index)=>{const product=findProduct(item.id);return `<article class="cart-item"><img src="${product.images[0]}" alt="Imagem demonstrativa de ${product.name}"><div><h2><a href="produto.html?id=${product.id}">${product.name}</a></h2><p>${item.size?`Tamanho ${item.size} · `:''}Preço ilustrativo</p><strong>${money(product.price)}</strong><div class="cart-item__actions"><label>Qtd. <input type="number" min="1" max="99" value="${item.quantity}" data-qty="${index}" aria-label="Quantidade de ${product.name}"></label><button type="button" data-remove="${index}">Remover</button></div></div><b>${money(product.price*item.quantity)}</b></article>`}).join('')}</div><div class="cart-summary"><h2>Resumo</h2><div><span>Total ilustrativo</span><strong>${money(subtotal)}</strong></div><p>Não é um pedido nem pagamento. Confirme os valores reais com a equipe.</p><a id="cartWhatsApp" class="button button--blue" href="#" target="_blank" rel="noopener noreferrer">Consultar pelo WhatsApp</a></div></div>`;
  container.onchange = event => {
    const input = event.target.closest('[data-qty]');
    if (!input) return;
    const next = loadCart();
    const qty = Number(input.value);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) { input.value = next[Number(input.dataset.qty)].quantity; return; }
    next[Number(input.dataset.qty)].quantity = qty;
    saveCart(next);
    renderCart();
  };
  container.onclick = event => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    const next = loadCart();
    next.splice(Number(button.dataset.remove),1);
    saveCart(next);
    renderCart();
  };
  const lines = cart.map(item=>{const product=findProduct(item.id);return `• ${item.quantity}x ${product.name}${item.size?` (tam. ${item.size})`:''}`;}).join('\n');
  const message = `Olá, Kanaloa! Tenho interesse nestes itens vistos no catálogo demonstrativo do site:\n${lines}\nPodem confirmar produtos reais, preços e disponibilidade?`;
  container.querySelector('#cartWhatsApp').href=`https://wa.me/5598988404040?text=${encodeURIComponent(message)}`;
}
renderCart();
updateCartCount();
