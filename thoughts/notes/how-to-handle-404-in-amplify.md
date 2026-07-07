# How to Handle 404 Pages in AWS Amplify

AWS Amplify does **not** automatically serve a `404.html` file from your build output. You must add a rewrite rule manually.

## Configuration

In the **AWS Amplify Console**:

1. Select the app
2. Go to **Hosting** > **Rewrites and redirects**
3. Click **Manage redirects**
4. Click **Add rewrite/redirect**
5. Set:
   - **Source address**: `/<*>`
   - **Target address**: `/404.html`
   - **Type**: `404 (Rewrite)`
6. **Move this rule to the last position** (below all other rules)
7. Click **Save**

JSON equivalent:

```json
[
  {
    "source": "/<*>",
    "target": "/404.html",
    "status": "404",
    "condition": null
  }
]
```

## Apps to Configure

| Environment | Site   | Amplify App Name              | Region       |
| ----------- | ------ | ----------------------------- | ------------ |
| Dev         | Fusion | `ipor-dev-fusion-website`     | eu-central-1 |
| Dev         | IPOR   | `ipor-dev-main-website`       | eu-central-1 |
| Prod        | Fusion | `ipor-mainnet-fusion-website` | eu-central-1 |
| Prod        | IPOR   | `ipor-mainnet-main-website`   | eu-central-1 |

## Important Notes

- The rule **must be last** in the redirect list. If placed above other rules, it will intercept valid routes before Amplify can match them.
- Use type **`404 (Rewrite)`**, not `404 (Redirect)`. A rewrite serves the `404.html` content while keeping the original URL in the address bar.
- Do **not** use `200 (Rewrite)`. That returns HTTP 200 for missing pages, which is bad for SEO and misleads crawlers.
- Redirect rules cannot be configured via `customHttp.yml` or any committed file. They are managed only through the Amplify Console UI (or CloudFormation/Terraform).

## Verification

After saving, visit a non-existent path:

- `https://fusion.ipor.io/this-does-not-exist`
- `https://ipor.io/this-does-not-exist`

Expected: custom 404 page renders, browser DevTools Network tab shows HTTP status `404`.
