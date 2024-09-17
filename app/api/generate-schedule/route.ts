import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { jsonData, userPreference } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    const completion = await anthropic.completions.create({
      model: "claude-2.0",
      max_tokens_to_sample: 1000,
      prompt: `Given the following course data: ${jsonData}
      
      And considering the user's preference for ${userPreference}, generate a 4-year course schedule. 
      The schedule should be returned as a JSON array of years, where each year contains an array of semesters, 
      and each semester contains an array of courses. Each course should have a code, name, and credits.
      
      Please provide the schedule in the following format:
      [
        {
          "year": 1,
          "semesters": [
            {
              "name": "Fall",
              "courses": [
                {"code": "CS101", "name": "Introduction to Programming", "credits": 4},
                ...
              ]
            },
            ...
          ]
        },
        ...
      ]`,
    });

    return NextResponse.json(completion.completion);
  } catch (error) {
    console.error('Error generating schedule:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Failed to generate schedule: ${errorMessage}` }, { status: 500 });
  }
}