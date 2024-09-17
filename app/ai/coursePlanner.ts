import AIController from './aiController';

export async function generateCourseSchedule(jsonData: string, userPreference: string): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set in the environment variables');
    }

    const controller = new AIController(apiKey, 5);

    try {
        // Step 1: Process course data
        console.log('Processing course data...');
        const courseDatabase = await controller.processCourseData(jsonData);

        // Step 2: Analyze curriculum requirements
        console.log('Analyzing curriculum requirements...');
        const requirements = await controller.analyzeCurriculumRequirements(courseDatabase);

        // Step 3: Identify specialization courses
        console.log('Identifying specialization courses...');
        const specializedCourses = await controller.identifySpecializationCourses(courseDatabase, userPreference);

        // Step 4: Generate course schedule
        console.log('Generating course schedule...');
        const schedule = await controller.generateCourseSchedule(courseDatabase, requirements, specializedCourses);

        // Step 5: Present and refine schedule
        console.log('Presenting and refining schedule...');
        const finalSchedule = await controller.presentAndRefineSchedule(schedule);

        return finalSchedule;
    } catch (error) {
        console.error('Error generating course schedule:', error);
        throw error;
    }
}