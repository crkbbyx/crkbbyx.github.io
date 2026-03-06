/* Fuzzy Robotics — hero fire sparks */
(function () {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;

    var hero = canvas.closest('.hero');
    if (!hero) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var animationId = null;
    var colors = [
        '255, 160, 60',   /* bright orange */
        '255, 220, 100',  /* gold */
        '255, 100, 50',   /* red-orange */
        '255, 240, 150'   /* bright yellow */
    ];

    function setSize() {
        var rect = hero.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    }

    function spawnSpark(rect, y) {
        return {
            x: Math.random() * rect.width,
            y: y !== undefined ? y : rect.height * (0.3 + Math.random() * 0.7),
            vx: (Math.random() - 0.5) * 1,
            vy: -(2.2 + Math.random() * 2.8),
            size: Math.random() * 2.2 + 0.7,
            baseSize: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: 0.006 + Math.random() * 0.006
        };
    }

    function createParticles() {
        var rect = hero.getBoundingClientRect();
        var count = Math.min(220, Math.floor((rect.width * rect.height) / 3500));
        particles = [];
        for (var i = 0; i < count; i++) {
            var p = spawnSpark(rect);
            p.baseSize = p.size;
            p.y = Math.random() * rect.height;
            p.life = Math.random();
            particles.push(p);
        }
    }

    function draw() {
        var rect = hero.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            animationId = requestAnimationFrame(draw);
            return;
        }

        ctx.clearRect(0, 0, rect.width, rect.height);

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx += (Math.random() - 0.5) * 0.15;
            p.vx = Math.max(-1.2, Math.min(1.2, p.vx));
            p.life -= p.decay;

            if (p.life <= 0 || p.y < -10) {
                particles[i] = spawnSpark(rect, rect.height + 5);
                particles[i].baseSize = particles[i].size;
                continue;
            }

            var alpha = p.life * 0.95;
            var size = p.baseSize * p.life;
            if (size < 0.25) size = 0.25;

            /* Brighter at bottom (fire base) */
            var bottomFactor = p.y / rect.height;
            if (bottomFactor > 0.5) {
                var boost = 0.3 + 0.4 * (bottomFactor - 0.5) * 2;
                alpha = Math.min(1, alpha * (1 + boost));
            }
            var glowBlur = size * (4 + (bottomFactor > 0.5 ? 3 * (bottomFactor - 0.5) * 2 : 0));

            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.color + ',' + alpha + ')';
            ctx.shadowColor = 'rgba(' + p.color + ',0.9)';
            ctx.shadowBlur = glowBlur;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        animationId = requestAnimationFrame(draw);
    }

    function init() {
        setSize();
        createParticles();
        draw();
    }

    window.addEventListener('resize', function () {
        setSize();
        createParticles();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
