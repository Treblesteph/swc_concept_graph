---
layout: page
subtitle: Course Design
---
## Overview

This material is meant to be used in a two-week workshop
similar to those run by [Software Carpentry][swc-website] and [Data Carpentry][dc-website].
The outline below was developed using a slimmed-down variant of the "Understanding by Design" process.
The main sections are:

## Assumptions

*   Audience
    *   Graduate students in numerate disciplines from cosmology to economics
    *   Who understand very basic statistics (mean, standard deviation, correlation coefficient)
    *   And have manipulated data in spreadsheets and with interactive tools like SAS
    *   But have *not* programmed beyond CPD (copy-paste-despair)
*   Ten full days, 09:00-16:00 each day
    *   1:00 for lunch
    *   1:00 total for breaks
    *   05:00 per day
    *   50:00 total time
*   Learners use native installs on their own machines
    *   May use VMs or cloud resources at instructor's discretion
    *   But must keep native local install as an option
*   Lesson materials
    *   Notes for instructors and self-study will be written in Markdown

## Coarse Outline

| **Week** | **Day** | **Session** | **Subject**                          |
| 1        | Mon     | a.m.        | Spreadsheets / OpenRefine            |
|          |         | p.m.        | SQL                                  |
| 1        | Mon     | a.m.        | Unix Shell 1                         |
|          |         | p.m.        | Python 1 (loops and conditionals)    |
|          | Tue     | a.m.        | Python 2 (functions)                 |
|          |         | p.m.        | Plotting                             |
|          | Wed     | a.m.        | Git                                  |
|          |         | p.m.        | Regular Expressions / Unix Shell 2   |
|          | Thu     | a.m.        | Python 3 (structures and patterns)   |
|          |         | p.m.        | FIXME                                |
|          | Fri     | a.m.        | Markdown / Publishing                |
|          |         | p.m.        | Capstone 1                           |
| 2        | Mon     | a.m.        | Make for Reproducible Research       |
|          |         | p.m.        | Installation + Configuration         |
|          | Tue     | a.m.        | Testing                              |
|          |         | p.m.        | Code Review / Debugging              |
|          | Wed     | a.m.        | FIXME                                |
|          |         | p.m.        | Data Wrangling / Data Hygiene        |
|          | Thu     | a.m.        | Using Clusters                       |
|          |         | p.m.        | Open Science                         |
|          | Fri     | a.m.        | Capstone 2                           |
|          |         | p.m.        | Capstone 2 (cont.)                   |

Missing:

* using an editor
* interfacing with hardware

## Desired Results

### Goals

1.  Teach learners the skills described in "[Good Enough Practices in Scientific Computing][good-enough]"
2.  Enable them to make sense of other onlines tutorials and resources
3.  Convey core principles:
    1.  It's all just data, but data doesn't mean anything on its own
    2.  Models are for computers, and views are for people
    3.  Programming is about creating and composing abstractions
    4.  Better code is better than better hardware
    5.  Paranoia makes us productive
    6.  We are smarter together

### Summative Assessment

*   Unix Shell: FIXME
*   Git: FIXME
*   Python 1: FIXME
*   Python 2: FIXME
*   SQL: FIXME
*   Regular Expressions/Data Management: FIXME
*   Make: FIXME
*   Testing/Packaging: FIXME
*   Publishing: FIXME
*   Using the Web: FIXME

### Essential Questions

*   How do I organize my data so that other people (including my future self) can use it?
*   How do I find and use software and data that other people have created?
*   How do I build complex software efficiently?
*   How do I tell if my software is correct?
*   How do I fix it if it isn't?
*   How do I make it easy for other people to use my software and data?
*   How do I share my findings with other people?

### Learners Will Be Able To...

*   Run code interactively
*   Run code saved in a file
*   Write single-condition `if` statements
*   Convert between basic data types (integer, float, string)
*   Call built-in functions
*   Use `help` and online documentation
*   Import a library using an alias
*   Call something from an imported library
*   Read tabular data into an array or data frame
*   Do collective operations on arrays and data frames
*   Create simple plots of data in arrays and data frames
*   Interpret common error messages
*   Track down bugs by running small tests of program modules
*   Write non-recursive functions taking a fixed number of named parameters
*   Create literate programs in the Jupyter Notebook

### Learners Will Know...

*   That a program is a piece of lab equipment that implements an analysis
    *   Needs to be validated/calibrated before/during use
    *   Makes analysis reproducible, reviewable, shareable
