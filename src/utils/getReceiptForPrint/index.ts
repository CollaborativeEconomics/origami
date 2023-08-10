import appIcon from "./appIcon";
import watermark from "./watermark";

interface Props {
  recipient: string;
  recipientName: string;
  amount: string;
  sender: string;
  senderName: string;
  expirationDate: string;
  message: string;
  authorizedPerson?: string;
  qrData: string;
  qrDataWithoutFulfillment: string;
  txid: string;
}

const getReceiptForPrint = ({
  recipient,
  recipientName,
  expirationDate,
  sender,
  senderName,
  authorizedPerson,
  message,
  qrData,
  qrDataWithoutFulfillment,
  amount,
  txid,
}) => {
  return `
<html>
<head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
  />
  <style>
    @media print {
      @page {
        size: auto;
        margin: 0;
      }
      .noprint {
        display: none;
      }
    }
  </style>
</head>
<body style="margin: 0 auto; font: normal 0.6rem sans-serif; height: 93%">
  <div
    id="voucher"
    style="
      margin: 0px;
      padding: 30px;
      line-height: 1.2em;
      height: 100%;
      display: flex;
      flex-direction: column;
    "
  >
    <div
      id="voucher-top"
      style="
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
      "
    >
      <div style="flex: 1; display: flex; flex-direction: column">
        <img
          style="
            position: absolute;
            width: 80%;
            top: 10%;
            left: 50%;
            translate: -50%;
            z-index: -1;
            opacity: 0.3;
          "
          src="${watermark}"
        />
        <div>
          <h2 style="margin-bottom: 20px; text-align: center">
            ORIGAMI E-VOUCHER
          </h2>
          <h3
            style="
              margin-bottom: 40px;
              text-align: center;
              font-weight: normal;
              color: #333;
            "
          >
            BENEFICIARY COPY
          </h3>
        </div>
        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
          "
        >
          <div
            id="senderReceiver"
            style="
              align-self: stretch;
              display: flex;
              justify-content: space-between;
            "
          >
            <div>
              <p>Issued by:</p>
              ${senderName ? `<h2>${senderName}</h2>` : ''}
              <h3 style="overflow-wrap: break-word;">${sender}</h3>
              <p><i>${message}</i></p>
            </div>
            <div>
              <p>Issued for:</p>
              ${recipientName ? `<h2>${recipientName}</h2>` : ''}
              <h3 style="overflow-wrap: break-word;">${recipient}</h3>
              <p>Expires ${expirationDate}</p>
              ${authorizedPerson ? `<p><b>ID Required for ${authorizedPerson}</b></p>` : ''}
            </div>
          </div>
          <div
            style="
              margin-top: auto;
              align-self: flex-end;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            "
          >
            <h2 style="font-size: 3em; margin-top: 40px">
              ***${amount} <small>XRP</small>
            </h2>
            <img
              width="130"
              height="130"
              src="data:image/png;base64,${qrDataWithoutFulfillment}"
            />
            <p style="overflow-wrap: break-word; width: 130px;"><b>ID: ${txid}</b></p>
            <!-- <p>https://example.com/verify/qr/1234567890</p> -->
          </div>
          <div style="justify-content: flex-end; align-self: center">
            <p
              style="
                padding: 10px;
                font-size: 1.5em;
                color: #333;
                border: 3px double #333;
                border-radius: 10px;
              "
            >
              THIS COPY IS NON-REDEEMABLE
            </p>
            <p style="line-height: 1em">
              Print this voucher, cut along the dotted line and keep this
              copy<br />Redeemer copy can be used at any approved merchant
            </p>
          </div>
        </div>
      </div>
    </div>
    <hr style="margin: 30px 0; border: none; border-top: 1px dashed #333" />
    <div id="voucher-bottom" style="position: relative; flex: 0;">
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          position: relative;
        "
      >
        <div style="width: 33%;">
          <div id="voucher-recipient">
            <p>Issued for:</p>
            ${recipientName ? `<h2>${recipientName}</h2>` : ''}
            <h4 style="overflow-wrap: break-word;">${recipient}</h4>
            <p>Expires ${expirationDate}</p>
            ${authorizedPerson ? `<p><b>ID Required for ${authorizedPerson}</b></p>` : ''}
          </div>
          <div id="voucher-sender" style="margin-top: 40px">
            <p>Issued by:</p>
            ${senderName ? `<h2>${senderName}</h2>` : ''}
            <h4 style="overflow-wrap: break-word;">${sender}</h4>
            <p><i>${message}</i></p>
          </div>
        </div>
        <div style="width: 34%">
          <h2 style="margin-bottom: 20px; text-align: center">
            ORIGAMI E-VOUCHER
          </h2>
          <h3
            style="
              margin-bottom: 20px;
              text-align: center;
              font-weight: normal;
              color: #333;
            "
          >
            REDEEMER COPY
          </h3>
          <div
            style="border: 1px solid black; padding: 10px; border-radius: 10px;"
          >
            <div
              style="display: flex; align-items: center; justify-content: space-between"
            >
              <img
                style="width: 80px"
                src="${appIcon}"
              />
              <img
                width="80"
                src="data:image/png;base64,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"
              />
            </div>
            <div>
              <p>Download the Origami mobile app</p>
              <p>https://cfce.io/origami</p>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; width: 33%;">
          <h2 style="font-size: 3em">***${amount} <small>XRP</small></h2>
          <img
            width="130"
            height="130"
            src="data:image/png;base64,${qrData}"
          />
          <p style="overflow-wrap: break-word; width: 130px"><b>ID: ${txid}</b></p>
          <!-- <p>https://example.com/verify/qr/1234567890</p> -->
        </div>
      </div>
    </div>
  </div>
</body>
</html>

  `;
}


export default getReceiptForPrint;
