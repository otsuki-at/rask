// prevent closing tab or jumping to another page in editing
const beforeUnloadHandler = (e) => {
  e.preventDefault();
  e.returnValue = '';
};

let registered = false;
const editableElements = document.querySelectorAll('input,select,textarea');
editableElements.forEach((element) => {
  element.addEventListener('change', () => {
    // イベントリスナーがまだ登録されていない場合のみ追加
    if (!registered) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      registered = true;
    }
  });
});

const form = document.getElementById('editor');
form.addEventListener('submit', () => {
  // フォーム送信時にリスナーを削除
  window.removeEventListener('beforeunload', beforeUnloadHandler);
});