*   That programs are written for people, not for computers
    *   Meaningful variable names
    *   Modularity for readability as well as re-use
    *   No duplication
    *   Document purpose and use
*   That there is no magic: the programs they use are no different in principle from those they build
*   What a variable is
*   How assignment works
*   What integers, floats, strings, and data frames are
*   How a `for` loop executes
*   What a list is and how to index one
*   How `if`/`else` executes
*   The difference between defining and calling a function
*   What a call stack is
*   How local variables are created and scoped
*   Where to find documentation on standard libraries

## Stage 2 - Learning Plan

FIXME: outline learning plan for each half day.

## Data Management

### Goals

1.  You should never lose data.
2.  Data should be [findable, accessible, interoperable and reusable][fair-data]
    so that people (including your future self) can use it in ways you didn't anticipate,
    without pestering you with questions.
3.  Data should also be comprehensible (also called "human readable"),
    i.e.,
    potential collaborators should easily be able to understand what the data contains.
4.  Data should be *machine readable*,
    i.e.,
    programs should be able to load data correctly without extra programming effort.

### Rules

1.  Raw data should be stored exactly as it arrived (e.g., raw JPEGs for photographs)
    *   But use common sense:
        if a large volume of data is received
        in a format that is storage-inefficient or computationally inefficient to work with,
        transform it for storage with a lossless, well-documented procedure.
    *   Prefer open non-proprietary formats to closed ones (they'll likely last longer)
        *   See [this guide][uiuc-file-formats]
    *   And don't duplicate contents of stable, long-lived repositories (i.e., don't clone GenBank)
2.  All synthesized data is stored in well-defined widely-used formats:
    *   CSV for simple tabular data
    *   JSON, YAML, or XML for non-tabular data such as graphs (the node-and-arc kind)
    *   Note: prefer structured text for its longevity,
        but HDF5 and other standardized formats should be used where appropriate
3.  All data follows a few basic rules:
    *   Each value is *atomic*, i.e., has no sub-parts
        *   Example: store personal and family names in separate fields
    *   Every record has a unique *key* so that it can be selected precisely
4.  *Normalization* (the process of making data adhere to the rules in the preceding point) is treated as a processing step
    *   Raw data files are stored as they came
    *   Normalization steps are recorded textually in repeatable way
5.  Filenames and directory names are semantically meaningful
    and anticipate the need to list and filter them programmatically,
    e.g. via regular expressions or "globbing".
    *   Files as field-field-field.extension
    *   Dates as yyyy-mm-dd
6.  Metadata is stored explicitly in `data` as well
    *   Source(s) of data
    *   Meanings and units of fields
    *   Stored in machine-readable form whenever possible
        *   E.g., a CSV table of data descriptors, not paragraphs of prose
7.  Submit data to a reputable DOI-issuing repository so that others can access and cite it

## Software

### Goals

1.  Make it easy for people (again, including your future self) to understand and (re)use your code
    *   The easier software is to use, the more likely people are to do so
    *   Which in turn makes them more likely to collaborate with you and/or give you credit for your work
2.  Modular, comprehensible, reusable, and testable all come together
    *   Building software this way also happens to be the key to productivity

### Rules

1.  Every analysis step is represented textually (complete with parameter values)
    *   Sometimes not possible to store the verb as text (e.g., selection of region of interest in image)
    *   But should still store the result
    *   Quoting Jonah Duckles,
        "Duplicating the weather that generated a temperature log time series isn't going to happen, but we have a log of it.
        I feel the same is true of hand-digitizing an area of interest, we are concerned with the artifact, not necessarily how it came to be."
2.  Every program or script has a brief explanatory comment at the start
    *   Which includes at least one example of use
3.  Programs of all kinds (including "scripts") are broken into functions that:
    *   Are no more than one page long (60 lines, including spaces and comments)
    *   Do not use global variables (constants are OK)
    *   Take no more than half a dozen parameters
4.  No duplication
    *   Write and re-use functions instead of copying and pasting source code
    *   Use data structures, e.g. a list called `scores` instead of lots of variables called `score1`, `score2`, `score3`, etc.
5.  Functions and variables have meaningful names
    *   The larger the scope, the more informative the name
6.  Dependencies and requirements are explicit (e.g., a requirements.txt file)
7.  Commenting/uncommenting are not routinely used to control program behavior
    *   Use if/else to control behavior
    *   Use configuration files or command-line arguments for parameters
8.  Use a simple example or test data set to run to tell if it's working at all and whether it gives a known correct output for a simple known input
    *   A system/integration test that checks the entire program at once for a case similar to the real analysis
