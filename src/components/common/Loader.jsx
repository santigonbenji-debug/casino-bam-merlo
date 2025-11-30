export default function Loader({ message = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
}