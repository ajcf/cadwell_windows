import { useState } from 'react'
import { sections } from '../data/drawings'
import Lightbox from '../components/Lightbox'

export default function Drawings() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <div className="page-content">
      {sections.map((section) => (
        <section key={section.title}>
          <h4>{section.title}</h4>
          {section.galleries.map((gallery, gi) => (
            <div key={gi} className={`gallery gallery-${gallery.columns}`}>
              {gallery.images.map((img, i) => (
                <figure key={i}>
                  <img
                    src={`/images/${img.src}`}
                    alt={img.caption || section.title}
                    loading="lazy"
                    className={gallery.centered ? 'img-full' : undefined}
                    onClick={() => setLightbox({ src: `/images/${img.src}`, alt: img.caption || section.title })}
                  />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ))}
          <p>{section.text}</p>
        </section>
      ))}
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </div>
  )
}
