'use server';
import { ChatContext } from '@/types/chat';
import { createClient } from '@/utils/supabase/server';
import * as UsageNext from '@usagehq/sdk-next';

export async function getSessions() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Needs auth');
  }

  return await UsageNext.getSessions(user.id);
}

export async function createSession() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Needs auth');
  }

  return await UsageNext.createSession(user.id);
}

export async function queue(
  sessionId: string,
  input: string,
  context: ChatContext,
  isGettingTopic: boolean = false
) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Needs auth');
  }

  return await UsageNext.queue(user.id, sessionId, {
    url: process.env.LLM_URL ?? 'http://localhost:11434/api/chat',
    body: {
      model: process.env.LLM_MODEL ?? 'dolphin-phi',
      stream: true,
      messages: [...context, { role: 'user', content: input }]
    },
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    metadata: { input, isGettingTopic }
  });
}

export async function setSessionName(sessionId: string, name: string) {
  // TODO: must validate if the user owns the session
  //
  // const supabase = createClient();
  // const {
  //   data: { user }
  // } = await supabase.auth.getUser();
  //
  // if (!user) {
  //   throw new Error('Needs auth');
  // }

  return await UsageNext.setSessionName(sessionId, name);
}

export async function getCredit() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Needs auth');
  }
  // Uncomment to add a quick free credit
  // await UsageNext.addCustomerFreeCredit(user.id, 500);
  return await UsageNext.getCustomerFreeCredit(user.id);
}
