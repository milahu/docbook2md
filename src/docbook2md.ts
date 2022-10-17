/*

transform docbook xml to markdown

https://github.com/rehypejs/rehype-remark#use

https://unifiedjs.com/learn/recipe/remark-html/#how-to-allow-html-embedded-in-markdown

https://unifiedjs.com/explore/package/rehype-remark/#example-keeping-some-html

https://unifiedjs.com/learn/guide/using-unified/

https://github.com/topics/rehype-plugin

How do I create a compiler?
https://github.com/unifiedjs/unified/discussions/159

md -> latex
https://github.com/zestedesavoir/zmarkdown/tree/master/packages/rebber

TODO?
syntax highlighting
https://github.com/rehypejs/rehype-highlight
https://github.com/timlrx/rehype-prism-plus

https://github.com/rehypejs/rehype-autolink-headings
https://github.com/JS-DevTools/rehype-toc

New syntax to add attributes to Markdown.
https://github.com/jaywcjlove/rehype-attr

https://github.com/topics/remark-plugin
https://github.com/remarkjs/remark-gfm
https://github.com/remarkjs/remark-html

plugin to compile markdown to man pages
https://github.com/remarkjs/remark-man

https://github.com/remarkjs/remark-validate-links

https://github.com/mdx-js
https://github.com/syntax-tree/mdxast

*/

const t1 = Date.now()

import { readFileSync } from 'https://deno.land/std@0.159.0/node/fs.ts';
import fs from 'https://deno.land/std@0.159.0/node/fs.ts';

import {unified} from 'https://esm.sh/unified@10.1.2'

import rehypeParse from "https://esm.sh/rehype-parse@8.0.4"

import rehypeRemark from "https://esm.sh/rehype-remark@9.1.2" // html -> md
//import rehypeRemark from './rehype-remark/index.js' // html -> md
import type { Options as RehypeRemarkOptions } from "https://esm.sh/rehype-remark@9.1.2"

import { toHtml } from 'https://esm.sh/hast-util-to-html@8.0.3' // html -> str
import {toText} from 'https://esm.sh/hast-util-to-text@3.1.1'

//import remarkPrettier from 'https://esm.sh/remark-prettier@2.0.0';
import report from 'https://esm.sh/vfile-reporter@7.0.4';

//import {toMdast, defaultHandlers, all, one} from 'https://esm.sh/hast-util-to-mdast@8.4.1'
import {all} from 'https://esm.sh/hast-util-to-mdast@8.4.1'
import {wrapChildren} from 'https://esm.sh/hast-util-to-mdast@8.4.1/lib/util/wrap-children.js'

import {select, selectAll} from 'https://esm.sh/hast-util-select@5.0.2'
//import {matches, select, selectAll} from 'https://esm.sh/hast-util-select@5.0.2'

import remarkStringify from 'https://esm.sh/remark-stringify@10.0.2' // md -> str
//import remarkStringify from './remark/packages/remark-stringify/index.js' // md -> str

/*
import xmlParseBroken from '@starptech/rehype-webparser DENOIFY: UNKNOWN NODE BUILTIN'
import remarkHtml from 'remark-html DENOIFY: UNKNOWN NODE BUILTIN' // md -> html
import rehypeStringify from 'rehype-stringify DENOIFY: UNKNOWN NODE BUILTIN' // html -> str
import {visit} from 'https://esm.sh/unist-util-visit@4.1.1'
import {remove} from 'https://esm.sh/unist-util-remove@3.1.0'
import {h} from 'https://esm.sh/hastscript@7.1.0'
*/

//import {wrapText} from '' // not exported by hast-util-to-mdast

//import remarkMdx from 'remark-mdx'; // html -> mdx
// const ast = unified().use(remarkParse).use(remarkMdx).parse(src)

// https://github.com/syntax-tree/hast-util-to-mdast/tree/main/lib/util



function date() {
  return new Date().toLocaleString('af')
}



/*
https://github.com/NixOS/nixpkgs/blob/7a79469a24a71c26cb61b53590cb09ad6192654f/doc/functions/library/attrsets.xml
*/
//const inputPath = 'functions/library/attrsets.xml';
const inputPath = 'examples/attrsets.xml';

