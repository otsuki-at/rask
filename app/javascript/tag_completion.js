import Textcomplete from "textcomplete";

document.addEventListener("DOMContentLoaded", () => {
  const fetchTags = async () => {
    // サーバーからタグリストを取得
    const response = await fetch('/tags.json');
    if (!response.ok) {
      console.error("Failed to fetch tags");
      return [];
    }
    const tags = await response.json();
    return tags.map(tag => tag.name);
  };

  const setupAutocomplete = async (inputElement) => {
    const tagList = await fetchTags();
    if (!tagList.length) return;

    // Textcomplete セットアップ
    const editor = new Textcomplete.editors.Textarea(inputElement);
    const textcomplete = new Textcomplete(editor);

    textcomplete.register([{
      match: /(^|\s)(\w*)$/,
      search: (term, callback) => {
        callback(tagList.filter(tag => tag.includes(term)));
      },
      replace: (value) => `${value} `,
    }]);
  };

  const inputElement = document.getElementById("tag-name");
  if (inputElement) {
    setupAutocomplete(inputElement);
  }
});
