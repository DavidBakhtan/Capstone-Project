<?php
session_start();
$logged_in = isset($_SESSION['uid']);
$role = $_SESSION['role'] ?? 'guest';
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Admin · NokNuk</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root { color-scheme: dark; }
  body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system; background:#0b1220; color:#e5e7eb;}
  header { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid #1f2937; }
  a.btn, button.btn { background:#2563eb; border:0; color:#fff; padding:8px 12px; border-radius:8px; cursor:pointer; }
  main { padding:16px; display:grid; gap:24px; }
  section { border:1px solid #1f2937; border-radius:12px; padding:16px; background:#0a0f1a; }
  input, select { background:#0a0f1a; color:#e5e7eb; border:1px solid #374151; padding:8px; border-radius:8px; }
  table { width:100%; border-collapse: collapse; }
  th, td { padding:8px; border-bottom:1px solid #1f2937; text-align:left; }
  .muted { color:#9ca3af; }
</style>
</head>
<body>
<header>
  <strong>Admin Panel</strong>
  <div>
    <?php if ($logged_in): ?>
      <span class="muted">Role: <?=htmlspecialchars($role)?></span>
      <button class="btn" onclick="logout()">Logout</button>
    <?php else: ?>
      <a class="btn" href="http://localhost:8081/login">Go to Login</a>
    <?php endif; ?>
  </div>
</header>

<main>
  <section>
    <h2>Products</h2>
    <form id="addForm" style="display:grid; grid-template-columns:repeat(6,1fr); gap:8px; align-items:center;">
      <input name="name" placeholder="Name" required>
      <input name="price" placeholder="Price" type="number" step="0.01" required>
      <input name="category" placeholder="Category">
      <input name="store" placeholder="Store">
      <input name="image" placeholder="Image URL">
      <button class="btn">Add</button>
    </form>
    <div id="products" class="muted" style="margin-top:12px;">Loading…</div>
  </section>

  <section>
    <h2>Pending Users (approve)</h2>
    <div id="users" class="muted">Loading…</div>
  </section>
</main>

<script>
async function api(url, opts){ const r=await fetch(url, Object.assign({credentials:'include'},opts)); const j=await r.json(); if(!r.ok) throw new Error(j.error||'error'); return j; }
async function logout(){ await api('/api/auth/logout',{method:'POST'}); location.reload(); }

async function loadProducts(){
  const el = document.getElementById('products');
  try {
    const {products} = await api('/api/products');
    if(!products.length){ el.textContent='No products yet.'; return; }
    el.innerHTML = `
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Store</th><th>Sale%</th><th>Actions</th></tr></thead>
        <tbody>
          ${products.map(p=>`
            <tr>
              <td>${p.id}</td>
              <td><input value="${p.name||''}" data-k="name" data-id="${p.id}"></td>
              <td><input type="number" step="0.01" value="${p.price||0}" data-k="price" data-id="${p.id}"></td>
              <td><input value="${p.category||''}" data-k="category" data-id="${p.id}"></td>
              <td><input value="${p.store||''}" data-k="store" data-id="${p.id}"></td>
              <td><input type="number" value="${p.salePercentage||0}" data-k="salePercentage" data-id="${p.id}"></td>
              <td>
                <button class="btn" onclick="save(${p.id})">Save</button>
                <button class="btn" style="background:#ef4444" onclick="del(${p.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch(e){ el.textContent = e.message; }
}

async function save(id){
  const inputs = document.querySelectorAll(`[data-id="${id}"]`);
  const payload = {}; inputs.forEach(i=>payload[i.dataset.k]= i.type==='number' ? Number(i.value) : i.value);
  await api('/api/products/'+id,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  loadProducts();
}
async function del(id){
  if(!confirm('Delete product '+id+'?')) return;
  await api('/api/products/'+id,{method:'DELETE'});
  loadProducts();
}
document.getElementById('addForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const payload = Object.fromEntries(fd.entries());
  payload.price = Number(payload.price||0);
  await api('/api/products',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  e.currentTarget.reset(); loadProducts();
});

async function loadUsers(){
  const el = document.getElementById('users');
  try {
    const {users} = await api('/api/users?status=pending');
    if(!users.length){ el.textContent = 'No pending users.'; return; }
    el.innerHTML = users.map(u => `
      <div style="display:flex; gap:8px; align-items:center; margin:6px 0;">
        <code style="opacity:.7">#${u.id}</code> ${u.email}
        <select id="role-${u.id}">
          <option value="tech">tech</option>
          <option value="admin">admin</option>
        </select>
        <button class="btn" onclick="approve(${u.id})">Approve</button>
      </div>
    `).join('');
  } catch(e){ el.textContent = e.message; }
}
async function approve(id){
  const role = document.getElementById('role-'+id).value;
  await api('/api/users/approve',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({user_id:id, role})});
  loadUsers();
}

loadProducts();
loadUsers();
</script>
</body>
</html>
