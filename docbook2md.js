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

import { readFileSync } from 'fs';
import fs from 'fs';

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'

import rehypeRemark from 'rehype-remark' // html -> md
import { toHtml } from 'hast-util-to-html' // html -> str
import {toText} from 'hast-util-to-text'

import {all} from 'mdast-util-to-hast'

import remarkPrettier from 'remark-prettier';
import report from 'vfile-reporter';

import {wrapChildren} from 'hast-util-to-mdast/lib/util/wrap-children.js'

import {matches, select, selectAll} from 'hast-util-select'

/*
import xmlParseBroken from '@starptech/rehype-webparser'
import remarkHtml from 'remark-html' // md -> html
import rehypeStringify from 'rehype-stringify' // html -> str
import remarkStringify from 'remark-stringify' // md -> str
import {visit} from 'unist-util-visit'
import {remove} from 'unist-util-remove'
import {h} from 'hastscript'
*/

//import {wrapText} from '' // not exported by hast-util-to-mdast

//import remarkMdx from 'remark-mdx'; // html -> mdx
// const ast = unified().use(remarkParse).use(remarkMdx).parse(src)

// https://github.com/syntax-tree/hast-util-to-mdast/tree/main/lib/util



/*
https://github.com/NixOS/nixpkgs/blob/7a79469a24a71c26cb61b53590cb09ad6192654f/doc/functions/library/attrsets.xml
*/
//const inputPath = 'functions/library/attrsets.xml';
const inputPath = 'attrsets.xml';

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
import {fromXml} from 'xast-util-from-xml'
import {toXml} from 'xast-util-to-xml'
import {fromHtml} from 'hast-util-from-html'

// https://github.com/syntax-tree/xastscript
// utility to create xast trees
import {x} from 'xastscript'
import {u} from 'unist-builder' // cdata

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
          h(
            node,
            'html',
            '### Signature'
          ),
          h(
            node,
            'code',
            {lang: 'nix', meta: 'signature'},
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
        if (!section) {
          console.dir({ section }, { depth: 20 }); throw new Error('TODO')
        }
        //console.dir({ section }, { depth: 20 }); throw new Error('TODO')
        const title = select('title', section)
        // TODO section id
        //console.dir({title}); throw new Error('TODO')
        // remove title
        if (section.children) {
          section.children = section.children.filter(node => node.tagName != 'title')
        }
        return [
          // TODO transform <function>lib.attrset.attrByPath</function>
          h(section, 'html', `## ${toText(title)}\n`),
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
  /*
  .use(remarkStringify, {
    bullet: '*',
    //fence: '~',
    fences: true,
    incrementListMarker: false,
  })
  */

  // markdown tree -> pretty markdown string
  // remark-prettier registers a unified compiler.
  // This means this plugin is used for formatting the document.
  // Usually this is done by remark-stringify
  // ugly string -> pretty string
  // Format HTML in Markdown
  // https://github.com/prettier/prettier/issues/8480
  // -> open issue!
  .use(remarkPrettier, {
    options: {
      //asdf
    },
  })

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
    // write output to file
    console.log(`writing ${outputPath}`)
    fs.writeFileSync(outputPath, String(result), 'utf8')

  })

);
