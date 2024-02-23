import {ITemplate} from "./types"
import {pv, pvAttr} from "./promptVariable"

const ROLES: Array<string> = [
    "Expert Accountant",
    "Skilled Software Developer",
    "Seasoned Teacher",
    "Accomplished Sales Representative",
    "Competent Project Manager",
    "Proficient Layer",
    "Qualified Engineer",
    "Experienced Architect",
    "Competent Marketing Manager",
    "Knowledgeable Financial Analyst",
    "Creative Graphic Designer",
    "Seasoned Human Resources Manager",
    "Trusted Consultant",
    "Skilled Doctor",
    "Licensed Psychologist",
    "Dedicated Researcher",
    "Analytical Data Analyst",
    "Astute Economist",
    "Journalistic Reporter",
    "Professional Pharmacist",
    "Compassionate Social Worker",
    "Tech-savvy IT Specialist",
    "Insightful Business Analyst",
    "Seasoned Operations Manager",
    "Strategic Event Planner",
    "Expert Real Estate Agent",
    "Seasoned Investment Banker",
    "Proficient Web Developer",
    "Certified Fitness Trainer",
    "Professional Executive Coach",
    "Agile Scrum Master",
    "Cyber Security Analyst",
    "User Experience (UX) Researcher",
    "Blockchain Developer",
    "Artificial Intelligence (AI) Engineer",
    "Environmental Consultant",
    "Data Privacy Officer",
    "Virtual Reality (VR) Developer",
    "Ethical Hacker"
];

const TASKS: Array<string> = [
    "Adapt",
    "Analyze",
    "Automate",
    "Calculate",
    "Classify",
    "Collaborate",
    "Convert",
    "Customize",
    "Debug",
    "Design",
    "Detect",
    "Diagnose",
    "Discover",
    "Enhance",
    "Facilitate",
    "Filter",
    "Generate",
    "Identify",
    "Improve",
    "Optimize",
    "Personalize",
    "Predict",
    "Rank",
    "Recognise",
    "Recommend",
    "Simulate",
    "Streamline",
    "Summarize",
    "Track",
    "Translate",
    "Validate"
];

const FORMATS: Array<string> = [
    "plain text",
    "well structured format",
    "JSON",
    "CSV",
    "HTML",
    "XML",
    "Markdown code",
    "PDF"
];

export const PROMPT_TEMPLATE: ITemplate = {
    name: "Main Template",
    id: crypto.randomUUID(),
    promptVariableAttributes: {
        role: pvAttr(null, "Select a role:", "[Specify a role]",  ROLES, null),
        needs: pvAttr(null, "What do you need?", "[What do you need?]", null, null),
        task: pvAttr(null, "What is the task?", "[Enter a task]", TASKS,  null),
        details: pvAttr(null, "Details:", "[Enter details]", null, null),
        exclusion: pvAttr(null, "Exclusions:", "[Enter exclusion]", null, null),
        format: pvAttr(null, "Select format:", "[Select a format]", FORMATS, null),
        example: pvAttr(null, "Example:", "[Enter an example]", null, null)
    },
    sourceTemplate: "[Act like a $ROLE, <br>][I need a $NEEDS, <br>][you will $TASK, <br>][in the process, you should $DETAILS, <br>][please $EXCLUSION, <br>][input the final result in a $FORMAT, <br>][here is an example: $EXAMPLE]",
    template: [
        ["Act like a ", pv("role"), ",", "<br/>"],
        ["I need a ", pv("needs"), ", ", "<br/>"],
        ["you will ", pv("task"), ", ", "<br/>"],
        [" in the process, you should ", pv("details"), ", ", "<br/>"],
        ["please ", pv("exclusion"), ", ", "<br/>"],
        ["input the final result in a ", pv("format"), ", ", "<br/>"],
        ["here is an example: ", pv("example")]
    ],
    examples: [
        {
            name: "Full Example",
            id: crypto.randomUUID(),
            values: {
                role: "SEO Professional Writer",
                needs: "optimized blog post",
                task: "research keywords and incorporate them naturally into the content",
                details: "focus on readability, relevance and proper keyword placement",
                exclusion: "avoid keyword stuffing or over-optimisation",
                format: "well structured format",
                example: "title \"Top 10 Tips for Effective SEO Writing: Boost Your Content's Visibility\""
            }
        },
        {
            name: "Short Example",
            id: crypto.randomUUID(),
            values: {
                role: "SEO Professional Writer",
                task: "research keywords and incorporate them naturally into the content",
                details: "focus on readability, relevance and proper keyword placement",
                format: "well structured format"
            }
        }
    ]
};
