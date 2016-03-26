---
layout: page
subtitle: Course Design
---
## Overview

This material is meant to be used in a two-week workshop
similar to those run by [Software Carpentry][swc-website] and [Data Carpentry][dc-website].
The outline below was developed using a slimmed-down variant of the "[Understanding by Design][ubd-overview]" process,
and incorporates ideas from
"[Software Carpentry: Lessons Learned][swc-lessons-learned]",
"[Best Practices in Scientific Computing][best-practices]",
and "[Good Enough Practices in Scientific Computing][good-enough-practices]".

## Assumptions

* Audience
  * Graduate students in numerate disciplines from cosmology to economics
  * Who understand very basic statistics (mean, standard deviation, correlation coefficient)
  * And have manipulated data in spreadsheets and with interactive tools like SAS
  * But have *not* programmed beyond CPD (copy-paste-despair)
* Ten full days, 09:00-16:00 each day
  * 1:00 for lunch
  * 1:00 total for breaks
  * 05:00 per day
  * 50:00 total time
* Learners use native installs on their own machines
  * May use VMs or cloud resources at instructor's discretion
  * But must keep native local install as an option
* Lesson materials
  * Notes for instructors and self-study will be written in Markdown

## Essential Questions

01. How can I avoid losing work?
    * Prefer open text formats to proprietary non-text formats: [what-is-csv][], [read-csv-files][]
    * Store work in a remotely-hosted version control repository: [version-control-intro][], [where-to-host-repository][]
    * Put everything created by a human being into version control as soon as it's created: [add-to-repository][], [update-repository][]
    * Write good commit comments: [writing-good-commit-comments][]
02. How can I make it easy for people to find and use my data?
    * Separate models from views: [models-vs-views][]
    * Store raw data exactly as it arrived: [nobles-rules][]
    * Don't duplicate large data: [what-not-to-store][]
    * Use semantically-meaningful path names: [choosing-good-path-names][]
    * Store metadata with data as plain text: [metadata][]
    * Submit data to a reputable DOI issuer: [getting-doi][]
03. How can I make it easy for programs to use my data?
    * Make every value atomic: [data-hygiene][]
    * Give every record a unique key: [data-hygiene][], [associative-structures][]
    * Represent each fact once: [data-hygiene][]
    * Apply these same rules to metadata: [metadata][]
    * Use path names that are easy to sort and to match with simple regular expressions: [choosing-good-path-names][]
04. How can I make it easy for people to find and use my software?
    * Make requirements/dependencies explicit (preferably in machine-usable form): [documenting-requirements][]
    * Use a publicly-hosted version control repository: [where-to-host-repository][]
    * Submit software to a reputable DOI issuer: [getting-doi][]
    * Include a README file explaining its scope (and giving a working contact address): [boilerplate][]
05. How can I make it easy for people to understand my software?
    * Begin every program with an explanatory comment that includes an example of use: [programming-style][]
    * Give values, functions, and classes meaningful names: [programming-style][]
    * Break programs into short functions that take a small number of parameters and have no side effects: [creating-functions][], [programming-style][]
    * Avoid duplicating functionality within modules: [programming-style][]
    * Use data structures with named parts: [associative-structures][]
    * Re-use libraries rather than writing equivalents: [finding-software][], [using-libraries][]
    * Use configuration files and conditionals rather than commenting: [conditionals][], [program-configuration][], [programming-style][]
    * Remove unused code: [coverage][]
06. How can I tell if my results are correct?
    * Add assertions to the software to document invariants: [defensive-programming][]
    * Provide simple re-runnable end-to-end test cases: [creating-integrity-tests][]
    * Write unit tests to specify and check behavior: [writing-unit-tests][]
    * Run tests automatically before each commit: [continuous-integration][]
07. How can I make it easy for people to reproduce my results?
    * Organize the project consistently: [nobles-rules][]
    * Represent every analysis step textually: [recording-history][], [writing-shell-scripts][], [writing-analysis-programs][], [exporting-openrefine-history][], [using-make][]
    * Make it easy to set up a development environment: [setting-up-for-development][]
    * Record provenance in data: [tracking-provenance][]
08. How can I be more productive?
    * Automate repetitive tasks: [writing-shell-scripts][]
    * Only do as much calculation as necessary: [using-make][]
    * Use efficient data structures: [associative-structures][]
    * Find performance bottlenecks: [profiling][]
    * Use more hardware: [task-farming][]
09. How can I make it easy for people to collaborate with me?
    * Add assertions to the software to document invariants: [defensive-programming][]
    * Provide simple re-runnable end-to-end test cases: [creating-integrity-tests][]
    * Maintain a to-do list for each project: [issue-tracking][]
    * Make the project's license explicit: [boilerplate][]
    * Maintain a checklist of things to do before sharing a change: [commit-checklist][]
    * Make it easy to set up a development environment: [setting-up-for-development][]
10. How can I make it easy for my collaborators and I to co-author manuscripts?
    * Keep the master copy of every manuscript on the web (version control or Google Docs): [version-control-intro][], [using-web-authoring][]
    * Document publishing steps in machine-usable form (e.g., a script or Makefile): [writing-shell-scripts][]
11. How can I make it easy for people to give me credit for my work?
    * Make the preferred citation(s) for projects explicit: [boilerplate][]
    * Get an ORCID: [getting-orcid][]

## Key Insights

