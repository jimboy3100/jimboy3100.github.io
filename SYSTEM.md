# Agent Descriptor: jimboy3100.github.io

## Role
Web content repository for hosting Legend Mod (Agario client).

## Responsibilities
- Hosting static web assets (`index.html`, `js`, `css`).
- Hosting user scripts (`Tampermonkey`).
- Serving the Legend Mod client.

## Interfaces
- **Web**: HTTP access to `index.html`.
- **User Scripts**: `.user.js` files for browser extensions.

## Dependencies (Inbound)
- `jquery` (Library).
- `bootstrap` (Library).
- `pixi.js` (Library).

## Dependents (Outbound)
- Users of Legend Mod.

## Communication Patterns
- Static web hosting.

## Examples
- `ogario/` folder contains the game client.

## Constraints & Assumptions
- GitHub Pages environment.

## Stability
- Active/Stable.

## Ownership
- Maintainer(s): Rem Collier
