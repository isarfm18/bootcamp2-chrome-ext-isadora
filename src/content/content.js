
async function highlightSavedLinks() {
    const { links = [] } = await chrome.storage.local.get(['links']);
    if (!links.length) return;

    const savedUrls = new Set(links.map(l => l.url));

    for (const a of document.querySelectorAll('a[href]')) {
        if (savedUrls.has(a.href)) {
            a.style.backgroundColor = '#fff7a3'; // amarelo suave
            a.style.border = '1px solid #e0c200';
            a.style.padding = '2px 4px';
            a.style.borderRadius = '4px';
        }
    }
}

document.addEventListener('DOMContentLoaded', highlightSavedLinks);

const observer = new MutationObserver(highlightSavedLinks);
observer.observe(document.body, { childList: true, subtree: true });
