const Card = ({
  children,
  title,
  header,
  footer,
  image,
  imageAlt,
  imageAspect = '16/9',
  className = '',
  bodyClassName = '',
  hoverable = false,
  onClick,
}) => {
  const isClickable = !!onClick || hoverable;
  const displayHeader = title || header;

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm
        ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {image && (
        <div
          className="w-full overflow-hidden rounded-t-lg"
          style={{ aspectRatio: imageAspect }}
        >
          <img
            src={image}
            alt={imageAlt || 'Card image'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {displayHeader && (
        <div className="px-6 py-4 border-b border-gray-200">
          {typeof displayHeader === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-900">{displayHeader}</h3>
          ) : (
            displayHeader
          )}
        </div>
      )}

      <div className={`px-6 py-4 ${bodyClassName}`}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardGrid = ({ children, cols = 3, gap = 6, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

