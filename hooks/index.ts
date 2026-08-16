import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(callBack:()=>void){
    const ref = useRef<T>(null);

    useEffect(()=>{
        const handleClickedOutside = (e:MouseEvent)=>{
            if(ref.current && !ref.current.contains(e.target as Node)){
                callBack();
            }
        }
        document.addEventListener('mousedown', handleClickedOutside);
        return () =>{
            document.addEventListener('mousedown', handleClickedOutside);
        }
    },[callBack])
    return ref;
}