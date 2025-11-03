# Frequently Asked Questions

## Installation and Setup

<details>
<summary>What AI agents are supported?</summary>

Universal Skills MCP Server works with any MCP-compatible AI agent, including:

- **OpenCode** - Configure via `opencode.json`
- **Claude Code** - Configure via `claude mcp add` command
- **Codex** - Configure via `codex mcp add` command
- Any other agent that supports the Model Context Protocol

</details>

<details>
<summary>Do I need to rebuild after making changes?</summary>

No, skills are discovered and loaded automatically. Modified skills will be picked up within 30 seconds and new skills require you to restart your agent.

</details>

## Creating and Managing Skills

<details>
<summary>How do I create a new skill?</summary>

1. Create a directory in one of the skill locations:
   - `./.agent/skills/` (project-specific)
   - `~/.agent/skills/` (global)
   - `./.claude/skills/` (project-specific, legacy)
   - `~/.claude/skills/` (global, legacy)

2. Add a `SKILL.md` file with YAML frontmatter:

```bash
mkdir -p ~/.agent/skills/my-skill
cat > ~/.agent/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Brief description of what this skill does and under which circumstances it should be loaded.
---

# My Skill

## Overview

Detailed documentation about your skill...

## Usage

Instructions on how to use this skill...
EOF
```

3. Restart your agent to pick up the new skill.

</details>

<details>
<summary>What fields are required in the SKILL.md frontmatter?</summary>

Only two fields are required:

- **`name`**: Skill identifier
- **`description`**: Brief description of what this skill does and under which circumstances it should be loaded.

</details>

<summary>Can I use subdirectories or additional files in a skill?</summary>

Yes! Each skill directory can contain:

- `SKILL.md` (required)
- Additional markdown files
- Code examples
- Data files
- Any other resources

However, only the `SKILL.md` file is loaded and provided to the AI agent. You can reference other files in your documentation, but they won't be automatically included.

</details>

<details>
<summary>Can I override global skills with project-specific ones?</summary>

Yes! Skills are discovered in priority order:

1. `./.agent/skills/` (highest priority)
2. `~/.agent/skills/`
3. `./.claude/skills/`
4. `~/.claude/skills/` (lowest priority)

If you create a skill with the same name in a higher-priority directory, it will override the one in lower-priority directories. This allows you to customize global skills for specific projects.

</details>

<details>
<summary>Are skill names case-sensitive?</summary>

No! Skill names are matched case-insensitively. This means:

- "git", "Git", and "GIT" all load the same skill
- The `name` field in frontmatter defines the canonical name
- You can invoke skills using any case variation

</details>

## Troubleshooting

<details>
<summary>Why aren't my skills appearing?</summary>

Check these common issues:

1. **Directory structure**: Each skill must be in its own directory with a `SKILL.md` file

   ```
   ~/.agent/skills/my-skill/SKILL.md  ✓ Correct
   ~/.agent/skills/my-skill.md        ✗ Incorrect
   ```

2. **Required frontmatter**: Both `name` and `description` are required

   ```yaml
   ---
   name: my-skill
   description: Brief description
   ---
   ```

3. **Auto-refresh timing**: Skills are scanned every 30 seconds. For immediate detection, restart your AI agent.

4. **File permissions**: Ensure skill files have read permissions:

   ```bash
   chmod -R +r ~/.agent/skills/
   ```

5. **Check logs**: The server logs to stderr. Check your AI agent's logs for error messages.

</details>

<details>
<summary>I'm getting "Skill not found" errors</summary>

When a skill isn't found, the error message lists all available skills. Common causes:

- **Typo in skill name**: Double-check the spelling
- **Skill not in search path**: Ensure the skill is in one of the four priority directories
- **Missing frontmatter**: Skill is being skipped due to missing `name` or `description`
- **Permission issues**: Server can't read the skill file

Try listing your skill directories to verify the skill exists:

```bash
ls -la ~/.agent/skills/
ls -la ./.agent/skills/
```

</details>

<details>
<summary>The server won't start</summary>

1. **Check Node.js version**: Must be 18.0.0 or higher

   ```bash
   node --version
   ```

2. **Rebuild the server**:

   ```bash
   npm run clean && npm run build
   ```

