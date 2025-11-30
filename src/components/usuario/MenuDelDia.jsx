export default function MenuDelDia({ menuAlmuerzo, menuCena, costo }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🍽️ Menú del Día
      </h3>
      
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-indigo-100">Almuerzo:</p>
          <p className="text-white">{menuAlmuerzo}</p>
        </div>
        
        <div>
          <p className="font-semibold text-indigo-100">Cena:</p>
          <p className="text-white">{menuCena}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <span className="inline-block bg-white/20 px-4 py-2 rounded-full font-bold">
            💵 Costo: ${costo} por plato
          </span>
        </div>
      </div>
    </div>
  );
}