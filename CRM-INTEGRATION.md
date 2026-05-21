# Follow Up Boss CRM Integration Guide

## Overview

The website is now integrated with Follow Up Boss CRM for automatic lead capture from contact forms.

---

## API Endpoint

**Endpoint**: `/api/followupboss`  
**Method**: POST  
**Location**: `api/followupboss.ts` (Vercel serverless function)

---

## Setup Instructions

### 1. Get Follow Up Boss API Key

1. Log in to your Follow Up Boss account
2. Go to Settings → API
3. Generate or copy your API key
4. Keep this secure - you'll need it for Vercel environment variables

### 2. Add Environment Variable to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `FUB_API_KEY`
   - **Value**: Your Follow Up Boss API key
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

### 3. Redeploy (if needed)

After adding the environment variable:
```bash
vercel --prod
```

Or trigger a new deployment by pushing to GitHub (Vercel will auto-deploy).

---

## Forms Integrated

### 1. Valuation Form (`valuation.html`)

**Fields Captured**:
- Name (first/last)
- Email
- Phone
- Property Address
- Bedrooms
- Bathrooms
- Square Feet
- Special Features (checkboxes)
- Timeline
- Additional Notes

**Tags Applied**: `Website Lead`, `Valuation Request`

### 2. Consultation Form (`contact.html`)

**Fields Captured**:
- Name (first/last)
- Email
- Phone
- Service Interest (dropdown)
- Timeline
- Message

**Tags Applied**: `Website Lead`, `[Service Interest]`

---

## Lead Data Structure

### Standard Fields
```javascript
{
  firstName: "John",
  lastName: "Doe",
  emails: [{ value: "john@example.com" }],
  phones: [{ value: "(702) 555-1234" }],
  source: "Skye Summit Website - Valuation Request",
  tags: ["Website Lead", "Valuation Request"]
}
```

### Custom Fields (for valuation requests)
```javascript
{
  customFields: {
    bedrooms: "3",
    bathrooms: "2.5",
    squareFeet: "2500",
    features: "corner-lot, golf-view, pool",
    timeline: "1-3 months",
    additionalNotes: "Looking to sell in spring"
  }
}
```

---

## Testing the Integration

### Test Valuation Form

1. Go to `/valuation`
2. Fill out the form with test data
3. Submit the form
4. Check Follow Up Boss dashboard for new lead
5. Verify all fields are captured correctly

### Test Consultation Form

1. Go to `/contact`
2. Fill out the consultation form
3. Submit the form
4. Check Follow Up Boss dashboard for new lead
5. Verify service interest tag is applied

---

## Error Handling

The API includes comprehensive error handling:

- **Missing API Key**: Returns 500 error with helpful message
- **Invalid Data**: Returns 400 error with validation message
- **Follow Up Boss API Error**: Logs error and returns user-friendly message
- **Network Errors**: Catches and returns fallback message

**User Experience**: If form submission fails, users see a friendly error message and are directed to call (702) 930-8222 directly.

---

## Monitoring

### Check Logs

1. Go to Vercel dashboard
2. Navigate to **Deployments** → Select deployment → **Functions** tab
3. Click on `/api/followupboss` to view logs
4. Check for any errors or warnings

### Common Issues

**"Server configuration error"**
- Solution: Add `FUB_API_KEY` environment variable in Vercel

**"Failed to submit lead"**
- Check Follow Up Boss API key is valid
- Verify API key has proper permissions
- Check Vercel function logs for detailed error

**Form submits but no lead appears**
- Check Follow Up Boss dashboard (may take a few seconds)
- Verify API key permissions
- Check Vercel function logs

---

## Customization

### Add More Fields

Edit `api/followupboss.ts` to add additional fields:

```javascript
// Add to leadData object
leadData.customFields = {
  ...leadData.customFields,
  newField: request.body.newField
};
```

### Change Tags

Modify the tags array in `api/followupboss.ts`:

```javascript
leadData.tags = ['Website Lead', 'Custom Tag', 'Another Tag'];
```

### Change Source Name

Modify the source field:

```javascript
leadData.source = 'Your Custom Source Name';
```

---

## Security

- API key is stored as environment variable (never in code)
- API route validates all input data
- Only POST requests are accepted
- Error messages don't expose sensitive information
- Basic Auth used for Follow Up Boss API

---

## Support

**Follow Up Boss API Documentation**:  
https://followupboss.com/api/

**Vercel Serverless Functions**:  
https://vercel.com/docs/functions

**Troubleshooting**:  
Check Vercel function logs and Follow Up Boss dashboard for detailed error information.

---

*Last Updated: January 2025*

