
interface Props {
  recipient: string;
  recipientName?: string;
  amount: string;
  sender: string;
  senderName?: string;
  expirationDate: string;
  message?: string;
  authorizedPerson?: string;
  qrData: string;
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
  amount,
  qrDataUrl
}) => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <h1>${recipientName || recipient}</h1>
        ${recipientName ? `<p>${recipient}</p>` : ''}
        <p>
          Expires ${new Date(expirationDate).toLocaleDateString('en-us')}
        </p>
        <p>
          ====================================================
        </p>
        <p>${amount} XRP</p>
        <p>
          ====================================================
        </p>
        ${authorizedPerson && `<p>ID Required for ${authorizedPerson}</p>`}
        <p>Issued by ${senderName || sender}</p>
        ${senderName ? `<p>${sender}</p>` : ''}
        ${message ? `<p>${message}</p>` : ''}
        <div />
        <div>
          <img src="data:image/png;base64,${qrData}" width="600" />
        </div>
        <p>${qrDataUrl}</p>
      </body>
    </html>
  `
  ;

export default getReceiptForPrint;
