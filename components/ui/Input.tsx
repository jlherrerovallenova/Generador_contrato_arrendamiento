import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className, ...props }) => {
  return (
    <div className={`mb-4 ${className || ''}`}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 transition-colors
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200 bg-white'
          }
          ${props.disabled ? 'bg-slate-100 text-slate-500' : ''}
        `}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    error?: string;
  }
  
  export const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          {...props}
          className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 transition-colors
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
            }
          `}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  };