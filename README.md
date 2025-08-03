### 🚀 LinkedIn Prospect Messaging API

A NestJS-based backend system that takes a LinkedIn prospect URL, analyzes the profile, and generates personalized messaging sequences using AI with configurable tone-of-voice.

---

## **Features**

* REST API `POST /api/generate-sequence`
* LinkedIn prospect creation and storage
* Tone-of-Voice configuration saved per prospect
* AI integration with OpenAI (Claude support planned)
* Token usage and cost tracking
* Returns AI thinking process, confidence scores, and prospect analysis
* Clean architecture with separate domains:

  * `ai/` – AI integrations (OpenAI implemented, abstracted for polymorphism)
  * `prospect/` – LinkedIn profile handling + TOV configs
  * `message-sequence/` – Generated messaging campaigns
  * `ai-generation/` – AI generation logs for audit and analytics

---

## **Environment Variables**

```env
DATABASE_URL=postgres://user:pass@host:5432/dbname
OPEN_AI_API_KEY=your_openai_api_key
```

---

## **Database Schema Decisions**

* **`prospects`**:
  Stores LinkedIn profile data. Chose `ulid` for distributed ID generation and easy sorting by time.
  Includes `raw_data JSONB` to keep full LinkedIn profile payload for flexibility.

* **`tov_configs`**:
  One-to-one mapping with `prospects`. Stores Tone-of-Voice parameters (formality, warmth, directness).
  Separated into its own table for normalization and future A/B testing support.

* **`message_sequences`**:
  Stores generated campaigns linked to a prospect. `messages JSONB` allows flexible AI outputs.

* **`ai_generations`**:
  Logs each AI call with `prompt` and `output` as JSONB.
  Tracks `tokens` and `cost` for observability and billing.

**Why JSONB?** PostgreSQL's JSONB lets us store flexible AI outputs and inputs without schema changes, ideal for evolving AI prompt/response formats.

---

## **Prompt Engineering Approach**

* Translates numerical TOV params (0–1) into natural language instructions via a helper.
* Prompt instructs AI to:

  1. Analyze the prospect and company context.
  2. Return a **structured JSON** with:

     * `analysis` (prospect summary and outreach angle)
     * `messages` array with `message`, `confidence`, and `thinking`.
* Kept temperature moderate (0.7) to balance creativity and consistency.

Example AI prompt:

```
Analyze the prospect based on the summary and company context, then generate 3 personalized outreach messages.

Prospect Summary:
John Doe (Software Engineer) at Acme Corp

Company Context:
We help SaaS companies automate sales

Tone of Voice:
Formal, Warm, Moderately Direct

Always return JSON in this format:
{
  "analysis": "Brief summary of prospect and best outreach angle",
  "messages": [
    {
      "message": "string",
      "confidence": 0.0-1.0,
      "thinking": "reasoning behind this message"
    }
  ]
}
```

---

## **AI Integration & Error Handling**

* **Abstract class `AIServiceImpl`** defines the contract.
* **OpenAI implementation** uses NestJS `HttpService` (Axios).
* **Factory method** (`AIService.fromClient`) supports polymorphic client selection (OpenAI now, Claude planned).
* Handles AI failures:

  * Wraps API errors in HTTP exceptions.
  * Fallback parsing if AI returns non-JSON content.
  * Logs cost/tokens even on degraded output.

---

## **API Design & Data Validation**

* **DTOs + class-validator** for request validation.
* **Clean use case orchestration**:

  1. Create/fetch prospect via LinkedIn URL.
  2. Save or update TOV config.
  3. Generate messages via AI client.
  4. Store message sequence and AI generation log.
* Responses always include:

  * `prospect`
  * `analysis`
  * `messages` (with confidence + thinking)
  * `tokens` & `cost`

---

## **What I'd Improve With More Time**

* **Real LinkedIn API integration** (replace mock client).
* **Prospect analysis table** to version and reuse AI analyses separately from sequences.
* **Background jobs** for heavy AI generations and retries.
* **Rate limiting and API keys** for multi-tenant usage.
* **Unit + integration tests** with mocked AI clients.
* **Claude & Anthropic integration** for multi-AI experimentation.
* **WebSocket events** for streaming AI output in real-time.

---

## **Quick Start**

```bash
# Install dependencies
yarn

# Generate Prisma client
yarn migrate:generate <name>

# Run migrations
yarn generate:run

# Start server
yarn start:dev

# Access API Documentation on Swagger at http://prospect-api.up.railway.app/api/docs
```
