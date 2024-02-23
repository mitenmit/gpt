import './App.css';

import Trigger from '@rc-component/trigger';
import copy from 'copy-to-clipboard';
import { useSetAtom } from "jotai"
import { Fragment } from 'react';
import {Toaster, toast} from "react-hot-toast";
import Modal from "react-modal"

import { DialogComponent, useModal } from "./components/Dialog"
import * as icons from "./components/Icons"
import { Menu } from "./components/Menu"
import { PromptBuilder } from "./components/PromptBuilder"
import { TemplateBuilder, setModalOpenAtom, compilePrompt } from "./components/TemplateBuilder"
import * as state from "./state";
import { WorkspaceMenuOptions, openFileHandleAtom, onWorkspaceMenuItemClick} from "./Workspace"


function PipeSeparator() {
  return <Fragment>{" | "}</Fragment>;
}


/***
 * Manage Templates
 */

function DeleteTemplateModalBody () {
  return (
    <div>
      <strong>
        <div style={{color: "#777777"}}>Are you sure you want to delete the following template?</div>
        <div style={{color: "#333333"}}>{state.useSelectedTemplateName()}</div>
      </strong>
    </div>
  );
}

function TemplateList() {
  let selectedTemplateName = state.useSelectedTemplateName()
  let templateIndex = state.useTemplateIndex();
  let templateOpts = state.useTemplateOptions();
  let setTemplateIndex = useSetAtom(state.useAction("select_template"));

  return (
    <Trigger  maskClosable={false}
              popup={<Menu value = {templateIndex} options = {templateOpts} onMouseDown = {(k) => {setTemplateIndex(k)}} />}
              popupAlign={{points: ["tl", "bl"], offset: [0, 5]}}>
      <a>
        {selectedTemplateName} 
        <span style={{fontSize: 14}}> <icons.CaretDown/> </span>
      </a>
    </Trigger>
  );
}

function TemplateDelete() {
  let setModal = useSetAtom(useModal());
  let templateId = state.useSelectedTemplateId();
  let deleteTemplate = useSetAtom(state.useAction("delete_template"));

  const deleteModal = () => {
    setModal({title: "Delete Template",
              body: <DeleteTemplateModalBody />,
              footerButtons: [["Delete", { className: "primary", onClick: () => deleteTemplate(templateId)}],
                              ["Cancel", {}]]})
  }

  return (
    <Fragment> 
      <PipeSeparator />
      <a style={{color: "red"}} onClick={deleteModal}> <icons.DeleteRedIcon/> Delete </a> 
    </Fragment>
  );
}

function TemplateSelector() {
  let setModalOpen = useSetAtom(setModalOpenAtom);
  
  let templateCount = state.useTemplates().length;
  let templateId = state.useSelectedTemplateId();
  
  
  return (
    <Fragment>
      <TemplateList />
      <span style={{fontSize: 12, marginLeft: 3}}>
        [
        <a onClick={() => setModalOpen(templateId)}> <icons.EditIcon/> Edit </a>
        {templateCount > 1 ? <TemplateDelete/> : null}
        ]
      </span>
    </Fragment>
  );
}


/***
 * Manage Examples
 */

function ExampleNameModalBody() {
  let exampleName = state.useNewExampleName();
  let setValue = state.useSetNewExampleName();
  return (
    <div>
      <div><strong>Enter a name for the example:</strong></div>
      <div style={{userSelect: "none"}}>
        <input type = "text" style={{width: "100%"}} value={exampleName} onChange={ (e) => setValue(e.target.value)}/>
      </div>
    </div>
  );
}

function ExamplesList() {
  let loadExample = useSetAtom(state.useAction("load_example"));
  let exampleId = state.useLoadedExampleId() || undefined;
  let examples = state.useSelectedTemplateExampes();
  let exampleOptions = examples.map( (e: any) => {return {key: e.id, label: e.name }} )

  return (
    <Trigger  popup = {<Menu value = {exampleId} options={exampleOptions} onMouseDown = { loadExample }/>}
              popupAlign = {{points: ["tl", "bl"], offset: [0, 5]}}>
      <a>
        <icons.FileTextIcon /> {" Examples (" + examples.length + ")"} <icons.CaretDown />
      </a>
    </Trigger>
  );
}

function SetAsExample() {
  let setModal = useSetAtom(useModal());
  let createExample = useSetAtom(state.useAction("create_example"));

  const createExampleModal = () => {
    setModal({ title: "Create Example",
               body: <ExampleNameModalBody/>,
               footerButtons: [["Create", { className: "primary", onClick: () => createExample()}],
                               ["Cancel", {}]]}) 
  }
  
  return (
    <Fragment>
      <a onClick = { createExampleModal }>
        <icons.Plus/> {" Set As Example"}
      </a>
      <PipeSeparator/>
    </Fragment> 
  );  
}

