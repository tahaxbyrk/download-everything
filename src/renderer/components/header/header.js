const form = document.querySelector('#urlForm');
const urlInput = document.querySelector('#url');
const msg = document.querySelector('#msg');

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.classList.toggle('error', isError);
}

export function initHeader() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    setMsg(`Connection received: ${urlInput.value.trim()}`);
  });
}