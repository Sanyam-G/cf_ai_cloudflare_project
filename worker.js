export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") { return new Response(null, { headers: cors }); }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: cors });
    }

    try {
      const body = await req.json();
      const prompt = body.prompt;
      const sId = body.sessionId;

      if (!prompt || !sId) return new Response("Missing data", { status: 400, headers: cors });

      let hist = await env.MEMORY.get(sId, { type: "json" });
      if (!hist) {
          hist = [{ role: "system", content: "You are a helpful assistant with persistent memory." }];
      }

      hist.push({ role: "user", content: prompt });
      const ai = await env.AI.run("@cf/meta/llama-3-8b-instruct", { messages: hist });
      
      const txt = ai.response;
      hist.push({ role: "assistant", content: txt });

      await env.MEMORY.put(sId, JSON.stringify(hist), { expirationTtl: 86400 });

      return new Response(JSON.stringify({ response: txt }), {
        headers: { ...cors, "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors });
    }
  }
};
