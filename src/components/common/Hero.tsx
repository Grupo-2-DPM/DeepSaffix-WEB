export const Hero = () => {
  const content = {
    title: "DeepSaffix",
    subtitle: "Herramienta Especializada para el simulacro de las pruebas Saber Pro",
    cta: "Ver Proyectos",
    secondaryCta: "Saber más"
  };

  return (
    <section className="flex flex-col items-start justify-center text-left py-20 px-8 bg-slate-900 text-white border-b border-slate-800">
      <h1 className="text-4xl md:text-5xl font-bold max-w-4xl leading-tight text-white">
        {content.title}
      </h1>

      <p className="mt-6 text-lg text-slate-300 max-w-2xl">
        {content.subtitle}
      </p>

      <div className="mt-10 flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition">
          {content.cta}
        </button>

        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-md font-medium transition">
          {content.secondaryCta}
        </button>
      </div>
    </section>

  );
};