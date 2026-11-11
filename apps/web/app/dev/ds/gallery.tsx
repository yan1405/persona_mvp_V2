"use client";

import { useState, type ReactNode } from "react";

import {
  AppHeader,
  AppShell,
  ArtifactCard,
  Avatar,
  Badge,
  Button,
  ButtonLink,
  Card,
  Chip,
  Count,
  DestinationGrid,
  DestinationTile,
  DimensionRow,
  EntryCard,
  EvidenceCard,
  FloatingPanel,
  FocalCard,
  FocalJourney,
  Icon,
  ICON_NAMES,
  IconButton,
  Input,
  JourneyStepper,
  Logo,
  NavItem,
  ProgressBar,
  ScoreRing,
  SectionIndex,
  Sidebar,
  StepFlow,
  Switch,
  TraceLine,
  STATUSES,
  type JourneyStep,
  type StatusKey,
  type TraceStep,
} from "@/components/ds";

import "./gallery.css";

// Exemplos genéricos: nenhum dado real, nenhuma chamada de rede.
const SECTIONS = [
  { id: "icones", label: "Ícones" },
  { id: "acoes", label: "Botões e ações" },
  { id: "selos", label: "Selos, chips e avatares" },
  { id: "campos", label: "Campos" },
  { id: "superficies", label: "Superfícies" },
  { id: "jornada", label: "Jornada e score" },
  { id: "rastro", label: "Rastreabilidade" },
  { id: "navegacao", label: "Navegação" },
  { id: "shell", label: "Shell" },
  { id: "sobreposicao", label: "Painel e fluxo" },
  { id: "cartoes", label: "Cartões" },
];

const JOURNEY: JourneyStep[] = [
  { label: "Primeira etapa", meta: "Concluída", state: "done" },
  { label: "Segunda etapa", meta: "Concluída", state: "done" },
  { label: "Etapa em andamento", meta: "Em andamento · 4 de 5", state: "active", icon: "badge-check" },
  { label: "Etapa seguinte", meta: "Bloqueada", state: "locked" },
  { label: "Etapa futura", state: "todo" },
];

const TRACE: TraceStep[] = [
  { kind: "registro", label: "Registro de exemplo", meta: "12 jan." },
  { kind: "sugestao", label: "Sugestão revisada" },
  { kind: "evidencia", label: "Evidência confirmada" },
  { kind: "prova", label: "Link de prova" },
  { kind: "uso", label: "Uso em artefato" },
];

function Spec({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="dxg__spec">
      <h3>{title}</h3>
      {note ? <p className="dxg__note">{note}</p> : null}
      {children}
    </section>
  );
}

function Group({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="dxg__group" aria-labelledby={id + "-h"}>
      <h2 id={id + "-h"}>{title}</h2>
      {children}
    </section>
  );
}

function ShellDemo({ frame, label }: { frame: "phone" | "tablet" | "desktop"; label: string }) {
  const [active, setActive] = useState<"inicio" | "diario" | "evidencias" | "live" | "artefatos" | "configuracoes">("inicio");
  const [q, setQ] = useState("");
  return (
    <Spec title={label}>
      <div className={"dxg__frame dxg__frame--" + frame}>
        <AppShell
          height={560}
          active={active}
          onNavigate={setActive}
          title="Início"
          searchValue={q}
          onSearchChange={setQ}
          onSearch={() => undefined}
          resume={{ title: "Registro de exemplo", meta: "2 sugestões para revisar" }}
          badges={{ diario: { count: 2, label: "2 sugestões para revisar" } }}
        >
          <div className="dxg__row dxg__row--top">
            <Card>Conteúdo de exemplo da tela</Card>
          </div>
        </AppShell>
      </div>
    </Spec>
  );
}

