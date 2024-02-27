import { hash } from "./hash"
import { appState } from "./state";
import {Templates, LoadedExampleId, CurrentValues} from "./types"

import { useAtomValue, useAtom } from "jotai"


export const isEmpty = (obj: any) => {
    let keys = Object.keys(obj);
    return keys.length === 0 ||
           keys.reduce( (acc, k: string) =>  acc && !obj[k], true );
}

const removeEmptyKeys = (values: any) => {
    return Object.keys(values).reduce( (acc: Record<string, any>, k: string) => {
        if (values[k]) acc[k] = values[k];
        return acc;
    }, {});
}

export const useTemplates = (): Templates => {
    return useAtomValue(appState.templates);
};

export const useTemplateNames = (): Array<string> => {
    return useTemplates().map( t => t.name );
};

export const useTemplateOptions = () => {
    return useTemplates().map( (t, i) => {
        return { key: i, label: t.name }
    });
}

export const useSelectedTemplate = (): any => {
    let templates = useAtomValue(appState.templates);
    let index = useAtomValue(appState.templateIndex);
    return templates[index];
};

export const useSelectedTemplateName = (): string => {
    return useSelectedTemplate().name;
};

export const useSelectedTemplateId = (): string => {
    return useSelectedTemplate().id;
};

export const useSelectedTemplateAttr = (key: string) => {
    return useSelectedTemplate().promptVariableAttributes[key];
};

export const useSelectedTemplateExampes = () => {
    return useSelectedTemplate().examples;
};


export const useTemplateIndex = (): number => {
    return useAtomValue(appState.templateIndex);
};

export const useCurrentValues = (): CurrentValues => {
    return useAtomValue(appState.currentValues);
};

export const useCurrentValuesEmpty = (): boolean => {
    return isEmpty(useAtomValue(appState.currentValues));
};

export const useLoadedExampleId = (): LoadedExampleId => {
    return useAtomValue(appState.loadedExampleId)
}

export const useIsExampleModified = (): boolean => {
    let loadedExampleId = useAtomValue(appState.loadedExampleId);
    let template = useSelectedTemplate();
    let currentValues = useCurrentValues();
    let example = loadedExampleId ? template.examples.filter( (e: any) => e.id === loadedExampleId)[0] : null;

    return hash(removeEmptyKeys(example?.values)).toNumber() !== hash(removeEmptyKeys(currentValues)).toNumber();
}

export const useLoadedExampleName = (): boolean => {
    let loadedExampleId = useAtomValue(appState.loadedExampleId);
    let template = useSelectedTemplate();
    let example = loadedExampleId ? template.examples.filter( (e: any) => e.id === loadedExampleId)[0] : null;

    return example?.name;
}

export const useStateToJSON = (): Record<string, any> => {
    let [templates] = useAtom(appState.templates);
    let [templateIndex] = useAtom(appState.templateIndex);
    let [loadedExampleId] = useAtom(appState.loadedExampleId);
    let [currentValues] = useAtom(appState.currentValues);

    return {
        templates: templates,
        templateIndex: templateIndex,
        loadedExampleId: loadedExampleId,
        currentValues: currentValues
    };
}

export const useCurrentValue = (key: string): string | null => {
    return useAtomValue(appState.currentValues)[key];
};