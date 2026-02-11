# Setup Instructions

## Version control (Git)

**If you see “git is not recognized”:** Git is not installed or not on your PATH.

1. **Install Git for Windows:** [https://git-scm.com/download/win](https://git-scm.com/download/win) — use the default options (including “Add Git to PATH”).
2. **Restart your terminal** (or close and reopen Cursor’s terminal) so the updated PATH is picked up.
3. Run the commands below again.

### How to add Git to PATH (if already installed)

**Option A — Re-run the installer (easiest)**  
1. Run the Git for Windows installer again from [git-scm.com/download/win](https://git-scm.com/download/win).  
2. When you see **“Adjusting your PATH environment”**, choose **“Git from the command line and also from 3rd-party software”**.  
3. Complete the install, then **restart your terminal**.

**Option B — Add Git to PATH manually**  
1. Note Git’s install folder (often `C:\Program Files\Git`).  
2. Press **Win + R**, type `sysdm.cpl`, Enter → **Advanced** tab → **Environment Variables**.  
3. Under **User variables** or **System variables**, select **Path** → **Edit** → **New**.  
4. Add: `C:\Program Files\Git\cmd` (or your Git install path + `\cmd`).  
5. OK out of all dialogs, then **restart your terminal** and run `git --version` to confirm.

To use Git for this project, run in the project root (where this file is):

```powershell
git init
git add .
git commit -m "Initial commit"
```

To add a remote (e.g. GitHub) and push later:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 1: Install Dependencies

1. Open a terminal in this directory.
2. Run:
   ```powershell
   npm install
   ```

## Step 2: Configure Environment (Optional)

If using Supabase (e.g. for API Playground / Dashboards), see **README-SUPABASE.md** for env vars and setup.

## Step 3: Start Development Server

```powershell
npm run dev
```

The app will be available at `http://localhost:3000`.
