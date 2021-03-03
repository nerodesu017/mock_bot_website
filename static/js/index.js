function align(selector){
    let el = document.querySelector(selector)
    if(el instanceof Array)el=el[0];
    let width = el.offsetWidth;
    let height = el.offsetHeight;
    console.log(width + ' ' + height);
}

document.addEventListener('DOMContentLoaded', event => {
    align('.product');
})