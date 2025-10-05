# Resend Email Setup Guide

This guide will help you set up Resend to handle email sending for the contact form.

## 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for an account
2. Verify your email address

## 2. Get Your API Key

1. In your Resend dashboard, go to "API Keys"
2. Create a new API key
3. Copy the API key (it starts with `re_`)

## 3. Configure Your Domain (Optional but Recommended)

1. In your Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS verification steps
4. Once verified, you can send emails from `noreply@yourdomain.com`

## 4. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

## 5. Update Email Configuration

In the file `app/api/contact/route.ts`, update these lines:

```typescript
// Replace with your verified domain
from: 'Satoshe Marketplace <noreply@yourdomain.com>',

// Replace with your contact email
to: [process.env.CONTACT_EMAIL || 'contact@yourdomain.com'],
```

## 6. Testing

1. Make sure your environment variables are set
2. Restart your development server: `pnpm dev`
3. Visit `/contact` and submit a test message
4. Check your email for the message

## 7. Production Setup

For production:

1. Make sure your domain is verified in Resend
2. Set the environment variables in your hosting platform (Vercel, Netlify, etc.)
3. Test the contact form on your live site

## Troubleshooting

### Common Issues:

1. **"Domain not verified" error**: Make sure you've added and verified your domain in Resend
2. **"Unauthorized" error**: Check that your API key is correct and set properly
3. **Emails not being received**: Check your spam folder, and ensure the recipient email is valid

### Free Tier Limits:

- Resend free tier includes 3,000 emails/month
- 100 emails/day limit
- Perfect for contact forms on most websites

## Alternative: Using Default Resend Domain

If you don't want to set up a custom domain, you can use Resend's default domain by changing the `from` field to:

```typescript
from: 'onboarding@resend.dev',
```

Note: This is only recommended for testing, not production use.
