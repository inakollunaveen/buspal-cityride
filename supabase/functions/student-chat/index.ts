import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing student query:", message);

    // Call Lovable AI to generate answer and YouTube search query
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a helpful study assistant for students. Provide clear, concise answers to student questions. Always be encouraging and supportive. After answering, suggest a relevant YouTube search query that would help the student learn more about the topic."
          },
          {
            role: "user",
            content: message
          }
        ],
        tools: [
          {
            type: "function",
            name: "provide_answer_with_youtube",
            description: "Provide an answer to the student's question along with a YouTube search query",
            parameters: {
              type: "object",
              properties: {
                answer: {
                  type: "string",
                  description: "Clear, student-friendly answer to the question"
                },
                youtubeQuery: {
                  type: "string",
                  description: "A search query optimized for finding relevant educational YouTube videos"
                }
              },
              required: ["answer", "youtubeQuery"]
            }
          }
        ],
        tool_choice: {
          type: "function",
          function: { name: "provide_answer_with_youtube" }
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response:", JSON.stringify(data, null, 2));

    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    const youtubeLinks = [
      `https://www.youtube.com/results?search_query=${encodeURIComponent(result.youtubeQuery)}`,
      `https://www.youtube.com/results?search_query=${encodeURIComponent(result.youtubeQuery + " tutorial")}`,
      `https://www.youtube.com/results?search_query=${encodeURIComponent(result.youtubeQuery + " explained")}`
    ];

    return new Response(
      JSON.stringify({
        answer: result.answer,
        youtubeLinks: youtubeLinks,
        searchQuery: result.youtubeQuery
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in student-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
