#!/usr/bin/env node

const contentful = require('contentful');
const env = require('common-env/withLogger')(console);
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const yaml = require('js-yaml');

/**********************************************/

const config = env.getOrElseAll({
  contentful: {
    space: { $type: env.types.String },
    access_token: { $type: env.types.String, $secure: true },
    preview: { $type: env.types.Boolean, $default: '0' },
    content_type_id: { $type: env.types.String },
    locale: { $type: env.types.String },
    content_field: { $type: env.types.String, $default: 'content' },
    slug_field: { $type: env.types.String, $default: 'slug' },
  },
  output_dir: { $type: env.types.String },
});

/**********************************************/

function extractType(entry) {
  return entry.sys.contentType.sys.id;
}

function writeEntry(item) {
  const filename = path.join(config.output_dir, item.slug + '.md');
  const content = item.data.fields[config.contentful.content_field];
  const metadata = yaml.dump(item.data);
  const data = '---\n' + metadata + '\n---\n' + content + '\n';
  fs.writeFileSync(filename, data);
  console.log(`[${item.type}] ${item.slug}`);
}

/**********************************************/

const host = 'preview.contentful.com';
const hostFlag = (config.contentful.preview === '1' || config.contentful.preview === 1 || config.contentful.preview === true) ? { host } : {};
const client = contentful.createClient({
  accessToken: config.contentful.access_token,
  space: config.contentful.space,
  resolveLinks: true,
  locale: config.contentful.locale,
  ...hostFlag,
});

client.getEntries({'content_type': config.contentful.content_type_id}).then((res) => {
  const data = res.items.map(e => ({ type: config.contentful.content_type_id, slug: e.fields[config.contentful.slug_field], data: e}));
  mkdirp.sync(config.output_dir);
  data.forEach(writeEntry);
}).catch((err) => console.log(err));
