import { backend } from '../../services/api.js';

const dialog = document.querySelector('#settingsDialog');
const openBtn = document.querySelector('#settingsBtn');
const closeBtn = document.querySelector('#settingsClose');
const tabList = dialog.querySelector('[role="tablist"]');
const tabs = [...dialog.querySelectorAll('[role="tab"]')];
const themeSelect = document.querySelector('#themeSelect');
const msg = document.querySelector('#settingsMsg');

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.classList.toggle('error', isError);
}

function selectTab(tab) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
}

function onTabKeydown(e) {
  const index = tabs.indexOf(document.activeElement);
  if (index === -1) return;
  const last = tabs.length - 1;
  const target = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last,
  }[e.key];
  if (target === undefined) return;
  e.preventDefault();
  tabs[target].focus();
  selectTab(tabs[target]);
}

async function syncTheme() {
  try {
    themeSelect.value = (await backend.getSettings()).theme;
    return true;
  } catch {
    return false;
  }
}

async function openSettings() {
  setMsg('');
  if (!(await syncTheme())) setMsg('Could not load the settings.', true);
  if (!dialog.open) dialog.showModal();
  tabs.find((tab) => tab.getAttribute('aria-selected') === 'true').focus();
}

async function changeTheme() {
  try {
    await backend.setTheme(themeSelect.value);
    setMsg('');
  } catch {
    setMsg('Could not change the theme.', true);
    await syncTheme();
  }
}

export function initSettings() {
  selectTab(tabs[0]);
  tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab)));
  tabList.addEventListener('keydown', onTabKeydown);
  openBtn.addEventListener('click', openSettings);
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  themeSelect.addEventListener('change', changeTheme);
}