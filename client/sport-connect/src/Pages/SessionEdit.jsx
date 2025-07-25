import FormSession from "../Component/FormSession";
import SideBar from "../Component/SideBar";

export default function SessionEdit() {
  return (
    <div className="d-flex">
      <SideBar />
      <div className="container mt-5">
        <h2 className="mb-4">Edit Session</h2>
        <FormSession type="edit" />
      </div>
    </div>
  );
}
