const getServerUrl = (): string => {
  return localStorage.getItem('gehenna-server-url') || 'http://localhost:8000';
};

export interface ChatResponse {
  type: 'text' | 'mcp_command';
  response?: string;
  tool?: string;
  params?: Record<string, any>;
}

export const sendMessageToAI = async (message: string, assistant: string = 'default'): Promise<ChatResponse> => {
  const serverUrl = getServerUrl();
  const response = await fetch(`${serverUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, assistant }),
  });
  if (!response.ok) throw new Error(`Сервер вернул ошибку (${response.status})`);
  return response.json();
};

export const checkServerHealth = async (): Promise<boolean> => {
  const serverUrl = getServerUrl();
  try {
    const res = await fetch(`${serverUrl}/health`);
    return res.ok;
  } catch {
    return false;
  }
};