export default function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary",
  className = "",
  disabled = false 
}) {
  const baseStyles = "w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}