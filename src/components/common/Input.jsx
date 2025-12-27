import { forwardRef, useState } from 'react';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      required = false,
      leftIcon,
      rightIcon,
      clearable = false,
      className = '',
      containerClassName = '',
      onClear,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      if (props.onChange) {
        props.onChange({ target: { value: '' } });
      }
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-danger-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={`
              w-full rounded-lg border px-3 py-2 text-sm
              transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || type === 'password' || clearable ? 'pr-10' : ''}
              ${
                error
                  ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                  : isFocused
                  ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20'
                  : 'border-gray-300 hover:border-gray-400'
              }
              ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              focus:outline-none
              placeholder:text-gray-400
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {clearable && props.value && !props.disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {rightIcon && !type === 'password' && !clearable && (
              <div className="text-gray-400">{rightIcon}</div>
            )}
          </div>
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

Input.displayName = 'Input';

export default Input;