9.  Submit code to a reputable DOI-issuing repository upon submission of paper, just like data

## Collaboration

### Goals

1.  Again, the easier it is for people to collaborate, the more likely they are to do so
    (and to give you credit)
2.  Two most reported barriers from [Steinmacher et al][steinmacher-newcomers]
    are finding a task to start on
    and problems setting up the local workspace to start work
    *   So remove those
3.  Additional disincentive is uncertainty: what am I allowed to do?
    *   So remove that as well
    *   Lack of an explicit license implies the author is keeping all rights
        and others are not allowed to re-use

### Rules

1.  Every project has a short README file explaining its purpose
    *   Includes a contact address that actually works
2.  And a plain text file (often called notes.txt or todo.txt) containing the to-do list
    *   Aimed at contributors, where README is aimed at users
3.  And a LICENSE file
    *   CC-0 or CC-BY for data and text
    *   Permissive license (e.g., MIT/BSD/Apache) for software
4.  And a CITATION file
    *   How to cite this project overall
    *   Where to find/how to cite data sets, code, figures, and other things that have their own DOIs

## Project Organization

### Goals

1.  Convention over configuration
    (why add cognitive load of different layout unless there's significant demonstrable advantage?)
2.  Support the ways tools work and reduce possibility for error
    *   E.g., separating source data from processed data reduces odds of mistakenly re-processing files
3.  Project should be able to grow and be revisited without major reorganization or inconsistency

### Rules

Sub-directories in each project are organized according to Noble's rules:

1.  `doc` for documents (such as manuscripts, if you're storing them in version control)
2.  `src` for source code of programs written in compiled languages like Fortran, C++ and Java (if any)
    *   Within that, obey languages rules or strong conventions about where source files have to go
        (e.g., C++ header files, Python package structure)
3.  `bin` for executable scripts and programs
    *   Footnote: the name is old Unix shorthand for "binary", meaning "the output of the compiler"
4.  `data` for raw data and metadata (including links for fetching data)
    *   Use a sub-directory for each data set if the project uses more than one
    *   Modern file systems can handle hundreds of thousands of files in a directory,
        but displaying contents is problematic
5.  `results` for generated (intermediate) files
    *   Most programmers frown on storing generated files (because you can regenerate them)
    *   Researchers should so that they can easily tell if generated results have changed
    *   Note that figures, tables, and other things expected to go into publications count as generated results

## Version Control

### Goals

*   *Reproducibility:*
    for your future self (when you get the referee's report a year from now),
    your lab-mates and collaborators (in case you leave the project),
    and (heaven forbid) the person who accuses you of making up your data.
*   *Efficiency:*
    if data and files are stored in a standard way,
    your future self can come back to a project in 6 months and not have to spend 2 days figuring out what's what.
    Ditto for someone else trying to take what you've done and go in a new direction.
*   *Fixability:*
    version control of code, figures, and data helps you figure out why Figure 4 looks different now from last week.
*   *Sharing and Collaboration:*
    version control tools make it easy to share projects and update them, sometimes simultaneously, with other collaborators

### Rules

1.  Everything created by a human being goes under version control as soon as it's created
    *   With the possible exception of manuscripts (discussed below)
    *   And the possible exception of raw data, especially if large
2.  The repository is mirrored on at least one machine that *isn't* the researcher's computer
    *   E.g., pushed to GitHub or sync'd with a departmental server
3.  The project repository contains a checklist of things that must pass before a change is shared with the world
    *   Style guidelines met, to-do list updated, smoke test(s) pass
    *   Note: "shared with the world" means "pushed to GitHub" or however else changes are copied off the researcher's computer

## Manuscripts

### Goals

1.  Make text accessible to yourself and others now and in the future by using a single point of access for the master document
    that is accessible to all coauthors at all times.
2.  Reduce chances of work being lost or people overwriting each other's work.
3.  Make it easy to track and combine contributions from multiple collaborators.
4.  Avoid duplication and manual entry of information, particularly in constructing bibliographies, tables of contents, and lists of figures and tables.
5.  Make it easy to regenerate the final shared form (e.g., the PDF), and to tell if the PDF in hand is up to date.
6.  Make it easy to share the final version with collaborators and to submit it to a journal.

### Rules

1. The manuscript is written in a plain text format such as LaTeX or Markdown that enables version control for the files involved,
   and programatically converted to other formats such as PDF after major changes.
2. Tools needed to compile manuscripts (e.g., a makefile or a LaTeX style file)
   are included in the project folder (and kept under version control)
   just like tools used to do simulation or analysis.
