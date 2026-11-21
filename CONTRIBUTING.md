# Contributing Guidelines

These guidelines establish the standard Git workflow for the Wildcats Innovation Labs Office Document Management and Automated Reporting System.

## 1. Branching Strategy

The project uses the following branches:

| Branch | Purpose |
|---|---|
| `main` | Stable and release-ready project version |
| `development` | Shared integration branch |
| `feature/*` | New functionality |
| `fix/*` | Bug fixes |
| `hotfix/*` | Urgent production fixes |
| `docs/*` | Documentation updates |
| `test/*` | Testing-related changes |

## 2. Development Workflow

1. Start from the latest `development` branch.
2. Create a separate branch for your assigned task.
3. Implement and test your changes locally.
4. Commit your changes using descriptive commit messages.
5. Push your branch to GitHub.
6. Open a Pull Request targeting `development`.
7. Address any review comments and resolve conversations.
8. Merge the Pull Request when the changes are ready.

Do not push changes directly to `main` or `development`.

## 3. Branch Naming Convention

Use lowercase names with hyphens between words.

Examples:

- `feature/user-authentication`
- `feature/document-registration`
- `feature/google-drive-integration`
- `fix/document-search`
- `docs/api-documentation`

## 4. Commit Message Convention

Use the following format:

`type: short description`

Recommended types:

| Type | Purpose |
|---|---|
| `feat` | New functionality |
| `fix` | Bug fixes |
| `docs` | Documentation changes |
| `style` | Formatting changes |
| `refactor` | Code restructuring |
| `test` | Adding or modifying tests |
| `chore` | Maintenance and configuration |

Examples:

- `feat: add user login functionality`
- `fix: correct document search filtering`
- `docs: update installation instructions`
- `chore: configure project gitignore`

## 5. Pull Request Guidelines

Every Pull Request should:

- Have a clear and descriptive title.
- Explain what was implemented or changed.
- Identify the related task or issue when applicable.
- Include screenshots for significant UI changes.
- Mention any known limitations or incomplete work.
- Be tested before submission.

The target branch for ordinary feature development is `development`.

Only completed and tested project versions should be merged into `main`.

## 6. Security Guidelines

- Never commit `.env` files or actual credentials.
- Never expose Supabase service-role keys or Google OAuth client secrets.
- Use environment variables for sensitive configurations.
- Do not commit unnecessary generated files, dependencies, or build outputs.

## 7. General Team Practices

- Keep changes focused on the assigned task.
- Avoid modifying another developer's work without coordination.
- Communicate changes that affect shared components or database structures.
- Test changes before opening a Pull Request.
- Keep branches updated with the latest integration changes.
