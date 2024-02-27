import * as consts from "./constants"
import { isPv } from "./promptVariable"
import {AppState, Templates, TemplateIndex, TemplateId, LoadedExampleId, CurrentValues} from "./types"

import {atom, useAtomValue, useSetAtom} from "jotai"

const initialTemplates = [consts.PROMPT_TEMPLATE];
// const _testInitialTemplates = [consts.PROMPT_TEMPLATE,
//                               {...consts.PROMPT_TEMPLATE, name: "Updated Template", id: crypto.randomUUID()}];

export const appState: AppState = {
    templates: atom<Templates>(initialTemplates),
    templateIndex: atom<TemplateIndex>(0),
    templateId: atom<TemplateId>(""),
    loadedExampleId: atom<LoadedExampleId>(null),
    currentValues: atom<CurrentValues>({})
};

export const newExampleNameAtom = atom("");

export const useNewExampleName = (): string => {
    return useAtomValue(newExampleNameAtom);
};

export const useSetNewExampleName = () => {
    return useSetAtom(newExampleNameAtom);
};

export const templateByIdAtom = atom(
    null,
    (get, set, id: string) => { 
        let template = get(appState.templates)
                       .filter((t) => t.id === id).at(0);
        return template;
    }
);

export const createEmptyValues = (template: Array<any>) => {
    return template.reduce( (acc, block) => {
        let filteredVars = block.filter(isPv); 
        let variable = (filteredVars && filteredVars.length) ? filteredVars[0].variable : null;
        if (variable) acc[variable] = "";
        return acc;
    }, {});
}