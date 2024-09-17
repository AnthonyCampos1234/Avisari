import Anthropic from '@anthropic-ai/sdk';

class AIAgent {
    private client: Anthropic;
    private model: string;

    constructor(apiKey: string, model: string = 'claude-3-sonnet-20240229') {
        this.client = new Anthropic({ apiKey });
        this.model = model;
    }

    async runTask(task: string): Promise<string> {
        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 1000,
            messages: [{ role: 'user', content: task }],
        });

        return response.content[0].type === 'text' ? response.content[0].text : '';
    }
}

class AIController {
    private agents: AIAgent[];

    constructor(apiKey: string, numAgents: number) {
        this.agents = Array(numAgents).fill(null).map(() => new AIAgent(apiKey));
    }

    async runTasks(tasks: string[]): Promise<string[]> {
        const results = await Promise.all(
            tasks.map((task, index) => this.agents[index % this.agents.length].runTask(task))
        );
        return results;
    }

    async processResults(results: string[]): Promise<string> {
        const finalAgent = new AIAgent(process.env.ANTHROPIC_API_KEY || '');
        const combinedResults = results.join('\n\n');
        const finalTask = `Analyze and summarize the following results:\n\n${combinedResults}`;
        return await finalAgent.runTask(finalTask);
    }

    // New methods for specific tasks
    async processCourseData(jsonData: string): Promise<string> {
        const task = `
            Process and organize the provided JSON course data into a structured, queryable database.
            Your tasks:
            1. Parse the JSON data, which is structured with departments and courses within each department.
            2. Create a database schema that efficiently represents departments, courses, their attributes, and relationships.
            3. Populate the database with the extracted information.
            4. Ensure that the database can be easily queried for:
               - Course details (code, title, credits, description)
               - Prerequisites and co-requisites
               - NUPath attributes
               - Compulsory courses
            5. Implement functions to quickly retrieve course information and check prerequisites.

            Use this JSON data: ${jsonData}
        `;
        return await this.agents[0].runTask(task);
    }

    async analyzeCurriculumRequirements(courseDatabase: string): Promise<string> {
        const task = `
            Analyze the curriculum requirements based on the processed course database.
            Your tasks:
            1. Identify all compulsory courses from the database (courses with "compulsory": 1).
            2. List all NUPath requirements found in the "attributes" field and map them to relevant courses.
            3. Create a comprehensive list of prerequisites and co-requisites for all courses.
            4. Determine the minimum number of credits required for graduation based on the compulsory courses and typical degree requirements.
            5. Identify any special requirements or constraints (e.g., minimum GPA, internship requirements) if mentioned in the course descriptions.

            Use this course database: ${courseDatabase}
        `;
        return await this.agents[1].runTask(task);
    }

    async identifySpecializationCourses(courseDatabase: string, userPreference: string): Promise<string> {
        const task = `
            Identify and recommend courses based on the user's specialization preference and the course database.
            Your tasks:
            1. Analyze course descriptions and titles to identify courses related to the user's preference.
            2. Categorize courses into theoretical and applied categories if applicable.
            3. Create a ranked list of courses based on their relevance to the user's preference.
            4. Identify any prerequisites for the recommended courses.
            5. Suggest a logical sequence for taking the specialization courses.

            Use this course database: ${courseDatabase}
            Consider this user preference: ${userPreference}
        `;
        return await this.agents[2].runTask(task);
    }

    async generateCourseSchedule(courseDatabase: string, requirements: string, recommendedCourses: string): Promise<string> {
        const task = `
            Create an optimal semester-by-semester course schedule based on all available information.
            Your tasks:
            1. Design a schedule that spans 8 semesters with 16-20 credits each.
            2. Ensure all compulsory courses and NUPath requirements are included.
            3. Incorporate the recommended specialization courses in a logical sequence.
            4. Respect all prerequisites and co-requisites.
            5. Balance the difficulty of courses across semesters.
            6. Allow for flexibility in later semesters for electives or further specialization.

            Use this information:
            Course database: ${courseDatabase}
            Curriculum requirements: ${requirements}
            Specialization course recommendations: ${recommendedCourses}
        `;
        return await this.agents[3].runTask(task);
    }

    async presentAndRefineSchedule(generatedSchedule: string): Promise<string> {
        const task = `
            Present the generated course schedule to the user and handle any feedback or requests for modifications.
            Your tasks:
            1. Display the semester-by-semester schedule in a clear, easy-to-understand format.
            2. Highlight key features of the schedule (e.g., specialization focus, NUPath completion, credit distribution).
            3. Explain any important decisions or trade-offs made in the schedule.
            4. Be prepared to make adjustments based on user feedback while ensuring all requirements are still met.

            Use this generated schedule: ${generatedSchedule}

            Return the final schedule as a JSON string that matches this structure:
            [
                {
                    "year": 1,
                    "semesters": [
                        {
                            "name": "Fall",
                            "courses": [
                                { "id": "unique-id", "code": "CS101", "name": "Introduction to Programming", "credits": 4 }
                            ]
                        },
                        // ... other semesters
                    ]
                },
                // ... other years
            ]
        `;
        return await this.agents[4].runTask(task);
    }
}

export default AIController;