3. **Reinstall dependencies**:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Verify the path**: Ensure your AI agent config points to the correct `dist/index.js` path

5. **Check for build errors**: Look for TypeScript compilation errors during `npm run build`

</details>

<details>
<summary>Skills are loading slowly</summary>

The server is designed for fast performance:

- **Lookup time**: <100ms per skill invocation
- **Initial scan**: <1 second
- **Refresh cycle**: 30 seconds

If skills are loading slowly:

- Check for very large `SKILL.md` files (>1MB)
- Verify disk performance (especially on network drives)
- Check if you have an unusually high number of skills (>100)
- Ensure no other process is locking skill files

</details>

<details>
<summary>How do I debug skill loading issues?</summary>

1. **Enable detailed logging**: The server logs to stderr. Check your AI agent's log output.

2. **Test the server directly**:

   ```bash
   node dist/index.js
   ```

   The server should start and wait for MCP protocol messages.

3. **Verify skill format**: Ensure your `SKILL.md` has valid YAML frontmatter:

   ```bash
   head -n 10 ~/.agent/skills/my-skill/SKILL.md
   ```

4. **Check file encoding**: Ensure `SKILL.md` files are UTF-8 encoded.

</details>

## Advanced Usage

<details>
<summary>Can I use environment variables in skills?</summary>

The skill content itself is static markdown. However, you can:

- Document how to use environment variables in your skill instructions
- Have the AI agent use environment variables when executing commands based on skill guidance
- Include conditional instructions in your skill (e.g., "If on macOS, use... If on Linux, use...")

</details>

<details>
<summary>How do I share skills with my team?</summary>

Several approaches:

1. **Version control**: Commit skills to your project's `.agent/skills/` directory

   ```bash
   git add .agent/skills/
   git commit -m "Add project skills"
   ```

2. **Shared directory**: Point multiple projects to the same global skills directory

   ```bash
   ln -s ~/shared-skills ~/.agent/skills
   ```

3. **Documentation**: Create a team repository of skills that team members can clone

   ```bash
   git clone https://github.com/team/skills ~/.agent/skills
   ```

</details>

<details>
<summary>Can I dynamically generate skills?</summary>

Yes! Since skills are just files in specific directories:

1. Create a script that generates `SKILL.md` files
2. Place generated files in a skill directory
3. The server will discover them within 30 seconds

Example:

```bash
#!/bin/bash
# Generate skill from template
cat > ~/.agent/skills/generated-skill/SKILL.md << EOF
---
name: generated-skill
description: Auto-generated skill
---

# Generated Skill

Generated at: $(date)
EOF
```

</details>

<details>
<summary>What's the difference between .agent and .claude directories?</summary>

- **`.agent/` and `~/.agent/`**: Recommended directories for universal skills across all AI agents
- **`.claude/` and `~/.claude/`**: Legacy directories originally for Claude-specific skills

Both are supported for backward compatibility. We recommend using `.agent/` for new skills.

Priority order:

1. `./.agent/skills/` (highest)
2. `~/.agent/skills/`
3. `./.claude/skills/`
4. `~/.claude/skills/` (lowest)

</details>

## Performance and Limits

<details>
<summary>How many skills can I have?</summary>

The server has been tested with up to 100 skills and maintains excellent performance:

- Memory usage: <10MB
- Lookup time: <100ms
- Initial scan: <1 second

Theoretically, you can have many more, but performance may degrade with:

- Very large individual skill files (>1MB each)
- Thousands of skills in a single directory
- Slow disk I/O (network drives, etc.)

</details>

<details>
<summary>How large can a skill file be?</summary>

There's no hard limit, but consider:

- **Recommended**: <100KB per skill
- **Maximum practical**: ~1MB per skill

Large skills may:

- Slow down skill loading
- Consume more of the AI agent's context window
- Be harder to maintain and update

Consider breaking very large skills into multiple smaller, focused skills.

</details>

<details>
<summary>Does the server cache skills in memory?</summary>

Yes! Skills are cached in memory with:

- **Auto-refresh**: Every 30 seconds
- **Lazy loading**: Only skill metadata is scanned; full content loaded on demand
- **Efficient updates**: Only changed skills are reloaded

This design ensures:

- Fast skill invocation (<100ms)
- Automatic updates without restart
- Minimal memory footprint

</details>
