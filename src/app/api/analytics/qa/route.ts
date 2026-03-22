import { NextRequest, NextResponse } from "next/server";
import deepseek from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  try {
    const { question, csvData } = await req.json();
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert product analyst answering questions about analytics data. Provide clear, data-driven answers with specific insights where possible." },
        { role: "user", content: `Analytics data:\n${csvData || "No specific data provided. Answer based on general knowledge."}\n\nQuestion: ${question}` }
      ],
      temperature: 0.3,
    });
    return NextResponse.json({ answer: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
