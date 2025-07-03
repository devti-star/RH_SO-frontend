import type { Atestado } from "../../models/atestados";

export async function solicitarExameMedico(atestado: Atestado) {
  await fetch("/api/solicitar-exame-medico", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ atestadoId: atestado.id }),
  });
}
