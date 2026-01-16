document.addEventListener('DOMContentLoaded', () => {
  const mediaSection = document.getElementById('midia');
  if (!mediaSection) return;

  const sourceWrapper = mediaSection.querySelector('.custom p');
  if (!sourceWrapper) return;

  const images = Array.from(sourceWrapper.querySelectorAll('img'));
  if (!images.length) return;

  // Cria estrutura do marquee
  const marquee = document.createElement('div');
  marquee.className = 'media-marquee';

  const track = document.createElement('div');
  track.className = 'marquee-track';

  images.forEach(img => {
    const clone = img.cloneNode(true);
    clone.removeAttribute('width');
    clone.removeAttribute('height');
    track.appendChild(clone);
  });

  // Duplica para loop infinito
  track.innerHTML += track.innerHTML;

  marquee.appendChild(track);

  // Substitui conteúdo original
  sourceWrapper.replaceWith(marquee);

  // Velocidade do movimento
  track.style.animationDuration = '30s';
});

