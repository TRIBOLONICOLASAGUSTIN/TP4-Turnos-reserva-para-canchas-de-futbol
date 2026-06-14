import { useState, useRef, useEffect } from 'react';
import '../estilos/custom-select.css';

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Seleccioná una opción',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    function handleOut(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  function toggle(e) {
    e.stopPropagation();
    if (!disabled) setOpen((o) => !o);
  }

  function pick(val, e) {
    e.stopPropagation();
    onChange(val);
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className={`csel${open ? ' csel--open' : ''}${disabled ? ' csel--disabled' : ''}`}
    >
      <button type="button" className="csel-trigger" onClick={toggle} disabled={disabled}>
        <span className={selected ? 'csel-label' : 'csel-placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className="csel-chevron" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="csel-dropdown">
        <div className="csel-list">
          {options.length === 0 ? (
            <p className="csel-empty">Sin opciones disponibles</p>
          ) : (
            options.map((opt) => {
              const isActive = String(opt.value) === String(value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`csel-option${isActive ? ' csel-option--active' : ''}`}
                  onClick={(e) => pick(String(opt.value), e)}
                >
                  <span>{opt.label}</span>
                  {isActive && (
                    <svg className="csel-check" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 10.5l4.5 4.5L16 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
