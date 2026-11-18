"""
Gatekeeper de Frequência Adaptativa — MPOX Brasil
Avalia o estado epidemiológico atual e os horários reais de funcionamento
dos postos de vacinação no Brasil para decidir se a execução deve prosseguir.
"""

import os
import sys
import json
from datetime import datetime, timezone, timedelta

def get_brasilia_time():
    # Horário Oficial de Brasília (UTC-3)
    tz_brt = timezone(timedelta(hours=-3))
    return datetime.now(tz_brt)

def main():
    brt_now = get_brasilia_time()
    hour_brt = brt_now.hour
    weekday = brt_now.weekday() # 0 = Segunda, ..., 5 = Sábado, 6 = Domingo
    is_weekend = weekday >= 5

    event_name = os.environ.get("GITHUB_EVENT_NAME", "local")
    print(f"🕒 [Gatekeeper] Horário atual em Brasília: {brt_now.strftime('%d/%m/%Y %H:%M:%S (UTC-3)')}")
    print(f"📌 [Gatekeeper] Tipo de gatilho: {event_name}")

    # Execuções manuais ou pushes sempre executam
    if event_name in ["workflow_dispatch", "push", "local"]:
        print("✅ Gatilho manual/push detectado. Execução permitida.")
        set_github_output(True, "Gatilho manual/push")
        return

    state_path = os.path.join(os.path.dirname(__file__), "..", "public", "data", "monitor_state.json")
    if not os.path.exists(state_path):
        print("⚠️ monitor_state.json não encontrado. Permitindo execução por padrão.")
        set_github_output(True, "Estado inicial não configurado")
        return

    try:
        with open(state_path, "r", encoding="utf-8") as f:
            state = json.load(f)
    except Exception as e:
        print(f"⚠️ Erro ao ler monitor_state.json: {e}")
        set_github_output(True, "Fallback em caso de erro")
        return

    modo = state.get("modo", "CAMPANHA_ATIVA")
    print(f"🔍 [Gatekeeper] Modo de vigilância ativo: {modo}")

    if modo == "CAMPANHA_ATIVA":
        # Horários de funcionamento dos postos:
        # - CRIEs, CTAs, SAEs: 07h/08h às 17h/18h (Seg-Sex)
        # - Super Centros (Botafogo, Shopping Nova América, Campo Grande): 08h/10h às 22h (Seg-Dom)
        if is_weekend:
            # Final de semana: Super Centros funcionam das 08h/10h às 22h
            if 8 <= hour_brt <= 22:
                print(f"✅ [CAMPANHA_ATIVA - Fim de Semana] Postos em funcionamento (Super Centros 08h-22h). Hora atual: {hour_brt}h BRT.")
                set_github_output(True, f"Horário de Super Centros fim de semana ({hour_brt}h BRT)")
            else:
                print(f"⏸️ [CAMPANHA_ATIVA - Fim de Semana] Fora do horário de atendimento ({hour_brt}h BRT). Early exit para economizar recursos.")
                set_github_output(False, "Madrugada no fim de semana")
        else:
            # Dias úteis: Atendimento geral das 07h às 22h
            if 7 <= hour_brt <= 22:
                print(f"✅ [CAMPANHA_ATIVA - Dia Útil] Postos em pleno funcionamento (07h às 22h). Hora atual: {hour_brt}h BRT.")
                set_github_output(True, f"Horário comercial e estendido ({hour_brt}h BRT)")
            elif hour_brt in [23, 4]:
                # Checagens noturnas essenciais de consolidação
                print(f"✅ [CAMPANHA_ATIVA] Checagem de consolidação noturna/madrugada ({hour_brt}h BRT).")
                set_github_output(True, f"Consolidação noturna ({hour_brt}h BRT)")
            else:
                print(f"⏸️ [CAMPANHA_ATIVA] Madrugada com postos fechados ({hour_brt}h BRT). Early exit.")
                set_github_output(False, "Madrugada em dia útil")

    elif modo == "CALMA":
        # Modo basal / calma epidemiológica: checagem diária às 06h (antes de abrir) e 18h (após fechar)
        if hour_brt in [6, 18]:
            print(f"✅ [CALMA] Janela diária programada ({hour_brt}h BRT).")
            set_github_output(True, f"Janela regular modo calma ({hour_brt}h BRT)")
        else:
            print(f"⏸️ [CALMA] Nenhuma atividade crítica recente. Hora: {hour_brt}h BRT. Pulando ciclo.")
            set_github_output(False, "Ciclo intermediário em modo calma")

    else:
        set_github_output(True, "Modo desconhecido")

def set_github_output(should_run: bool, reason: str):
    gh_output = os.environ.get("GITHUB_OUTPUT")
    val_str = "true" if should_run else "false"
    if gh_output and os.path.exists(gh_output):
        with open(gh_output, "a", encoding="utf-8") as f:
            f.write(f"should_run={val_str}\n")
            f.write(f"reason={reason}\n")
    print(f"📢 [Resultado Gatekeeper] should_run={val_str} | motivo: {reason}")
    if not should_run:
        sys.exit(0)

if __name__ == "__main__":
    main()
