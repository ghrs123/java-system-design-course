# Integration with System Design Roadmap

This repository (Java System Design Course) is the **single source of truth** for course content: modules, theory, exercises, solutions, projects, and tools.

## How the roadmap uses this repo

- The **System Design Roadmap** app (separate repository) can use this repo as a **Git submodule** under the path `java-system-design-course/`.
- The roadmap app then serves course files in development at `/course-content/` and shows the "Curso" section (levels and modules) using that content.
- What stays in the **roadmap** repo (and is not duplicated here):
  - **content/** — Deep-dive markdown for the main roadmap (Início / Níveis), referenced by `roadmapData.ts`.
  - **scripts/** — Export and submodule-link scripts that operate on the roadmap repo (`export-course-to-new-repo.ps1`, `push-course-to-new-repo.ps1`, `link-course-as-submodule.ps1`). Run these from the **roadmap** repo root.
  - **client/** — Course UI (CourseHome, CourseLevelPage, CourseModulePage, courseData.ts, etc.) as part of the same React app.

So: **only the course content** lives in this repo; the app and integration scripts live in the roadmap repo.

## Exporting or linking this repo to the roadmap

If you maintain the roadmap and need to (re)export or link this course repo:

1. In the **roadmap** repository, see `scripts/README.md`.
2. Run the scripts from the **roadmap** root, for example:
   - Export course to a sibling folder and push to GitHub: `.\scripts\export-course-to-new-repo.ps1` then `.\scripts\push-course-to-new-repo.ps1 -GitHubUser YOUR_USER`.
   - Replace the course folder with a submodule: `.\scripts\link-course-as-submodule.ps1 -CourseRepoUrl "https://github.com/OWNER/java-system-design-course.git"`.

No scripts are duplicated in this repo; the canonical place for export/link tooling is the roadmap repo’s `scripts/` directory.
