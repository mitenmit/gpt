import {ITemplate} from "./types"
import {pv, pvAttr} from "./promptVariable"

const ROLES: Array<string> = [
    "专业会计师",
	"熟练软件开发者",
	"资深教师",
	"成就销售代表",
	"称职项目经理",
	"熟练律师",
	"合格工程师",
	"经验丰富的建筑师",
	"称职营销经理",
	"知识渊博的财务分析师",
	"富有创意的平面设计师",
	"资深人力资源经理",
	"值得信赖的顾问",
	"熟练医生",
	"持牌心理学家",
	"专注研究者",
	"分析数据分析师",
	"敏锐经济学家",
	"新闻记者",
	"专业药剂师",
	"富有同情心的社会工作者",
	"精通科技的IT专家",
	"洞察力商业分析师",
	"经验丰富的运营经理",
	"战略活动策划者",
	"专业房地产经纪人",
	"资深投资银行家",
	"熟练的Web开发者",
	"认证健身教练",
	"专业执行教练",
	"灵活的Scrum大师",
	"网络安全分析师",
	"用户体验（UX）研究员",
	"区块链开发者",
	"人工智能（AI）工程师",
	"环境顾问",
	"数据隐私官员",
	"虚拟现实（VR）开发者",
	"道德黑客"
];

const TASKS: Array<string> = [
    "适应",
	"分析",
	"自动化",
	"计算",
	"分类",
	"协作",
	"转换",
	"定制",
	"调试",
	"设计",
	"检测",
	"诊断",
	"发现",
	"增强",
	"促进",
	"过滤",
	"生成",
	"识别",
	"改进",
	"优化",
	"个性化",
	"预测",
	"排名",
	"识别",
	"推荐",
	"模拟",
	"简化",
	"总结",
	"追踪",
	"翻译",
	"验证"
];

const FORMATS: Array<string> = [
    "纯文本",
	"结构良好的格式",
	"JSON",
	"CSV",
	"HTML",
	"XML",
	"Markdown",
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
