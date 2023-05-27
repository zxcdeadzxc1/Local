let timer, n;
window.onload = () => slider((n = 0));
function slider() {
    let width = document.querySelector("#slider .slide").offsetWidth + 20;
    let count = document.querySelectorAll("#slider .slide").length;
    count = 3;
    if (n >= count) n = 0;
    else if (n < 0) n = count - 1;
    document.querySelector("#slider .slides").style.left = `-${width * n
        }px`;
    clearTimeout(timer);
    timer = setTimeout(() => slider(++n), 3000);
}