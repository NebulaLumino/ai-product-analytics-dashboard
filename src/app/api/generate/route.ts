import { NextRequest, NextResponse } from "next/server";
import deepseek from "@/lib/deepseek";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const completion = await deepseek.chat.completions.create({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.7 });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
