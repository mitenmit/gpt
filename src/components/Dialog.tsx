
import Modal from "react-modal"
import {ClearIcon} from "../components/Icons"
import { atom, useSetAtom, useAtomValue } from "jotai"

let _sampleState = {title: "Dialog Title",
                    body: <div>Body</div>,
                    footerButtons: [["OK", {class: "primary", onClick: () => false}],
                                    ["Cancel", {onClick: () => {}}]]}

const stateAtom = atom(null);

export function useModal() {
    return atom(null, (get, set, opts: any) => {
        set(stateAtom, opts);
    })
}

function useCloseModal() {
    return atom(null, (get, set) => {
        let state:any = get(stateAtom);
        set(stateAtom, {...state, open: false});
    })
}

function Header(props:any ) {
    let closeModal = useSetAtom(useCloseModal());
    return (
        <div className="modal-header" style={{paddingBottom: 10}}>
            <h3>
                {props.title ? props.title : "Modal"}
                <a style={{color: "#777777", float: "right", padding: 5}} onClick={closeModal}> <ClearIcon /> </a>
            </h3>
        </div>        
    );    
}

function Body() {
    let currentState = useAtomValue<any>(stateAtom);
    return (
        <div className="modal-body" style={{padding: "25px 30px"}}>
            {currentState && currentState.body ? currentState.body : ""}
        </div>        
    );    
}

function interpose(arr: Array<any>, sep: any) {
    let arr1: Array<any> = arr.map(v => [sep, v]);
    return [].concat(...arr1).slice(1);
}

function footerBodyClick(onClick: Function | null, closeModal: Function) {
    if (typeof onClick === 'function') {
        let result = onClick();
        if (result !== false) closeModal()
    } else {
        closeModal();
    }
}

function Footer() {
    let currentState = useAtomValue<any>(stateAtom);
    let closeModal = useSetAtom(useCloseModal());
    let footerButtons = currentState && currentState.footerButtons ? currentState.footerButtons : [];
    let buttons:Array<any> = footerButtons.map(([txt, opts]: [string, any], i: number) => {
        let className = opts && opts.className ? opts.className : "";
        let onClick = opts && opts.onClick ? opts.onClick : null;
        return <a key={i} className={"button " + className} onClick={() => {footerBodyClick(onClick, closeModal)}}>{txt}</a>
    });

    return (
        <div className="modal-footer" style={{paddingTop: 10, textAlign: "right"}}>
            {interpose(buttons, " ")}
        </div>        
    );    
}

export function DialogComponent() {
    let currentState = useAtomValue<any>(stateAtom);
    let closeModal = useSetAtom(useCloseModal());
    let modalStyle: any  = {overlay: {background: "rgba(0,0,0,0.7)"},
                            content: {position: "relative", width: "500px", margin: "auto auto", padding: 0, inset: 0, marginTop: "7%"}}
    return (
        <Modal isOpen={currentState && currentState.open !== false ? true : false}
               closeTimeoutMS={200}
               onRequestClose={closeModal}
               style={modalStyle}
               >
            <div className="modal">
                <Header title={currentState && currentState.title ? currentState.title : ""}/>
                <Body/>
                <Footer/>
            </div>
        </Modal>
    );
}