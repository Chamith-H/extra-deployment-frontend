import { useEffect, useState } from "react";
import "../../../styles/shared/common/ConfirmationModal.css";

export default function ConfirmationModal(props: any) {
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
        <div
          onClick={() => props.closeModal()}
          className={`modal-confirmation-overlay show`}
        >
          <div
            className={`modal-confirmation-container ${
              showModal ? "slide-in" : "slide-out"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="modal-image">
                  <img src="/images/modalhead/remove.png" alt="" />
                </div>

                <div className="modal-content ms-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="mb-0">{props.title}</h6>
                    <i
                      onClick={() => props.closeModal()}
                      className="bi bi-arrow-right"
                    ></i>
                  </div>

                  <p>{props.description}</p>
                </div>
              </div>

              <div className="d-flex justify-content-end action-confiration mt-3 pt-2">
                <h6 onClick={() => props.closeModal()} className="cancel-con">
                  CANCEL
                </h6>
                <h6 className="ms-3 delete-con">DELETE</h6>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
