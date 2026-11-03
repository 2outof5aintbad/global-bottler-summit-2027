# Claude handoff: preserve this site and deploy it to approved Heroku

You have the complete current Global Bottler Summit London website. Read README.md first, inspect the implementation, then run `npm ci` and `npm test`.

## Objective

Help Mike Emery move this site from ChatGPT Sites to a Salesforce-approved Heroku app and an approved Salesforce/Slack-owned source repository. Preserve the existing visual design and content. Do not rebuild the website or add a framework without a concrete need.

## Current state

- Node 24, ES modules, no runtime dependencies, `npm start` runs `server.js`.
- Heroku Procfile, app.json and lockfile are supplied.
- All images, summit logo, Salesforce/Perfect Bottler logos, favicon and preview artwork are present.
- `public/index.html` is the editable page. The Node server renders its URLs for PUBLIC_BASE_URL; no generated HTML blob needs editing.
- March 11–12, 2027 is provisional. Day one arrival; day two summit.
- Navigation is THE GATHERING, PROGRAM, REGISTER INTEREST. The last link is a red button.
- Registration panel fills content width. Bottom logos are large and centered lower in the open area.
- Existing Sites URL remains live and must not be deleted automatically.

## Finish with the user

1. Confirm the authorized Salesforce-owned repository URL and Heroku app/account.
2. Check the organization’s deployment requirements; the package does not imply admin approval.
3. Push the code to that repository and deploy to the authorized Heroku app when the user authorizes those destinations.
4. Set PUBLIC_BASE_URL to the actual final HTTPS origin.
5. Once Slack app approval is granted, have the user configure SLACK_WEBHOOK_URL in Heroku securely. Never ask for it in the chat or include it in Git.
6. Run all tests, check mobile and desktop visually, verify public assets and link preview, and send a test registration only to the user-approved Slack destination.
7. Report the exact deployed URL and any remaining blockers.

## Known limitations

No database, confirmation email, durable retry queue, deduplication, CAPTCHA or distributed rate limiter. No active Slack webhook is bundled. Delivery is synchronous; success requires Slack acceptance. Tests mock Slack and do not prove live delivery. There is no AI/LLM in the running registration workflow.

Keep adjustments scoped to migration, correctness and review findings. Do not change branding, replace artwork, remove provisional wording, or add tracking without user direction.
