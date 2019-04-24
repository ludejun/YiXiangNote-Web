import highlight from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import cpp from 'highlight.js/lib/languages/cpp'; // C++
import cs from 'highlight.js/lib/languages/cs'; // C#
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import json from 'highlight.js/lib/languages/json';
import objectivec from 'highlight.js/lib/languages/objectivec';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import scala from 'highlight.js/lib/languages/scala';
import thrift from 'highlight.js/lib/languages/thrift';
import r from 'highlight.js/lib/languages/r';
import matlab from 'highlight.js/lib/languages/matlab';
import swift from 'highlight.js/lib/languages/swift';
import 'highlight.js/styles/vs2015.css';

highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('java', java);
highlight.registerLanguage('cpp', cpp);
highlight.registerLanguage('cs', cs);
highlight.registerLanguage('php', php);
highlight.registerLanguage('python', python);
highlight.registerLanguage('sql', sql);
highlight.registerLanguage('json', json);
highlight.registerLanguage('bash', bash);
highlight.registerLanguage('css', css);
highlight.registerLanguage('go', go);
highlight.registerLanguage('objectivec', objectivec);
highlight.registerLanguage('ruby', ruby);
highlight.registerLanguage('xml', xml);
highlight.registerLanguage('scala', scala);
highlight.registerLanguage('thrift', thrift);
highlight.registerLanguage('r', r);
highlight.registerLanguage('matlab', matlab);
highlight.registerLanguage('swift', swift);

highlight.configure({
  // optionally configure hljs
  languages: [
    'javascript',
    'java',
    'cpp',
    'cs',
    'php',
    'python',
    'sql',
    'json',
    'bash',
    'css',
    'go',
    'objectivec',
    'ruby',
    'xml',
    'scala',
    'thrift',
    'r',
    'matlab',
    'swift',
  ],
  useBR: false,
});
window.hljs = highlight;
