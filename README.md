# Product Reviews Summarizer Mock API

This is an example Adobe I/O Runtime action that demonstrates how to fetch product reviews and return them in the expected format for integration with other systems.

## Overview

This action serves as a mock API that fetches product reviews for a given product ID and returns them in a standardized format. It's designed to be compatible with systems expecting the `ReviewsResponse` format defined in `actions-src/types/review.ts`.

## Expected Response Format

The action returns data in the `ReviewsResponse` format:

```typescript
interface ReviewsResponse {
  reviews: Review[];
  pagination: Pagination;
  averageScore: number;
  totalReviews: number;
}
```

Where each `Review` contains:

- `id`: Unique identifier for the review
- `score`: Numerical rating (typically 1-5)
- `content`: The review text content
- `title`: Review title/summary
- `createdAt`: ISO string timestamp

## Usage

### Input Parameters

The action accepts the following parameters:

```typescript
{
  data: {
    productId: string;     // Required: Product identifier
    page?: number;         // Optional: Page number (default: 1)
    perPage?: number;      // Optional: Items per page (default: 10)
    sort?: string;         // Optional: Sort field
    direction?: string;    // Optional: Sort direction (asc/desc)
  }
}
```

### Example Request

```json
{
  "data": {
    "productId": "product-123",
    "page": 1,
    "perPage": 20,
    "sort": "createdAt",
    "direction": "desc"
  }
}
```

### Example Response

```json
{
  "statusCode": 200,
  "body": {
    "reviews": [
      {
        "id": "review-1",
        "score": 5,
        "content": "Great product! Highly recommended.",
        "title": "Excellent quality",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 20,
      "total": 1
    },
    "averageScore": 5.0,
    "totalReviews": 1
  }
}
```

## Implementation Details

- **Entry Point**: `actions-src/reviews/mock-api/index.ts`
- **Main Function**: `main(params: MockFunctionParams)`
- **GraphQL Client**: Uses `commerce-reviews-graphql-client.ts` for data fetching
- **Error Handling**: Returns standardized error responses with appropriate HTTP status codes
- **Logging**: Integrated logging for debugging and monitoring

## Key Features

1. **Standardized Format**: Returns data in the exact `ReviewsResponse` format expected by consuming applications
2. **Pagination Support**: Handles paginated requests with configurable page size
3. **Sorting Options**: Supports sorting by various fields with ascending/descending order
4. **Error Handling**: Comprehensive error handling with meaningful error messages
5. **Type Safety**: Full TypeScript support with defined interfaces

## Integration Notes

When integrating with other systems, ensure they expect the `ReviewsResponse` format as defined in `actions-src/types/review.ts`. This format includes:

- An array of review objects
- Pagination metadata
- Aggregated statistics (average score and total count)

This standardized format ensures consistent data exchange between different components of the product reviews system.
