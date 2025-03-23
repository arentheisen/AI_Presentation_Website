export default async function handler(req, res) {
  // ✅ Handle CORS preflight request
  res.setHeader("Access-Control-Allow-Origin", "https://arentheisen.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight success
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: "No response from OpenAI." });
    }

    res.status(200).json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Unable to connect to OpenAI API." });
  }
}
