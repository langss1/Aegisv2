# AEGIS Security CLI

Autonomous security CLI for project ingestion, lightweight SAST checks, and guided remediation.

## Quick Start

Run AEGIS in any project without installing it globally:

```bash
npx aegis-security@latest init
```

You can also install it globally:

```bash
npm install -g aegis-security
aegis init
```

## Commands

```bash
aegis init      # run ingestion and SAST scan
aegis scan      # map project architecture
aegis code      # run security audit and optional remediation
aegis undo      # restore .bak files created by AEGIS
aegis models    # show AI backend options
aegis --help    # show CLI usage
```

## AI Configuration

The published package does not ship with private API keys. To use the built-in DeepSeek backend, set one of these environment variables before running AEGIS:

```bash
AEGIS_DEEPSEEK_API_KEY=your_key
# or
DEEPSEEK_API_KEY=your_key
```

For local/offline use, run `aegis`, choose `ollama`, and make sure Ollama is available at `http://localhost:11434`.

## Output

AEGIS writes reports into the current project:

- `AEGIS_INGESTION_REPORT.md`
- `AEGIS_REPORT.md`

## License

MIT
