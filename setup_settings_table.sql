-- 🚀 Script para configurar a tabela de configurações do Gateway Telegram
-- Copie e cole este código no SQL Editor do seu projeto Supabase e clique em RUN.

CREATE TABLE IF NOT EXISTS public.app_settings (
    id int8 PRIMARY KEY DEFAULT 1,
    telegram_bot_token text,
    telegram_chat_id text,
    notification_hour int4 DEFAULT 10,
    updated_at timestamptz DEFAULT now(),
    -- Garante que só existirá uma linha de configuração
    CONSTRAINT single_row_config CHECK (id = 1)
);

-- Habilitar RLS (Segurança de Linha)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que qualquer pessoa com a Anon Key leia e edite (Ajuste para seu uso)
CREATE POLICY "Permitir leitura e edição para Anon" ON public.app_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Inserir valores padrão (Opcional)
INSERT INTO public.app_settings (id, telegram_bot_token, telegram_chat_id, notification_hour)
VALUES (1, '8617083417:AAEq4v5YVREslvoE4A0uZVUiSEyC1_xALFg', '7405092791', 10)
ON CONFLICT (id) DO NOTHING;
