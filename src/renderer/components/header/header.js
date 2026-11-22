import { backend } from '../../services/api.js';

const form = document.querySelector('#urlForm');
const urlInput = document.querySelector('#url');
const fetchBtn = document.querySelector('#fetchBtn');
const msg = document.querySelector('#msg');

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.classList.toggle('error', isError);
}

export function clearUrl() {
  urlInput.value = '';
}

export function initHeader({ onInfo, onError }) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    setMsg('Information is being received...');
    fetchBtn.disabled = true;
    try {
      onInfo({ ...(await backend.getInfo(url)), url });
      setMsg('');
    } catch {
      onError();
      setMsg('No information could be obtained from this link. Please check the link and try again.', true);
    } finally {
      fetchBtn.disabled = false;
    }
  });
}