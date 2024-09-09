import React, { useContext, useState } from "react";
import "./2FA.css";
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";

const TWO_FA = () => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState();
  const [code, setCode] = useState("");
  const api = useAxios();
  // console.log(code);
  const getQRImage = async () => {
    try {
      const response = await api.post("/api/users/qrImage", {
        email: user.email,
      });

      if (response.status === 200) {
        console.log(response.data);

        setImage(response.data?.image);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handle2FAcode = async (e) => {
    try {
      e.preventDefault();
      const response = await api.post("api/users/2FACode", {
        code,
        email: user.email,
      });
      if (response.status === 200) {
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="twoFAContainer">
      <button id="enable2FAButton" onClick={getQRImage}>
        UPDATE/ENABLE 2FA
      </button>
      {image && (
        <div id="twoFAFormContainer">
          <img
            id="qrCodeImage"
            alt="QR Code"
            src={image}
            height="150"
            width="150"
          />
          <form
            onSubmit={(e) => {
              handle2FAcode(e);
            }}
            id="twoFAForm"
          >
            <input
              type="text"
              name="code"
              value={code}
              placeholder="2FA Code"
              className="code-input"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
            <button className="img-button" type="submit">
              Set Code
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TWO_FA;
