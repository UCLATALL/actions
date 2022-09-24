# validate-book-yaml

This action searches a given set of globs for book configuration YAML files. In each search path, any file matching `*.book.yaml` is considered. For each book configuration file found, the YAML is validated and then the contents of the YAML are validated against the book configuration specification. That specification is detailed below in [Valid Book Configuration](#valid-book-configuration)

In addition to the content validation, releases are checked to ensure that they have the appropriate version and date variables specified in the top-level variables. That automatic update is detailed below in [Automatic Updates](#automatic-updates).

## Inputs

| name                    | default | description                                                                                          |
| ----------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `include`               | `.`     | A multiline input of the globs to use to build search paths. Use a newline to separate each glob.    |
| `follow-symbolic-links` | `true`  | Indicates whether to follow symbolic links when searching with the globs                             |
| `automatically-update`  | `true`  | Indicates whether to apply automatic updates as described in [Automatic Updates](#automatic-updates) |

## Outputs

| name       | description                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `errors`   | A JSON array as a string. Each item is an error object a "description", the possible "location", and a "suggestion" for how to fix it. |
| `warnings` | The same as the errors, except these errors can be considered non-critical and don't necessarily need to be fixed.                     |

## Valid Book Configuration

### Main Top-Level Keys

- **name**: Book name. Supports book variable replacement
- **description**: Book description
- **sortOrder**: Must be an integer. Indicates the position of the book in the list of books related to the version. The sort goes by sort order first and then by name
- **variables**: (_optional_). Custom defined book string variables
- **chapters/modules**: List of book chapters. It has two possible keys:
  - **name**: Module name. Supports chapter variable replacement
  - **variables**: (_optional_). Custom defined chapter string variables
  - **pages/lessons**: List of chapter pages. Each page can have:
    - **name**: Lesson name. Supports chapter/page variable replacement
    - **shortName**: Short name that would appear on reports. Supports chapter/page variable replacement
    - **variables**: (_optional_). Custom defined page string variables
    - **file**: the markdown file location.
    - **required**: (_optional_). It indicates if the page is required to continue. If true, the student won’t be able to continue until the page is completed. If omitted, it is assumed that it is not required. This validation is only checked for real classes.
- **dashboard**: (_optional_). This controls the customization of the My CourseKata dashboard. If not included, default values are assumed.
  - **name**: The name that will appear as the link on the LMS page. This is required if the dashboard key is included, and if it’s not, the default value is My Progress + Jupyter.
  - **tabs**: The list of tabs that should be shown in the dashboard. If dashboard configuration is specified, at least one value should be included. Possible values:
    - **class**: Indicates if the Class tab should be present. This also controls the My Progress tab for students.
    - **students**: Indicates if the Students tab should be present.
    - **jupyter**: Indicates if the Jupyter tab should be present.
- **tools**: (_optional_). List of tools to be included on the book. Currently the only supported value is: hypothesis.

### Sample file

```yaml
name: 'Sample Book - {{ book.var }}'
description: Sample book's description
sortOrder: 1
variables:
  var: 'ABC'
chapters:
  - name: 'Chapter {{ chapter.number }}. Introduction!'
    variables:
      number: '1'
    pages:
      - name: '{{ page.number }} Welcome to Statistics'
        shortName: 'Page {{ page.number }}'
        file: 'chapter-01/1.0-welcome.md'
        variables:
          number: '1.0'
      - name: '{{ page.number }} What Is Understanding?'
        shortName: 'Page {{ page.number }}'
        variables:
          number: '1.1'
        file: 'chapter-01/1.1-understanding.md'
        required: true

  - name: 'Chapter 2. Understanding Data'
    lessons:
      - name: 'Understanding Data'
        shortName: Page 2.0
        file: 'chapter-02/2.0-bunch-of-numbers.md'

dashboard:
  name: 'My Progress + Jupyter'
  tabs:
    - class
    - students
    - jupyter

tools:
  - hypothesis
```

### Content validations

As part of the course build, there are a series of content validations that are run before persisting the changes. The current validations that are checked with this Action are described below, however, they are all checked again during the build process along with other more fine-grained errors. The checks here are just to prevent problems from being committed to the repositories.

- At least one `*.book.yml` file should be present.
- Book file should be a valid YAML.
- Book `name` should be present.
- Book `name` should not be repeated in the same course version.
- Book `sortOrder` must be present and be a valid integer.

## Automatic Updates

When a branch prefixed `release/` is being checked, two variables are checked and automatically updated if out-of-date: the release name and date. This update is only made the first time the branch is created on GitHub.

These variables should be defined in the YAML like so:

```yaml
vars:
  release: name-of-release
  release_date: date-of-release
```

The name of the release should either be the exact content following `release/` in the branch name, or if the branch is named like `release/v5.0`, then `5.0`. If it does not match, it is changed to follow this rule.

The date of the release should match the date that the release branch was first pushed to GitHub.

## Usage

### Basic

This example will search the root directory of a repository for book configuration files to validate:

```yaml
steps:
  # https://github.com/actions/checkout
  - uses: actions/checkout@v3

  # https://github.com/UCLATALL/actions/validate-book-yaml
  - name: 'Validate the book configuration files'
    uses: UCLATALL/actions/validate-book-yaml@v1
```

### Prevent automatic updates

This example does the same as the previous without running the automatic updates:

```yaml
steps:
  # https://github.com/actions/checkout
  - uses: actions/checkout@v3

  # https://github.com/UCLATALL/actions/validate-book-yaml
  - name: 'Validate the book configuration files'
    uses: UCLATALL/actions/validate-book-yaml@v1
    with:
      automatically-update: false
```

### Using the output

In this example, the errors and warnings are piped into another script using [`actions/github-script`](https://github.com/actions/github-script):

```yaml
steps:
  # https://github.com/actions/checkout
  - uses: actions/checkout@v3

  # https://github.com/UCLATALL/actions/validate-book-yaml
  - name: 'Validate the book configuration files'
    uses: UCLATALL/actions/validate-book-yaml@v1
    continue-on-error: true

  # https://github.com/actions/github-script
  - name: 'Use the errors in another step'
    uses: actions/github-script@v6
    env:
      VALIDATION_ERRORS: ${{ steps.validate-book-yaml.outputs.errors }}
    with:
      script: |
        // assert that there are no errors
        const assert_equal = (value) => require("node:assert/strict").deepEqual(value, true)
        assert_equal(Object.keys(JSON.parse(process.env['ERRORS'])).length !== 0)
```
