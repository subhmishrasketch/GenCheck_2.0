import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { textContent, fileName, fileType, metadata, contentStats, useProModel } = await req.json();
    
    if (!textContent) {
      return new Response(
        JSON.stringify({ error: "No content provided for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing document: ${fileName} (${fileType})`);
    console.log(`Content length: ${textContent.length} characters`);

    const systemPrompt = `You are an expert AI content detector specialized in analyzing presentations and documents. Your task is to determine whether the content was created by AI or by humans, and identify which AI tool was likely used.

CRITICAL: Analyze the ACTUAL EXTRACTED TEXT content provided. Perform a thorough analysis covering ALL of these areas:

1. **AI-Powered PPT Detection:**
   - Detect whether the presentation/document is AI-generated using NLP and pattern analysis
   - Identify the specific AI tool used (ChatGPT, Claude, Gemini, Gamma.app, Beautiful.ai, Tome, Canva AI, Copilot, etc.)

2. **Slide-wise / Section-wise AI Score:**
   - Break down the content by slide or section
   - Provide individual AI probability scores for each slide/section
   - Identify which specific slides/sections are most problematic

3. **NLP-Based Content Analysis:**
   - Writing style uniformity (AI tends to maintain unnaturally consistent tone)
   - Repetition patterns in phrasing and structure
   - Tone uniformity analysis
   - AI-like sentence construction patterns
   - Vocabulary diversity metrics
   - Use of AI-typical transitional phrases ("Furthermore," "Moreover," "In conclusion," "delve," "leverage")

4. **Metadata & Design Pattern Check:**
   - Template detection (AI tools use recognizable templates)
   - Layout consistency analysis
   - Timestamp analysis from metadata
   - Creator software detection from metadata
   - Design pattern signatures of specific AI tools

5. **Humanization Suggestions:**
   - Specific text segments that should be rewritten to sound more natural
   - Phrases to remove or replace
   - Structural changes to make the content look human-made
   - Concrete before/after examples where possible

6. **Explainable AI Report:**
   - For EVERY flagged section, explain WHY it was flagged
   - Provide evidence-based reasoning with quoted text
   - Confidence levels for each finding
   - Transparent methodology explanation

You MUST respond with a JSON object in this EXACT format:
{
  "aiProbability": <number 0-100>,
  "humanProbability": <number 0-100>,
  "detectedAITool": "<specific tool name or 'Unknown' or 'None'>",
  "aiToolConfidence": <number 0-100>,
  "summary": "<2-3 sentence executive summary>",
  "slideScores": [
    {
      "slideNumber": <number>,
      "title": "<slide/section title>",
      "aiScore": <number 0-100>,
      "flaggedContent": "<specific content that triggered the score>",
      "explanation": "<why this slide was scored this way>"
    }
  ],
  "nlpAnalysis": {
    "toneUniformity": <0-100, higher = more uniform/AI-like>,
    "repetitionScore": <0-100, higher = more repetitive>,
    "vocabularyDiversity": <0-100, higher = more diverse/human-like>,
    "sentenceVariety": "<low/medium/high>",
    "formality": "<formal/informal/mixed>",
    "writingStyleNotes": "<detailed analysis of writing style>"
  },
  "metadataDesignCheck": {
    "templateDetected": "<template name or 'None detected'>",
    "layoutPattern": "<description of layout patterns found>",
    "creatorSoftware": "<detected creator software>",
    "designSignatures": ["<specific design pattern 1>", "<specific design pattern 2>"],
    "timestampAnalysis": "<observations about timestamps>"
  },
  "humanizationSuggestions": [
    {
      "section": "<which slide/section>",
      "original": "<the problematic text>",
      "suggestion": "<how to rewrite it>",
      "reason": "<why this change helps>"
    }
  ],
  "explainableReport": [
    {
      "finding": "<what was found>",
      "evidence": "<quoted text or specific evidence>",
      "confidence": <0-100>,
      "explanation": "<detailed reasoning>"
    }
  ],
  "keyFindings": [
    "<key finding 1>",
    "<key finding 2>",
    "<key finding 3>",
    "<key finding 4>",
    "<key finding 5>"
  ],
  "detectedPhrases": [
    {"phrase": "<exact phrase from text>", "type": "ai" | "human", "reason": "<why>"}
  ],
  "patternAnalysis": {
    "repetitiveStructures": "<description>",
    "transitionUsage": "<description>",
    "personalTouches": "<present/absent>"
  },
  "indicators": {
    "aiIndicators": ["<evidence 1>", "<evidence 2>"],
    "humanIndicators": ["<evidence 1>", "<evidence 2>"]
  },
  "detailedScores": {
    "writingStyle": <0-100>,
    "contentDepth": <0-100>,
    "structuralPatterns": <0-100>,
    "vocabularyAnalysis": <0-100>,
    "originalityScore": <0-100>,
    "naturalLanguage": <0-100>,
    "consistencyScore": <0-100>
  }
}

The aiProbability and humanProbability MUST add up to 100. Be extremely specific - quote actual phrases. Provide accurate scores. For slideScores, analyze each distinct slide or section separately. For humanizationSuggestions, provide actionable rewrites.`;

    const selectedModel = useProModel ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";
    const maxContentLength = useProModel ? 50000 : 30000;
    
    console.log(`Using model: ${selectedModel}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this ${fileType} document named "${fileName}" for AI-generated content detection. Here is the full extracted content:\n\n${textContent.substring(0, maxContentLength)}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response received, length:", content?.length);

    let analysisResult;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      analysisResult = {
        aiProbability: 50,
        humanProbability: 50,
        summary: "Analysis completed but results were inconclusive.",
        indicators: {
          aiIndicators: ["Unable to determine specific indicators"],
          humanIndicators: ["Unable to determine specific indicators"]
        }
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
