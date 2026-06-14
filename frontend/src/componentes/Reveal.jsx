import useReveal from '../hooks/useReveal';

export default function Reveal({
  children,
  as = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  threshold,
  once = true,
  ...rest
}) {
  const [ref, shown] = useReveal({ threshold, once });
  const Tag = as;

  const style = delay ? { '--reveal-delay': `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant}${shown ? ' is-visible' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
