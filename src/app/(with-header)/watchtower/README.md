# Watchtower App

## Purpose
The Watchtower app provides fraud prevention and attack detection capabilities. It manages identifiers (IP, ASN, Subnet, Fingerprint) and creates scores based on events to detect and prevent fraudulent activities, SPAM, and other attacks.

## Key Features
- **Scope Types Management**: Define different types of identifiers (IP, ASN, Subnet, Browser Fingerprint, Custom Fingerprint)
- **Event Types Management**: Define event types with score factors, TTL values, and aggregation mode references
- **Aggregation Modes Management**: Configure how events are aggregated for scoring with max factors
- **Event Creation**: Create events for specific scopes to generate scores
- **IP-ASN Data Management**: Manage IP to ASN mappings and organization data
- **Score Calculation**: Automatically calculate scores for identifiers based on events and aggregation modes
- **Scopes**: View and manage individual scopes with their events and scores

## Routes
- Base route: `/watchtower`
- Service selection: `/watchtower` (automatic redirect if only one service)
- Service route: `/watchtower/[serviceId]`
- Scope Types: `/watchtower/[serviceId]/scope-type`
- Event Types: `/watchtower/[serviceId]/event-type`
- Events: `/watchtower/[serviceId]/event`
- IP-ASN Data: `/watchtower/[serviceId]/ip-asn`
- Aggregation Modes: `/watchtower/[serviceId]/aggregation-mode`
- Scopes: `/watchtower/[serviceId]/scope`

## Backend and Data Access
- Service layer: `src/services/watchtower/`
- Types: `src/services/watchtower/watchtower.type.ts`
- Service: `src/services/watchtower/watchtower.service.ts`
- In server code, use `fetchService` from `src/utils/fetchService.ts` with `serviceId` option.

## API Endpoints (Watchtower Server)
- `GET /v1/scope-types` - List scope types
- `POST /v1/scope-types` - Create scope type
- `GET /v1/scope-types/{id}` - Get scope type by ID
- `GET /v1/scope-data-types` - List scope data types
- `POST /v1/scope-data-types` - Create scope data type
- `GET /v1/event-types` - List event types
- `POST /v1/event-types` - Create event type
- `GET /v1/event-types/{id}` - Get event type by ID
- `POST /v1/events` - Create event
- `GET /v1/scopes` - List scopes
- `GET /v1/scopes/{id}` - Get scope by ID
- `GET /v1/scopes/{scopeId}/events` - List events for a scope
- `POST /v1/score/_actions/calculate` - Calculate score for scopes
- `GET /v1/ip-asn/datasources` - List IP-ASN datasources
- `POST /v1/ip-asn/datasources` - Create IP-ASN datasource
- `GET /v1/ip-asn/datasources/{datasourceId}/data` - List IP-ASN data for datasource
- `POST /v1/ip-asn/datasources/{datasourceId}/data` - Create IP-ASN data entry
- `GET /v1/aggregation-modes` - List aggregation modes
- `POST /v1/aggregation-modes` - Create aggregation mode
- `GET /v1/aggregation-modes/{id}` - Get aggregation mode by ID
- `PATCH /v1/aggregation-modes/{id}` - Update aggregation mode

## UI Structure
- App-specific reusable components: `src/components/apps/watchtower/`
- Prefer universal UI elements from `src/components/universals/`.

## Concepts

### Scope Types
Scope Types define the types of identifiers that can be tracked:
- **IP**: Individual IP addresses (IPv4/IPv6)
- **ASN**: Autonomous System Numbers
- **Subnet**: IP subnets (CIDR notation)
- **Browser Fingerprint**: Browser fingerprint identifiers
- **Custom Fingerprint**: Custom fingerprint identifiers

### Event Types
Event Types define categories of events that can affect scores:
- Each has a `defaultScoreFactor` (positive or negative)
- Each has a `defaultTtlSeconds` (how long the event affects the score)
- Examples: "SPAM", "Brute Force", "Valid Request", "Suspicious Activity"

### Events
Events are specific occurrences that affect scores for scopes:
- Must have an `eventTypeId`
- Can have multiple `scopes` (identifiers)
- Can have an optional `externalId` for tracking
- Score is calculated based on the Event Type's score factor
- Events expire after the TTL period

### Scopes
Scopes represent individual identifiers (IP, ASN, Subnet, etc.) that are being tracked:
- Each scope has a type (IP, ASN, Subnet, etc.)
- Events are associated with scopes
- Scores are calculated for each scope based on its events
- Each scope can have an external ID for tracking

### IP-ASN Data
IP to ASN mapping data for automatic scope creation:
- Maps IP prefixes to ASN numbers
- Includes ASN organization information
- Used for automatic scope creation when processing IP addresses

## Score Calculation
The system automatically calculates scores for identifiers based on:
1. Event Type's default score factor
2. Scope Type's score factor (if applicable)
3. Sum of all active (non-expired) events for the identifier

Positive scores indicate trustworthy identifiers, negative scores indicate potential threats.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

**See:** [GeneratedForm Documentation](../../../components/universals/forms/generated/README.md) for detailed usage.
