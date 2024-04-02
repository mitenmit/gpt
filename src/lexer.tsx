import * as pv from "./components/promptVariable"

const emptyBlockContext = () => {return {elementType: null,
                                         element: "",
                                         block: []}};

function insertBlockElement(blockContext: any, newType: string | null): void {
    let elementTypesSet = new Set(["block", "variable", "br", "nl"]);
    let currentElementType = blockContext.elementType;
    let currentElement = blockContext.element;

    blockContext.elementType = newType;
    blockContext.element = "";
    // console.log(blockContext);
    if (elementTypesSet.has(currentElementType) && (currentElement.length > 0 || currentElementType === "nl")) {
        switch(currentElementType) {
            case "block":
                // console.log("Pushing element: ", currentElement);
                blockContext.block.push(currentElement);
                break;
            case "variable":
                blockContext.block.push( pv.pv( currentElement.toLowerCase() ) );
                break;
            case "br":
                blockContext.block.push( "<br/>" );
                break;
            case "nl":
                blockContext.block.push( "\n" );
                break;    
        } 
    }
}

export function lex(st: string) {
    // console.log("Begin lexer =====", emptyBlockContext());
    let template: Array<any> = [];
    let blockContext = emptyBlockContext();
    let currentContext: Array<string> = [];
    
    let context = () => currentContext[currentContext.length - 1];
    let pushContext = (ctx: string) => currentContext.push(ctx);
    let popContext = () => {currentContext.pop(); return currentContext;};

    let isInBlock    = () => currentContext[currentContext.length - 1] === "block";
    let isInVaraible = () => currentContext[currentContext.length - 1] === "variable";
    let isInBr       = () => currentContext[currentContext.length - 1] === "br";
    let isInEscape   = () => currentContext[currentContext.length - 1] === "escape";

    let insertBlockCtxChar = (ch: string) => blockContext.element = blockContext.element + ch;

    let resetBlockCtx = () => blockContext = emptyBlockContext()
    let blockToTemplate = () => {template.push(blockContext.block); resetBlockCtx();}

    let isBrStart = (charPos: number) => st.substring(charPos, charPos + "<br>".length) === "<br>"
    let isBrEnd   = (charPos: number) => st[charPos] === ">" && isInBr()
    let isNewLine = (charPos: number) => st[charPos] === "\n"

    let isBlockStart = (charPos: number) => st[charPos] === "["
    let isBlockEnd = (charPos: number) => st[charPos] === "]"

    let isEscapeCharStart = (charPos: number) => st[charPos] === "\\"

    let isVariableStart = (charPos: number) => st[charPos] === "$"
    let isVariableEnd = (charPos: number) => {
        const varDelimiterSet = new Set([" ", ",", ".", "<", ">", "?", ";", "'", ":", "\"", "|", "[", "]", "{", "}",
                                         "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "=", "+", "\n"]);
        return isInVaraible() && varDelimiterSet.has(st[charPos]);
    }

    for(let i=0; i < st.length; i++) {
        let currentChar = st[i];
        switch (true) {
            case isInEscape():
                insertBlockCtxChar(currentChar);
                popContext();
                break;

            case isEscapeCharStart(i):
                pushContext("escape");
                break;

            case isVariableStart(i):
                insertBlockElement(blockContext, "variable");
                pushContext("variable");
                break;

            case isVariableEnd(i):
                popContext();
                insertBlockElement(blockContext, context());
                if (isBlockEnd(i)) {
                    insertBlockElement(blockContext, null);
                    popContext();
                    blockToTemplate();
                } else {
                    insertBlockCtxChar(currentChar);
                }
                break;
                
            case isNewLine(i):
                insertBlockElement(blockContext, "nl");
                insertBlockElement(blockContext, context());
                break;
            case isBrStart(i):
                insertBlockElement(blockContext, "br");
                pushContext("br");
                break;
            case isBrEnd(i):
                popContext();
                insertBlockElement(blockContext, context());
                break;    
            case isBlockStart(i):
                insertBlockElement(blockContext, "block");
                pushContext("block");
                break;
            case isBlockEnd(i):
                insertBlockElement(blockContext, null);
                popContext();
                blockToTemplate();
                break;
            case isInBlock() || isInVaraible() || isInBr():
                insertBlockCtxChar(currentChar);
                break
        }    
    }

    // console.log("Return lexer =====", template);
    return template;
}