export function Gallery() {
  const [panelA, setPanelA] = useState(false);
  const [panelB, setPanelB] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sel, setSel] = useState(true);
  const [chip, setChip] = useState(true);
  const [step, setStep] = useState(2);

  return (
    <div className="dxg">
      <div className="dxg__inner">
        <aside className="dxg__aside">
          <SectionIndex items={SECTIONS} />
        </aside>
        <main className="dxg__main">
          <header>
            <h1 className="dxg__title">Design System · galeria</h1>
            <p className="dxg__lead">
              Todos os componentes e estados, com dados de exemplo. Rota de desenvolvimento: responde 404 em produção. Cada tela real tem no máximo um bloco escuro (FocalCard) e um botão de marca; esta página reúne vários só para
              mostrar as variantes.
            </p>
          </header>

          <Group id="icones" title="Ícones">
            <Spec title={ICON_NAMES.length + " glifos Lucide embutidos (traço 1,75, herdam a cor do texto)"}>
              <div className="dxg__grid dxg__grid--icons">
                {ICON_NAMES.map((n) => (
                  <span key={n} className="dxg__icon">
                    <Icon name={n} size={24} />
                    {n}
                  </span>
                ))}
              </div>
            </Spec>
            <Spec title="Logo">
              <div className="dxg__row">
                <Logo variant="lockup" height={40} />
                <Logo variant="mark" height={40} />
              </div>
            </Spec>
          </Group>

          <Group id="acoes" title="Botões e ações">
            <Spec title="Quatro níveis (marca, sólido, contorno, fantasma) e sobre bloco escuro">
              <div className="dxg__row">
                <Button variant="brand">Marca</Button>
                <Button variant="solid">Sólido</Button>
                <Button variant="outline">Contorno</Button>
                <Button variant="ghost">Fantasma</Button>
                <Button variant="solid" disabled>
                  Desativado
                </Button>
              </div>
              <div className="dxg__on-focal dxg__row">
                <Button variant="brand">Marca</Button>
                <Button variant="onFocal">Sobre escuro</Button>
              </div>
            </Spec>
            <Spec title="Tamanhos e ícones">
              <div className="dxg__row">
                <Button size="sm" icon="plus">
                  Pequeno
                </Button>
                <Button size="md" icon="plus">
                  Médio
                </Button>
                <Button size="lg" iconRight="arrow-right">
                  Grande
                </Button>
                <ButtonLink href="#acoes" variant="outline" icon="link">
                  Como link
                </ButtonLink>
              </div>
              <Button fullWidth variant="outline">
                Largura total
              </Button>
            </Spec>
            <Spec title="Botões de ícone (nome acessível obrigatório)">
              <div className="dxg__row">
                <IconButton icon="settings" label="Configurações" />
                <IconButton icon="bell" label="Avisos" variant="outline" badge={3} />
                <IconButton icon="sparkles" label="Sugestões" variant="soft" />
                <IconButton icon="plus" label="Adicionar" variant="solid" />
                <IconButton icon="send" label="Enviar" variant="brand" />
                <IconButton icon="bell" label="Avisos (novo)" variant="outline" dot />
                <IconButton icon="panel-left" label="Menu ativo" active />
                <IconButton icon="x" label="Desativado" disabled />
              </div>
            </Spec>
            <Spec title="Switch">
              <div className="dxg__row">
                <Switch label="Lembretes" defaultChecked />
                <Switch label="Desligado" />
                <Switch label="Desativado" disabled />
              </div>
            </Spec>
          </Group>

          <Group id="selos" title="Selos, chips e avatares">
            <Spec title="Tons">
              <div className="dxg__row">
                {(["neutral", "brand", "success", "warning", "danger", "info", "ink"] as const).map((t) => (
                  <Badge key={t} tone={t} dot>
                    {t}
                  </Badge>
                ))}
                <Count>3</Count>
                <Count tone="danger">12</Count>
                <Count tone="success">7</Count>
              </div>
            </Spec>
            <Spec title="Estados do produto (rótulo sempre visível, nunca só cor)">
              <div className="dxg__row">
                {(Object.keys(STATUSES) as StatusKey[]).map((s) => (
                  <Badge key={s} status={s} />
                ))}
              </div>
              <div className="dxg__row">
                {(Object.keys(STATUSES) as StatusKey[]).map((s) => (
                  <Chip key={s} status={s} />
                ))}
              </div>
            </Spec>
            <Spec title="Chips">
              <div className="dxg__row">
                <Chip>Rótulo</Chip>
                <Chip icon="sparkles" tone="brand">
                  Com ícone
                </Chip>
                <Chip size="sm">Pequeno</Chip>
                <Chip onClick={() => setChip(!chip)} selected={chip}>
                  Filtro (alterna)
                </Chip>
                <Chip onClick={() => undefined} selected={false}>
                  Filtro
                </Chip>
              </div>
            </Spec>
            <Spec title="Avatares">
              <div className="dxg__row">
                <Avatar name="Ana Souza" tone="indigo" />
                <Avatar name="Bruno Lima" tone="green" status="online" />
                <Avatar name="Carla Dias" tone="amber" size={56} status="away" />
                <Avatar name="Diego Reis" tone="rose" size={32} />
              </div>
            </Spec>
          </Group>

          <Group id="campos" title="Campos">
            <div className="dxg__grid">
              <Input label="Nome" placeholder="Como quer ser chamado" hint="Aparece no seu perfil." />
              <Input label="E-mail" defaultValue="pessoa@exemplo.com" error="Informe um e-mail válido." />
              <Input label="Desativado" defaultValue="Somente leitura" disabled />
              <Input variant="search" aria-label="Buscar ou perguntar" placeholder="Buscar ou perguntar" />
            </div>
          </Group>

          <Group id="superficies" title="Superfícies">
            <Spec title="Card: elevações, raios e realce">
              <div className="dxg__grid">
                <Card>Suave (padrão)</Card>
                <Card elevation="float">Flutuante</Card>
                <Card elevation="none" bordered>
                  Sem sombra, com borda
                </Card>
                <Card radius="sm" interactive>
                  Interativo (realce ao passar)
                </Card>
              </div>
            </Spec>
            <Spec title="FocalCard: o único bloco escuro da tela">
              <FocalCard>
                <div className="dxg__row">
                  <strong>Bloco focal</strong>
                  <Button variant="brand" size="sm">
                    Ação principal
                  </Button>
                  <Button variant="onFocal" size="sm">
                    Secundária
                  </Button>
                </div>
              </FocalCard>
            </Spec>
            <Spec title="DestinationGrid: 4 colunas em contêiner largo, 2 em estreito; o último ímpar ocupa a linha">
              <DestinationGrid>
                <DestinationTile tone="indigo" icon="notebook-pen" title="Diário" status="2 sugestões" meta="Último registro ontem" />
                <DestinationTile tone="blue" icon="badge-check" title="Evidências" status="12 confirmadas" meta="3 sem prova" />
                <DestinationTile tone="amber" icon="mic" title="Persona Live" status="Pronto para ensaiar" />
                <DestinationTile tone="green" icon="file-text" title="Artefatos" status="1 rascunho" meta="Atualizado hoje" />
                <DestinationTile tone="rose" icon="settings" title="Um título bem comprido para testar o corte do texto" status="Estado com texto longo que precisa quebrar sem estourar a caixa" />
                <DestinationTile tone="slate" icon="folder" title="Arquivo" status="Nada pendente" href="#superficies" />
                <DestinationTile tone="indigo" icon="library" title="Biblioteca" status="Ímpar ocupa a linha" />
              </DestinationGrid>
            </Spec>
            <Spec title="ProgressBar">
              <div className="dxg__grid">
                <ProgressBar value={72} label="Marca" />
                <ProgressBar value={40} tone="success" label="Sucesso" />
                <ProgressBar value={55} tone="warning" label="Atenção" />
                <ProgressBar value={90} tone="ink" ariaLabel="Tinta, sem rótulo visível" />
                <div className="dxg__on-focal">
                  <ProgressBar value={64} label="Sobre escuro" onFocal />
                </div>
              </div>
            </Spec>
          </Group>

          <Group id="jornada" title="Jornada e score">
            <Spec title="JourneyStepper: claro e sobre bloco escuro (estado nunca só cor: ícone muda)">
              <div className="dxg__grid">
                <Card>
                  <JourneyStepper steps={JOURNEY} onFocal={false} />
                </Card>
                <div className="dxg__on-focal">
                  <JourneyStepper steps={JOURNEY} />
                </div>
              </div>
            </Spec>
            <Spec title="FocalJourney: duas colunas só com o contêiner largo; senão empilhado">
              <FocalJourney title="Jornada de exemplo" steps={JOURNEY.slice(0, 4)} nextText="Revise as 2 sugestões do Diário" ctaLabel="Revisar sugestões" />
            </Spec>
            <Spec title="ScoreRing">
              <div className="dxg__row">
                <ScoreRing value={72} size={96} label={72} sublabel="de 100" />
                <ScoreRing value={35} size={72} />
                <ScoreRing value={100} size={128} label="100" sublabel="completo" />
                <div className="dxg__on-focal">
                  <ScoreRing value={64} onFocal sublabel="de 100" />
                </div>
              </div>
            </Spec>
            <Spec title="DimensionRow: valor, não avaliada, erro, bloqueada e clicável">
              <div className="dxg__grid dxg__grid--wide">
                <DimensionRow label="Dimensão A" value={72} weight="30%" origin="observada" progress="Faltam 2 evidências para subir" />
                <DimensionRow label="Dimensão B" value={48} origin="parcial" onOpen={() => undefined} />
                <DimensionRow label="Dimensão C" notEvaluated />
                <DimensionRow label="Dimensão D" error="Não foi possível calcular agora." />
                <DimensionRow label="Dimensão E" disabled />
              </div>
            </Spec>
          </Group>

          <Group id="rastro" title="Rastreabilidade">
            <Spec title="TraceLine horizontal (vira vertical quando falta espaço), vertical, lacuna, erro e arquivada">
              <div className="dxg__grid dxg__grid--wide">
                <Card>
                  <TraceLine steps={TRACE} />
                </Card>
                <Card>
                  <TraceLine steps={TRACE.slice(0, 3)} orientation="vertical" title="Vertical" />
                </Card>
                <Card>
                  <TraceLine
                    title="Com lacuna e erro"
                    steps={[
                      { kind: "registro", label: "Registro de exemplo" },
                      { kind: "evidencia", label: "Falta a prova", state: "gap", meta: "Adicione um link" },
                      { kind: "uso", label: "Uso indisponível", state: "error" },
                    ]}
                    onStep={() => undefined}
                  />
                </Card>
                <Card>
                  <TraceLine steps={TRACE.slice(0, 3)} archived title="Arquivada" />
                </Card>
              </div>
            </Spec>
          </Group>

          <Group id="navegacao" title="Navegação">
            <Spec title="NavItem">
              <div className="dxg__row dxg__row--top">
                <NavItem icon="house" label="Ativo" active />
                <NavItem icon="notebook-pen" label="Com contador" badge={2} badgeLabel="2 sugestões para revisar" />
                <NavItem icon="settings" label="Inativo" />
              </div>
            </Spec>
            <Spec title="Sidebar: expandida e trilho (use o botão de recolher)">
              <div className="dxg__row dxg__row--top">
                <div className="dxg__stage dxg__stage--tall">
                  <Sidebar
                    active="diario"
                    collapsed={collapsed}
                    onToggle={setCollapsed}
                    resume={{ title: "Registro de exemplo", meta: "2 sugestões para revisar" }}
                    badges={{ diario: { count: 2, label: "2 sugestões para revisar" } }}
                  />
                </div>
                <div className="dxg__stage dxg__stage--tall">
                  <Sidebar active="evidencias" collapsed />
                </div>
              </div>
            </Spec>
            <Spec title="AppHeader (sem botão do Agente)">
              <div className="dxg__stage">
                <AppHeader title="Início" onMenu={() => undefined} />
              </div>
            </Spec>
          </Group>

          <Group id="shell" title="Shell">
            <p className="dxg__note">A largura do próprio shell decide o layout (container query): gaveta no celular, trilho no tablet, barra expandida no desktop.</p>
            <ShellDemo frame="phone" label="Celular (menos de 640 px): navegação em gaveta" />
            <ShellDemo frame="tablet" label="Tablet: barra em trilho" />
            <ShellDemo frame="desktop" label="Desktop: barra expandida" />
          </Group>

          <Group id="sobreposicao" title="Painel e fluxo">
            <Spec title="FloatingPanel: um por vez, foco preso, Esc fecha">
              <div className="dxg__row">
                <Button variant="outline" onClick={() => setPanelA(true)}>
                  Abrir painel A
                </Button>
                <Button variant="outline" onClick={() => setPanelB(true)}>
                  Abrir painel B
                </Button>
              </div>
              <FloatingPanel
                open={panelA}
                onClose={() => setPanelA(false)}
                eyebrow="Detalhe"
                title="Painel A"
                subtitle="Abrir o B fecha este."
                footer={
                  <>
                    <Button variant="ghost" onClick={() => setPanelA(false)}>
                      Fechar
                    </Button>
                    <Button variant="solid" onClick={() => setPanelB(true)}>
                      Abrir painel B
                    </Button>
                  </>
                }
              >
                <p>Conteúdo de exemplo. Tab percorre só este painel; Esc ou o botão de fechar devolvem o foco ao botão que abriu.</p>
                <Input label="Campo de exemplo" />
              </FloatingPanel>
              <FloatingPanel open={panelB} onClose={() => setPanelB(false)} title="Painel B" width={480}>
                <p>Segundo painel, mais estreito.</p>
              </FloatingPanel>
            </Spec>
            <Spec title="StepFlow: normal, desativado com motivo, erro e salvando">
              <div className="dxg__grid dxg__grid--wide">
                <StepFlow step={step} total={4} title="Título da etapa" description="Explicação curta do que fazer nesta etapa." onBack={() => setStep(Math.max(1, step - 1))} onNext={() => setStep(Math.min(4, step + 1))}>
                  <Input label="Resposta" />
                </StepFlow>
                <StepFlow step={1} total={3} title="Avanço bloqueado" nextDisabled nextDisabledReason="Preencha o campo para continuar.">
                  <Input label="Obrigatório" />
                </StepFlow>
                <StepFlow step={2} total={3} title="Com erro" error="Não foi possível salvar. Tente de novo.">
                  <Input label="Campo" />
                </StepFlow>
                <StepFlow step={3} total={3} title="Salvando" saving nextLabel="Concluir" />
              </div>
            </Spec>
            <Spec title="SectionIndex (também usado no topo desta página)">
              <Card>
                <SectionIndex
                  title="Índice de exemplo"
                  items={[
                    { id: "icones", label: "Ícones" },
                    { id: "campos", label: "Campos", meta: "4" },
                    { id: "x-desativado", label: "Seção desativada", disabled: true },
                  ]}
                />
              </Card>
            </Spec>
          </Group>

          <Group id="cartoes" title="Cartões">
            <Spec title="EvidenceCard: grade (estática e clicável), sugestão e selecionável">
              <div className="dxg__grid dxg__grid--wide">
                <EvidenceCard title="Conduzi uma oficina para um grupo de gestores" competencies={["Comunicação", "Adaptação"]} level="Documentada" proofCount={2} origin="Diário" updatedAt="há 2 dias" />
                <EvidenceCard title="Cartão clicável" competencies={[]} level="Registrada" proofCount={1} origin="Manual" onOpen={() => undefined} />
                <EvidenceCard variant="suggestion" title="Liderei a migração de um processo" competencies={["Liderança"]} proofCount={0} origin="Diário" onConfirm={() => undefined} onDiscard={() => undefined} />
                <EvidenceCard variant="selectable" title="Evidência recomendada" competencies={["Comunicação"]} level="Documentada" reason="Mostra o resultado que a vaga pede." proofCount={1} origin="Diário" selected={sel} onSelectedChange={setSel} />
                <EvidenceCard variant="selectable" title="Evidência desativada" level="Registrada" disabled />
              </div>
            </Spec>
            <Spec title="EntryCard">
              <div className="dxg__grid dxg__grid--wide">
                <EntryCard kind="registro" date="12 jan. 2026" title="Título do registro" meta="Resumo curto do que foi registrado." status="para-revisar" onOpen={() => undefined} openLabel="Abrir registro" />
                <EntryCard kind="sessao" date="10 jan." title="Sessão de ensaio" meta="Duração de exemplo" statusLabel="Concluída" statusIcon="check" />
                <EntryCard kind="versao" />
              </div>
            </Spec>
            <Spec title="ArtifactCard">
              <div className="dxg__grid dxg__grid--wide">
                <ArtifactCard type="star" title="Resposta para liderança" objective="Preparar a entrevista" status="rascunho" sources={["Evidência 1", "Evidência 2"]} updated="hoje" onOpen={() => undefined} />
                <ArtifactCard type="pitch" title="Pitch pessoal" status="revisado" />
                <ArtifactCard type="curriculo" title="Currículo" disabled />
                <ArtifactCard type="portfolio" title="Portfólio" objective="Mostrar casos" error="Não foi possível gerar. Tente de novo." />
              </div>
            </Spec>
          </Group>
        </main>
      </div>
    </div>
  );
}
