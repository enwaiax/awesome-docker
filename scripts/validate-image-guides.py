#!/usr/bin/env python3
"""Validate repository-owned image guides against the catalog contract."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUIDES = {
    "maddy": ROOT / "images/maddy/README.md",
    "download-bot": ROOT / "images/download-bot/README.md",
    "netease-cloud-music-tasks": ROOT / "images/netease-cloud-music-tasks/README.md",
    "x-ui": ROOT / "images/x-ui/README.md",
    "firefox-send": ROOT / "images/firefox-send/README.md",
}

REQUIRED_HEADINGS = (
    "Overview",
    "Prerequisites",
    "Quick start",
    "Configuration",
    "First-run verification",
    "Operations",
    "Security",
    "Troubleshooting",
    "Lifecycle and known limitations",
)

FORBIDDEN_PATTERNS = {
    r"chmod\s+-R\s+777": "world-writable recursive permissions",
    r"RPC_SECRET\s*=\s*P3TERX": "hard-coded default RPC secret",
    r"删除[^\n]{0,30}(db|data)[^\n]{0,20}(目录|folder)": "destructive reset advice",
    r"docker-compose\s": "legacy docker-compose command",
}


def heading_set(text: str) -> set[str]:
    return {m.group(1).strip().lower() for m in re.finditer(r"^##\s+(.+?)\s*$", text, re.M)}


def validate(slug: str, path: Path) -> list[str]:
    errors: list[str] = []
    if not path.is_file():
        return [f"{path.relative_to(ROOT)}: missing guide"]

    text = path.read_text(encoding="utf-8")
    lower_headings = heading_set(text)
    for heading in REQUIRED_HEADINGS:
        if heading.lower() not in lower_headings:
            errors.append(f"{path.relative_to(ROOT)}: missing '## {heading}'")

    if not re.search(r"\*\*Lifecycle:\*\*\s*`?(Maintained|Community|Archived|Moved)`?", text):
        errors.append(f"{path.relative_to(ROOT)}: missing valid Lifecycle metadata")
    if "**Image:**" not in text:
        errors.append(f"{path.relative_to(ROOT)}: missing Image metadata")
    if "**Architectures:**" not in text:
        errors.append(f"{path.relative_to(ROOT)}: missing Architectures metadata")
    if not re.search(r"\*\*Last verified:\*\*\s*`?\d{4}-\d{2}-\d{2}`?", text):
        errors.append(f"{path.relative_to(ROOT)}: missing ISO Last verified date")

    for pattern, description in FORBIDDEN_PATTERNS.items():
        if re.search(pattern, text, re.I):
            errors.append(f"{path.relative_to(ROOT)}: contains {description}")

    lifecycle = re.search(r"\*\*Lifecycle:\*\*\s*`?(\w+)", text)
    if lifecycle and lifecycle.group(1) in {"Archived", "Moved"}:
        if not re.search(r"Recommended for new deployments:\*\*\s*`?No`?", text, re.I):
            errors.append(f"{path.relative_to(ROOT)}: archived/moved guide must say new deployments = No")

    if slug in {"maddy", "download-bot"}:
        if "### Docker CLI" not in text or "### Docker Compose" not in text:
            errors.append(f"{path.relative_to(ROOT)}: active guide requires Docker CLI and Compose sections")

    return errors


def validate_compose_files() -> list[str]:
    errors: list[str] = []
    owned_compose = [
        path
        for path in sorted((ROOT / "images").glob("**/docker-compose.yml"))
        if not any(part in {"send", "DownloadBot", "NeteaseCloudMusicTasks", "maddy", "x-ui"} for part in path.relative_to(ROOT / "images").parts[1:-1])
    ]
    for path in owned_compose:
        text = path.read_text(encoding="utf-8")
        if re.search(r"^version:\s*[\"']?[0-9]", text, re.M):
            errors.append(f"{path.relative_to(ROOT)}: obsolete top-level Compose version key")
        if "RPC_SECRET=P3TERX" in text or "RPC_SECRET: P3TERX" in text:
            errors.append(f"{path.relative_to(ROOT)}: hard-coded default RPC secret")
    return errors


def main() -> int:
    errors = [error for slug, path in GUIDES.items() for error in validate(slug, path)]
    errors.extend(validate_compose_files())
    if errors:
        print("Image guide validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"Validated {len(GUIDES)} image guides and Compose policy")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
