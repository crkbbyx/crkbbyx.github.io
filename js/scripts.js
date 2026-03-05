/* Fuzzy Robotics — PTSD: Terminal 01 site */
window.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    if (header) {
        function onScroll() {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
});
