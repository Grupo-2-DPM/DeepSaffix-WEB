export const Hero = () => {
  const content = {
    title: "Construye tu futuro con software de calidad",
    subtitle: "Diseñamos y desarrollamos soluciones web escalables con rigor de ingeniería y diseño moderno.",
    cta: "Ver Proyectos",
    secondaryCta: "Saber más"
  };

  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-linear-to-b from-blue-50 to-white">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 max-w-4xl leading-tight">
        {content.title}
      </h1>
      <p className="mt-6 text-xl text-gray-600 max-w-2xl">
        {content.subtitle}
      </p>
      <div className="mt-10 flex gap-4">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-blue-200 transition-all">
          {content.cta}
        </button>
        <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all">
          {content.secondaryCta}
        </button>
      </div>
    </section>
  );
};