* It's all just data, but data doesn't mean anything on its own
* Models for computers, views for people
* The computer doesn't understand what we want to do
* Program by creating and composing abstractions
* Software is just another kind of lab equipment
* Better code is better than better hardware
* The less we do, the more productive we are
* We are smarter together
* Data (and software) should be [findable, accessible, interoperable and reusable][fair-data]
* Your most important collaborator is your future self
* Favor convention over configuration

## Course Outline

| **Week** | **Day** | **Session** | **Subject**                        | *Slug*               |
| 1        | Mon     | a.m.        | Spreadsheets / OpenRefine            | tabular                |
|          |         | p.m.        | SQL                                  | sql                    |
| 1        | Mon     | a.m.        | Unix Shell 1                         | shell_01               |
|          |         | p.m.        | Python 1 (loops and conditionals)    | python_01              |
|          | Tue     | a.m.        | Python 2 (functions)                 | python_02              |
|          |         | p.m.        | Plotting                             | plotting               |
|          | Wed     | a.m.        | Git                                  | git                    |
|          |         | p.m.        | Regular Expressions / Unix Shell 2   | regexp / shell_02      |
|          | Thu     | a.m.        | Python 3 (structures and patterns)   | python_3               |
|          |         | p.m.        | FIXME                                |                        |
|          | Fri     | a.m.        | Markdown / Publishing                | markdown / manuscript  |
|          |         | p.m.        | Capstone 1                           | capstone_01            |
| 2        | Mon     | a.m.        | Make for Reproducible Research       | make                   |
|          |         | p.m.        | Installation + Configuration         | setup                  |
|          | Tue     | a.m.        | Testing                              | qa                     |
|          |         | p.m.        | Code Review / Debugging              | review / debug         |
|          | Wed     | a.m.        | Data Wrangling                       | data                   |
|          |         | p.m.        | Using APIs / Publishing Data         | api / datapub          |
|          | Thu     | a.m.        | Performance / Using Clusters         | perf / clusters        |
|          |         | p.m.        | Open Science                         | opensci                |
|          | Fri     | a.m.        | Capstone 2                           | capstone_02            |
|          |         | p.m.        | Capstone 2 (cont.)                   | capstone_02            |

## Learning Plan

FIXME: outline learning plan for each half day.

[best-practices]: http://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1001745 "Best Practices in Scientific Computing"
[dc-website]: http://datacarpentry.org "Data Carpentry website"
[fair-data]: http://datafairport.org/fair-principles-living-document-menu "FAIR Data"
[good-enough-practices]: http://github.com/swcarpentry/good-enough-practices-in-scientific-computing/ "Good Enough Practices in Scientific Computing"
[noble-rules]: http://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1000424 "A Quick Guide to Organizing Computational Biology Projects"
[swc-lessons-learned]: http://f1000research.com/articles/3-62/v2 "Software Carpentry: Lessons Learned"
[swc-website]: http://software-carpentry.org "Software Carpentry website"
[ubd-overview]: http://www.grantwiggins.org/documents/UbDQuikvue1005.pdf "Overview of Understanding by Design & the Design Template"

[add-to-repository]: path.html "Adding Files to a Repository"
[associative-structures]: path.html "Associative Data Structures"
[boilerplate]: path.html "Project Boilerplate"
[choosing-good-path-names]: path.html "Choosing Good Path Names"
[commit-checklist]: path.html "Creating a Commit Checklist"
[conditionals]: path.html "Conditional Expressions"
[continuous-integration]: path.html "Continuous Integration"
[coverage]: path.html "Coverage Analysis"
[creating-functions]: path.html "Creating Functions"
[creating-integrity-tests]: path.html "Creating Integrity Tests"
[data-hygiene]: path.html "Data Hygiene"
[defensive-programming]: path.html "Defensive Programming"
[exporting-openrefine-history]: path.html "Exporting OpenRefine History"
[finding-software]: path.html "Finding Software"
[getting-doi]: path.html "Using DOIs"
[getting-orcid]: path.html "Using ORCIDs"
[issue-tracking]: path.html "Issue Tracking"
[metadata]: path.html "Storing Metadata"
[models-vs-views]: path.html "Models vs. Views"
[nobles-rules]: path.html "Noble's Rules for Organizing Projects"
[profiling]: path.html "Profiling Performance"
[program-configuration]: path.html "Configuring Programs"
[programming-style]: path.html "Programming Style"
[read-csv-files]: path.html "Reading CSV Files"
[recording-history]: path.html "Recording History"
[setting-up-for-development]: path.html "Setting Up for Development"
[task-farming]: path.html "Task Farming"
[tracking-provenance]: path.html "Tracking Provenance"
[update-repository]: path.html "Updating a Repository"
[using-libraries]: path.html "Using Libraries"
[using-make]: path.html "Using Make"
[using-web-authoring]: path.html "Using Web-based Authoring Tools"
[version-control-intro]: path.html "Introducing Version Control"
[what-is-csv]: path.html "CSV Format"
[what-not-to-store]: path.html "What Not to Put in Version Control"
[where-to-host-repository]: path.html "Repository Hosting Options"
[writing-analysis-programs]: path.html "Writing Analysis Programs"
[writing-good-commit-comments]: path.html "Writing Good Commit Comments"
[writing-shell-scripts]: path.html "Writing Shell Scripts"
[writing-unit-tests]: path.html "Writing Unit Tests"
