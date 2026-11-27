/* Subpáginas: muestra las imágenes y marca las que aún no existen */
document.querySelectorAll('.img').forEach(function(f){ f.classList.add('in'); });
document.querySelectorAll('.img img').forEach(function(im){
  function vacia(){ im.parentNode.classList.add('vacia'); }
  im.addEventListener('error', vacia);
  if(im.complete && im.naturalWidth === 0) vacia();
});