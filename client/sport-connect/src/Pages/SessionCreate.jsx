import { useEffect } from "react";
import FormSession from "../Component/FormSession";
import SideBar from "../Component/SideBar";
import { useNavigate } from "react-router";

export default function SessionCreate(props) {
 
    return (
        <div className="d-flex">
            <SideBar />
            <FormSession type='add' />
        </div>
    );
}