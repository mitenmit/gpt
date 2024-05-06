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
    name: "主模板",
    id: crypto.randomUUID(),
    promptVariableAttributes: {
        role: pvAttr(null, "选择一个角色:", "[指定一个角色]",  ROLES, null),
	needs: pvAttr(null, "你需要什么？", "[你需要什么？]", null, null),
	task: pvAttr(null, "任务是什么？", "[输入一个任务]", TASKS,  null),
	details: pvAttr(null, "详情:", "[输入详情]", null, null),
	exclusion: pvAttr(null, "排除项:", "[输入排除项]", null, null),
	format: pvAttr(null, "选择格式:", "[选择一个格式]", FORMATS, null),
	example: pvAttr(null, "示例:", "[输入一个示例]", null, null)
    },
    sourceTemplate: "[扮演一个 $ROLE, <br>][我需要一个 $NEEDS, <br>][你将会 $TASK, <br>][在这个过程中, 你应该 $DETAILS, <br>][请 $EXCLUSION, <br>][输入的信息最终以 $FORMAT, <br>][这里是一个示例: $EXAMPLE]",
    template: [
        ["扮演一个 ", pv("role"), ",", "<br/>"],
        ["我需要一个 ", pv("needs"), ", ", "<br/>"],
        ["你将会 ", pv("task"), ", ", "<br/>"],
        [" 在这个过程中, 你应该 ", pv("details"), ", ", "<br/>"],
        ["请 ", pv("exclusion"), ", ", "<br/>"],
        ["输入的信息最终以 ", pv("format"), ", ", "<br/>"],
        ["这里是一个示例: ", pv("example")]
    ],
    examples: [
        {
            name: "完整示例",
            id: crypto.randomUUID(),
            values: {
                role: "SEO 专业撰稿人",
		needs: "优化的博客文章",
		task: "研究关键词并自然地将它们融入内容中",
		details: "侧重于易读性、相关性和适当的关键词放置",
		exclusion: "避免关键词堆积或过度优化",
		format: "良好的结构化格式",
		example: "标题\"SEO 写作的十大有效技巧：提升您内容的曝光度\""
            }
        },
        {
            name: "简短示例",
            id: crypto.randomUUID(),
            values: {
                role: "SEO 专业撰稿人",
		task: "研究关键词并自然地将它们融入内容中",
		details: "侧重于易读性、相关性和适当的关键词放置",
		format: "良好的结构化格式"
            }
        }
    ]
};
