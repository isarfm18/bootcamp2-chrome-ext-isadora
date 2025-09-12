# Resumindo — Link Saver

Extensão para Google Chrome (Manifest V3) que permite salvar a aba atual e links do menu de contexto diretamente em um popup. Todos os dados são armazenados localmente (`chrome.storage.local`).

---

## Instalação manual (modo desenvolvedor)

1. Abra o Chrome em `chrome://extensions`.
2. Ative o **Developer mode** (modo de desenvolvedor).
3. Clique em **Load unpacked** e selecione a pasta do projeto (`link-saver-extension`).
4. Clique no ícone da extensão para abrir o popup.

---

## Funcionalidades

- Salvar aba atual pelo popup.
- Salvar links ou páginas via botão direito (context menu).
- Listar links salvos com favicon, título e URL.
- Filtrar links por título ou URL.
- Remover links individualmente ou todos de uma vez.
- Copiar todos os links como texto.
- Exportar links em JSON.

---

## Estrutura de Pastas

link-saver-extension/
├─ src/
│ ├─ popup/ # Popup HTML, CSS e JS
│ ├─ background/ # Service worker 
│ ├─ content/ # Scripts injetados
│ ├─ assets/ # Imagens e logos
│ └─ styles/ # CSS global
├─ icons/ # Ícones da extensão 
├─ docs/ # GitHub Pages (index.html)
├─ manifest.json # MV3
├─ README.md 
└─ LICENSE # Licença MIT
```
---

## GitHub Pages

- https://isarfm18.github.io/bootcamp2-chrome-ext-isadora/

---

## Teste Local

1. Abra o Chrome e vá para `chrome://extensions`.
2. Ative **Developer mode**.
3. Clique em **Load unpacked** e selecione a pasta da extensão.
4. Abra o popup pelo ícone da extensão.
5. Use o botão direito para salvar páginas ou links.
6. Teste filtros, remover, copiar e exportar.

---

## Licença

MIT License (veja o arquivo LICENSE)


