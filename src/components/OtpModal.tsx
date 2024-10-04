import { ChangeEvent, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Modal, Button } from "react-bootstrap";

interface OtpModalProps {
  modalOtp: boolean;
  setModalOtp: (value: boolean) => void;
  setEmailOtp: (value: string[]) => void;
  handleLoginOtp: () => void;
  emailOtp: string[];
  handleChangeOtp: (e: ChangeEvent<HTMLInputElement>, index: number, 
    inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({
  modalOtp,
  setModalOtp,
  setEmailOtp,
  handleLoginOtp,
  emailOtp = ["", "", "", "", "", ""],
  handleChangeOtp,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setEmailOtp(newOtp); // Ensure we pass an array here
      inputRefs.current[5]?.focus(); // Focus on the last input
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && emailOtp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Modal
      className="loader-modal"
      show={modalOtp}
      centered
      onHide={() => {
        setModalOtp(false);
        setEmailOtp(["", "", "", "", "", ""]); // Reset OTP on modal close
      }}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body style={{ padding: "30px 20px" }}>
        <p
          style={{ color: "green", fontFamily: "monospace", fontWeight: 600 }}
        >
          Please Enter OTP Sent to Your Registered Email.
        </p>
        <div
          className="otp-inputs"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {emailOtp.map((digit, index) => (
  <input
    key={index}
    ref={(el) => {
      inputRefs.current[index] = el;
    }}
    type="text"
    className="form-control"
    maxLength={1}
    value={digit}
    onChange={(e) => handleChangeOtp(e, index, inputRefs)} // Pass inputRefs here
    onPaste={handlePaste}
    onKeyDown={(e) => handleKeyDown(e, index)}
    style={{
      width: "40px",
      height: "40px",
      textAlign: "center",
      fontSize: "20px",
      marginRight: index < 5 ? "8px" : "0",
    }}
  />
))}

        </div>
        <Button onClick={handleLoginOtp} className="golden global-button mt-3">
          Submit OTP
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
