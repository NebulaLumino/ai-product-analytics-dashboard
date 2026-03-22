import { NextRequest, NextResponse } from "next/server";
import deepseek from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  try {
    const { csvData } = await req.json();
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert product analyst. Analyze the provided analytics data and generate a comprehensive weekly summary report. Include: key metrics, trends, anomalies, and actionable recommendations. Format your response with clear sections using markdown." },
        { role: "user", content: `Analyze this analytics data and generate a weekly summary report:\n\n${csvData || "Sample data: users, sessions, revenue over past 7 days"}` }
      ],
      temperature: 0.5,
    });
    return NextResponse.json({ report: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
