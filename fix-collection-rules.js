const createdField = {
  id: 'autodate2990389176', name: 'created', type: 'autodate',
  onCreate: true, onUpdate: false, hidden: false, presentable: false, system: false
};
const updatedField = {
  id: 'autodate3332085495', name: 'updated', type: 'autodate',
  onCreate: true, onUpdate: true, hidden: false, presentable: false, system: false
};

(async () => {
  const authRes = await fetch('http://127.0.0.1:8090/api/collections/_superusers/auth-with-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: 'admin@example.com', password: 'SecureAdmin@123' })
  });
  const token = (await authRes.json()).token;
  const hdrs = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const collections = ['cart', 'orders', 'reviews', 'coupons', 'wishlist'];

  for (const name of collections) {
    const col = await fetch(`http://127.0.0.1:8090/api/collections/${name}`, { headers: hdrs }).then(r => r.json());
    const hasCreated = col.fields.some(f => f.name === 'created');
    if (hasCreated) {
      console.log(`✓ ${name} already has autodate fields`);
      continue;
    }
    const newFields = [...col.fields, createdField, updatedField];
    const patch = await fetch(`http://127.0.0.1:8090/api/collections/${name}`, {
      method: 'PATCH', headers: hdrs, body: JSON.stringify({ fields: newFields })
    });
    console.log(`${patch.ok ? '✓' : '✗'} ${name} — added created/updated (${patch.status})`);
  }

  // Verify
  for (const name of collections) {
    const r = await fetch(`http://127.0.0.1:8090/api/collections/${name}/records?sort=-created`);
    console.log(`  ${name} sort=-created: ${r.status}`);
  }
})().catch(e => console.error(e));
