import assert from "node:assert/strict";
import test from "node:test";

import { parseLiveResponse, type LiveArgument } from "./response-schema.ts";

// Contrato do parser do Persona Live (achados A-1, A-7 e L-1): o excerto precisa ser trecho íntegro e fiel do campo citado.
const ID = "11111111-1111-1111-1111-111111111111";
const evidence = (field: LiveArgument["source_field"], value: string | string[]) => {
  const base = { id: ID, title: "Título", context: "Contexto", action: "Ação", result: null as string | null, learning: null as string | null, competencies: ["Comunicação"] };
  return field === "competencies" ? { ...base, competencies: value as string[] } : { ...base, [field]: value as string };
};
const parse = (field: LiveArgument["source_field"], source: string | string[], excerpt: string) => {
  const evidences = [evidence(field, source)];
  const raw = JSON.stringify({ intent: "behavioral", supported: true, primary_evidence_id: ID, draft: "rascunho", target_duration_seconds: 30, gap: null,
    arguments: [{ text: "argumento", evidence_id: ID, source_field: field, source_excerpt: excerpt }] });
  return parseLiveResponse(raw, evidences);
};
const accepted = (source: string, excerpt: string, field: LiveArgument["source_field"] = "result") => assert.equal(parse(field, source, excerpt).supported, true, `deveria aceitar «${excerpt}» de «${source}»`);
const rejected = (source: string | string[], excerpt: string, field: LiveArgument["source_field"] = "result") => assert.throws(() => parse(field, source, excerpt), /invalid_output/, `deveria rejeitar «${excerpt}» de «${source}»`);

test("A-1: excerto vazio, só espaços, invisível ou só pontuação é rejeitado", () => {
  for (const excerpt of ["", "  ", "\t\n", "​​", "..", " - ", "…"]) rejected("Reduzi o trabalho manual", excerpt);
  accepted("Reduzi o trabalho manual", "  Reduzi o trabalho manual  "); // espaços nas pontas continuam sendo aparados
});

test("A-7: excerto não corta número nem palavra", () => {
  rejected("Reduzi o trabalho manual em 30%", "Reduzi o trabalho manual em 3");
  rejected("Reduzi o trabalho manual em 30%", "Reduzi o trabalho manual em 30");
  rejected("Atendi 1.000 clientes", "Atendi 1");
  rejected("Atendi 1.000 clientes", "000 clientes");
  rejected("Atendi 1,5 mil clientes", "Atendi 1");
  rejected("Reduzi o trabalho manual", "duzi o trabalho");
  rejected("Reduzi o trabalho manual", "Reduzi o trabalho man");
  for (const excerpt of ["Reduzi o trabalho manual em 30%", "trabalho manual em 30%"]) accepted("Reduzi o trabalho manual em 30%", excerpt);
  accepted("Atendi 1.000 clientes", "Atendi 1.000 clientes");
  accepted("Atendi 1.000 clientes", "1.000");
});

test("A-7: excerto não remove a negação que o precede na mesma oração", () => {
  rejected("Não reduzi o custo, nem liderei a equipe", "reduzi o custo");
  rejected("Nunca liderei a equipe", "liderei a equipe");
  rejected("Sem experiência, liderei a equipe", "experiência");
  accepted("Não reduzi o custo, nem liderei a equipe", "Não reduzi o custo");
  accepted("Não reduzi o custo, nem liderei a equipe", "nem liderei a equipe");
  accepted("Não liderei a equipe. Reduzi o custo em 10%", "Reduzi o custo em 10%"); // outra oração
});

test("A-7: competências são checadas uma a uma, sem cruzar duas", () => {
  rejected(["Liderança", "Dados"], "Liderança Dados", "competencies");
  assert.equal(parse("competencies", ["Liderança", "Dados"], "Dados").supported, true);
  assert.equal(parse("competencies", ["Liderança", "Dados"], "Liderança").supported, true);
});

test("L-1: afirmação verdadeira depois de vírgula, quebra de linha ou ponto final de oração continua aceita", () => {
  const faithful: [string, string][] = [
    ["Sem supervisão direta, estruturei o fluxo de atendimento", "estruturei o fluxo de atendimento"],
    ["Não havia processo definido, então criei um fluxo padrão", "criei um fluxo padrão"],
    ["Mesmo sem experiência prévia, liderei a equipe de 5 pessoas", "liderei a equipe de 5 pessoas"],
    ["Não só liderei o projeto, como também treinei o time", "como também treinei o time"],
    ["Nenhum curso me preparou, então aprendi Python sozinho", "aprendi Python sozinho"],
    ["Não concluí o plano B. Reduzi o custo em 10%", "Reduzi o custo em 10%"],
    ["Nem sempre havia dados, mas atingi 95% de acerto", "atingi 95% de acerto"],
    ["- Sem acesso ao CRM\n- Organizei a base manualmente", "Organizei a base manualmente"],
    ["Sem acesso ao CRM; organizei a base manualmente", "organizei a base manualmente"],
    ["Participei do projeto, liderei a entrega", "liderei a entrega"],
  ];
  for (const [source, excerpt] of faithful) accepted(source, excerpt);
});

test("L-1: limites conhecidos continuam rejeitando (falha fechada, registrados no ADR/contrato)", () => {
  rejected("Nunca perdi um prazo e entreguei 12 relatórios", "entreguei 12 relatórios"); // sem vírgula: negador na mesma oração
  rejected("Não lancei a versão v2.0 pelo cliente Acme", "pelo cliente Acme"); // "." entre dígitos não encerra oração
});
