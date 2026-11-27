/* ===== COMPONENTE: Wind Stream Cursor =====
   Origen: "Wind Stream Cursor" de felix-au (@delego) en 21st.dev, licencia MIT.
   https://21st.dev/@felix-au/components/wind-stream-cursor
   Adaptación propia: el original es un componente de React. Aquí se reescribió la idea en
   JavaScript sin framework, con canvas: corrientes curvas que siguen al cursor, se engrosan
   sobre enlaces y botones, y estallan en una ráfaga de colores al hacer clic. Los colores son
   los de mi paleta (rosa, pistacho, celeste). Solo se activa con mouse y sin "reducir movimiento". */
(function(){
  if(!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var c = document.createElement('canvas');
  c.className = 'rastro';
  c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  var ctx = c.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
  function ajustar(){
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ajustar();
  window.addEventListener('resize', ajustar);

  var COLORES = ['#E7A6B5', '#B8D58A', '#8EC9DC'];
  var MAX = 24, puntos = [], rafagas = [], movido = false, grosor = 1, objetivo = 1;

  window.addEventListener('mousemove', function(e){
    puntos.push({x: e.clientX, y: e.clientY});
    if(puntos.length > MAX) puntos.shift();
    movido = true;
    objetivo = (e.target.closest && e.target.closest('a, button')) ? 2.2 : 1;
  }, {passive: true});

  window.addEventListener('click', function(e){
    rafagas.push({x: e.clientX, y: e.clientY, t: performance.now()});
  });

  function corriente(desfase, color){
    var n = puntos.length;
    if(n < 3) return;
    ctx.strokeStyle = color; ctx.lineCap = 'round';
    for(var i = 1; i < n - 1; i++){
      var a = puntos[i], b = puntos[i + 1];
      ctx.lineWidth = (i / n) * 7 * grosor;
      ctx.globalAlpha = 0.35 + 0.55 * (i / n);
      ctx.beginPath();
      ctx.moveTo((puntos[i - 1].x + a.x) / 2, (puntos[i - 1].y + a.y) / 2 + desfase);
      ctx.quadraticCurveTo(a.x, a.y + desfase, (a.x + b.x) / 2, (b.y + a.y) / 2 + desfase);
      ctx.stroke();
    }
  }

  function dibujar(ahora){
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if(!movido && puntos.length) puntos.shift();   // la estela se apaga al detener el cursor
    movido = false;
    grosor += (objetivo - grosor) * 0.15;
    COLORES.forEach(function(col, k){ corriente((k - 1) * 7 * grosor, col); });

    rafagas = rafagas.filter(function(r){ return ahora - r.t < 600; });
    rafagas.forEach(function(r){
      var p = (ahora - r.t) / 600;
      ctx.globalAlpha = 1 - p; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for(var i = 0; i < 12; i++){
        var ang = i * Math.PI / 6, d0 = 12 + 20 * p, d1 = 24 + 70 * p;
        ctx.strokeStyle = COLORES[i % 3];
        ctx.beginPath();
        ctx.moveTo(r.x + Math.cos(ang) * d0, r.y + Math.sin(ang) * d0);
        ctx.lineTo(r.x + Math.cos(ang) * d1, r.y + Math.sin(ang) * d1);
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(dibujar);
  }
  requestAnimationFrame(dibujar);
})();