# Gestão de Estado de Sessão e Briefing Diário

## 1. Arquivo de Checkpoint Persistente (`.session_state.md`)
- Mantenha sempre atualizado na raiz do projeto o arquivo `.session_state.md`.
- Ao final de cada ciclo de trabalho ou tarefa concluída, atualize silenciosamente esse arquivo com:
  1. **Data e Hora** da última sessão.
  2. **Módulo/Feature em foco:** O que estava sendo implementado exatamente.
  3. **Última alteração efetuada:** Resumo das mudanças e arquivos tocados.
  4. **Estado atual do projeto:** Status de builds/testes e pontos deixados pendentes ou em aberto.
  5. **Próximo passo recomendado:** O que deve ser feito a seguir para dar continuidade lógica.
- Sincronize sempre o arquivo com a pasta espelho do Desktop: `c:\Users\BLUECASE\Desktop\PROJETO ANTI\rancho\.session_state.md`.

## 2. Briefing Automático de Início de Sessão
- Sempre que uma nova sessão for iniciada (ou em qualquer primeira interação do dia como *"olá"*, *"bom dia"*, *"vamos continuar"* ou início de conversa):
  1. Inspecione imediatamente o `.session_state.md` e o histórico recente do Git (`git log -n 3 --oneline` e `git status`).
  2. Abra a resposta com o Briefing Rápido de Contexto no formato:

> 🧭 **Status da Última Sessão**
> - **Onde estávamos:** [Módulo/arquivo e contexto exato de trabalho]
> - **Última alteração feita:** [Resumo objetivo da última mudança/commit]
> - **Estado do ambiente:** [Verde/estável ou se ficou algo pendente]
> - **Próximo passo sugerido:** [Ação imediata recomendada para avançarmos]
> 
> *Pronto para continuar no próximo passo ou prefere mudar de foco?*
