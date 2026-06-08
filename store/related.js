/* FreePeerStore — related tools widget + cross-store links */
(function () {
  'use strict';

  const REGISTRY_URL = '/registry.json';
  const STORE_LINKS = [
    { name: 'FreeAppStore', url: 'https://freeappstore.online', color: '#3b82f6' },
    { name: 'FreeGameStore', url: 'https://freegamestore.online', color: '#22c55e' },
    { name: 'FreeWebStore', url: 'https://freewebstore.online', color: '#f59e0b' },
    { name: 'FreeAgentStore', url: 'https://freeagentstore.online', color: '#ef4444' },
    { name: 'FreePeerStore', url: 'https://freepeerstore.online', color: '#a855f7' }
  ];

  function getCurrentPath() {
    return window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  }

  function injectStyles() {
    if (document.getElementById('fps-related-styles')) return;
    const style = document.createElement('style');
    style.id = 'fps-related-styles';
    style.textContent = `
      .fps-related-bar {
        position: fixed; bottom: 0; left: 0; right: 0;
        background: #18181b; border-top: 1px solid #27272a;
        padding: 10px 20px; z-index: 9999;
        font-family: 'Manrope', sans-serif; font-size: 13px;
        display: flex; align-items: center; gap: 16px;
        overflow-x: auto; white-space: nowrap;
      }
      .fps-related-bar a {
        color: #a1a1aa; text-decoration: none; padding: 4px 10px;
        border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;
        flex-shrink: 0;
      }
      .fps-related-bar a:hover {
        color: #e4e4e7; background: #27272a; border-color: #3f3f46;
      }
      .fps-related-bar a.fps-active {
        color: #a855f7; border-color: #a855f7; background: rgba(168,85,247,0.08);
      }
      .fps-related-sep {
        width: 1px; height: 20px; background: #3f3f46; flex-shrink: 0;
      }
      .fps-related-label {
        color: #71717a; font-size: 11px; text-transform: uppercase;
        letter-spacing: 0.05em; flex-shrink: 0;
      }
      .fps-store-dot {
        display: inline-block; width: 7px; height: 7px;
        border-radius: 50%; margin-right: 5px; vertical-align: middle;
      }
      body { padding-bottom: 52px; }
    `;
    document.head.appendChild(style);
  }

  function buildBar(items) {
    const currentPath = getCurrentPath();
    const bar = document.createElement('div');
    bar.className = 'fps-related-bar';

    /* Related tools */
    const currentItem = items.find(i => currentPath.includes(i.path.replace(/\/$/, '')));
    const related = currentItem
      ? items.filter(i => i.id !== currentItem.id && i.category === currentItem.category).slice(0, 4)
      : items.slice(0, 5);

    if (related.length > 0) {
      const label = document.createElement('span');
      label.className = 'fps-related-label';
      label.textContent = 'Related';
      bar.appendChild(label);

      related.forEach(item => {
        const a = document.createElement('a');
        a.href = item.path;
        a.textContent = item.name;
        bar.appendChild(a);
      });

      const sep = document.createElement('div');
      sep.className = 'fps-related-sep';
      bar.appendChild(sep);
    }

    /* Cross-store links */
    const storeLabel = document.createElement('span');
    storeLabel.className = 'fps-related-label';
    storeLabel.textContent = 'Open Frontier';
    bar.appendChild(storeLabel);

    STORE_LINKS.forEach(store => {
      const a = document.createElement('a');
      a.href = store.url;
      a.target = '_blank';
      a.rel = 'noopener';
      if (store.name === 'FreePeerStore') a.classList.add('fps-active');
      const dot = document.createElement('span');
      dot.className = 'fps-store-dot';
      dot.style.background = store.color;
      a.appendChild(dot);
      a.appendChild(document.createTextNode(store.name));
      bar.appendChild(a);
    });

    document.body.appendChild(bar);
  }

  function init() {
    injectStyles();
    fetch(REGISTRY_URL)
      .then(r => r.json())
      .then(data => buildBar(data.items || []))
      .catch(() => buildBar([]));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
