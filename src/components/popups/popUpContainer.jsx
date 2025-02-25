import { useEffect } from "react"
import "./popUpContainer.css"

export const PopUpContainer = ({ isOpen, close, children }) => {

    useEffect(() => {
        if (isOpen) {
            document.querySelector("body").style.overflow = "hidden";
        } else {
            document.querySelector("body").style.overflow = "auto";
        }
        return (() => {
            document.querySelector("body").style.overflow = "auto";
        })
    }, [isOpen])

    if (!isOpen) { return }
    return (
        <div className="containerPopUp" onClick={() => { close() }}>
            <div className="popUp" onClick={(e) => { e.stopPropagation() }}>
                {children}
                <button className="btnClosePopUp" onClick={() => { close() }}>✘</button>
            </div>
        </div>
    )
}