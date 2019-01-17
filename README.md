# contentful2md

[![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/contentful2md.svg)](https://www.npmjs.com/package/contentful2md)
[![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/dsferruzza?utm_source=github&utm_medium=button&utm_term=dsferruzza&utm_campaign=github)

Fetch entries from a [Contentful](https://www.contentful.com/) space and write them as Markdown files.

## Motivation

> Use Contentful as a GUI to edit content for a static website made with [Jekyll](https://jekyllrb.com/).

**contentful2md** can help you if you are in the following context:

- you have a static website, built by _developers_ using [Jekyll](https://jekyllrb.com/)
- you want to enable _writers_ to edit some of the website content (for example: a blog)

In this situation, it is common to use a dynamic Content Management System (like WordPress, for example) to build the website because it provides a GUI and _writers_ find it easy to use.

Though, we believe that in many cases static websites are a more suitable solution than dynamic CMS: they are very easy to host, easier to customize, faster and more secure.

To allow _writers_ to focus on **writing** and not on installing and keeping up-to-date the development environment, we provide a solution that makes it very easy to use the nice GUI of Contentful to write content that will end up in a Jekyll website.

## The Solution

### Development

_Mostly at the beginning of the project:_

- A space is created on [Contentful](https://www.contentful.com/)
- _Developers_ configure one or several **content types** to define a model of the content that needs to be edited by _writers_, and create example content (that remains unpublished on Contentful)
- _Developers_ create a [Jekyll](https://jekyllrb.com/) project and develop the website they want
- _Developers_ use **contentful2md** to fetch the **preview API** of Contentful so that they can develop and test the parts of the website that display content from Contentful

### Writing

_On a regular basis:_

- _Writers_ use Contentful to add or edit content, using the content types defined previously
- _Writers_ or _developers_ use a CI/CD system (such as GitLab CI) to:
  - fetch content from Contentful (using **contentful2md**)
  - build the website (using Jekyll)
  - deploy it

## Usage

In your Jekyll project:

- install via npm: `npm install contentful2md`
- add the following script in `package.json`:

```json
{
  "scripts": {
    "contentful2md": "contentful2md"
  }
}
```

- configure using environment variables (see next section)
- run: `npm run contentful2md`

### Configuration

Configuration is done using environment variables.
The following variables can/must be configured:

| Name | Default Value | Description |
|---|---|---|
| `CONTENTFUL_SPACE` |  | Space ID, as given by Contentful. |
| `CONTENTFUL_ACCESS_TOKEN` |  | Access token, as given by Contentful. Depending on the value of `CONTENTFUL_PREVIEW`, this should be the _Content Delivery API_ or the _Content Preview API_. |
| `CONTENTFUL_PREVIEW` | `false` | If the value if `true`, use the _Preview API_. Else use the _Delivery API_. |
| `CONTENTFUL_CONTENT_TYPE_ID` |  | The ID of the _Content Type_ you want to fetch, as you defined in the _Content Model_ of your space on Contentful. |
| `CONTENTFUL_LOCALE` |  | The locale to fetch. For example: `fr-FR`. |
| `CONTENTFUL_CONTENT_FIELD` | `content` | The field of your _Content Type_ that should be considered as the main content and put in the body of the Markdown file. |
| `CONTENTFUL_SLUG_FIELD` | `slug` | The field of your _Content Type_ that correspond to the URL your content should take. It will be used to name the Markdown file, so **it must be unique**. |
| `OUTPUT_DIR` |  | The path to a directory where Markdown files should be created. If the directory does not exist, it will be created. If it exists, its files might be overridden. |

**Every variable must be defined**, except those which have a default value.

There are several ways to define them (which can be mixed):
- in your environment (Continous Integration often allow that)
- in a shell script:

```bash
export CONTENTFUL_SPACE="..."
# ...

npm run contentful2md
```

- directly in the command line: `CONTENTFUL_SPACE="..." npm run contentful2md`
