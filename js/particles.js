/* Fuzzy Robotics — hero tech particles (canvas, no external deps) */
(function () {
    var canvas = document.getElementById('heroParticles');
    if (!canvas || canvas.getContext === undefined) return;

    var hero = canvas.closest('.hero');
    if (!hero) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var animationId = null;
    var mouse = { x: null, y: null };
    var linkDistance = 120;

    var colors = [
        [5, 217, 232],    /* neon-blue */
        [0, 212, 170],    /* accent teal */
        [255, 42, 109],   /* neon-pink */
        [157, 78, 221]    /* neon-purple */
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

    var attractStrength = 0.08;
    var attractRadius = 280;
    var damp = 0.96;

    function spawnParticle(rect) {
        return {
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            size: Math.random() * 1.5 + 0.8,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    function createParticles() {
        var rect = hero.getBoundingClientRect();
        var count = Math.min(80, Math.floor((rect.width * rect.height) / 3500));
        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push(spawnParticle(rect));
        }
    }

    function draw() {
        var rect = hero.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            animationId = requestAnimationFrame(draw);
            return;
        }

        ctx.clearRect(0, 0, rect.width, rect.height);

        /* Update positions: attract to mouse when over hero, else drift */
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            if (mouse.x != null && mouse.y != null) {
                var dx = mouse.x - p.x;
                var dy = mouse.y - p.y;
                var dist = Math.hypot(dx, dy) || 0.001;
                if (dist < attractRadius) {
                    var pull = (1 - dist / attractRadius) * attractStrength;
                    p.vx += (dx / dist) * pull;
                    p.vy += (dy / dist) * pull;
                }
            }

            p.vx *= damp;
            p.vy *= damp;
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) { p.x = 0; p.vx *= -0.6; }
            if (p.x > rect.width) { p.x = rect.width; p.vx *= -0.6; }
            if (p.y < 0) { p.y = 0; p.vy *= -0.6; }
            if (p.y > rect.height) { p.y = rect.height; p.vy *= -0.6; }
        }

        /* Draw links between nearby particles */
        ctx.lineWidth = 0.6;
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var a = particles[i];
                var b = particles[j];
                var dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < linkDistance) {
                    var alpha = (1 - dist / linkDistance) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = 'rgba(5, 217, 232,' + alpha + ')';
                    ctx.stroke();
                }
            }
        }

        /* Draw particles */
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',0.7)';
            ctx.shadowColor = 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',0.8)';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        animationId = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
        var rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
        mouse.x = null;
        mouse.y = null;
    }

    function init() {
        setSize();
        createParticles();
        hero.addEventListener('mousemove', onMouseMove);
        hero.addEventListener('mouseleave', onMouseLeave);
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
