import { sections } from '../data/drawings'

export default function Drawings() {
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
                    style={gallery.centered ? { maxWidth: '100%', margin: '0 auto', display: 'block' } : {}}
                  />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ))}
          <p>{section.text}</p>
        </section>
      ))}
    </div>
  )
}
