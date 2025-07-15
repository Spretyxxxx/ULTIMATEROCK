const webhookURL = "TVŮJ_WEBHOOK_URL_TADY";  // Sem dej svůj webhook

document.getElementById("playBtn").addEventListener("click", async () => {
  const consent = confirm("Opravdu chcete informace odeslat přes webhook?");
  if (!consent) return;

  const infoDiv = document.getElementById("info");
  infoDiv.textContent = "⏳ Získávám informace...";

  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const userAgent = navigator.userAgent;
    const browser = getBrowser(userAgent);
    const os = getOS(userAgent);

    const message = `
🌍 Země: ${data.country_name}
📍 Město: ${data.city}
🌐 IP: ${data.ip}
🛰️ ISP: ${data.org}
🧠 Prohlížeč: ${browser}
💻 Systém: ${os}
    `;

    await sendWebhook(message);

    // Nezobrazujeme na stránce, jen potvrzení
    infoDiv.textContent = "✅ Informace byly odeslány.";
  } catch (e) {
    infoDiv.textContent = "❌ Chyba při získávání informací.";
  }
});

function getBrowser(ua) {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  return "Jiný/Neznámý";
}

function getOS(ua) {
  if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
  if (ua.includes("Windows NT 6.1")) return "Windows 7";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  return "Neznámý";
}

async function sendWebhook(content) {
  await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}