function UpdateExample() {
  let loadedExampleId = state.useLoadedExampleId();
  let isExampleModified = state.useIsExampleModified();
  let updateExample = useSetAtom(state.useAction("update_example"));

  return (
    isExampleModified ?
      <Fragment>
        <a onClick={ () => updateExample(loadedExampleId) }><icons.EditIcon/> {" Update Example"}</a>
        <PipeSeparator/>
      </Fragment>
      : null
  );  
}

function ClearExample() {
  let loadExample = useSetAtom(state.useAction("load_example"));
  return (
    <a onClick = {() => loadExample(null)}><icons.CloseCircleIcon /> {" Clear"}</a> 
  );  
}

function DeleteExampleModalBody() {
  let exampleName = state.useLoadedExampleName();
  return (
    <div>
      <strong>
        <div style={{color: "#777777"}}>Are you sure you want to delete the following example?</div>
        <div style={{color: "#333333"}}>{exampleName}</div>
      </strong>
    </div>
  );
}

function DeleteExample() {
  let loadedExampleId = state.useLoadedExampleId();
  let deleteExample = useSetAtom(state.useAction("delete_example"));
  let setModal = useSetAtom(useModal());

  let deleteExampleModal = () => {
    setModal({title: "Delete Example",
              body: <DeleteExampleModalBody/>,
              footerButtons: [["Delete", { className: "primary", onClick: deleteExample}],
                              ["Cancel", {}]]})  
  }
  
  return (
    loadedExampleId ? 
      <Fragment>
        <PipeSeparator/>
        <a style = {{color: "red"}} onClick = {deleteExampleModal}>
          <icons.DeleteRedIcon /> {" Delete Example"}
        </a> 
      </Fragment>
      : null
    
  );  
}

function BuildPromptMenu() {
  let loadedExampleId = state.useLoadedExampleId();
  let valuesEmpty = state.useCurrentValuesEmpty();
  
  return (
    <span style={{fontSize: 12}}>
      [
      <ExamplesList /> 
      <PipeSeparator/>
      { !valuesEmpty ?
          !loadedExampleId ? <SetAsExample/> : <UpdateExample/>
          : null
      }
      <ClearExample />
      <DeleteExample />
      ]
    </span>
  );
}


/***
 * Complete Prompt
 */

function copyToClipboard(currentPrompt: string) {
  copy(currentPrompt);
  toast.success("Propmpt Copied to Clipboard");
}

function CurrentPromptMenu() {
  let template = state.useSelectedTemplate().template;
  let currentValues = state.useCurrentValues();
  let currentPrompt = compilePrompt(template, currentValues);

  return (
    <span style={{fontSize: 12}}>
      [ <a onClick={() => {copyToClipboard(currentPrompt)}}> <icons.CopyIcon /> Copy to Clipboard</a> ]
    </span>
  );
}

function CompletePrompt() {
  let template = state.useSelectedTemplate().template;
  let currentValues = state.useCurrentValues();
  let currentPrompt = compilePrompt(template, currentValues);
  
  return (
    <pre className="ready-prompt">
      { currentPrompt ? currentPrompt : "[Empty prompt, use the builder to create a prompt]" }
    </pre>
  );
}


/***
 * Application components
 */

function Header() {
  let setModalOpen = useSetAtom(setModalOpenAtom);
  let setFileHandle = useSetAtom(openFileHandleAtom);
  let loadWorkspace = useSetAtom(state.useAction("load_workspace"));
  let saveWorkspace = useSetAtom(state.useAction("save_workspace"));

  const handleWorkspaceMenuActions = 
        (key: any, label: any) => onWorkspaceMenuItemClick(key, label, loadWorkspace, saveWorkspace, setFileHandle)

  return (
    <div className='header'>
      <div className='container flex'>
        <div className='header-left'>
          <h1>LLM Prompting</h1>
          <div className="title-caption">Chat GPT, Bard, Claude2 , and others</div>
        </div>
        <div className='header-right'>
          <a className="create-template button" onClick={() => setModalOpen(true)}> <icons.FolderPlusIcon/> Create Template</a>
          <Trigger action = {["click"]} 
                   maskClosable={false} 
                   popupAlign = {{points: ['tr', 'br'],  offset: [0, 5]}}
                   popup = {<Menu options={WorkspaceMenuOptions()} onMouseDown={ handleWorkspaceMenuActions }/>}>
            <a className="button" style={{marginLeft: 10}}><icons.Menu/></a>
          </Trigger>  
        </div> 
      </div>
    </div>
  );
}

Modal.setAppElement('#root');  // Required by react-modal

function App() {
  let template = state.useSelectedTemplate();
  let setTemplate = useSetAtom(state.useAction("set_template"));
  return (
    <div className="App">
      <Header/>
      <div className="container">
        <h2>Select a template: <TemplateSelector/></h2>
        <h2>Build a Prompt: <BuildPromptMenu/></h2>
        <PromptBuilder promptTemplate={template}/>
        <h2>Prompt: <CurrentPromptMenu /></h2>
        <CompletePrompt />
      </div>
      <TemplateBuilder onSubmit = { setTemplate }/>
      <DialogComponent />
      <Toaster position="bottom-center"/>
    </div>
  );
}

export default App;