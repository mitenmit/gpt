import {IPromptVariableAttribute} from "../types"

export type NullableString = string | null;

export class PromptVariable {
    variable: string;

    constructor(v: string) {
        this.variable = v;
    }
};

export function pv(variable: string): PromptVariable {
    return new PromptVariable(variable);
}

export function isPv(val: any): boolean {
    return val instanceof PromptVariable;
}

export class PromptVariableAttribute implements IPromptVariableAttribute {
    component: NullableString;
    title: string;
    placeholder: string;
    options: Array<string> | null;
    emptyValue: NullableString;

    constructor(component: NullableString, title: string, placeholder: string, options: Array<string> | null, emptyValue: NullableString) {
        this.component = component;
        this.title = title;
        this.placeholder = placeholder;
        if (Array.isArray(options)) 
            this.options =  [...options];
        else
            this.options = null;
        this.emptyValue = emptyValue;
    }

    getComponent() {
        return this.component || (Array.isArray(this.options) ? "menu" : "text");
    }
};

export function pvAttr(component: NullableString, title: string, placeholder: string, options: Array<string> | null, emptyValue: NullableString): PromptVariableAttribute {
    return new PromptVariableAttribute(component, title, placeholder, options, emptyValue);
}

export function isPvAttr(val: any): boolean {
    return val instanceof PromptVariableAttribute;
}

export function recordToPvAttr(record: Record<string, any>) {
    return pvAttr(record?.component, record?.title, record?.placeholder, record?.options, record?.emptyValue)
}

