export const SimulationPanel = () => {
  return (
    <div className="grow p-6 bg-white shadow-md border border-blue-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Panel de Simulación</h3>
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-2/3 animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-600 italic">Ejecutando algoritmos de prueba...</p>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Reiniciar Simulación
        </button>
      </div>
    </div>
  );
};