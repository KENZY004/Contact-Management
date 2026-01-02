import React from 'react';

const Input = ({
    label,
    error,
    type = 'text',
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                className={`
          w-full px-4 py-3 rounded-lg border-2 
          ${error
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-slate-200 focus:border-primary-500'
                    }
          focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-200' : 'focus:ring-primary-200'}
          transition-all duration-200
          placeholder:text-slate-400
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
