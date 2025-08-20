import "../../../styles/shared/common/SideModal.css";
import { useEffect, useState } from "react";

export default function InsideSideModal(props: any) {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (props.visible) {
      setVisible(true);
      setTimeout(() => setShowModal(true), 100);
    } else {
      setShowModal(false);
      setTimeout(() => setVisible(false), 100);
    }
  }, [props.visible]);

  return (
    <div>
      {visible && (
        <div className={`modal-overlay show`}>
          <div
            className={`modal-container modal-inside ${
              showModal ? "slide-in" : "slide-out"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between py-2 mx-3 modal-heading">
              <div className="d-flex align-items-center button-class">
                <h6 className="mb-0 me-1">{props.title}</h6>
              </div>

              <div
                onClick={() => props.closeModal()}
                className="d-flex flex-row align-items-center back-sider"
              >
                <i className="bi bi-arrow-left me-1"></i>

                <img src={"/images/modalhead/" + props.image} alt="Sider-Img" />
              </div>
            </div>

            <div className="modal-content-body py-3 px-3">{props.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
