import styles from './VariantSelector.module.css'

// Derives unique ordered sizes preserving first-seen order from variants array.
function uniqueOrdered(arr) {
  return [...new Set(arr)]
}

export default function VariantSelector({ variants, selectedVariantId, onSelect }) {
  const sizes = uniqueOrdered(variants.map((v) => v.size))
  const colors = uniqueOrdered(variants.map((v) => v.color))

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null
  const selectedSize = selectedVariant?.size ?? null
  const selectedColor = selectedVariant?.color ?? null

  function findVariant(size, color) {
    return variants.find((v) => v.size === size && v.color === color) ?? null
  }

  function handleSizeClick(size) {
    // If clicking the already-selected size, deselect
    if (size === selectedSize) {
      onSelect(null)
      return
    }
    // Try to preserve the current color with the new size
    if (selectedColor) {
      const combo = findVariant(size, selectedColor)
      if (combo) { onSelect(combo.id); return }
    }
    // Fall back to first available variant of this size
    const first = variants.find((v) => v.size === size && v.available)
    onSelect(first ? first.id : null)
  }

  function handleColorClick(color) {
    if (color === selectedColor) {
      onSelect(null)
      return
    }
    if (selectedSize) {
      const combo = findVariant(selectedSize, color)
      if (combo) { onSelect(combo.id); return }
    }
    const first = variants.find((v) => v.color === color && v.available)
    onSelect(first ? first.id : null)
  }

  function isSizeDisabled(size) {
    // Disabled only when ALL variants of this size are unavailable
    return variants.filter((v) => v.size === size).every((v) => !v.available)
  }

  function isColorDisabled(color) {
    if (selectedSize) {
      // With a size picked: this exact combo must be available
      const combo = findVariant(selectedSize, color)
      return !combo || !combo.available
    }
    // No size picked: disabled only if ALL variants of this color are unavailable
    return variants.filter((v) => v.color === color).every((v) => !v.available)
  }

  const multipleColors = colors.length > 1

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <p className={styles.label}>
          Size{selectedSize ? <span className={styles.selected}>&ensp;{selectedSize}</span> : null}
        </p>
        <div className={styles.options} role="group" aria-label="Select size">
          {sizes.map((size) => {
            const disabled = isSizeDisabled(size)
            const active = size === selectedSize
            return (
              <button
                key={size}
                className={[
                  styles.sizeBtn,
                  active ? styles.btnActive : '',
                  disabled ? styles.btnDisabled : '',
                ].join(' ')}
                onClick={() => !disabled && handleSizeClick(size)}
                disabled={disabled}
                aria-pressed={active}
                aria-label={`Size ${size}${disabled ? ', sold out' : ''}`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {multipleColors && (
        <div className={styles.group}>
          <p className={styles.label}>
            Color{selectedColor ? <span className={styles.selected}>&ensp;{selectedColor}</span> : null}
          </p>
          <div className={styles.options} role="group" aria-label="Select color">
            {colors.map((color) => {
              const disabled = isColorDisabled(color)
              const active = color === selectedColor
              return (
                <button
                  key={color}
                  className={[
                    styles.colorBtn,
                    active ? styles.btnActive : '',
                    disabled ? styles.btnDisabled : '',
                  ].join(' ')}
                  onClick={() => !disabled && handleColorClick(color)}
                  disabled={disabled}
                  aria-pressed={active}
                  aria-label={`Color ${color}${disabled ? ', sold out' : ''}`}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!multipleColors && selectedVariant && !selectedVariant.available && (
        <p className={styles.unavailableNote}>This combination is sold out.</p>
      )}
    </div>
  )
}
