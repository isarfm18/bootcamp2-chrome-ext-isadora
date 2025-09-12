const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const saveBtn = document.getElementById('saveCurrent');
const copyBtn = document.getElementById('copyAll');
const exportBtn = document.getElementById('exportJson');
const clearBtn = document.getElementById('clearAll');


async function getLinks() {
    const { links = [] } = await chrome.storage.local.get(['links']);
    return links;
}
async function setLinks(links) {
    return chrome.storage.local.set({ links });
}

function faviconFor(url) {
    return `chrome://favicon/size/16@2x/${url}`;
}

function render(links, q = '') {
    const query = q.trim().toLowerCase();
    const filtered = !query ? links : links.filter(l =>
        (l.title || '').toLowerCase().includes(query) ||
        (l.url || '').toLowerCase().includes(query)
    );
    listEl.innerHTML = '';
    if (filtered.length === 0) {
        const li = document.createElement('li');
        li.textContent = query ? 'Nada encontrado.' : 'Sem links salvos.';
        li.style.color = '#666';
        listEl.appendChild(li);
        return;
    }
    for (const link of filtered) {
        const li = document.createElement('li');
        li.className = 'item';
        const fav = document.createElement('img');
        fav.width = 16; fav.height = 16; fav.referrerPolicy = 'no-referrer';
        fav.src = faviconFor(link.url);
        const meta = document.createElement('div');
        meta.className = 'meta';
        const a = document.createElement('a');
        a.className = 'title';
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.title || link.url;
        const url = document.createElement('div');
        url.className = 'url';
        url.textContent = link.url;
        meta.appendChild(a);
        meta.appendChild(url);

        const actions = document.createElement('div');
        actions.className = 'actions';
        const del = document.createElement('button');
        del.textContent = 'Remover';
        del.addEventListener('click', async () => {
            const current = await getLinks();
            const next = current.filter(x => !(x.url === link.url && x.addedAt === link.addedAt));
            await setLinks(next);
            render(next, searchEl.value);
        });
        actions.appendChild(del);

        li.appendChild(fav);
        li.appendChild(meta);
        li.appendChild(actions);
        listEl.appendChild(li);
    }
}


saveBtn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab || !tab.url) return;

    const links = await getLinks();
    const exists = links.some(l => l.url === tab.url && (l.title || '') === (tab.title || ''));
    if (!exists) {
        links.unshift({
            url: tab.url,
            title: tab.title || tab.url,
            addedAt: Date.now()
        });
        await setLinks(links);
        render(links, searchEl.value);
    }
});


copyBtn.addEventListener('click', async () => {
    const links = await getLinks();
    const text = links.map(l => `- ${l.title} — ${l.url}`).join('\n');
    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => (copyBtn.textContent = 'Copiar'), 1200);
    } catch (e) {
        alert('Não foi possível copiar automaticamente. Selecione e copie manualmente.');
    }
});


exportBtn.addEventListener('click', async () => {
    const links = await getLinks();
    const blob = new Blob([JSON.stringify(links, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `links-${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});


clearBtn.addEventListener('click', async () => {
    if (!confirm('Tem certeza que deseja apagar todos os links?')) return;
    await setLinks([]);
    render([]);
});


searchEl.addEventListener('input', async (e) => {
    const links = await getLinks();
    render(links, e.target.value);
});


getLinks().then(links => render(links));
