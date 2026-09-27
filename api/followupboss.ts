// Follow Up Boss CRM integration — POST /v1/events (Vercel serverless)

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE = 'skyesummithomes.com';
const CLIENT_ERROR_PHONE = '(702) 930-8222';

type LeadFormBody = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  propertyAddress?: string;
  serviceInterest?: string;
  timeline?: string;
  beds?: string;
  baths?: string;
  squareFeet?: string;
  features?: string[] | string;
  notes?: string;
  formKind?: 'contact' | 'valuation';
  formName?: string;
  sourceUrl?: string;
};

function splitName(full: string): { firstName: string; lastName: string } {
  const trimmed = full.trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function resolvePersonName(body: LeadFormBody): {
  firstName: string;
  lastName: string;
} {
  const first = (body.firstName ?? '').trim();
  const last = (body.lastName ?? '').trim();
  if (first || last) {
    return { firstName: first, lastName: last };
  }
  if (typeof body.name === 'string' && body.name.trim()) {
    return splitName(body.name);
  }
  return { firstName: '', lastName: '' };
}

function hasContactMethod(email?: string, phone?: string): boolean {
  return Boolean(email?.trim() || phone?.trim());
}

function resolveEventType(body: LeadFormBody): string {
  if (body.formKind === 'valuation') return 'Seller Inquiry';
  if (body.formKind === 'contact') return 'General Inquiry';
  if (body.propertyAddress?.trim()) return 'Seller Inquiry';
  if (body.serviceInterest === 'Valuation Request') return 'Seller Inquiry';
  return 'General Inquiry';
}

function resolveFormName(body: LeadFormBody, eventType: string): string {
  if (body.formName?.trim()) return body.formName.trim();
  return eventType === 'Seller Inquiry'
    ? 'Home Valuation Form'
    : 'Contact Form';
}

function buildFieldSummary(body: LeadFormBody): string {
  const lines: string[] = [];
  if (body.serviceInterest) lines.push(`Service interest: ${body.serviceInterest}`);
  if (body.timeline) lines.push(`Timeline: ${body.timeline}`);
  if (body.propertyAddress) lines.push(`Property: ${body.propertyAddress}`);
  if (body.beds) lines.push(`Bedrooms: ${body.beds}`);
  if (body.baths) lines.push(`Bathrooms: ${body.baths}`);
  if (body.squareFeet) lines.push(`Square feet: ${body.squareFeet}`);
  if (body.features) {
    const features =
      Array.isArray(body.features) ? body.features.join(', ') : body.features;
    if (features) lines.push(`Features: ${features}`);
  }
  if (body.notes) lines.push(`Notes: ${body.notes}`);
  return lines.join('\n');
}

export function buildFubEventPayload(
  body: LeadFormBody,
  sourceUrl: string
): Record<string, unknown> {
  const { firstName, lastName } = resolvePersonName(body);
  const email = body.email?.trim() ?? '';
  const phone = body.phone?.trim() ?? '';
  const eventType = resolveEventType(body);
  const formName = resolveFormName(body, eventType);
  const visitorMessage = body.message?.trim() ?? '';
  const summary = buildFieldSummary(body);

  let message = visitorMessage;
  if (summary) {
    message = message
      ? `${message}\n\n---\n${summary}`
      : summary;
  }
  if (!message) {
    message = `New ${eventType} from ${formName}`;
  }

  const phones = phone ? [{ value: phone }] : [];
  const emails = email ? [{ value: email }] : [];

  return {
    source: SITE,
    system: SITE,
    type: eventType,
    message,
    description: `${formName} — ${sourceUrl}`,
    sourceUrl,
    person: {
      firstName,
      lastName,
      emails,
      phones,
      tags: [SITE, formName],
    },
  };
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const body: LeadFormBody =
    request.body && typeof request.body === 'object' ? request.body : {};

  const { firstName, lastName } = resolvePersonName(body);
  const hasName = Boolean(firstName || lastName);
  const email = body.email?.trim();
  const phone = body.phone?.trim();

  if (!hasName || !hasContactMethod(email, phone)) {
    return response.status(400).json({
      error: 'Name and either email or phone are required.',
    });
  }

  const apiKey = process.env.FOLLOW_UP_BOSS_API_KEY;
  if (!apiKey) {
    console.error(
      'FOLLOW_UP_BOSS_API_KEY is not set — cannot submit leads to Follow Up Boss'
    );
    return response.status(503).json({
      error: `Sorry, something went wrong sending your message. Please call or text Dr. Jan Duffy at ${CLIENT_ERROR_PHONE}.`,
    });
  }

  const referer = request.headers.referer;
  const sourceUrl =
    (typeof body.sourceUrl === 'string' && body.sourceUrl.trim()) ||
    (typeof referer === 'string' ? referer : '') ||
    `https://www.${SITE}/`;

  const eventPayload = buildFubEventPayload(body, sourceUrl);

  try {
    const fubResponse = await fetch('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-System': SITE,
      },
      body: JSON.stringify(eventPayload),
    });

    if (!fubResponse.ok) {
      console.error(
        'Follow Up Boss API error:',
        fubResponse.status,
        await fubResponse.text()
      );
      return response.status(502).json({
        error: `Sorry, something went wrong sending your message. Please call or text Dr. Jan Duffy at ${CLIENT_ERROR_PHONE}.`,
      });
    }

    const successStatuses = [200, 201, 204];
    if (!successStatuses.includes(fubResponse.status)) {
      console.error('Unexpected Follow Up Boss status:', fubResponse.status);
      return response.status(502).json({
        error: `Sorry, something went wrong sending your message. Please call or text Dr. Jan Duffy at ${CLIENT_ERROR_PHONE}.`,
      });
    }

    let leadId: string | null = null;
    if (fubResponse.status !== 204) {
      try {
        const result = (await fubResponse.json()) as { id?: string };
        leadId = result.id ?? null;
      } catch {
        leadId = null;
      }
    }

    const eventType = resolveEventType(body);
    const defaultMessage =
      eventType === 'Seller Inquiry'
        ? 'Thank you! Your valuation request has been submitted. Dr. Jan will contact you within 24 hours.'
        : 'Thank you! Your consultation request has been submitted. Dr. Jan will contact you within 2 hours.';

    return response.status(200).json({
      success: true,
      message: defaultMessage,
      leadId,
    });
  } catch (error) {
    console.error('Error submitting to Follow Up Boss:', error);
    return response.status(502).json({
      error: `Sorry, something went wrong sending your message. Please call or text Dr. Jan Duffy at ${CLIENT_ERROR_PHONE}.`,
    });
  }
}

