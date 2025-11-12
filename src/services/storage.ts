import { supabase } from '../lib/supabase';
import { BrainstormSession } from '../types';

export async function saveBrainstormSession(session: BrainstormSession): Promise<string> {
  const { data, error } = await supabase
    .from('brainstorm_sessions')
    .insert({
      app_name: session.appName,
      app_idea: session.appIdea,
      chat_log: session.chatLog,
      user_flow: session.userFlow,
      created_at: new Date().toISOString()
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving session:', error);
    throw error;
  }

  return data?.id || '';
}

export async function updateSessionFlow(sessionId: string, userFlow: string): Promise<void> {
  const { error } = await supabase
    .from('brainstorm_sessions')
    .update({ user_flow: userFlow })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating flow:', error);
    throw error;
  }
}