const outputPath = inputPath.split('.').slice(0, -1).join('.') + '.md'

const inputText = (
  readFileSync(inputPath, 'utf8')
  // workaround for parsing xml
  // https://github.com/rehypejs/rehype/issues/109
  //.replace(/<!\[CDATA\[(.*?)\]\]>/sg, '$1')
  //.replace(/<!\[CDATA\[(.*?)\]\]>/sg, '<cdata>$1</cdata>')
);

/* TODO parse xml. https://github.com/rehypejs/rehype/issues/109
// https://github.com/syntax-tree/xast-util-from-xml
import {fromXml} from 'https://esm.sh/xast-util-from-xml@2.0.1'
import {toXml} from 'xast-util-to-xml DENOIFY: UNKNOWN NODE BUILTIN'
import {fromHtml} from 'hast-util-from-html DENOIFY: UNKNOWN NODE BUILTIN'

// https://github.com/syntax-tree/xastscript
// utility to create xast trees
import {x} from 'xastscript DENOIFY: UNKNOWN NODE BUILTIN'
import {u} from 'unist-builder DENOIFY: UNKNOWN NODE BUILTIN' // cdata

const tree = fromXml(await fs.readFile('example.xml'))
console.log(tree)
*/

(unified()

  // html string -> html tree
  .use(rehypeParse, {
    //fragment: true,
  })

  // no. parse error
  //.use(xmlParse)

// html to xml
// https://github.com/syntax-tree/hast-util-to-xast

  // html tree -> markdown tree
  .use(rehypeRemark, {
    // https://github.com/rehypejs/rehype-remark#optionshandlers
    // https://github.com/syntax-tree/hast-util-to-mdast#optionshandlers
    // In a handler, you have access to h,
    // which should be used to create mdast nodes from hast nodes.
    // On h, there are several fields that may be of interest.
    // Most interesting of them is h.wrapText,
    // which is true if the mdast content can include newlines,
    // and false if not (such as in headings or table cells).
    handlers: {

      // keep some html elements
      /*
      svg(h, node) {
        return h(node, 'html', toHtml(node))
      },
      table(h, node) {
        return h(node, 'html', toHtml(node))
      },
      */

      'function': (h, node) => {
        return h(node, 'inlineCode', all(h, node))
      },

      /**
      * function signature
      *
      * ### Signature
      *
      * ```nix signature
      * content
      * ```
      *
      * @param {Element} node
      */

      subtitle(h, node) {
        // https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/handlers/code.js
        return [
          /* too verbose
          // also, there can be description paragraphs
          // after the signature
          h(
            node,
            'html',
            '### Signature'
          ),
          */
          h(
            node,
            'code',
            // signatures are in haskell format
            {lang: 'haskell'},
            //trimTrailingLines(wrapText(h, toText(node)))
            toText(node)
          ),
        ]
      },

      // section should work by default?
      example(h, example) {
        /* TODO example id
          properties: {
            'xml:id': 'function-library-lib.attrsets.recursiveUpdate-example'
          },
        */
        const title = select('title', example)
        const programlisting = select('programlisting', example)
        if (false) {
          console.dir({
            programlisting,
            text: toText(programlisting),
          }, { depth: 5 })
          throw new Error('TODO')
        }
        const cdata = inputText.slice(
          (
            programlisting.position.start.offset
            + '<programlisting><![CDATA['.length
          ),
          (
            programlisting.position.end.offset
            - ']]></programlisting>'.length
          ),
        ).trim()
        return [
          h(example, 'html', `### Example: ${toText(title)}\n`),
          // TODO unwrap xml <![CDATA[ ... ]]>
          //h(example, 'code', {lang: 'nix'}, toText(programlisting)),
          h(example, 'code', {lang: 'nix'}, cdata),
          // FIXME xml CDATA
          //h(example, 'code', {lang: 'nix'}, wrapChildren(programlisting)),
        ]
      },

      // TODO
      //'xi:include': (h, xi_include) => {},
      /*
        {
          type: 'element',
          tagName: 'xi:include',
          properties: {
            href: './locations.xml',
            xpointer: 'lib.attrsets.recursiveUpdate'
          },
          children: []
        }
      */


      // section should work by default?
      section(h, section) {
        // TODO track depth of section, use depth for heading
        //console.log(`section.depth: ${section.depth}`) // undefined
        //console.dir({ section }, { depth: 20 })
        //throw new Error('TODO')
        //console.dir({ section }, { depth: 5 }); throw new Error('TODO')
        // properties: { 'xml:id': 'function-library-lib.attrsets.attrByPath' },
        //console.dir({ section }, { depth: 20 }); throw new Error('TODO')
        const title = select('title', section)
        /** @type {string | undefined} */
        const id = section.properties && section.properties['xml:id']
        // TODO section id
        //console.dir({title}); throw new Error('TODO')
        // remove title
        if (section.children) {
          section.children = section.children.filter(node => node.tagName != 'title')
        }
        const mdHeadId = id ? ` {#${id}}` : ''
        return [
          // TODO transform <function>lib.attrset.attrByPath</function>
          //h(section, 'html', `## ${toText(title)}${mdHeadId}\n`),
          //h(section, 'heading', {depth: 3, id}, toText(title)),
          // TODO implement id in heading-handler in hast-util-to-mdast
          // or in markdown-renderer in remark-stringify
          h(section, 'heading', {depth: 3, id}, all(h, title)),
          (
            section.children
              // FIXME TypeError: Cannot read properties of undefined (reading 'children')
              ? wrapChildren(h, section)
              // TODO how does recursion work??
              //? section.children.map(node => h(node, 'paragraph', toText(node)))
              : 'wtf?'
          ),
          // Error: Cannot handle unknown node `element`
          //...section.children,
        ]

        return wrapChildren(h, section) // ok

        return all(h, section) // no

        // Error: Cannot handle value `[object Object],[object Object]`, expected node
        return h(section, 'blockquote', wrapChildren(h, section))

        return all(h, section.children[0])
        // FIXME no recursion
        return [
          h(section, 'html', `## TODO section\n`),
          // transform children
          // FIXME
          ...all(h, section.children),
          //h(section, 'html', all(h, section)),
        ]
        console.dir(section)
        throw new Error('TODO')
        return all(h, section.children)

        return h(section, 'html', [
          h(section, 'html', `## TODO section\n`),
          // transform children
          // FIXME
          all(h, section),
          //h(section, 'html', all(h, section)),
        ])
        /*
        */
      },

      /**
      * function arguments
      *
      * ### Arguments
      *
      * #### arg1
      *
      * description 1
      *
      * #### arg2
      *
      * description 2
      *
      * @param {Element} node
      */
      variablelist(h, variablelist) {
        // TODO better
        // this feels really wrong and stupid ...
        return [
          h(variablelist, 'html', `### Arguments\n`),
          variablelist.children.map(varlistentry => {
            const term = varlistentry.children[0];
            const listitem = varlistentry.children[1];
            return [
              //h(term, 'html', `<div class="term">${toText(term).trim()}</div>\n`),
              h(term, 'html', `#### ${toText(term).trim()}\n`),
              listitem.children.map(para => {
                //return h(para, 'html', `<div class="para">${toText(para).trim()}</div>\n`)
                return h(para, 'html', toText(para).trim()+"\n")
              })
            ]
            return varlistentry.children[1].map(node => {
              
            })
          })
        ]

        // what did not work ...

        if (false) {

          return h(node, 'paragraph', 'LALALLALA') // no
          return h(node, 'heading', 'LALALLALA') // no
          return h(node, 'html', 'LALALLALA') // ok

          // keep the original node
          return h(node, 'html', toHtml(node))

          return {
            type: 'heading',
            value: 'TODO',
            children: []
          }

          return [
            h(node, 'heading', {depth:3}, 'TODO'),
          ]
          return selectAll('varlistentry', node).map(node => {
            //return '<div>' + toText(node) + '</div>\n'
            return h(node, 'paragraph', {depth:3}, all(h, node))
            return h(node, 'paragraph', {depth:3}, node.children[0].children[0])
            return h(node, 'heading', {depth:3}, node.children[0].children[0])
            return h(node, 'heading', {depth:3}, all(h, node))

            return h(
              node,
              'heading',
              {lang: 'varlistentry', meta: null},
              toText(node)
            )

            console.dir({
              term: select('term', node),
              varname: select('term > varname', node),
            })
            return h(node, 'heading', {depth:3}, toText(select('term', node)))
            const heading = (() => {
              // https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/handlers/heading.js
              const node = select('term > varname', node);
              return h(node, 'heading', {depth}, toText(node))
              const depth = 3
              const wrap = h.wrapText
              h.wrapText = false
              const result = h(node, 'heading', {depth}, all(h, node))
              h.wrapText = wrap
              return result
            })()
            const paragraphs = (
              // https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/handlers/p.js
              selectAll('listitem > para', node).map(
                //node => h(node, 'paragraph', all(h, node))
                node => h(node, 'paragraph', 'TODO para')
              )
            )
            return [
              heading,
              //paragraphs,
            ]
          })
          return [
            h(node, 'heading', {depth:3}, toText(node)),
            h(node, 'heading', {depth:4}, toText(node))
          ];


          //console.dir({node}, {depth:5})
          return all(h, selectAll('varlistentry', node).map(
            node => {
              console.dir({varlistentry: node})
              h(node, 'heading', {depth:3}, all(h, node))
            }
          ))
          return selectAll('varlistentry', node).map(
            //** @param {Element} node *xxxxxxxxxxxxxxxx/
            node => {
              const heading = (() => {
                // https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/handlers/heading.js
                const node = select('term > varname', node);
                const depth = 3
                const wrap = h.wrapText
                h.wrapText = false
                const result = h(node, 'heading', {depth}, all(h, node))
                h.wrapText = wrap
                return result
              })()
              const paragraphs = (
                // https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/handlers/p.js
                selectAll('listitem > para', node).map(
                  node => h(node, 'paragraph', all(h, node))
                )
              )
              return [
                heading,
                ...paragraphs,
              ]
            }
          )
          console.dir(node.querySelector, {depth:5})
          throw new Error('TODO')
          //return h(node, 'heading', {depth: 3}, toText(node.querySelector('term > varname')))
          return h(node, 'heading', {depth: 3}, toText(node.children[0]))

          return node.children.map(
            //** @param {Element} varlistentry *xxxxxxxxxxxxxxxx/
            varlistentry => {
            }
          )[0]
        }
      },





      /* https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/handlers/blockquote.js
      blockquote(h, node) {
        return h(node, 'blockquote', wrapChildren(h, node))
      }
      */

      /*
        {
          type: 'comment',
          value: '[CDATA[\n' +
            'recursiveUpdate\n' +
            '  {\n' +
            '    boot.loader.grub.enable = true;\n' +
            '    boot.loader.grub.device = "/dev/hda";\n' +
            '  }\n' +
            '  {\n' +
            '    boot.loader.grub.device = "";\n' +
            '  }\n' +
            '='
        },
      */

      /** @param {Comment} comment */
      /*
      comment(h, comment) {
        // never called
        console.dir({ comment })
        throw new Error('todo')
        if (!comment.value.startsWith('[CDATA[')) return
        return {
          type: 'text',
          value: comment.value.slice('[CDATA['.length), // TODO
        }
      },
      */


    } // end of handlers: {
  })

  // markdown tree -> markdown string
  .use(remarkStringify, {
    bullet: '*',
    //fence: '~',
    fences: true,
    incrementListMarker: false,
  })

  // markdown tree -> pretty markdown string
  // remark-prettier registers a unified compiler.
  // This means this plugin is used for formatting the document.
  // Usually this is done by remark-stringify
  // ugly string -> pretty string
  // Format HTML in Markdown
  // https://github.com/prettier/prettier/issues/8480
  // -> open issue!
  /*
  .use(remarkPrettier, {
    options: {
      //asdf
    },
  })
  */

  .process(inputText, function(error, result) {
    //console.error(report(err || output))
    if (error) {
      console.error(report(error))
    }
    /*
    console.log(
      String(result) //.slice(0, 2000)
    )
    */

    const t2 = Date.now()
    const dt = (t2 - t1) / 1000;

    // write output to file
    console.log(`${date()} docbook2md.js: done after ${dt.toFixed(1)} sec. writing ${outputPath}`)
    fs.writeFileSync(outputPath, String(result), 'utf8')

  })

);
