$(document).ready(() => {
  $('#cc-no').on('keydown', e => {
    let el = $('#cc-no')[0];
    let key = e.keyCode;
    let len = el.value.length;
    if (key === 8) {
      if (el.value.substring(el.value.length - 2, el.value.length - 1) == ' ') el.value = el.value.substring(0, el.value.length - 1);
      // return;
    } else {
      if (key < 48 || key > 57) return false;
      if (len === 4 || len === 9 || len === 14) el.value = el.value + ' ';
    }
  })
  $('#cc-exp').on('keydown', e => {
    let el = $('#cc-exp')[0];
    let key = e.keyCode;
    let len = el.value.length;
    if (key === 8) {
      if (el.value.substring(el.value.length - 2, el.value.length - 1) === '/') el.value = el.value.substring(0, el.value.length - 1);
    } else {
      if (key < 48 || key > 57) return false;
      if (len === 2) el.value = el.value + '/';
    }
  })
})