// prevent closing tab or jumping another page in editing
const beforeUnloadHandler = (e) => {
  e.preventDefault();
  e.returnValue = '';
};

let registered = false;
const editableElements = document.querySelectorAll('input,select,textarea');
editableElements.forEach((element) => {
  element.addEventListener('change', (e) => {
    if (registered) return;
    registered = true;
    window.addEventListener('beforeunload', beforeUnloadHandler);
  });
});

const form = document.getElementById('editor');
form.addEventListener('submit', (e) => {
  window.removeEventListener('beforeunload', beforeUnloadHandler);
});
