# E-commerce Domain

## Purpose

Define the standard e-commerce domain used by the E-commerce Foundation.
The Foundation uses Vendure's native commerce domain whenever possible.

The Foundation must not create parallel domain models for concepts
already provided by Vendure.

Store-specific business requirements should remain isolated from the
standard domain whenever possible.

## Standard Domain

The Foundation is organized around the following core e-commerce areas:

### Catalog

Represents the products and commercial information offered by the store.

Includes:

- Products
- Product variants
- Categories
- Collections
- Prices
- Inventory
- Stock
- Product assets

### Customers

Represents users who interact with the store.

Includes:

- Customer accounts
- Customer information
- Addresses
- Authentication

### Cart

Represents the customer's current purchase.

Includes:

- Cart
- Cart lines
- Quantities
- Prices
- Discounts

### Checkout

Represents the process of preparing a cart for order creation.

Includes:

- Customer information
- Addresses
- Shipping
- Payment
- Order validation

### Orders

Represents completed purchases and their lifecycle.

Includes:

- Orders
- Order lines
- Order states
- Payment state
- Fulfillment state

### Payments

Represents the payment process associated with an order.

Includes:

- Payment methods
- Payment transactions
- Payment states
- Refunds
- Payment webhooks

The standard payment provider is Wompi.

Payment integrations should use Vendure's payment architecture.

### Shipping

Represents the delivery of orders.

Includes:

- Shipping methods
- Shipping eligibility
- Shipping costs
- Fulfillment
- Tracking

### Promotions

Represents commercial incentives applied to purchases.

Includes:

- Discounts
- Coupons
- Promotional conditions
- Promotional actions

## Domain Principles

- Prefer Vendure's native domain capabilities.
- Do not duplicate Vendure entities without a clear architectural reason.
- Keep business rules close to the domain they belong to.
- Keep store-specific requirements isolated from the standard domain.
- Extend the domain only when a real business requirement cannot be
  adequately represented using Vendure's existing capabilities.
- New domain extensions must be documented when they affect the
  Foundation architecture.

## Store-Specific Domain

A store may introduce requirements that are not part of the standard
Foundation domain.

Examples include:

- Product personalization
- Custom product configuration
- Special order workflows
- Subscription models
- Loyalty programs
- Marketplace functionality

Store-specific requirements should not become part of the Foundation
unless they are identified as reusable across multiple e-commerce
projects.
