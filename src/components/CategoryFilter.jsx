import styles from './CategoryFilter.module.css'

export default function CategoryFilter({ categories, activeSlug, onChange }) {
  return (
    <nav className={styles.filter} aria-label="Category filter">
      <button
        className={[styles.btn, !activeSlug ? styles.btnActive : ''].join(' ')}
        onClick={() => onChange(null)}
        aria-pressed={!activeSlug}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={[styles.btn, activeSlug === cat.slug ? styles.btnActive : ''].join(' ')}
          onClick={() => onChange(cat.slug)}
          aria-pressed={activeSlug === cat.slug}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  )
}
