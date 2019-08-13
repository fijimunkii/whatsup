module.exports = `
function bold(e) {
  e.style['font-weight'] = (e.style['font-weight'] == 'bold') ? 'normal' : 'bold';
}
function showHide(id) {
  var e = document.getElementById(id);
  e.style.display = (e.style.display == 'block') ? 'none' : 'block';
}
function selectText(id) {
  var node = document.getElementById(id);
  if (document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
}
`;
