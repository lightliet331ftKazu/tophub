const catalog = {
  "Mobile Legends": {symbol:"ML", accent:"violet", subtitle:"Diamonds · Weekly Pass", bundles:[["86 Diamonds",29],["172 Diamonds",55],["257 Diamonds",79],["Weekly Pass",99]]},
  "Genshin Impact": {symbol:"GI", accent:"blue", subtitle:"Genesis Crystals", bundles:[["60 Crystals",55],["300 + 30 Crystals",259],["980 + 110 Crystals",799],["Blessing (demo)",279]]},
  "Valorant": {symbol:"V", accent:"gold", subtitle:"Valorant Points", bundles:[["475 VP",100],["1000 VP",199],["2050 VP",399],["3650 VP",699]]},
  "Roblox": {symbol:"R", accent:"cyan", subtitle:"Robux gift bundles", bundles:[["Small Bundle",60],["Starter Bundle",149],["Player Bundle",299],["Mega Bundle",599]]},
  "PUBG Mobile": {symbol:"P", accent:"pink", subtitle:"Unknown Cash (UC)", bundles:[["60 UC",49],["325 UC",249],["660 UC",499],["1800 UC",1299]]},
  "Call of Duty: Mobile": {symbol:"COD", accent:"green", subtitle:"COD Points", bundles:[["80 CP",45],["400 CP",199],["800 CP",399],["2000 CP",899]]}
};
const artClass = {violet:"art-ml",blue:"art-gi",gold:"art-val",cyan:"art-roblox",pink:"art-pubg",green:"art-cod"};
let currentGame = "Mobile Legends", selectedBundle = 0, quantity = 1, cart = [];
const $ = (id) => document.getElementById(id);
const money = (value) => "₱" + value.toLocaleString("en-PH", {minimumFractionDigits:2, maximumFractionDigits:2});
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2800)}
function setBodyLock(){document.body.classList.toggle("locked", $("productModal").classList.contains("open")||$("cartBackdrop").classList.contains("open")||$("orderBackdrop").classList.contains("open"))}
function openProduct(name){
  currentGame=name;selectedBundle=0;quantity=1;const item=catalog[name];
  $("modalGame").textContent=name;$("modalSubtitle").textContent=item.subtitle+" · Demo bundles";
  $("modalSymbol").textContent=item.symbol;$("modalArt").className="modal-art "+artClass[item.accent];
  $("playerId").value="";$("qtyValue").textContent=quantity;
  $("bundleGrid").innerHTML=item.bundles.map((bundle,i)=>`<button class="bundle-option ${i===0?"selected":""}" data-index="${i}"><strong>${bundle[0]}</strong><small>${money(bundle[1])}</small></button>`).join("");
  $("bundleGrid").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{selectedBundle=Number(btn.dataset.index);$("bundleGrid").querySelectorAll("button").forEach(b=>b.classList.toggle("selected",b===btn));updateProductTotal()}));
  updateProductTotal();$("productModal").classList.add("open");$("productModal").setAttribute("aria-hidden","false");setBodyLock();
}
function updateProductTotal(){const price=catalog[currentGame].bundles[selectedBundle][1];$("modalTotal").textContent=money(price*quantity)}
function closeProduct(){$("productModal").classList.remove("open");$("productModal").setAttribute("aria-hidden","true");setBodyLock()}
document.querySelectorAll(".card-hit").forEach(btn=>btn.addEventListener("click",()=>openProduct(btn.closest(".game-card").dataset.name)));
$("qtyMinus").addEventListener("click",()=>{quantity=Math.max(1,quantity-1);$("qtyValue").textContent=quantity;updateProductTotal()});
$("qtyPlus").addEventListener("click",()=>{quantity=Math.min(20,quantity+1);$("qtyValue").textContent=quantity;updateProductTotal()});
$("modalClose").addEventListener("click",closeProduct);
$("productModal").addEventListener("click",e=>{if(e.target===$("productModal"))closeProduct()});
$("addToCart").addEventListener("click",()=>{
  const player=$("playerId").value.trim();if(!player){$("playerId").focus();toast("Enter a player ID or username for the demo order.");return}
  const bundle=catalog[currentGame].bundles[selectedBundle];
  cart.push({id:Date.now()+Math.random(),game:currentGame,bundle:bundle[0],price:bundle[1],quantity,player,symbol:catalog[currentGame].symbol,accent:catalog[currentGame].accent});
  updateCart();closeProduct();toast("Added to your demo cart ✦");
});
function updateCart(){
  $("cartCount").textContent=cart.reduce((n,x)=>n+x.quantity,0);$("drawerCount").textContent="("+cart.length+")";
  const total=cart.reduce((n,x)=>n+x.price*x.quantity,0);$("cartSubtotal").textContent=money(total);
  if(!cart.length){$("cartItems").innerHTML='<div class="cart-empty"><span>◇</span><h3>Your cart is waiting.</h3><p>Choose a game bundle to see it here.</p><button class="button button-primary" id="emptyBrowse">Explore games ↗</button></div>';$("emptyBrowse").addEventListener("click",closeCart);$("checkoutButton").disabled=true;$("checkoutButton").style.opacity=".45";return}
  $("checkoutButton").disabled=false;$("checkoutButton").style.opacity="1";
  $("cartItems").innerHTML=cart.map(x=>`<div class="cart-line"><div class="cart-line-art">${x.symbol}</div><div><h4>${x.game}</h4><p>${x.bundle} · Qty ${x.quantity}<br>Player: ${escapeHtml(x.player)}</p><button class="remove-line" data-remove="${x.id}">Remove</button></div><strong>${money(x.price*x.quantity)}</strong></div>`).join("");
  $("cartItems").querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{cart=cart.filter(x=>String(x.id)!==btn.dataset.remove);updateCart()}));
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openCart(){$("cartBackdrop").classList.add("open");$("cartBackdrop").setAttribute("aria-hidden","false");setBodyLock()}
function closeCart(){$("cartBackdrop").classList.remove("open");$("cartBackdrop").setAttribute("aria-hidden","true");setBodyLock()}
$("cartOpen").addEventListener("click",openCart);$("cartClose").addEventListener("click",closeCart);$("cartBackdrop").addEventListener("click",e=>{if(e.target===$("cartBackdrop"))closeCart()});
$("checkoutButton").addEventListener("click",()=>{
  if(!cart.length)return;
  $("orderLines").innerHTML=cart.map(x=>`<div class="order-line"><span>${escapeHtml(x.game)} · ${escapeHtml(x.bundle)} × ${x.quantity}</span><strong>${money(x.price*x.quantity)}</strong></div>`).join("");
  $("orderTotal").textContent=money(cart.reduce((n,x)=>n+x.price*x.quantity,0));closeCart();$("orderBackdrop").classList.add("open");$("orderBackdrop").setAttribute("aria-hidden","false");setBodyLock();
});
function closeOrder(){$("orderBackdrop").classList.remove("open");$("orderBackdrop").setAttribute("aria-hidden","true");setBodyLock()}
$("orderClose").addEventListener("click",closeOrder);$("finishOrder").addEventListener("click",()=>{cart=[];updateCart();closeOrder();toast("Demo order complete — no payment was made.")});$("orderBackdrop").addEventListener("click",e=>{if(e.target===$("orderBackdrop"))closeOrder()});
$("filterPills").querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  $("filterPills").querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));
  const filter=btn.dataset.filter;let visible=0;
  document.querySelectorAll(".game-card").forEach(card=>{const show=filter==="all"||card.dataset.category===filter;card.hidden=!show;if(show){visible++;card.style.animation="none";requestAnimationFrame(()=>card.style.animation="cardEnter .45s both")}});
  $("resultText").textContent=String(visible).padStart(2,"0")+" TITLES";
}));
$("searchToggle").addEventListener("click",()=>{$("searchPanel").classList.toggle("show");if($("searchPanel").classList.contains("show"))$("searchInput").focus()});
$("searchClose").addEventListener("click",()=>{$("searchPanel").classList.remove("show");$("searchInput").value="";filterSearch("")});
function filterSearch(query){let visible=0;document.querySelectorAll(".game-card").forEach(card=>{const show=card.dataset.name.toLowerCase().includes(query.toLowerCase());card.hidden=!show;if(show)visible++});$("resultText").textContent=String(visible).padStart(2,"0")+" TITLES"}
$("searchInput").addEventListener("input",e=>{filterSearch(e.target.value);$("filterPills").querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"))});
$("menuToggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
document.querySelectorAll(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".desktop-nav").classList.remove("open")));
$("newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("Thanks! Newsletter signup is demo-only.");$("emailInput").value=""});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProduct();closeCart();closeOrder();$("searchPanel").classList.remove("show")}});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
updateCart();
