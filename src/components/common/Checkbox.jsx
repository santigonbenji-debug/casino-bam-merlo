export default function Checkbox({ 
  label, 
  checked, 
  onChange,
  name
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
      />
      {label && (
        <label className="text-sm font-medium text-gray-700 cursor-pointer" onClick={onChange}>
          {label}
        </label>
      )}
    </div>
  );
}