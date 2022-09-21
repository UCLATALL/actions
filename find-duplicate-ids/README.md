# find-duplicate-ids

This action searches a given set of globs for markdown files, then searches those markdown files for duplicate HTML IDs. The action can either trigger a warning or an error if it finds duplicates, and in either event the duplicate IDs and their locations will be logged in the output.

## Inputs

| name      | default | description | 
| --------- | ------- | ------------|
| `include` | `.` | A multiline input of the globs to use to build search paths. Use a newline to separate each glob. |
| `follow-symbolic-links` | `true` | Indicates whether to follow symbolic links when searching with the globs |
| `action`  | `warn` | If duplicates are found, what should we do? Either `warn` or `error`  |

## Outputs

| name         | description |
| ------------ | ------------|
| `duplicates` | A JSON object as a string, where the keys are the duplicate IDs and the values are the locations in the files they were found in. If none are found, an empty object is returned: `{}` |


## Usage

### Basic

This example will search the entire repository for duplicate IDs and stop the workflow if it finds any:

```yaml
steps:
  # https://github.com/actions/checkout
  - uses: actions/checkout@v3

  # https://github.com/UCLATALL/actions/find-duplicate-ids
  - name: "Find duplicate IDs in the repository's markdown files"
    uses: UCLATALL/actions/find-duplicate-ids@v1
    with:
      action: error
```

### Search only specific directories

This example only searches the subdirectories `a/` and `b/`:

```yaml
steps:
  # https://github.com/actions/checkout
  - uses: actions/checkout@v3

  # https://github.com/UCLATALL/actions/find-duplicate-ids
  - name: "Find duplicate IDs in a set of globs"
    uses: UCLATALL/actions/find-duplicate-ids@v1
    with:
      action: error
      include: |
        ./a
        ./b
```

### Using the output

In this example, the duplicates are piped into another script using [`actions/github-script`](https://github.com/actions/github-script):

```yaml
steps:
  # https://github.com/actions/checkout
  - uses: actions/checkout@v3

  # https://github.com/UCLATALL/actions/find-duplicate-ids
  - name: "Find duplicate IDs in the repository's markdown files"
    id: find-duplicate-ids
    uses: UCLATALL/actions/find-duplicate-ids@v1
    with:
      action: error
    continue-on-error: true
  
  # https://github.com/actions/github-script
  - name: "Use the duplicate IDs in another step"
    uses: actions/github-script@v6
    env: 
      DUPLICATES: ${{ steps.find-duplicate-ids.outputs.duplicates }}
    with:
      script: |
        // assert that there are no errors
        const assert_equal = (value) => require("node:assert/strict").deepEqual(value, true)
        assert_equal(Object.keys(JSON.parse(process.env['DUPLICATES'])).length !== 0)
```