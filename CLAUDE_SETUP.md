# Claude Code Setup for CRM Terminal

## Permissions Configuration

This project is configured with `dangerously-skip-permissions` for smooth development workflow.

### What's Allowed ✅

The following operations are pre-approved and won't require confirmation:

**File Operations:**
- Read, Write, Edit files
- Glob, Grep searches
- Create directories (`mkdir`)
- Copy/move files (`cp`, `mv`)

**Development Tools:**
- `git` - All git operations
- `npm`, `npx`, `node` - Package management
- `babel-node` - Running JSX/React code
- `sqlite3` - Database operations
- `docker` - Container operations

**Utilities:**
- `ls`, `cat`, `head`, `tail` - Inspection
- `grep`, `find`, `sed`, `awk` - Text processing
- `curl`, `wget` - HTTP requests
- `chmod`, `make` - Build tools

### What's Blocked ❌

Dangerous operations are explicitly denied:

- `rm`, `rmdir` - File deletion
- `del`, `format` - Destructive operations
- `shutdown`, `reboot` - System operations
- `sudo`, `su` - Privilege escalation

### Why This Setup?

1. **Faster Development**: No interruptions for safe operations
2. **Safety**: Dangerous commands still require confirmation
3. **Git-Friendly**: All git operations are seamless
4. **Database Work**: SQLite queries work smoothly

### Configuration Location

`~/.claude/settings.json`

### How to Use

Just run Claude Code normally:
```bash
cd ~/Personal/crm-terminal
claude
```

Claude will automatically use the configured permissions.

### Need to Delete Files?

If you need to delete files, Claude will ask for confirmation. This is intentional for safety.

Alternatively, you can delete manually:
```bash
rm unwanted-file.js
```

### Modifying Permissions

To add/remove allowed commands, edit `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(your-command:*)"
    ],
    "deny": [
      "Bash(dangerous-command:*)"
    ]
  }
}
```

### Best Practices

1. ✅ Use for development work
2. ✅ Keep dangerous commands in deny list
3. ✅ Review Claude's changes with `git diff`
4. ✅ Commit frequently
5. ❌ Don't add `rm` to allowed list
6. ❌ Don't use in production environments

### Troubleshooting

**Q: Claude is still asking for permission?**
- Make sure `~/.claude/settings.json` is valid JSON
- Restart Claude Code: `Ctrl+C` and restart

**Q: Want to add a new command?**
- Add it to the "allow" array in settings.json
- Example: `"Bash(your-tool:*)"`

**Q: Need temporary full permissions?**
- Run: `claude --dangerously-skip-permissions`
- Use with caution!

---

**Note:** This setup is optimized for the Ink + SQLite migration. All necessary tools are pre-approved.
