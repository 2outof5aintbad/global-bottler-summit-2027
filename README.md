# Global Bottler Summit · London 2027

Complete handoff package for Claude and deployment to Heroku. The existing Sites publication has not been changed or removed.

## Start here

1. Give Claude this entire folder and `CLAUDE_HANDOFF.md`.
2. Run `npm ci`, `npm test`, then `npm start` with Node 24.
3. Open http://localhost:3000. Images are included; no external image hosting is needed.
4. Place this code in your Salesforce/Slack-owned approved repository.
5. Deploy to your approved Heroku app. Configure the final URL and Slack webhook as described below.

## Included

- `public/index.html`: complete editable website, styles and form JavaScript.
- `public/assets/`: original embedded images externalized with identical bytes.
- `public/favicon.svg`: red bottle-in-the-O favicon.
- `public/summit-preview.png`: Global Summit logo for shared-link previews.
- `server.js`: dependency-free Node HTTP server, assets, social URL adaptation and registration adapter.
- `src/registration.js`: validated form-to-Slack handler.
- `Procfile`, `package.json`, `package-lock.json`, `app.json`: Heroku startup configuration.
- `test/site.test.js`: meaningful server and mocked Slack checks.
- `SOURCE_MANIFEST.json`: source version and asset hashes.

## Current content and design

March 11–12, 2027 is provisional. March 11 is arrival/reception/dinner; March 12 is the summit. Keep the editorial styling, full-width backgrounds, London/Astro artwork, wider content areas, uppercase three-tab navigation, full-width registration panel, and larger centered bottom logos. Registration is interest only, not a confirmed attendance booking.

## Local development

```sh
npm ci
npm test
npm start
```

No runtime npm dependencies or compilation step are required. `.env.example` documents environment keys; this server does not automatically load `.env` files. Use your shell environment or `node --env-file=.env server.js` locally. Never commit an actual `.env` file.

## Heroku deployment

Use an app and repository authorized by your Salesforce team. Do not use a personal repository as evidence of Salesforce ownership.

```sh
# In the extracted project folder, after creating the approved repository:
git init
git add .
git commit -m "Add London bottler summit website"
git branch -M main
# Add and push to the approved Salesforce/Slack-owned source remote.
# Set your approved Heroku app as the Heroku remote:
heroku git:remote -a YOUR_APPROVED_HEROKU_APP
git push heroku main
heroku ps:scale web=1 -a YOUR_APPROVED_HEROKU_APP
```

Alternatively connect the approved GitHub repository through the Heroku dashboard when your organization permits it. Heroku must run a web dyno; billing/plan choices are yours. The server binds to `0.0.0.0` and the assigned `PORT`.

In Heroku Settings → Config Vars configure:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PUBLIC_BASE_URL` | The final HTTPS origin, e.g. your actual app or approved custom domain, without trailing slash |
| `SLACK_WEBHOOK_URL` | Approved Slack Incoming Webhook URL for the selected internal channel |

Enter the webhook directly into the approved secret configuration interface. Do not put it in Claude prompts, source, documentation, screenshots, or version control. The webhook is not included in this package. Heroku config changes restart the app.

`PUBLIC_BASE_URL` updates Open Graph image URLs and same-origin submission checks. It must exactly match the origin visitors use. When moving to a custom domain, update it before testing forms on that domain. Without it the server derives an origin from the request host; explicitly configure it in production.

## Slack behavior

The form collects name, work email, company, job title and an optional message. A server-side POST sends these fields to the configured channel. No LLM is called. No Salesforce CRM access or Slack history permissions are needed.

Submissions are NOT stored in a database. Without a webhook the handler returns 503 and displays “Registration will open shortly.” If Slack rejects or times out, users see an error and no success confirmation. Delivery has a 10-second timeout. Duplicate submissions are possible; no durable deduplication or delivery queue is implemented. A hidden honeypot and same-origin validation are included; there is no durable rate limiting or CAPTCHA. Review those controls before broad public promotion.

## Verification and launch checklist

Automated checks passed on Node 24.22.1: field validation, origin check, missing webhook, mocked Slack success/failure, Node server routes, all page image URLs, favicon, preview image, and deployed-origin metadata substitution. No live Slack message was sent and no Heroku deployment was performed.

Before launch:

- Confirm Salesforce approval of repository, Heroku app, data handling and Slack integration.
- Configure final origin and the approved webhook.
- Open `/healthz`; expect `{"ok":true}`.
- Review desktop and mobile layouts in the actual Heroku deployment.
- Submit an authorized test registration; verify exactly what arrives in the selected channel.
- Confirm failed deliveries do not show success.
- Check social metadata uses the final domain and the logo URL loads publicly. Sharing platforms may cache previews.
- Keep provisional dates until the event owner confirms them.

## References

- https://devcenter.heroku.com/articles/nodejs-support
- https://devcenter.heroku.com/articles/getting-started-with-nodejs
