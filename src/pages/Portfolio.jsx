import { projects } from '../data/portfolio'

export default function Portfolio() {
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
    </div>
  )
}
