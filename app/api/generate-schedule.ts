import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { jsonData, userPreference } = req.body;

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

            res.status(200).json(completion.completion);
        } catch (error) {
            console.error('Error generating schedule:', error);
            res.status(500).json({ error: 'Failed to generate schedule' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}