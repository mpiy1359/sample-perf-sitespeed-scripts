# sample-perf-sitespeed-scripts

This project uses Sitespeed.io to run a sample performance script and collect browser-based performance metrics.

## 1. Set up the local environment

### Step 1: Verify Node.js and npm

Make sure Node.js is installed on your machine.

- Check Node.js:
  ```bash
  node -v
  ```
- Check npm:
  ```bash
  npm -v
  ```

If Node.js is not installed, install the Windows x64 `.msi` package from the official Node.js website.

### Step 2: Install Sitespeed.io globally

```bash
npm install -g sitespeed.io
```

## 2. Run the project

Open a terminal and navigate to the folder that contains `sample_journey.mjs`.

```bash
cd <path-to-project-directory>
```

Then run:

```bash
sitespeed.io sample_journey.mjs -b chrome -n 3
```

## Troubleshooting

### Issue 1: `sitespeed.io` command is not recognized

Verify the package is installed globally:

```bash
npm list -g --depth=0
```

If Sitespeed.io is not listed, reinstall it:

```bash
npm install -g sitespeed.io
```

Check that the command is available:

```bash
sitespeed.io --version
where sitespeed.io
```

Expected output should include a `.cmd` file such as:

```text
C:\Users\YourUser\AppData\Roaming\npm\sitespeed.io.cmd
```

If Windows is resolving the command incorrectly, use the `.cmd` version explicitly:

```bash
sitespeed.io.cmd sample_journey.mjs -b chrome -n 3
```

Alternatively, bypass Windows PATH resolution issues with:

```bash
npx sitespeed.io sample_journey.mjs -b chrome -n 3
```

### Issue 2: Results are not appearing

After the script completes, the output will be written to the directory configured by the project or default Sitespeed.io output folder. Open the generated `index.html` file in a browser to review the performance metrics and analysis.
