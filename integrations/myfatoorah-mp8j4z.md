# Myfatoorah
> **Kind:** `url`
> **Source URL:** https://docs.myfatoorah.com/reference/create-payment
> **Last refreshed:** 2026-05-16T16:12:23.983Z
## Owner notes

Along side stripe add my fatoorah integration 

Note that it will send url to put card details

## 🧪 Sandbox / test credentials

> Owner-provided test card numbers, sandbox API keys, sandbox endpoints, test OTPs, etc. Use these for integration testing — never production data.

```
8888880000000001 09/30 pin-1234 captured

8888880000000001 06/10 pin-1234 not-captured
```

## Docs

### https://docs.myfatoorah.com/reference/create-payment

TimeStatusUser Agent

Retrieving recent requests…

Loading…

PaymentMethodstring

enum

Defaults to CARD

Specify the payment method you want to use, or omit this parameter to create a payment page that displays all enabled methods. This is required for redirection cases.

CARDAPPLE_PAYGOOGLE_PAYKNET

Allowed:CARDAPPLE_PAYGOOGLE_PAYKNET

Orderobject

required

Order information related to the payment..

Order object

SourceOfFundobject

Contains the payment source details (Tokenized card, direct card details, or Session Id)

SourceOfFund object

PaymentExpirydate-time

The payment expiration date. Must be in UTC timezone.

SaveCardOptionsobject

Used to tokenize card details when using direct integration.

SaveCardOptions object

ThreeDSobject

3D Secure authentication details for the direct card transaction.

ThreeDS object

NotificationOptionstring

enum

Defines how the customer receives invoice notifications.
Note: Email or mobile becomes mandatory based on the selected option.

EMAILSMSALLLINK

Allowed:EMAILSMSALLLINK

OperationTypestring

enum

Defines the type of payment operation.

AUTHORIZEPAY

Allowed:AUTHORIZEPAY

Suppliersarray of objects

Required only if Multi-Vendor feature is enabled.

SuppliersADD  object

Customerobject

Customer information that will be returned back to you in webhook events.

Customer object

IntegrationUrlsobject

URLs for redirecting and receiving payment status notifications.

IntegrationUrls object

Languagestring

enum

Invoice language.

ENAR

Allowed:ENAR

IpAddressstring

The customer’s IP address

MetaDataobject

Custom fields stored with the transaction and returned in the webhook.

MetaData object

DisplayPaymentMethodsarray of strings

Array of payment methods to be displayed on the invoice page.
such as: ["card", "knet", "googlepay", "applepay"]
If this parameter is not sent, and the PaymentMethod field is also not provided, all payment methods enabled on your account will be displayed automatically.

DisplayPaymentMethodsADD  string

NetworkTransactionIdstring

Can be used when paying with network tokens.

 201

Payment created successfully

Updated 4 months ago

ShellNodeRubyPHPPython

Loading…

Click Try It! to start a request and see the response here! Or choose an example:

application/json

201 - Payment Response201 - Payment Response with Result of Payment (when paying with a session and disabling 3DS)

Updated 4 months ago
