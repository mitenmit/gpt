import Trigger from '@rc-component/trigger';
import { useSetAtom } from "jotai"
import { Fragment, forwardRef, useImperativeHandle } from 'react';
import ContentEditable from "react-contenteditable";

import * as icons from "../components/Icons"
import * as events from "../events"
import {hash} from "../hash"
import {isPv, PromptVariableAttribute} from "./promptVariable"
import {useSelectedTemplateAttr, useCurrentValue}  from "../subs"


type ClearFieldProps = {
    variable: string;
}

function ClearField(props: ClearFieldProps) {
    let value = useCurrentValue(props.variable);
    let clearValue = useSetAtom(events.clearValueAtom);

    if (value)
        return( 
            <a style={{marginLeft: 5}} onClick={ () => clearValue(props.variable) }>
                <span aria-hidden="true" unselectable="on" style={{userSelect: "none", fontSize: 14, color: "rgb(194, 167, 114)"}}>
                    <icons.ClearIcon/>
                </span>
                   
            </a>
        )
    else
        return null;    
}

function pastePlainText(e: any) {
    let txt = e.clipboardData.getData("text/plain");
    e.preventDefault();
    document.execCommand("insertHTML", false, txt);
}

function disableNewLines(e: any) {
    const keyCode = e.keyCode || e.which

    if (keyCode === 13) {
        e.returnValue = false
        if (e.preventDefault) e.preventDefault()
        let tabIndex = e.target.tabIndex + 1;
        let target: HTMLElement | null = document.querySelector("[tabindex='" + tabIndex + "']");

        if (target) target.focus();
    }
}

function trimSpaces(s: string) {
    return s
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
}

function highlightAll() {
    setTimeout(() => {
      document.execCommand('selectAll', false)
    }, 0)
}

function onContentEditableBlur() {
    let sel = window.getSelection();
    if (sel) sel.removeAllRanges();

    //TODO: write to localStorage
}

type PromptDropdownMenuProps = {
    promptVar: string;
    promptVarAttributes: PromptVariableAttribute;
}

function PromptDropdownMenu(props: PromptDropdownMenuProps) {
    let attr = props.promptVarAttributes;
    let setValue = useSetAtom(events.setValueAtom);
    return (
        <div className="var-menu" style={{minWidth: 100}}>
            <div className="var-menu-title" style={{background: "#EFEFEF", padding: 5}}>
                {attr?.title}
            </div>
            <div className="var-menu-item-wrapper">
                {attr?.options?.map( (v: any, i: number) => {
                    return <div key={i} className="var-menu-item" onMouseDown={() => {setValue(props.promptVar, v)}}>{v}</div>;
                })}
            </div>
        </div>
    );
}

type BlockElementProps = {
    promptVar: string;
    promptVarAttributes: PromptVariableAttribute;
    index: number;
}

function getPopupContainer(trigger: any) {
    return trigger.parentNode;
  }

function BlockElement(props: BlockElementProps) {
    let component = props.promptVarAttributes?.getComponent() || "text";

    let attr = props.promptVarAttributes;
    let value = useCurrentValue(props.promptVar);
    let setValue = useSetAtom(events.setValueAtom);
    let placeholder = attr?.placeholder || "[Placeholder]";
    
    switch(true) {
        case (component === "menu"): 
            return (
                <Fragment>
                    <Trigger action={["focus"]}
                            maskClosable={false}
                            getPopupContainer={undefined && getPopupContainer}
                            popup={<PromptDropdownMenu promptVar={props.promptVar} promptVarAttributes={props.promptVarAttributes}/>}
                            popupAlign={{points: ["tl", "bl"], offset: [0, 0]}}> 

                        
                        {/* span is needed to prevent: "findDOMNode is deprecated in StrictMode" warning */}
                        <span> 
                            <ContentEditable
                                key = { hash({placeholder: placeholder}).toString() }
                                className="editable-variable"
                                tabIndex={ props.index }
                                html={ value || "" }
                                data-placeholder={ placeholder }
                                onChange={ (e) => {setValue(props.promptVar, trimSpaces(e.target.value))} }
                                onPaste={ pastePlainText }
                                onKeyPress={ disableNewLines }
                                onFocus={ highlightAll }
                                onBlur={ onContentEditableBlur }
                            />
                        </span>    
                    </Trigger>
                    <ClearField variable={props.promptVar}/>
                </Fragment>
            );
        case (component === "text"):
            return (
                <Fragment>
                    <ContentEditable
                            key = { hash({placeholder: placeholder}).toString() }
                            className="editable-variable"
                            tabIndex={ props.index }
                            html={ value || "" }
                            data-placeholder={ placeholder }
                            onChange={ (e) => {setValue(props.promptVar, trimSpaces(e.target.value))} }
                            onPaste={ pastePlainText }
                            onKeyPress={ disableNewLines }
                            onFocus={ highlightAll }
                            onBlur={ onContentEditableBlur }
                        />
                    {/* <EditableVariable  promptVar={props.promptVar} promptVarAttributes={props.promptVarAttributes} index={props.index}/> */}
                    <ClearField variable={props.promptVar}/>
                </Fragment>
            );
        default:
            return <span></span>
    }
}

function nlToBr(el: any, k: any) {
    if ( el === "\n")
        return <br key={k}/>;
    else
        return el;
}

type ProcessPromptBuilderBlockProps = {
    block: Array<any>;
    index: number;
}

function ProcessPromptBuilderBlock(props: ProcessPromptBuilderBlockProps) {
    let filteredVars = props.block.filter(isPv); 
    let variable = (filteredVars && filteredVars.length) ? filteredVars[0].variable : null;
    let attr = useSelectedTemplateAttr(variable);
    let value = useCurrentValue(variable);
    
    return (
        <span key={props.index} style={value ? {} : {color: "#998a6a"}}>
            {props.block.map( (v: any, i: number) => {
                switch (true) { 
                    case isPv(v):
                        return <BlockElement key={i} promptVar={variable} promptVarAttributes={attr} index={props.index + 1}/>
                    case (v === "<br/>"):
                        return <br key={i}/>
                    case (typeof v === 'string' || v instanceof String):
                        return nlToBr(v, i);    
                    default:
                        return null;
                }
            })}
        </span>
    );
}

type PromptBuilderProps = {
    style?: any;
    promptTemplate: any;
}

export function PromptBuilder (props: PromptBuilderProps) {
    return (
        <div className="prompt-builder" style={ props.style ? props.style : {} }>
            {props.promptTemplate.template.map((block: any, idx: number) => {
                    return <ProcessPromptBuilderBlock key={idx} block={block} index = {idx}/>
                })
            }
        </div>
    );
}
PromptBuilder.displayName = "PromptBuilder"