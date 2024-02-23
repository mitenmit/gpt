import {Atom, WritableAtom} from "jotai"

export interface IPromptVariableAttribute {
    component?: string | null;
    title: string;
    placeholder: string;
    options?: Array<string> | null;
    emptyValue: any;
}

export interface ITemplateExample {
    name: string;
    id: string;
    values: Record<string, any>;
}

type TemplateRow = Array<any>;

export interface ITemplate {
    name: string;
    id: string;
    promptVariableAttributes: Record<string, IPromptVariableAttribute>,
    sourceTemplate: string;
    template: Array<TemplateRow>;
    examples: Array<ITemplateExample>;
}

export type Templates = Array<any>;
export type TemplateIndex = number;
export type TemplateId = string;
export type LoadedExampleId = string | null;
export type CurrentValues = Record<string, string | null>;

export interface AppState {
    templates: WritableAtom<Templates, [any], void>;
    templateIndex: WritableAtom<TemplateIndex, [number], void>;
    templateId: WritableAtom<TemplateId, [string], void>;
    loadedExampleId: WritableAtom<LoadedExampleId, [string | null], void>;
    currentValues: WritableAtom<CurrentValues, [CurrentValues], void>;
};