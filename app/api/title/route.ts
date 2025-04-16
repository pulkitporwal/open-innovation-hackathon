import { NextResponse } from "next/server"
import { generateWithLlama } from "@/lib/groq"

export async function POST(request: Request) {
    try {
        const { description } = await request.json()

        if (!description) {
            return NextResponse.json(
                { error: "Description is required" },
                { status: 400 }
            )
        }

        const prompt = `Generate a creative and engaging title for a presentation about: ${description}. The title should be concise, memorable, and relevant to the topic.`

        const response = await generateWithLlama(prompt, {
            temperature: 0.8,
            max_tokens: 100,
        })
        console.log(response)
        return NextResponse.json({ title: response.content.trim() })
    } catch (error) {
        console.error("Error generating title:", error)
        return NextResponse.json(
            { error: "Failed to generate title" },
            { status: 500 }
        )
    }
}