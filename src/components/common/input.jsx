export default function Input({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  required = false,
  name
}) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
      />
    </div>
  );
}