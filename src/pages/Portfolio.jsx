import { useState } from 'react'
import { projects } from '../data/portfolio'
import Lightbox from '../components/Lightbox'

export default function Portfolio() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <div className="page-content">
      {projects.map((project) => (
        <section key={project.title}>
          <h2>{project.title}</h2>
          <div className={`gallery gallery-${project.columns}`}>
            {project.images.map((img, i) => (
              <figure key={i}>
                <img
                  src={`/images/${img.src}`}
                  alt={img.caption || project.title}
                  loading="lazy"
                  onClick={() => setLightbox({ src: `/images/${img.src}`, alt: img.caption || project.title })}
                />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
          {project.caption && (
            <p className="gallery-caption">{project.caption}</p>
          )}
        </section>
      ))}
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </div>
  )
}
