# CS 341 — Discrete Structures

A public GitHub Pages resource website for **CS 341: Discrete Structures** at **Mississippi Valley State University**, Fall 2026. Maintained by **Dr. Abdul-Rashid Zakaria**.

Includes:
- Responsive course homepage with a 16-week tentative course roadmap.
- Searchable, topic-filterable lecture-note catalog.
- Links to notes (PDF), slides, and recorded lectures, with no broken placeholder links.
- Dedicated study resources page and optional YouTube playlist link.
- No build system, dependencies, hosting account, or Jekyll configuration required beyond GitHub Pages.

## 1. Put this website on GitHub

1. Create a **public** repository named `cs341-discrete-structures` at https://github.com/new.
2. Upload **all files and folders in this package to the repository root**. Do **not** upload only the ZIP, and do not nest everything under an extra `cs341-discrete-structures` directory.
   - To upload via GitHub: **Add file → Upload files**, drag in all site files/folders, then **Commit changes**.
   - Git also works:
     ```bash
     cd cs341-discrete-structures
     git init
     git branch -M main
     git add .
     git commit -m "Launch CS 341 course site"
     git remote add origin https://github.com/YOUR-USERNAME/cs341-discrete-structures.git
     git push -u origin main
     ```
     You may need to authenticate to GitHub for the push. Use the GitHub upload interface if you prefer not to use Git locally.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment** set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/(root)`**, then click **Save**.
5. After GitHub finishes publishing, your website will appear at:
   `https://YOUR-USERNAME.github.io/cs341-discrete-structures/`.

**Important:** The Pages URL above is an example; replace `YOUR-USERNAME` with your real GitHub username. The actual site is not published until you complete these steps.

## 2. Add a lecture PDF or a recording

### Step A. Upload the file

For example, upload a PDF to `notes/lecture-21.pdf` (using **Add file → Upload files** inside the `notes/` folder).

### Step B. Edit `data/lectures.json`

The catalog already contains a **planned example** for Lecture 21, with no live links. Edit it to add the actual PDF and/or YouTube link. For example:

```json
{
  "number": 21,
  "title": "Sizes of Infinity",
  "topic": "Sets & Functions",
  "summary": "Cardinality, countable and uncountable sets, and Cantor's diagonal argument.",
  "notes": "notes/lecture-21.pdf",
  "slides": "",
  "video": "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_VIDEO_ID",
  "updated": "2026-10-20",
  "status": "published"
}
```

This is **just an example record**. Do not use the example YouTube URL as a real link. Only fill in actual PDF paths and verified video URLs when available. The site determines availability from **non-empty working resource links**, not the `status` text.

### Step C. Add future lectures

Add a new object to the JSON array in `data/lectures.json` using the same fields and put a comma between records. The site sorts automatically by lecture number; you do **not** need to edit the HTML.

Or, if you work locally and have Python 3, you can use the included helper:

```bash
python3 scripts/add_lecture.py 22 "Graph Algorithms" --topic "Graphs & Trees"
python3 scripts/add_lecture.py 22 "Graph Algorithms" --topic "Graphs & Trees" --notes notes/lecture-22.pdf --video https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID
```

The helper **adds new lectures** or **updates an existing lecture with the same number**. Commit and push your changes afterwards.

## 3. Add the YouTube playlist URL

Edit `data/site.json`:

```json
{
  "youtube_playlist": "https://www.youtube.com/playlist?list=YOUR_REAL_PLAYLIST_ID",
  "canvas_course_url": ""
}
```

When a valid YouTube playlist URL is supplied, the **Watch playlist** button automatically appears on the Study Resources page. (The Canvas property is reserved for future integration; Canvas remains the official platform for submissions, announcements, and grades.)

## 4. Edit the tentative course schedule

The 16-week schedule lives in `data/roadmap.json`. Edit week titles and descriptions there; homepage automatically updates. This was transcribed and concisely paraphrased from the Fall 2026 course syllabus and should always be checked against official Canvas announcements.

## 5. Preview on your computer

Because the site loads JSON files, **don't double-click `index.html` using `file://`**. Instead, from the repository folder run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000 in your browser. You can stop the server using Ctrl+C. On GitHub Pages the site works normally without this local server.

## Folder layout

```text
cs341-discrete-structures/
├── index.html                 Homepage + weekly roadmap
├── lectures.html              Searchable lecture library
├── resources.html             Textbook, open resources, videos
├── .nojekyll                  Serve files as a static site
├── data/
│   ├── lectures.json          ADD NEW LECTURES HERE
│   ├── roadmap.json           Weekly course roadmap
│   └── site.json              Playlist URL
├── notes/                     Place published PDFs here
├── assets/
│   ├── css/styles.css
│   ├── js/site.js
│   └── favicon.svg
└── scripts/add_lecture.py     Optional local updater
```

## Notes about publication

- A **coming soon** lecture entry is not a file or a promised scheduled release.
- Only upload course notes, images and PDFs that you own, created, or have permission to redistribute. The required Chartrand & Zhang textbook is copyrighted and is **not** included.
- Supplemental MIT OCW resources are linked from MIT's official website instead of redistributed.
- Avoid posting student information, grades, or answer keys for active assessments publicly.
- The GitHub Pages site supplements Canvas and is not the official university learning management system.
