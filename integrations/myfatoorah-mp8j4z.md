# Myfatoorah
> **Kind:** `text`
> **Last refreshed:** 2026-05-16T16:34:29.301Z
## Owner notes

Along side stripe add my fatoorah integration 

Note that it will send url to put card details

Add my Fatoorah key in env 

## 🧪 Sandbox / test credentials

> Owner-provided test card numbers, sandbox API keys, sandbox endpoints, test OTPs, etc. Use these for integration testing — never production data.

```
8888880000000001 09/30 pin-1234 captured

8888880000000001 06/10 pin-1234 not-captured
```

## Docs

Hosted Payment Page
Introduction

The Hosted Payment Page integration provides a simple and secure way to accept online payments with minimal development effort. Using this integration type, you can display a list of available payment methods configured on your MyFatoorah account, allowing your customers to select their preferred method and complete the transaction through a secure hosted page.


Supported Payment Methods:

All payment methods are supported (Cards [Visa, Mastercard, Mada, AMEX], Apple Pay, Google Pay, etc.).


API Version
Always use the /v3/endpoint for this integration. For example: https://apitest.myfatoorah.com/v3/payments




Step 2: Create a Payment Request

You need to send a POST request to /v3/payments with the selected payment method and order details. This request will return a PaymentUrl, which you should use to redirect your customer to the hosted payment page.
Endpoint: POST /v3/payments (Create Payment)

curl --request POST \
     --url https://apitest.myfatoorah.com/v3/payments \
     --header 'accept: application/json' \
     --header 'authorization: Bearer SK_KWT_vVZlnnAqu8jRByOWaRPNId4ShzEDNt256dvnjebuyzo52dXjAfRx2ixW5umjWSUx' \
     --header 'content-type: application/json' \
     --data '
{
  "PaymentMethod": "CARD",
  "Order": {
    "Amount": 10
  },
    "IntegrationUrls": {
         "Redirection": "https://your-website.com/payment-callback"
    }
}
'
 
{
    "IsSuccess": true,
    "Message": "",
    "ValidationErrors": null,
    "Data": {
        "InvoiceId": "6148108",
        "PaymentId": null,
        "PaymentURL": "https://demo.MyFatoorah.com/KWT/ie/050754719614810863-ce9138bf",
        "PaymentCompleted": false,
        "TransactionDetails": null
    }
}


After receiving the PaymentURL, redirect your customer to the PaymentURL to complete the payment on the MyFatoorah-hosted page.

Note
Use uppercase with underscores for payment method naming, for example: "CARD", "APPLE_PAY", "GOOGLE_PAY", "KNET", "BENEFIT", "STC_PAY", etc.


Step 3: Inquire Payment Status

After the payment is completed, MyFatoorah will redirect the customer to your Redirection URL (the one provided in Step 2) and append a paymentId as a query parameter. Example: https://your-website.com/payment-callback?paymentId=100201923790872553 You should then call the GET/v3/payments/{paymentId} endpoint (Get Payment Details) to check the payment status and get the full invoice and transaction details.

GET /v3/payments/07076148071303658773

curl --request GET \
     --url https://apitest.myfatoorah.com/v3/payments/[paymentId] \
     --header 'accept: application/json' \
     --header 'authorization: Bearer SK_KWT_vVZlnnAqu8jRByOWaRPNId4ShzEDNt256dvnjebuyzo52dXjAfRx2ixW5umjWSUx'
{
    "IsSuccess": true,
    "Message": "",
    "ValidationErrors": null,
    "Data": {
        "Invoice": {
            "Id": "6389491",
            "Status": "PAID",
            "Reference": "2025060917",
            "CreationDate": "2025-12-24T14:48:17.1230000Z",
            "ExpirationDate": "2026-06-22T14:48:17.1230000Z",
            "ExternalIdentifier": null,
            "UserDefinedField": "",
            "MetaData": null
        },
        "Transaction": {
            "Id": "102585",
            "Status": "SUCCESS",
            "PaymentMethod": "VISA/MASTER",
            "PaymentId": "07076389491322460173",
            "ReferenceId": "535814102585",
            "TrackId": "24-12-2025_3224601",
            "AuthorizationId": "102585",
            "TransactionDate": "2025-12-24T14:51:06.5630000Z",
            "ECI": "02",
            "IP": {
                "Address": "41.35.105.183",
                "Country": "Egypt"
            },
            "Error": {
                "Code": "",
                "Message": ""
            },
            "Card": {
                "NameOnCard": "das",
                "Number": "512345xxxxxx0008",
                "Token": "",
                "PanHash": "b888aa5f23a817883d4d12c74044bab1ae6ee65dc8d6e11515394aba452b273b",
                "ExpiryMonth": "12",
                "ExpiryYear": "34",
                "Brand": "Mastercard",
                "Issuer": "Test Bank",
                "IssuerCountry": "KWT",
                "FundingMethod": "credit"
            }
        },
        "Customer": {
            "Reference": "",
            "Name": "Anonymous",
            "Mobile": "+201020304050",
            "Email": "xeraxe9309@fftube.com"
        },
        "Amount": {
            "BaseCurrency": "KWD",
            "ValueInBaseCurrency": "20",
            "ServiceCharge": "0.4",
            "ServiceChargeVAT": "0.06",
            "ReceivableAmount": "19.54",
            "DisplayCurrency": "KWD",
            "ValueInDisplayCurrency": "20",
            "PayCurrency": "KWD",
            "ValueInPayCurrency": "20"
        },
        "Suppliers": []
    }
}

Webhook
We recommended enabling the Webhook feature to automatically notify your system when a transaction status changes in your application.
