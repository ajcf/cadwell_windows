import { useState } from 'react'
import Lightbox from '../components/Lightbox'

export default function About() {
  const [lightbox, setLightbox] = useState(null)

  const openLightbox = (src, alt) => setLightbox({ src, alt })

  return (
    <div className="page-content">
      <figure className="centered-figure">
        <img
          src="/images/IMG_2099.jpg"
          alt="Jack Cadwell in his shop"
          loading="lazy"
          style={{ maxWidth: '480px', width: '100%', cursor: 'zoom-in' }}
          onClick={() => openLightbox('/images/IMG_2099.jpg', 'Jack Cadwell in his shop')}
        />
        <figcaption>Jack Cadwell in his shop located in Warwick MA</figcaption>
      </figure>

      <p>
        Jack Cadwell began his career as a woodworker in 1985 and currently
        works out of his Warwick Massachusetts shop. Specializing in period
        appropriate windows, doors, entrances and other parts for historic and
        new buildings, clients of Jack Cadwell include many historical sites
        and private residences.
      </p>

      <p>
        Jack Cadwell&#8217;s shop is outfitted with proper machinery and tools
        to ensure high quality finished products. Although handwork is important
        for final fit and finish, creating true, accurate and to drawing pieces
        is achieved by use of properly adjusted and maintained machinery.
      </p>

      <div className="gallery gallery-2">
        <figure>
          <img src="/images/IMG_3351-1024x768.jpg" alt="Custom blade in shaper" loading="lazy"
            onClick={() => openLightbox('/images/IMG_3351-1024x768.jpg', 'Custom blade in shaper')} />
          <figcaption>Custom blade in shaper.</figcaption>
        </figure>
        <figure>
          <img src="/images/knives_sm-1-rotated.jpg" alt="Custom knives" loading="lazy"
            onClick={() => openLightbox('/images/knives_sm-1-rotated.jpg', 'Custom knives')} />
          <figcaption>Custom knives are made for individual jobs.</figcaption>
        </figure>
      </div>

      <div className="gallery gallery-2">
        <figure>
          <img src="/images/planer.jpg" alt="Planer" loading="lazy"
            onClick={() => openLightbox('/images/planer.jpg', 'Planer')} />
          <figcaption>Planer</figcaption>
        </figure>
        <figure>
          <img src="/images/jointer.jpg" alt="Jointer" loading="lazy"
            onClick={() => openLightbox('/images/jointer.jpg', 'Jointer')} />
          <figcaption>Jointer</figcaption>
        </figure>
      </div>

      <div className="gallery gallery-1">
        <figure>
          <img src="/images/back-1.jpg" alt="Tenoner" loading="lazy"
            onClick={() => openLightbox('/images/back-1.jpg', 'Tenoner')} />
          <figcaption>Tenoner</figcaption>
        </figure>
      </div>

      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </div>
  )
}
