import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props{
    inverted?: Boolean;
    content?: string;
}

export default function LoadingComponent({inverted, content}: Props){
    return(
        <Dimmer active={true} inverted = {inverted}>
            <Loader content = {content}/>
        </Dimmer>
    )
}