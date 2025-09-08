chrome.runtime.onInstalled.addListener(() => {
    console.log('Resumindo — Link Saver instalado.');

    chrome.contextMenus.create({
        id: 'save-page',
        title: 'Salvar esta página no Link Saver',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: 'save-link',
        title: 'Salvar link selecionado no Link Saver',
        contexts: ['link']
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-page') {
        if (!tab || !tab.url) return;
        await saveLink({ url: tab.url, title: tab.title || tab.url });
    }
    if (info.menuItemId === 'save-link') {
        if (!info.linkUrl) return;
        await saveLink({ url: info.linkUrl, title: info.selectionText || info.linkUrl });
    }
});

async function saveLink(item) {
    const { links = [] } = await chrome.storage.local.get(['links']);
    const exists = links.some(l => l.url === item.url);
    if (!exists) {
        links.unshift({ ...item, addedAt: Date.now() });
        await chrome.storage.local.set({ links });
    }
}
