import React from "react";
import { useSimulacros } from "../hooks/useSimulacros";
import { useIntentosUsuario } from "../hooks/useIntentosUsuario";
import DisponiblesList from "./DisponiblesList";
import RecentAttemptsList from "./RecentAttemptsList";

export const SimulationPanel: React.FC = () => {
  const { disponibles } = useSimulacros();
  const { realizados } = useIntentosUsuario();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <RecentAttemptsList realizados={realizados} />
      <DisponiblesList
        disponibles={disponibles}
        onEdit={() => {}}
        onRefresh={() => {}}
      />
    </div>
  );
};
