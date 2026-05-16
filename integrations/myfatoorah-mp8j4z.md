# Myfatoorah
> **Kind:** `url`
> **Source URL:** https://docs.myfatoorah.com/docs/get-started
> **Last refreshed:** 2026-05-16T16:34:29.306Z
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

### https://docs.myfatoorah.com/docs/get-started

Introduction

In this section of the documentation, we will explain the different types of integration with MyFatoorah. This guide helps developers to get a better understanding of the exact technical endpoints and functions needed. It will serve the business accordingly and save development time and efforts to project the required business needs on the desired API and integration.

Integration Methods

Embedded Payment (Recommended)

Allow customers to complete the payment directly on your checkout page, while supporting hosted payment methods through a single integration.

Hosted Payment Page

You are able to redirect the client to the payment page based on the payment method he chose to pay from his side.

Invoicing

You are able to create a payment link and send it to your customers via email, SMS, or both. The customer can pay with any of the activated payment methods to your account.

Direct Payment

Collect card details or decrypt wallet tokens and send them to us. PCI Certificate is required

Updating Your System

Webhook

Keeps your system instantly updated through server-to-server notifications.

Get Payment Details

GET Payments keeps your system updated with the transaction status changes.

📘

Recommended Action

Kindly review the following section for more understanding of the best way to update your system with the payment status: Updating Payment Status Guidelines

Demo Environment

Test Cards

Perform virtual transactions and make sure everything is perfectly working before going live.

Test Token

Simulate live production without the need for actual payment.

📘

Demo Account Registration

To test your integration without real transactions, create a demo account by registering at https://registertest.myfatoorah.com/en/ , selecting Kuwait as the country, and skipping the bank details step. After completing the registration, email [email&#160;protected] to activate your demo account and enable the required features.

📘

API & Portal URLs

To identify the correct API Base URL and Portal URL for your environment, please refer to this table.

Updated 3 months ago

Copy Page
