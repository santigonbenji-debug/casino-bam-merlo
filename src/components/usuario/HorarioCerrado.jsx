export default function HorarioCerrado({ tipo = 'almuerzo' }) {
  const mensaje = tipo === 'almuerzo' 
    ? 'El horario para anotarse al almuerzo finalizó a las 10:00 AM'
    : 'El horario para anotarse a la cena finalizó a las 16:00 hs';

  return (
    <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg mb-6">
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        ⏰ Horario de anotación cerrado
      </h3>
      <p className="mb-4">{mensaje}</p>
      <p className="text-sm bg-white/20 inline-block px-4 py-2 rounded-lg">
        Para consultar disponibilidad, llamá al turno casino: <strong>📞 Interno 64107/64239</strong>
      </p>
    </div>
  );
}