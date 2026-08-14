# Image publishing

Docker images are validated on pull requests and published only by an explicit manual workflow run.

## Pull-request validation

Changes under `maddy/`, `download-bot/`, `netease-cloud-music-tasks/`, or `x-ui/` trigger an AMD64 Buildx build without registry credentials and without pushing an image. A change to the supply-chain workflow validates all four projects.

The repository validation workflow also runs Hadolint and parses available Compose files.

## Manual dry run

Open **Actions → Docker image supply chain → Run workflow** on the `main` branch and select:

- a project from the controlled list;
- `publish: false`;
- no additional tag.

The workflow builds AMD64 and ARM64 with QEMU but does not log in or push.

## Publishing

Publishing requires repository secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`. `x-ui` is intentionally excluded from manual publishing because its current Dockerfile clones a floating upstream revision instead of building the repository-pinned source.

Run the same workflow with `publish: true`. It publishes:

- `latest`;
- `sha-<12-character commit>`;
- the optional validated tag.

Published images include BuildKit provenance and an SBOM. The workflow then verifies that the manifest contains `linux/amd64` and `linux/arm64`, and updates the Docker Hub description from the project's README.

## Safety properties

- project names are selected from a fixed allow-list;
- arbitrary paths and platform strings are rejected;
- pull requests never receive Docker Hub credentials;
- registry login and README synchronization occur only during explicit publishing;
- per-project GitHub Actions cache scopes prevent cache collisions;
- concurrent runs on the same branch cancel older work.

Do not publish an archived project merely because it still builds. A successful build is not a security or maintenance guarantee.
