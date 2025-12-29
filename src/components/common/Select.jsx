import { forwardRef, useState } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      required = false,
      placeholder = 'Select an option',
      className = '',
      containerClassName = '',
      value,
      onChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue) => {
      onChange?.({ target: { value: optionValue } });
      setIsOpen(false);
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {label}
            {required && <span className="text-danger-600 dark:text-danger-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <button
            ref={ref}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`
              w-full rounded-lg border px-3 py-2 text-sm text-left
              flex items-center justify-between
              transition-all duration-200
              ${error
                ? 'border-danger-300 dark:border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
              }
              ${disabled ? 'bg-gray-50 dark:bg-slate-900 cursor-not-allowed' : 'bg-white dark:bg-slate-800 cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
              ${className}
            `}
            {...props}
          >
            <span className={selectedOption ? 'text-gray-900 dark:text-slate-100' : 'text-gray-400 dark:text-slate-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 dark:text-slate-500 transition-transform ${isOpen ? 'transform rotate-180' : ''
                }`}
            />
          </button>

          {isOpen && !disabled && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 max-h-60 overflow-auto">
                {options.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-slate-400">No options available</div>
                ) : (
                  options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`
                        w-full text-left px-3 py-2 text-sm
                        flex items-center justify-between
                        transition-colors
                        ${option.value === value
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'text-gray-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      <span>{option.label}</span>
                      {option.value === value && (
                        <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-1 flex items-center gap-1 text-sm text-danger-600 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

