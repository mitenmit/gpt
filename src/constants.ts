import {ITemplate} from "./types"
import {pv, pvAttr} from "./components/promptVariable"

const PERSONA: Array<string> = [
    "an Immunologist and expert in vaccination",
];

const CONTEXT: Array<string> = [
    "need a summary explaining how a vaccine work to protect from infectious diseases for third-year university students majoring in biology",
];

const TASKS: Array<string> = [
    "write a 200 word summary outlining the key principles of vaccine design and mains features of the expected immune response following vaccination",
    "Adapt...",
    "Analyze...",
    "Automate...",
    "Calculate...",
    "Classify...",
    "Collaborate...",
    "Convert...",
    "Customize...",
    "Debug...",
    "Design...",
    "Detect...",
    "Diagnose...",
    "Discover...",
    "Enhance...",
    "Facilitate...",
    "Filter...",
    "Generate...",
    "Identify...",
    "Improve...",
    "Optimize...",
    "Personalize...",
    "Predict...",
    "Rank...",
    "Recognise...",
    "Recommend...",
    "Simulate...",
    "Streamline...",
    "Summarize...",
    "Track...",
    "Translate...",
    "Validate..."
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
        persona: pvAttr(null, "Select a persona:", "[Specify a persona (NICE TO HAVE)]", PERSONA, null),
        context: pvAttr(null, "Ask: what's the background? What the success should look like? etc", "[Specify the context you are facing (IMPORTANT TO HAVE)]", CONTEXT, null),
        task: pvAttr(null, "What is the task?", "[Enter a task with details (MANDATORY)]", TASKS,  null),
        format: pvAttr(null, "Select sample format:", "[Enter a format (NICE TO HAVE)]", FORMATS, null),
        tone: pvAttr(null, "Tones:", "[Enter a tone of voice (NICE TO HAVE)]", null, null),
        example: pvAttr(null, "Example:", "[Enter an example output or example structure (IMPORTANT TO HAVE)]", null, null)
    },
    sourceTemplate: "[You are $PERSONA. <br>][I $CONTEXT. <br>][You will $TASK. <br>][Output the final result in a $FORMAT. <br>][Please ensure $TONE. <br>][Here is an example: $EXAMPLE.]",
    template: [
        ["You are ", pv("persona"), ". ", "<br/>"],
        ["I ", pv("context"), ". ", "<br/>"],
        ["You will ", pv("task"), ". ", "<br/>"],
        ["Output the final result in a ", pv("format"), ". ", "<br/>"],
        ["Please ensure ", pv("tone"), ". ", "<br/>"],
        ["Here is an example: \n", pv("example")]
    ],
    examples: [
        {
            name: "Full Example",
            id: crypto.randomUUID(),
            values: {
                persona: "an Immunologist and expert in vaccination",
                context: "need a summary explaining how a vaccine work to protect from infectious diseases for third-year university students majoring in biology",
                task: "write a 200 word summary outlining the key principles of vaccine design and mains features of the expected immune response following vaccination",
                format: "well structured format",
                tone: "the summary should be written for a scientific audience",
                example: "1. Introduction to the immune system and its role in protecting the body from infectious diseases. 2. Explanation of how vaccines work to stimulate the immune system and protect against infectious diseases. 3. Description of the main features of the immune response following vaccination. 4. Conclusion summarizing the key points of the summary.",
            }
        },
        // {
        //     name: "Short Example",
        //     id: crypto.randomUUID(),
        //     values: {
        //         role: "SEO Professional Writer",
        //         task: "research keywords and incorporate them naturally into the content",
        //         details: "focus on readability, relevance and proper keyword placement",
        //         format: "well structured format"
        //     }
        // }
    ]
};
