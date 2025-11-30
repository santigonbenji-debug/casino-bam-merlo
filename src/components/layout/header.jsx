export default function Header({ title, subtitle }) {
  return (
    <div className="text-center mb-8 pb-6 border-b-2 border-gray-100">
      <div className="flex justify-center mb-4">
        <img 
          src="/escudo-bam-merlo.jpg" 
          alt="Escudo BAM MERLO" 
          className="w-24 h-24 object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {title || "Sistema de Racionamiento"}
      </h1>
      <h2 className="text-lg font-semibold text-indigo-600">
        {subtitle || "Casino de Suboficiales BAM MERLO"}
      </h2>
    </div>
  );
}