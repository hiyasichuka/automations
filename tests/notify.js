export async function notifyLineBroadcast(text) {
    const token = process.env.LINE_ACCESS_TOKEN;
    if (!token) {
        console.warn('LINE_ACCESS_TOKEN 未設定。通知スキップ');
        return false;
    }
    const res = await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: [{ type: 'text', text }] }),
    });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.warn(`LINE broadcast 失敗: ${res.status} ${body}`);
        return false;
    }
    return true;
}
