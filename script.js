(function () {
    var themes = [
      { label: 'White Coast', hex: '#ffffff', rgb: '255,255,255', logo: 'img/icon-white.png', background: 'img/backgrounds/coast.jpg' },
      { label: 'Plutonium Pink Burst', hex: '#e8175d', rgb: '232,23,93', logo: 'img/icon-plutonium-pink.png', background: 'img/backgrounds/color-burst.jpg' },
      { label: 'White Desert', hex: '#ffffff', rgb: '255,255,255', logo: 'img/icon-white.png', background: 'img/backgrounds/desert.jpg' },
      { label: 'White Galaxy', hex: '#ffffff', rgb: '255,255,255', logo: 'img/icon-white.png', background: 'img/backgrounds/galaxy.jpg' },
      { label: 'Blue Lake Dusk', hex: '#3c5085', rgb: '60,80,133', logo: 'img/icon-blue.png', background: 'img/backgrounds/lake-dusk.jpg' },
      { label: 'Purple Lake Twilight', hex: '#7c3aed', rgb: '124,58,237', logo: 'img/icon-violet.png', background: 'img/backgrounds/lake-twilight.jpg' },
      { label: 'Emerald Light Stream', hex: '#059669', rgb: '5,150,105', logo: 'img/icon-emerald.png', background: 'img/backgrounds/light-stream.jpg' },
      { label: 'White Lightning', hex: '#ffffff', rgb: '255,255,255', logo: 'img/icon-white.png', background: 'img/backgrounds/lightning.jpg' },
      { label: 'Pink Lines', hex: '#e8175d', rgb: '232,23,93', logo: 'img/icon-plutonium-pink.png', background: 'img/backgrounds/lines.png' },
      { label: 'Blue Mojave', hex: '#3c5085', rgb: '60,80,133', logo: 'img/icon-blue.png', background: 'img/backgrounds/mojave.jpg' },
      { label: 'Green Refraction', hex: '#059669', rgb: '5,150,105', logo: 'img/icon-emerald.png', background: 'img/backgrounds/refraction-green.png' },
      { label: 'Purple Refraction', hex: '#7c3aed', rgb: '124,58,237', logo: 'img/icon-violet.png', background: 'img/backgrounds/refraction-purple.png' },
      { label: 'Red Swirls', hex: '#dc2626', rgb: '220,38,38', logo: 'img/icon-red.png', background: 'img/backgrounds/swirls.png' }
    ];
    var slot = document.getElementById('hero-logo-slot');
    var img = document.getElementById('hero-logo');
    var wall = document.getElementById('bg-wall');
    var tint = document.getElementById('bg-tint');
    var canvas = document.getElementById('bg-canvas');
    var pixelLayer = document.getElementById('theme-pixels');
    var index = 0;
    var pixelGridSize = 16;
    var pixelCount = pixelGridSize * pixelGridSize;
    var pixelStepDuration = 900;
    var pixels = [];

    for (var p = 0; p < pixelCount; p++) {
      var pixel = document.createElement('div');
      pixel.className = 'theme-pixel';
      pixels.push(pixel);
      pixelLayer.appendChild(pixel);
    }

    function resizePixels() {
      var size = 100 / pixelGridSize;
      pixels.forEach(function (pixel, i) {
        var row = Math.floor(i / pixelGridSize);
        var col = i % pixelGridSize;
        pixel.style.width = size + '%';
        pixel.style.height = size + '%';
        pixel.style.left = col * size + '%';
        pixel.style.top = row * size + '%';
      });
    }

    function shufflePixels() {
      for (var i = pixels.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = pixels[i]; pixels[i] = pixels[j]; pixels[j] = temp;
      }
    }

    function pixelTransition(theme, done) {
      var color = theme.hex === '#ffffff' ? '#ffffff' : theme.hex;
      pixelLayer.style.display = 'block';
      pixels.forEach(function (pixel) {
        pixel.style.backgroundColor = 'color-mix(in srgb, ' + color + ' 50%, transparent)';
        pixel.style.display = 'none';
      });
      shufflePixels();
      pixels.forEach(function (pixel, i) {
        setTimeout(function () { pixel.style.display = 'block'; }, i * (pixelStepDuration / pixelCount));
        setTimeout(function () { pixel.style.display = 'none'; }, pixelStepDuration + i * (pixelStepDuration / pixelCount));
      });
      setTimeout(function () {
        done();
        setTimeout(function () { pixelLayer.style.display = 'none'; }, pixelStepDuration);
      }, pixelStepDuration);
    }

    resizePixels();
    window.addEventListener('resize', resizePixels);

    function applyTheme(theme) {
      document.documentElement.style.setProperty('--pink', theme.hex);
      document.documentElement.style.setProperty('--pink-rgb', theme.rgb);
      document.documentElement.style.setProperty('--pink-muted', theme.hex);
      document.documentElement.style.setProperty('--pink-soft', theme.hex);
      document.documentElement.style.setProperty('--accent-rgb', theme.rgb);
      document.documentElement.classList.toggle('light-theme', theme.hex === '#ffffff');
      slot.classList.add('fading');
      wall.classList.remove('show');
      tint.classList.remove('show');
      pixelTransition(theme, function () {
        img.src = theme.logo;
        img.alt = theme.label + ' Plutonium Network logo';
        wall.style.backgroundImage = 'url("' + theme.background + '")';
        wall.classList.add('show');
        tint.classList.add('show');
        if (canvas) canvas.style.opacity = 0;
        slot.classList.remove('fading');
      });
    }

    applyTheme(themes[0]);
    setInterval(function () {
      index = (index + 1) % themes.length;
      applyTheme(themes[index]);
    }, 10000);
  })();

  function fbAvatar(img, icon) {
    img.onerror = null;
    img.style.background = 'linear-gradient(135deg,#e8175d,#971040)';
    img.removeAttribute('src');
    img.innerHTML = '<i class="fa-solid ' + icon + '"></i>';
  }
  (function () {
    var c = document.getElementById('bg-canvas');
    var ctx = c.getContext('2d');
    var w, h, particles = [], raf;
    function accent() {
      var value = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
      return value ? value.split(',').map(Number) : [232, 23, 93];
    }

    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      var count = Math.min(90, Math.floor(w * h / 24000));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.8 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          o: 0.15 + Math.random() * 0.5
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        var color = accent();
        ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + p.o + ')';
        ctx.fill();
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            var lineColor = accent();
            ctx.strokeStyle = 'rgba(' + lineColor[0] + ',' + lineColor[1] + ',' + lineColor[2] + ',' + (0.10 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  })();

  (function () {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  })();